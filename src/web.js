import fs from 'fs';
import { join } from 'path';

function content_type(name) {
	switch (name.split('.').pop()) {
		case 'html': return 'text/html';
		case 'js':   return 'text/javascript';
		case 'css':  return 'text/css';
		case 'png':  return 'image/png';
		case 'jpg':  return 'image/jpeg';
		case 'ico':  return 'image/x-icon';
		case 'otf':  return 'application/x-font-opentype';
		case 'wav':  return 'audio/wav';
		default:     return 'text/plain';
	}
}

const files = [
	'app.html',
	'robots.txt',
	'favicon.ico',
];

export function get_web_files() {
	const webFiles = {};
	const webFilesPath = 'static';
	for (const file of files) {
		const filePath = join(webFilesPath, file);
		webFiles[file] = {
			type: content_type(file),
			data: fs.readFileSync(filePath)
		};
	}
	return webFiles;
}