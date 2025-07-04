import { config, chats } from './main.js';

export const websockets = [];

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

async function send_twtv_chat(auth, chat_id, content) {
	const res = await fetch('https://gql.twitch.tv/gql', {
		headers: {
			'authorization': `OAuth ${auth}`,
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
					channelID: chat_id.toString(),
					message: content,
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
	const text = await res.text();
}

function send_kick_chat(auth, chat_id, content) {
	fetch(`https://kick.com/api/v2/messages/send/${chat_id}`, {
		headers: {
			'authorization': `Bearer ${auth}`,
			'accept': 'application/json',
			'content-type': 'application/json',
			'origin': 'https://kick.com',
		},
		method: 'POST',
		body: JSON.stringify({
			content: content,
			type: 'message',
			message_ref: Date.now(),
		}),
	});
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
	if (json.type == 'set_chat') {
		if (typeof(json.value) !== 'number') {
			ws.close();
			return;
		}
		ws.unsubscribe(`chat/${ws.chat}`);
		ws.chat = json.value;
		if (ws.chat < 0 || ws.chat >= chats.length) {
			ws.close();
			return;
		}
		ws.subscribe(`chat/${ws.chat}`);
		ws.send(JSON.stringify({
			type: 'chat_init',
			platform: chats[ws.chat].platform,
			history: chats[ws.chat].history,
			target: chats[ws.chat].id,
			encrypt: chats[ws.chat].encrypt,
		}), false);
	} else if (json.type === 'send_chat') {
		if (typeof(ws.chat) !== 'number') {
			return;
		}
		const chat = chats[ws.chat];
		if (chat.platform === 'twtv') {
			send_twtv_chat(json.auth, chat.chat_id, json.content);
		} else if (chat.platform === 'kick') {
			send_kick_chat(json.auth, chat.chat_id, json.content);
		}
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