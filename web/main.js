function query(query_string) {
	return window.document.querySelector(query_string);
}

function query_all(query_string) {
	return [...window.document.querySelectorAll(query_string)];
}

function set_disabled(element, disabled) {
	if (disabled) {
		element.setAttribute('disabled', '');
	} else {
		element.removeAttribute('disabled');
	}
}

function fade_in(element) {
	if (element.style.display == '') {
		return;
	}
	set_visible(element, true);
	const start_time = Date.now();
	function update() {
		const moment = Math.min((Date.now() - start_time) / 100, 1);
		element.style.opacity = moment;
		if (moment >= 1) {
			clearInterval(interval);
		}
	}
	const interval = setInterval(update, 0);
	update();
}

function fade_out(element) {
	if (element.style.display == 'none') {
		return;
	}
	const start_time = Date.now();
	function update() {
		const moment = Math.max(1 - ((Date.now() - start_time) / 100), 0);
		element.style.opacity = moment;
		if (moment <= 0) {
			set_visible(element, false);
			clearInterval(interval);
		}
	}
	const interval = setInterval(update, 0);
	update();
}

function init_modal_close_events(modal) {
	modal.addEventListener('mousedown', event => {
		if (event.target === modal) {
			modal.mouse_down = true;
		}
	});
	modal.addEventListener('mouseup', event => {
		if (modal.mouse_down && event.target === event.currentTarget) {
			fade_out(modal);
		}
		modal.mouse_down = false;
	});
}

function generate_id(length) {
	const arr = new Uint8Array((length || 40) / 2);
	window.crypto.getRandomValues(arr);
	return Array.from(arr, dec => dec.toString(16).padStart(2, '0')).join('');
}

function make_badge(type) {
	const badge = document.createElement('div');
	badge.classList.add('badge');
	switch (type) {
		case 'm': {
			badge.classList.add('moderator');
			badge.title = 'Moderator';
			badge.innerHTML = '<svg class="" viewBox="0 0 576 512"><path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z"/></svg>';
			break;
		}
	}
	return badge;
}

function make_badges(badges, parent) {
	for (let i = 0; i < badges.length; ++i) {
		parent.appendChild(make_badge(badges[i]));
	}
}

let ws;

function main() {
	ws = new WebSocket(location.origin.replace('http', 'ws'));
	ws.onopen = () => {
		ws.send(JSON.stringify({
			type: 'set_quality',
			value: localStorage.live_quality,
		}));
	};
	ws.onmessage = event => {
		if (typeof(event.data) === 'string') {
			const json = JSON.parse(event.data);
			if (json.type == 'live_reset') {
				on_join_live();
			} else if (json.type == 'user_count') {
				update_viewer_count(json.count);
			}
		} else {
			event.data.arrayBuffer().then(ab => {
				new_live_video_data(ab);
			});
		}
	};
	ws.onclose = () => {
		fade_in(query('#panel-disconnect-bg'));
	};

	const input_fields = query_all('.input-field');
	input_fields.forEach(input_field => {
		if (input_field.classList.contains('active')) {
			return;
		}
		const input = input_field.children[0];
		input.addEventListener('focus', () => {
			input_field.classList.add('active');
		});
		input.addEventListener('blur', () => {
			if (input.value.length === 0) {
				input_field.classList.remove('active');
			}
		});
		function on_change() {
			if (input.value.length > 0) {
				input_field.classList.add('active');
			} else {
				input_field.classList.remove('active');
			}
		}
		input.set_value = function(value) {
			input.value = value;
			on_change();
		};
		input.addEventListener('change', on_change);
	});

	const pages = query_all('.page');
	const page_links = query_all('.page-list-item');
	page_links.forEach(page_list_item => {
		const page = query(`#page-${page_list_item.getAttribute('target')}`);
		page_list_item.addEventListener('click', () => {
			page_links.forEach(page_link => { page_link.classList.remove('active'); });
			page_list_item.classList.add('active');
			pages.forEach(page => { set_visible(page, false); });
			set_visible(page, true);
		});
	});

	const bookmark_explain = query('#bookmark-explain');
	const bookmarks = query_all('.bookmark > .link');
	bookmarks.forEach(bookmark => {
		bookmark.addEventListener('click', event => {
			event.preventDefault();
		});
		bookmark.addEventListener('mouseenter', () => {
			bookmark_explain.classList.add('hover-active');
		});
		bookmark.addEventListener('mouseleave', () => {
			bookmark_explain.classList.remove('hover-active');
		});
		bookmark.addEventListener('dragstart', event => {
			event.dataTransfer.setDragImage(bookmark, bookmark.getBoundingClientRect().width / 2, bookmark.getBoundingClientRect().height / 2);
			bookmark_explain.classList.add('drag-active');
		});
		bookmark.addEventListener('dragend', () => {
			bookmark_explain.classList.remove('drag-active');
		});
	});

	init_live();

	const chat_modes = query_all('.chat-mode');
	chat_modes.forEach(chat_mode => {
		chat_mode.set_channel = () => {
			chat_modes.forEach(old_chat_mode => {
				old_chat_mode.classList.remove('active');
			});
			chat_mode.classList.add('active');
			query('#twitch-chat').src = chat_mode.getAttribute('target_frame_src');
		};
		chat_mode.addEventListener('click', () => {
			chat_mode.set_channel();
		});
	});
	chat_modes[0].set_channel();
}