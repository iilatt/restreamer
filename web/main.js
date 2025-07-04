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

function make_modal(name, has_close) {
	const modal = {};
	const modal_bg = elem_create_div();
	elem_set_id(modal_bg, `${name}-modal-bg`);
	elem_class_add(modal_bg, `modal-bg`);
	if (has_close) {
		elem_class_add(modal_bg, `close`);
	}
	const modal_border = elem_create_div();
	elem_set_id(modal_border, `${name}-modal-border`);
	elem_class_add(modal_border, 'modal-border');
	elem_append(modal_bg, modal_border);
	const modal_content = elem_create_div();
	elem_set_id(modal_content, `${name}-modal`);
	elem_class_add(modal_content, `modal`);
	elem_append(modal_border, modal_content);
	modal.content = modal_content;
	if (has_close) {
		const close_button = elem_create(`button`);
		elem_append(modal_content, close_button);
		modal_bg.close_button = close_button;
		elem_class_add(close_button, `icon-btn`, `modal-close`);
		const icon_svg = elem_create_html(`<svg viewBox="0 -960 960 960"><path d="M480-437.85 277.08-234.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L437.85-480 234.92-682.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69L480-522.15l202.92-202.93q8.31-8.3 20.89-8.5 12.57-.19 21.27 8.5 8.69 8.7 8.69 21.08 0 12.38-8.69 21.08L522.15-480l202.93 202.92q8.3 8.31 8.5 20.89.19 12.57-8.5 21.27-8.7 8.69-21.08 8.69-12.38 0-21.08-8.69L480-437.85Z"/></svg>`);
		elem_append(close_button, icon_svg);
	}
	modal.show = function() {
		elem_append(document.body, modal_bg);
		fade_in(modal_bg);
	};
	modal.hide = function() {
		fade_out(modal_bg, () => {
			elem_remove(modal_bg);
		});
	};
	if (has_close) {
		add_event(modal_bg.close_button, `click`, () => {
			modal.hide();
		});
		add_event(modal_bg, `mousedown`, event => {
			if (event.target === modal_bg) {
				modal_bg.mouse_down = true;
			}
		});
		add_event(modal_bg, `mouseup`, event => {
			if (modal_bg.mouse_down && event.target === event.currentTarget) {
				modal.hide();
			}
			modal_bg.mouse_down = false;
		});
	}
	return modal;
}

function generate_id(length) {
	const arr = new Uint8Array((length || 40) / 2);
	window.crypto.getRandomValues(arr);
	return Array.from(arr, dec => dec.toString(16).padStart(2, '0')).join('');
}

let ws;
let discon_modal;
let token_modal;

function make_bookmark_link(target_host, target_name, storage_name, cookie_name) {
	return 'javascript:(function(){' + encodeURIComponent("const ui=window.document.createElement(`div`);ui.style=`position:fixed;top:0;left:0;width:100%;height:100%;padding:10px;display:flex;align-items:center;flex-direction:column;gap:10px;font-size:1.4em;z-index:9999999;color:#fff;background-color:#000`;if(window.location.host.includes(`" + target_host + "`)){ui.innerHTML=`Redirecting back to %APP_URL%...`;const token_value=window.document.cookie.split(`;`).map(cookie=>cookie.trim()).find(cookie=>cookie.startsWith(`" + cookie_name + "`));if(!token_value){window.alert(`You need to log in first.`);return}window.location.href=`%APP_URL%#" + storage_name + "=${token_value.substring(" + (cookie_name.length + 1) + ")}`}else{ui.innerHTML=`You will now be redirected to " + target_name + " to authorize.<br><b>After the page loads click on this bookmark again.</b><button onclick=\"javascript:window.location.href='https://" + target_host + "'\" style=\"color:#fff;border:2px solid #fff;padding:10px;border-radius:10px\">Continue to " + target_name + "</button>`}window.document.body.appendChild(ui)") + '})();';
}

