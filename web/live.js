let chunks = [];
let media_source;
let source_buffer;
let live_video;
let live_video_start;
let live_video_pause;
let player_state = 'pause';

function new_live_video_data(ab) {
	if (source_buffer && !source_buffer.updating && chunks.length === 0) {
		source_buffer.appendBuffer(ab);
	} else {
		chunks.push(ab);
	}
}

function update_viewer_count(viewers) {
	query('#live-viewer-count').innerText = viewers;
}

async function set_live_video_paused(new_paused) {
	if (new_paused) {
		live_video.pause();
	} else {
		if (ws.readyState === WebSocket.OPEN) {
			ws.send(JSON.stringify({
				type: 'set_quality',
				value: localStorage.live_quality,
			}));
		}
		live_video.play();
	}
}

function init_player() {
	media_source = new MediaSource();
	source_buffer = null;
	media_source.addEventListener('sourceopen', () => {
		source_buffer = media_source.addSourceBuffer('video/mp4; codecs="avc1.640028, mp4a.40.2"');
		function append_chunks() {
			while (chunks.length > 0 && !source_buffer.updating) {
				source_buffer.appendBuffer(chunks.shift());
			}
		}
		const seg_delay = 4;
		source_buffer.addEventListener('updateend', () => {
			if (source_buffer.buffered.length > 0) {
				const start = source_buffer.buffered.start(0);
				const end = source_buffer.buffered.end(0);
				const old_treshold = 300;
				if ((player_state === 'pause' && end - start > seg_delay) || live_video.currentTime + 30 < end) {
					player_state = 'play';
					live_video.currentTime = end - seg_delay / 2;
					console.log('Player seek to end');
				}
				if (live_video.currentTime > start + old_treshold + 60) {
					source_buffer.remove(start, start + old_treshold);
					console.log(`Removing first ${old_treshold}s`);
				}
				if (live_video.currentTime + seg_delay * 3 < end) {
					live_video.playbackRate = 1.1;
				} else if (live_video.currentTime + seg_delay * 2 < end) {
					live_video.playbackRate = 1.05;
				} else {
					live_video.playbackRate = 1;
				}
			}
			append_chunks();
		});
		append_chunks();
	});
	live_video.src = URL.createObjectURL(media_source);
}

function player_reset() {
	chunks = [];
	player_state = 'pause';
	source_buffer.abort();
}

