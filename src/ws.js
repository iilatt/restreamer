import { is_dev, config, lives } from './main.js';
import { respond400 } from './req_utils.js';

export const websockets = [];

export function on_ws_upgrade(res, req, context) {
	const ip = is_dev ? 'local' : req.getHeader('cf-connecting-ip');
	if (!is_dev) {
		const ws_index = websockets.findIndex(ws => ws.ip === ip);
		if (ws_index !== -1) {
			respond400(res, 'too_many');
			return;
		}
	}
	res.upgrade({ ip: ip }, req.getHeader('sec-websocket-key'), req.getHeader('sec-websocket-protocol'), req.getHeader('sec-websocket-extensions'), context);
}

export function on_ws_open(ws) {
	ws.ip = ws.getUserData().ip;
	websockets.push(ws);
	ws.subscribe('all');
	ws.send(JSON.stringify({
		type: 'chat_modes',
		modes: config.chat_modes,
	}), false);
	ws.send(JSON.stringify({
		type: 'user_count',
		count: websockets.length
	}), false);
}

function make_nonce() {
	const bytes = new Uint8Array(16);
	crypto.getRandomValues(bytes);
	return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function on_ws_message(ws, message, is_binary) {
	if (is_binary) {
		ws.close();
		return;
	}
	let json;
	try {
		json = JSON.parse(new TextDecoder().decode(message));
	} catch {
		ws.close();
		return;
	}
	if (json.type === 'set_quality') {
		if (typeof(json.value) !== 'string') {
			ws.close();
			return;
		}
		ws.unsubscribe(`live/${ws.quality}`);
		ws.quality = json.value;
		if (!lives[ws.quality]) {
			ws.close();
			return;
		}
		ws.subscribe(`live/${ws.quality}`);
		ws.send(JSON.stringify({
			type: 'live_reset'
		}), false);
		if (lives[ws.quality].init_seg) {
			ws.send(lives[ws.quality].init_seg, true);
		}
		if (lives[ws.quality].last_seg) {
			ws.send(lives[ws.quality].last_seg, true);
		}
	} else if (json.type === 'send_twtv_msg') {
		fetch('https://gql.twitch.tv/gql', {
			headers: {
				'authorization': `OAuth ${json.auth}`,
				'accept': 'application/json',
				'content-type': 'application/json',
				'origin': 'https://www.twitch.tv',
				'client-id': 'kimne78kx3ncx6brgo4mv6wki5h1ko',
			},
			method: 'POST',
			body: JSON.stringify({
				operationName: 'sendChatMessage',
				variables: {
					input: {
						channelID: config.twtv_channel_id,
						message: json.content,
						nonce: make_nonce(),
						replyParentMessageID: null,
					},
				},
				extensions: {
					persistedQuery: {
						version: 1,
						sha256Hash: '0435464292cf380ed4b3d905e4edcb73078362e82c06367a5b2181c76c822fa2',
					},
				},
			}),
		});
	} else if (json.type === 'send_kick_msg') {
		fetch(`https://kick.com/api/v2/messages/send/${config.kick_channel_id}`, {
			headers: {
				'authorization': `Bearer ${json.auth}`,
				'accept': 'application/json',
				'content-type': 'application/json',
				'origin': 'https://kick.com',
			},
			method: 'POST',
			body: JSON.stringify({
				content: json.content,
				type: 'message',
				message_ref: Date.now(),
			}),
		});
	}
}

export function on_ws_close(ws, code, message) {
	ws.closed = true;
	const ws_index = websockets.findIndex(old_ws => old_ws === ws);
	if (ws_index === -1) {
		return;
	}
	websockets.splice(ws_index, 1);
}