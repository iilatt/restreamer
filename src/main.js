import { existsSync, readFileSync } from 'fs';
import { spawn } from 'child_process';
import { App } from 'uWebSockets.js';
import { get_web_files } from './web.js';
import { websockets, on_ws_upgrade, on_ws_open, on_ws_message, on_ws_close } from './ws.js';

function load_optional_file(file_name) {
	if (existsSync(file_name)) {
		return readFileSync(file_name).toString();
	}
}

const streamlink_twitch_oauth = load_optional_file('streamlink_twitch_oauth');
const streamlink_url = load_optional_file('streamlink_url');
export const is_dev = process.argv[2] === '--dev';
const web_files = get_web_files();

export const app = App();
app.get('/*', (res, req) => {
	const url = req.getUrl();
	let content;
	switch (url) {
		case '/': content = web_files['app.html']; break;
		default:  content = web_files[url.slice(1)]; break;
	}
	if (!content) {
		res.writeStatus('404 Not Found').end('Not Found');
		return;
	}
	res.writeHeader('Content-Type', `${content.type}; charset=utf-8`).end(content.data);
});

app.ws('/', {
	maxPayloadLength: 1024 * 1024 * 8,
	idleTimeout: 10,
	upgrade: on_ws_upgrade,
	open: on_ws_open,
	message: on_ws_message,
	close: on_ws_close,
});

const HTTP_PORT = 80;
app.listen(HTTP_PORT, (listen_socket) => {
	if (listen_socket) {
		console.log(`HTTP Server listening on port ${HTTP_PORT}.`);
	} else {
		console.error('HTTP Server creation failed!');
	}
});

export const lives = {};

function start_stream(stream_url, quality) {
	const live = {
		init_seg: Buffer.from([]),
		init_seg_done: false,
		current_seg: Buffer.from([]),
	};
	lives[quality] = live;

	function cleanup_processes() {
		streamlink.kill();
		ffmpeg.kill();
	}

	console.log(`Starting stream for: ${stream_url}`);
	const streamlink = spawn('streamlink', [
		'--stdout',
		`--http-header=Authorization=OAuth ${streamlink_twitch_oauth}`,
		'--hls-live-restart',
		'--hls-segment-stream-data',
		'--hls-live-edge', '4',
		'--stream-segment-threads', '2',
		stream_url,
		quality
	]);
	const ffmpeg = spawn('ffmpeg', [
		'-i', 'pipe:0',
		'-g', '60',
		'-c:v', 'libx264',
		'-preset', 'veryfast',
		'-movflags', 'frag_keyframe+empty_moov+default_base_moof',
		'-c:a', 'aac',
		'-b:a', '128k',
		'-f', 'mp4',
		'pipe:1'
	]);
	streamlink.stdout.pipe(ffmpeg.stdin);
	streamlink.on('error', (err) => {
		console.error('[streamlink] error:', err);
		cleanup_processes();
	});
	ffmpeg.on('error', (err) => {
		console.error('[ffmpeg] error:', err);
		cleanup_processes();
	});
	streamlink.stderr.on('data', () => {});
	ffmpeg.stderr.on('data', () => {});
	ffmpeg.stdout.on('data', (data) => {
		let view = new Uint8Array(data);
		let new_data = data;
		for (let a = 0; a < view.length - 7; ++a) {
			if (view[a + 4] == 109 && view[a + 5] == 111 && view[a + 6] == 111 && view[a + 7] == 102) {
				if (live.init_seg_done) {
					live.current_seg = Buffer.concat([live.current_seg, data.slice(0, a)]);
					app.publish(`live/${quality}`, live.current_seg, true);
					live.current_seg = Buffer.from([]);
				} else {
					live.init_seg_done = true;
					live.init_seg = Buffer.concat([live.init_seg, data.slice(0, a)]);
					app.publish(`live/${quality}`, live.init_seg, true);
				}
				new_data = data.slice(a);
			}
		}
		if (live.init_seg_done) {
			live.current_seg = Buffer.concat([live.current_seg, new_data]);
		} else {
			live.init_seg = Buffer.concat([live.init_seg, new_data]);
		}
	});

	streamlink.on('close', (code) => {
		console.log(`Streamlink process exited with code ${code}`);
		cleanup_processes();
	});

	ffmpeg.on('close', (code) => {
		console.log(`FFmpeg process exited with code ${code}`);
		cleanup_processes();
	});
}

setInterval(() => {
	app.publish('all', JSON.stringify({
		type: 'user_count',
		count: websockets.length
	}), false);
}, 10000);

start_stream(streamlink_url, '160p');
start_stream(streamlink_url, '360p');
start_stream(streamlink_url, '480p');
start_stream(streamlink_url, '720p60');
start_stream(streamlink_url, '1080p60');