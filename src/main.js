import { Transform } from 'stream';
import { existsSync, readFileSync } from 'fs';
import { spawn } from 'child_process';
import { App } from 'uWebSockets.js';
import { get_web_files } from './web.js';
import { websockets, on_ws_upgrade, on_ws_open, on_ws_message, on_ws_close } from './ws.js';
import stream from 'stream';

function load_optional_file(file_name) {
	if (existsSync(file_name)) {
		return readFileSync(file_name).toString();
	}
}

export const config = JSON.parse(load_optional_file('config.json'));
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
		process.exit(1);
	}
});

export const lives = {};

class MP4AtomFinder extends Transform {
	constructor() {
		super();
		this.buffer = Buffer.alloc(0);
		this.parsingState = { offset: 0 };
	}

	_transform(chunk, encoding, callback) {
		this.buffer = Buffer.concat([this.buffer, chunk]);
		this.parse_atoms();
		callback();
	}

	parse_atoms() {
		while (this.buffer.length - this.parsingState.offset >= 8) {
			const offset = this.parsingState.offset;
			const size = this.buffer.readUInt32BE(offset);
			const type = this.buffer.toString('ascii', offset + 4, offset + 8);
			if (size < 8 || offset + size > this.buffer.length) {
				break;
			}
			const atom_data = this.buffer.subarray(offset, offset + size);
			this.emit('atom', { type, size, data: atom_data });
			this.parsingState.offset += size;
		}

		if (this.parsingState.offset > 0) {
			this.buffer = this.buffer.subarray(this.parsingState.offset);
			this.parsingState.offset = 0;
		}
	}
}

function start_stream(stream_url) {
	function cleanup_processes() {
		streamlink.kill();
		ffmpeg.kill();
	}

	console.log(`Starting stream for: ${stream_url}`);
	const streamlink = spawn('streamlink', [
		'--stdout',
		`--http-header=Authorization=OAuth ${config.stream_twtv_oauth}`,
		'--hls-segment-stream-data',
		'--hls-live-edge', '2',
		'--stream-segment-threads', '3',
		stream_url,
		'best',
	]);
	const atom_finders = {
		'1080p60': new MP4AtomFinder(),
		'720p60': new MP4AtomFinder(),
		'480p': new MP4AtomFinder(),
		'360p': new MP4AtomFinder(),
		'160p': new MP4AtomFinder()
	};

	// Create passthrough streams for each output
	const output_pipes = [
		new stream.PassThrough(), // pipe:1 (stdout)
		new stream.PassThrough(), // pipe:2
		new stream.PassThrough(), // pipe:3
		new stream.PassThrough(), // pipe:4
		new stream.PassThrough()  // pipe:5
	];

	const ffmpeg = spawn('ffmpeg', [
		'-i', 'pipe:0',
		// Create all scaled versions using filter_complex
		'-filter_complex', '[0:v]split=5[in1][in2][in3][in4][in5];[in1]fps=60[1080p];[in2]scale=1280:720,fps=60[720p];[in3]scale=854:480,fps=30[480p];[in4]scale=640:360,fps=30[360p];[in5]scale=284:160,fps=30[160p];[0:a]asplit=5[a1][a2][a3][a4][a5]',
		// 1080p output
		'-map', '[1080p]', '-map', '[a1]',
		'-c:v', 'libx264', '-preset', 'ultrafast', '-g', '120',
		'-profile:v', 'high', '-level', '4.0',
		'-b:v', '8000k', '-c:a', 'aac', '-b:a', '128k',
		'-movflags', 'frag_keyframe+empty_moov+default_base_moof',
		'-f', 'mp4', 'pipe:1',
		// 720p output
		'-map', '[720p]', '-map', '[a2]',
		'-c:v', 'libx264', '-preset', 'ultrafast', '-g', '120',
		'-profile:v', 'main', '-level', '3.1',
		'-b:v', '6000k', '-c:a', 'aac', '-b:a', '128k',
		'-movflags', 'frag_keyframe+empty_moov+default_base_moof',
		'-f', 'mp4', 'pipe:3',
		// 480p output
		'-map', '[480p]', '-map', '[a3]',
		'-c:v', 'libx264', '-preset', 'ultrafast', '-g', '60',
		'-profile:v', 'main', '-level', '3.0',
		'-b:v', '3000k', '-c:a', 'aac', '-b:a', '96k',
		'-movflags', 'frag_keyframe+empty_moov+default_base_moof',
		'-f', 'mp4', 'pipe:4',
		// 360p output
		'-map', '[360p]', '-map', '[a4]',
		'-c:v', 'libx264', '-preset', 'ultrafast', '-g', '60',
		'-profile:v', 'baseline', '-level', '3.0',
		'-b:v', '1200k', '-c:a', 'aac', '-b:a', '64k',
		'-movflags', 'frag_keyframe+empty_moov+default_base_moof',
		'-f', 'mp4', 'pipe:5',
		// 160p output
		'-map', '[160p]', '-map', '[a5]',
		'-c:v', 'libx264', '-preset', 'ultrafast', '-g', '60',
		'-profile:v', 'baseline', '-level', '2.1',
		'-b:v', '300k', '-c:a', 'aac', '-b:a', '48k',
		'-movflags', 'frag_keyframe+empty_moov+default_base_moof',
		'-f', 'mp4', 'pipe:6'
	], {
		stdio: [
			'pipe',
			'pipe',
			'pipe',
			'pipe',
			'pipe',
			'pipe',
			'pipe'
		]
	});
	streamlink.stdout.pipe(ffmpeg.stdin);
	// Pipe the outputs to our passthrough streams
	ffmpeg.stdout.pipe(output_pipes[0]);
	ffmpeg.stdio[3].pipe(output_pipes[1]);
	ffmpeg.stdio[4].pipe(output_pipes[2]);
	ffmpeg.stdio[5].pipe(output_pipes[3]);
	ffmpeg.stdio[6].pipe(output_pipes[4]);

	// Now pipe to the atom finders
	output_pipes[0].pipe(atom_finders['1080p60']);
	output_pipes[1].pipe(atom_finders['720p60']);
	output_pipes[2].pipe(atom_finders['480p']);
	output_pipes[3].pipe(atom_finders['360p']);
	output_pipes[4].pipe(atom_finders['160p']);

	for (const atom_finder in atom_finders) {
		const live = {};
		const quality = atom_finder;
		lives[quality] = live;
		atom_finders[quality].on('atom', atom => {
			if (atom.type == 'ftyp') {
				live.ftyp_seg = atom.data;
			} else if (atom.type == 'moov') {
				if (live.ftyp_seg) {
					live.init_seg = Buffer.concat([live.ftyp_seg, atom.data]);
					app.publish(`live/${quality}`, live.init_seg, true);
					live.ftyp_seg = null;
					live.last_seg = null;
				}
			} else if (atom.type == 'moof') {
				live.moof_seg = atom.data;
			} else if (atom.type == 'mdat') {
				if (live.moof_seg) {
					live.last_seg = Buffer.concat([live.moof_seg, atom.data]);
					app.publish(`live/${quality}`, live.last_seg, true);
					live.moof_seg = null;
				}
			}
		});
	}
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
}, 10000);

start_stream(config.stream_url);