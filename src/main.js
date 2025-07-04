import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { App } from 'uWebSockets.js';
import { get_web_files } from './web.js';
import { websockets, on_ws_upgrade, on_ws_open, on_ws_message, on_ws_close } from './ws.js';
import { init_chats } from './chat.js';
import stream from 'stream';

const hls_dir = 'hls';

function load_optional_file(file_name) {
	if (fs.existsSync(file_name)) {
		return fs.readFileSync(file_name).toString();
	}
}

export const config = JSON.parse(load_optional_file('config.json'));
export const is_dev = process.argv[2] === '--dev';
const web_files = get_web_files();

export const app = App();
app.get('/hls/:filename', (res, req) => {
	const filename = req.getParameter(0);
	if (!filename.match(/^[a-zA-Z0-9_-]+(\.m3u8|\.ts)$/)) {
		return res.writeStatus('400 Bad Request').end();
	}
	const filePath = path.join(hls_dir, filename);
	const resolvedPath = path.resolve(filePath);
	if (!resolvedPath.startsWith(path.resolve(hls_dir))) {
		return res.writeStatus('403 Forbidden').end();
	}
	try {
		if (fs.existsSync(filePath)) {
			const data = fs.readFileSync(filePath);
			if (filename.endsWith('.m3u8')) {
				res.writeHeader('Content-Type', 'application/vnd.apple.mpegurl');
			} else if (filename.endsWith('.ts')) {
				res.writeHeader('Content-Type', 'video/MP2T');
			}
			res.end(data);
		} else {
			res.writeStatus('404 Not Found').end();
		}
	} catch (err) {
		console.error('File serving error:', err);
		res.writeStatus('500 Internal Server Error').end();
	}
}).get('/*', (res, req) => {
	res.onAborted(() => {});
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
		process.exit(1);
	}
});

export const lives = {};
export const chats = [];

function start_stream(stream_url, quality) {
	function cleanup_processes() {
		streamlink.kill();
		ffmpeg.kill();
	}

	console.log(`Starting stream for: ${stream_url}`);
	const streamlink = spawn('streamlink', [
		'--stdout',
		`--http-header=Authorization=OAuth ${config.stream_twtv_oauth}`,
		'--hls-segment-stream-data',
		stream_url,
		quality,
	]);
	const ffmpeg = spawn('ffmpeg', [
		'-i', 'pipe:0',
		'-c', 'copy',
		'-f', 'hls',
		'-hls_time', '4',
		'-hls_list_size', '6',
		'-hls_flags', 'delete_segments+independent_segments',
		`hls/${quality}.m3u8`
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
}, 20000);

await init_chats(config.chat_modes);
for (const quality of config.stream_qualities) {
	start_stream(config.stream_url, quality);
}