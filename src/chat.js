import { WebSocket } from 'ws';
import { app, chats } from './main.js';

function add_chat_message(chat, msg_data) {
	chat.history.push(msg_data);
	if (chat.history.length > 50) {
		chat.history.splice(0, 1);
	}
	app.publish(`chat/${chat.index}`, JSON.stringify({
		type: `${chat.platform}_chat`,
		data: msg_data,
	}), false);
}

async function init_twitch_chat(chat, channel_name) {
	const res = await fetch('https://gql.twitch.tv/gql', {
		headers: {
			'content-type': 'application/json',
			'client-id': 'kimne78kx3ncx6brgo4mv6wki5h1ko',
		},
		method: 'POST',
		body: JSON.stringify({
			operationName: 'GetUserIDFromLogin',
			variables: {
				login: channel_name,
				lookupType: 'ACTIVE',
			},
			extensions: {
				persistedQuery: {
					version: 1,
					sha256Hash: 'c8502d09d4f290bb5155e6953a2c3119d4296d7ce647a2e21d1cf4c805583e43',
				}
			}
		}),
	});
	const json = await res.json();
	const twitch_user_id = json.data.user.id;
	chat.id = twitch_user_id;
	chat.chat_id = twitch_user_id;
	const chat_ws = new WebSocket('wss://irc-ws.chat.twitch.tv/');
	chat_ws.onopen = () => {
		chat_ws.send('CAP REQ :twitch.tv/commands twitch.tv/tags');
		chat_ws.send('PASS blah');
		chat_ws.send('NICK justinfan12345');
		chat_ws.send('USER justinfan12345 8 * :justinfan12345');
		chat_ws.send(`JOIN #${channel_name}`);
	};
	chat_ws.onmessage = event => {
		if (event.data.includes('PRIVMSG #')) {
			add_chat_message(chat, event.data);
		}
	};
}

async function init_kick_chat(chat, channel_name) {
	const res = await fetch(`https://kick.com/api/v2/channels/${channel_name}`);
	const json = await res.json();
	const kick_channel_id = json.id.toString();
	const kick_user_id = json.user_id.toString();
	chat.id = kick_user_id;
	{
		const res = await fetch(`https://kick.com/api/v2/channels/${channel_name}/chatroom`);
		const json = await res.json();
		const kick_chat_id = json.id.toString();
		chat.chat_id = kick_chat_id;
		{
			const chat_ws = new WebSocket('wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679?protocol=7&client=js&version=8.4.0&flash=false');
			chat_ws.onopen = () => {
				chat_ws.send(`{"event":"pusher:subscribe","data":{"auth":"","channel":"chatrooms.${kick_chat_id}.v2"}}`);
			};
			chat_ws.onmessage = (event) => {
				const json = JSON.parse(event.data);
				// {"event":"GiftedSubscriptionsEvent","data":"{\"chatroom_id\":XXXXXXXX,\"gifted_usernames\":[\"gifted_foobar\"],\"gifter_username\":\"gifter_foobar\",\"gifter_total\":1}","channel":"chatroom_XXXXXXXX"}
				if (json.event === 'App\\Events\\ChatMessageEvent') {
					const msg_data = JSON.parse(json.data);
					add_chat_message(chat, msg_data);
				}
			};
		}
	}
}

export async function init_chats(chat_modes) {
	for (let a = 0; a < chat_modes.length; ++a) {
		const chat_mode = chat_modes[a];
		chat_mode.index = a;
		chat_mode.history = [];
		chats.push(chat_mode);
		if (chat_mode.platform === 'twtv') {
			await init_twitch_chat(chat_mode, chat_mode.target);
		} else if (chat_mode.platform === 'kick') {
			await init_kick_chat(chat_mode, chat_mode.target);
		}
	}
}