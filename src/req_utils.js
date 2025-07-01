export function get_body(res, max_size) {
	return new Promise((resolve, reject) => {
		let buffer, offset = 0;
		res.onAborted(() => {
			res.aborted = true;
			return reject('aborted');
		});
		res.onData((array_buffer, is_last) => {
			let chunk = Buffer.from(array_buffer);
			if (!array_buffer.byteLength && !is_last) return;
			const total = offset + array_buffer.byteLength;
			if (total > max_size) {
				respond400(res, 'too_big');
				return;
			}
			if (!buffer) {
				buffer = Buffer.concat([chunk]);
			} else {
				buffer = Buffer.concat([buffer, chunk]);
			}
			if (is_last) {
				return resolve(buffer);
			}
			offset = total;
		});
	});
}

export function get_body_json(res, max_size) {
	return new Promise((resolve, reject) => {
		get_body(res, max_size).then(buffer => {
			try {
				return resolve(JSON.parse(buffer));
			} catch {
				return reject('invalid_json');
			}
		});
	});
}

export function respond(res, code) {
	if (res.aborted) return;
	res.writeStatus(code).end();
}

export function respond_body(res, code, data) {
	if (res.aborted) return;
	res.writeStatus(code).end(data);
}

export function respond200(res, data) {
	respond_body(res, '200 OK', data);
}

export function respond400(res, data) {
	respond_body(res, '400 Bad Request', data);
}