function parse_emojis_to_html(input) {
	const escapedInput = escape_html(input);
	const parsedHtml = escapedInput.replace(/\[emote:(\d+):([^\]]*)\]/g, (match, emoteId, emoteName) => {
		const id = parseInt(emoteId, 10);
		if (isNaN(id)) {
			return escape_html(match);
		}
		const safeEmoteName = escape_html(emoteName.trim());
		return `<img class="emote" src="https://files.kick.com/emotes/${id}/fullsize" alt="${safeEmoteName}" loading="lazy">`;
	});
	return parsedHtml;
}

function escape_html(unsafe) {
	return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function on_message_json(msg_data) {
	const content_html = parse_emojis_to_html(msg_data.content);
	add_live_message(msg_data.sender.username, msg_data.sender.identity.color, content_html);
}

const kick_chat_id = '64158499';

async function init_chat() {
	const res = await fetch(`https://kick.com/api/v2/channels/${chat_id}/messages`);
	const json = await res.json();
	json.data.messages.reverse().forEach(msg_data => {
		on_message_json(msg_data);
	});
	const chat_ws = new WebSocket('wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679?protocol=7&client=js&version=8.4.0&flash=false');
	chat_ws.onopen = () => {
		`<svg viewBox="0 0 32 32"><g clip-path="url(#clip0_209_29923)"><path d="M30 0C31.1046 0 32 0.895431 32 2V30C32 31.1046 31.1046 32 30 32H2C0.895431 32 0 31.1046 0 30V2C0 0.895431 0.895431 0 2 0H30Z" fill="url(#paint0_linear_209_29923)"></path><path d="M7.72858 11.537C8.29788 10.6893 9.50318 10.5784 10.2169 11.3085C10.7494 11.8537 10.8263 12.6983 10.4014 13.3309L8.76276 15.7733C8.33415 16.4119 8.41717 17.2643 8.961 17.8085L14.1905 23.038C14.7346 23.5817 15.5871 23.6648 16.2256 23.2362L18.668 21.5966C19.3013 21.1718 20.1453 21.2496 20.6905 21.7821C21.4211 22.4963 21.3096 23.7012 20.462 24.2694L18.0313 25.9012C16.0784 27.2121 13.4707 26.9579 11.8077 25.2948L10.7842 24.2714L9.94928 25.1444C9.40029 25.6934 9.17494 26.4949 9.37994 27.244C9.57682 27.9648 9.39909 28.7665 8.84674 29.3407C7.99257 30.2278 6.56451 30.2114 5.69342 29.3407L2.65826 26.3055C1.79711 25.4447 1.77179 24.0356 2.6358 23.1776C3.21155 22.6065 4.02552 22.421 4.75592 22.621C5.50449 22.826 6.30647 22.6005 6.85553 22.0516L7.68951 21.1776L6.70319 20.1913C5.04011 18.5282 4.78641 15.9206 6.09674 13.9677L7.72858 11.537ZM27.5098 2.02332C28.1899 1.9217 28.8782 2.14875 29.3643 2.63464C29.8505 3.12082 30.0774 3.80979 29.9756 4.49011L28.9024 11.6688C28.8214 12.2106 28.5674 12.7128 28.1797 13.1005C28.0623 13.2179 27.9336 13.3236 27.796 13.4159L16.7393 20.8358C16.1629 21.2224 15.3939 21.1476 14.9034 20.6571L14.8467 20.6005C14.2755 20.029 14.2809 19.1004 14.8594 18.535L20.8663 12.6639C21.266 12.2735 21.2794 11.6348 20.8965 11.2274C20.5033 10.8092 19.8433 10.7958 19.4327 11.1971L13.3839 17.1083C12.8152 17.6636 11.9055 17.6589 11.3428 17.0966C10.8523 16.606 10.7776 15.8365 11.1641 15.2606L18.584 4.203C18.6764 4.06524 18.7819 3.93676 18.8995 3.81921C19.2872 3.43152 19.7892 3.1785 20.3311 3.09753L27.5098 2.02332Z" fill="#222222"></path></g><defs><linearGradient id="paint0_linear_209_29923" x1="-2.5717" y1="32.9739" x2="30.6232" y2="-4.19582" gradientUnits="userSpaceOnUse"><stop stop-color="#FCA800"></stop><stop offset="0.99" stop-color="#FF5100"></stop></linearGradient><clipPath id="clip0_209_29923"><rect width="32" height="32" fill="white"></rect></clipPath></defs></svg>`
		console.log('chat ws open');
		chat_ws.send(`{"event":"pusher:subscribe","data":{"auth":"","channel":"chatrooms.${chat_id}.v2"}}`);
	};
	chat_ws.onmessage = (event) => {
		const json = JSON.parse(event.data);
		if (json.event === 'App\Events\ChatMessageEvent') {
			const msg_data = JSON.parse(json.data);
			on_message_json(msg_data);
		}
	};
	chat_ws.onclose = () => {
		console.log('close');
	};
}