function make_discon_modal() {
	const modal = make_modal('discon', false);
	const foo1 = elem_create_html(`<span class="modal-title">Disconnected</span>`);
	const foo2 = elem_create_html(`<button id="reload-button">Reload</button>`);
	foo2.addEventListener('click', () => {
		location.reload();
	});
	elem_append(modal.content, foo1);
	elem_append(modal.content, foo2);
	return modal;
}

function make_token_modal() {
	const modal = make_modal('token', true);
	const foo1 = elem_create_html(`<span class="modal-title">Chat Token</span>`);
	const foo2 = elem_create_html(`<span class="subtext">To send messages in Chat you will need to provide a Token.</span>`);
	const foo3 = elem_create_html(`<span>Drag the below button on to your Bookmarks Bar or copy the link and add it as a Bookmark manually. Then click the Bookmark once and follow the instructions on screen.</span>`);
	const twtv_bookmark_link = make_bookmark_link('twitch.tv', 'Twitch.tv', 'twtv_token', 'auth-token');
	const foo4 = elem_create_html(`<div class="bookmark"><a href="${twtv_bookmark_link}" class="link">Twitch Login</a><span>← drag this button to your Bookmarks Bar.</span></div>`);
	const kick_bookmark_link = make_bookmark_link('kick.com', 'Kick.com', 'kick_token', 'session_token');
	const foo5 = elem_create_html(`<div class="bookmark"><a href="${kick_bookmark_link}" class="link">Kick Login</a><span>← drag this button to your Bookmarks Bar.</span></div>`);
	elem_append(modal.content, foo1);
	elem_append(modal.content, foo2);
	elem_append(modal.content, foo3);
	elem_append(modal.content, foo4);
	elem_append(modal.content, foo5);
	const bookmark_explain = query('#bookmark-explain');
	const bookmarks = modal.content.querySelectorAll('.bookmark > .link');
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
	return modal;
}

function add_chat_modes(modes) {
	const mode_elems = [];
	for (let a = 0; a < modes.length; ++a) {
		const mode = modes[a];
		const elem = elem_create_html(`<button class="chat-mode wide">${mode.name}</button>`);
		const set_mode = () => {
			mode_elems.forEach(old_mode_elem => {
				old_mode_elem.classList.remove('active');
			});
			elem.classList.add('active');
			ws.send(JSON.stringify({
				type: 'set_chat',
				value: a,
			}));
		};
		mode_elems.push(elem);
		elem.addEventListener('click', () => {
			set_mode();
		});
		if (a == 0) {
			set_mode();
		}
		elem_append(query('#live-chat-modes'), elem);
	}
}

function main() {
	console.log('ReStreamer v0.2');
	const hash_params = new URLSearchParams(window.location.hash.substring(1));
	const twtv_token = hash_params.get('twtv_token');
	if (twtv_token) {
		localStorage.twtv_token = twtv_token;
	}
	const kick_token = hash_params.get('kick_token');
	if (kick_token) {
		localStorage.kick_token = kick_token;
	}
	window.history.replaceState({}, '', window.location.pathname);
	ws = new WebSocket(location.origin.replace('http', 'ws'));
	ws.onmessage = event => {
		if (typeof(event.data) === 'string') {
			const json = JSON.parse(event.data);
			if (json.type == 'live_init') {
				player_reset();
			} else if (json.type === 'user_count') {
				update_viewer_count(json.count);
			} else if (json.type === 'chat_modes') {
				add_chat_modes(json.modes);
			} else if (json.type === 'chat_init') {
				set_chat_mode(json.platform, json.history, json.target, json.encrypt);
			} else if (json.type === 'twtv_chat') {
				on_twitch_message(json.data);
			} else if (json.type === 'kick_chat') {
				on_kick_message(json.data);
			}
		} else {
			event.data.arrayBuffer().then(ab => {
				new_live_video_data(ab);
			});
		}
	};
	ws.onclose = () => {
		discon_modal.show();
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

	discon_modal = make_discon_modal();
	token_modal = make_token_modal();
	init_live();
	init_chat();
}