function init_live() {
	live_video = query('#live-video');
	init_player();
	live_video_start = query('#live-start');
	live_video_start.addEventListener('click', () => {
		set_live_video_paused(false);
	});
	const live_video_loading = query('#live-loading');
	live_video.addEventListener('play', () => {
		live_video_pause.paused = false;
		live_video_pause.innerHTML = '<svg viewBox="0 0 320 512"><path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"/></svg>';
		set_visible(live_video_start, false);
	});
	function on_pause() {
		live_video_pause.paused = true;
		live_video_pause.innerHTML = '<svg viewBox="0 0 384 512"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>';
		set_visible(live_video_start, true);
	}
	live_video.addEventListener('pause', () => {
		on_pause();
	});
	live_video.addEventListener('waiting', () => {
		set_visible(live_video_loading, true);
	});
	live_video.addEventListener('canplay', () => {
		set_visible(live_video_loading, false);
	});
	live_video_pause = query('#live-pause');

	on_pause();
	set_live_video_paused(true);
	live_video_pause.addEventListener('click', () => {
		set_live_video_paused(!live_video_pause.paused);
	});
	const live_video_volume_input = query('#live-volume-input');
	const live_video_volume = query('#live-volume');
	let muted = localStorage.muted === 'true';
	function set_live_volume(value) {
		if (value == 0) {
			muted = true;
		}
		live_video_volume_input.value = muted ? 0 : value;
		live_video.volume = muted ? 0 : value;
		localStorage.live_volume = value;
		localStorage.muted = muted;
		live_video_volume.innerHTML = muted || value == 0 ? '<svg viewBox="0 0 576 512"><path d="M301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zM425 167l55 55 55-55c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-55 55 55 55c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-55-55-55 55c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l55-55-55-55c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z"/></svg>': '<svg viewBox="0 0 576 512"><path d="M333.1 34.8C344.6 40 352 51.4 352 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L163.8 352H96c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L298.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zm172 72.2c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C507.3 341.3 528 301.1 528 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C466.1 199.1 480 225.9 480 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C425.1 284.4 432 271 432 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5z"></path></svg>';
	}
	live_video_volume_input.addEventListener('input', () => {
		muted = false;
		set_live_volume(live_video_volume_input.value);
	});
	const default_volume = 0.6;
	live_video_volume.addEventListener('click', () => {
		let new_volume = localStorage.live_volume;
		if (muted && new_volume == 0) {
			new_volume = default_volume;
		}
		muted = !muted;
		set_live_volume(new_volume);
	});
	set_live_volume(localStorage.live_volume || default_volume);
	const live_video_fullscreen = query('#live-fullscreen');
	function set_fullscreen_svg(fullscreen) {
		live_video_fullscreen.innerHTML = fullscreen ? '<svg viewBox="0 0 448 512"><path d="M160 64c0-17.7-14.3-32-32-32s-32 14.3-32 32v64H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32V64zM32 320c-17.7 0-32 14.3-32 32s14.3 32 32 32H96v64c0 17.7 14.3 32 32 32s32-14.3 32-32V352c0-17.7-14.3-32-32-32H32zM352 64c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H352V64zM320 320c-17.7 0-32 14.3-32 32v96c0 17.7 14.3 32 32 32s32-14.3 32-32V384h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H320z"/></svg>' : '<svg viewBox="0 0 448 512"><path d="M32 32C14.3 32 0 46.3 0 64v96c0 17.7 14.3 32 32 32s32-14.3 32-32V96h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H32zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H64V352zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32h64v64c0 17.7 14.3 32 32 32s32-14.3 32-32V64c0-17.7-14.3-32-32-32H320zM448 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v64H320c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32V352z"/></svg>';
	}
	set_fullscreen_svg(false);
	function toggle_fullscreen() {
		if (document.fullscreenElement) {
			document.exitFullscreen();
			set_fullscreen_svg(false);
		} else {
			query('#live-parent').requestFullscreen();
			set_fullscreen_svg(true);
		}
	}
	live_video.addEventListener('dblclick', toggle_fullscreen);
	live_video.addEventListener('contextmenu', event => {
		event.preventDefault();
		return false;
	})
	live_video_fullscreen.addEventListener('click', toggle_fullscreen);

	const live_settings = query('#live-settings');
	const live_settings_panel = query('#live-settings-panel');
	live_settings.addEventListener('click', () => {
		toggle_visible(live_settings_panel);
	});

	const quality_modes = query_all('.quality-mode');
	window.addEventListener('pointerdown', event => {
		if (live_settings.contains(event.target) || live_settings_panel.contains(event.target)) {
			return;
		}
		set_visible(live_settings_panel, false);
	});
	quality_modes.forEach(quality_mode => {
		const value = quality_mode.getAttribute('quality-mode');
		quality_mode.addEventListener('click', () => {
			quality_modes.forEach(old_quality_mode => {
				old_quality_mode.classList.remove('active');
			});
			quality_mode.classList.add('active');
			localStorage.live_quality = value;
			set_visible(live_settings_panel, false);
			if (ws.readyState === WebSocket.OPEN) {
				ws.send(JSON.stringify({
					type: 'set_quality',
					value: value,
				}));
			}
		});
	});
	if (!localStorage.live_quality) {
		localStorage.live_quality = '720p60';
	}
	query(`.quality-mode[quality-mode=\"${localStorage.live_quality}\"]`).click();
}