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

function make_badge(type) {
	const badge = document.createElement('div');
	badge.classList.add('badge');
	switch (type) {
		case 'm': {
			badge.classList.add('moderator');
			badge.title = 'Moderator';
			badge.innerHTML = '<svg class="" viewBox="0 0 576 512"><path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z"/></svg>';
			break;
		}
	}
	return badge;
}

function make_badges(badges, parent) {
	for (let i = 0; i < badges.length; ++i) {
		parent.appendChild(make_badge(badges[i]));
	}
}

let ws;
let token_modal;

function make_token_modal() {
	const modal = make_modal('token', true);
	const foo1 = elem_create_html(`<span class="modal-title">Chat Token</span>`);
	const foo2 = elem_create_html(`<span class="subtext">To send messages in Chat you will need to provide a Token.</span>`);
	const foo3 = elem_create_html(`<span>Drag the below button on to your Bookmarks Bar or copy the link and add it as a Bookmark manually. Then click the Bookmark once and follow the instructions on screen.</span>`);
	const bookmark_code = encodeURIComponent("if (window.location.host.includes(`kick.com`)) {window.location.replace(`%APP_URL%#kick_token=${document.cookie.split(`;`).map(cookie => cookie.trim()).find(cookie => cookie.startsWith('session_token')).substring(14)}`)} else {window.alert(`You will now be redirected to Kick.com to login.\nAfter the page loads click on this bookmark again.`);window.location.replace(`https://kick.com`)}");
	const foo4 = elem_create_html(`<div class="bookmark"><a href="javascript:(function(){${bookmark_code}})();" class="link">Kick Login</a><span>← drag this button to your Bookmarks Bar.</span></div>`);
	// const foo5 = elem_create_html(`<form id="modal-token-form" class="modal-form">
	// 	<div class="modal-part">
	// 		<span class="subtext">If you already have a token you can paste it here:</span>
	// 		<div class="input-field">
	// 			<input id="foobar" minlength="3" maxlength="16">
	// 			<span class="label">Kick Token</span>
	// 		</div>
	// 	</div>
	// </form>`);
	elem_append(modal.content, foo1);
	elem_append(modal.content, foo2);
	elem_append(modal.content, foo3);
	elem_append(modal.content, foo4);
	// elem_append(modal.content, foo5);
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

function main() {
	const hash_params = new URLSearchParams(window.location.hash.substring(1));
	const kick_token = hash_params.get('kick_token');
	if (kick_token) {
		localStorage.kick_token = kick_token;
		window.history.replaceState({}, '', window.location.pathname);
	}
	ws = new WebSocket(location.origin.replace('http', 'ws'));
	ws.onmessage = event => {
		if (typeof(event.data) === 'string') {
			const json = JSON.parse(event.data);
			if (json.type == 'live_reset') {
				player_reset();
			} else if (json.type == 'user_count') {
				update_viewer_count(json.count);
			}
		} else {
			event.data.arrayBuffer().then(ab => {
				new_live_video_data(ab);
			});
		}
	};
	ws.onclose = () => {
		fade_in(query('#modal-disconnect-bg'));
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

	token_modal = make_token_modal();
	init_live();
	init_chat();

	query('#reload-button').addEventListener('click', () => {
		location.reload();
	});

	const chat_modes = query_all('.chat-mode');
	chat_modes.forEach(chat_mode => {
		chat_mode.set_channel = () => {
			chat_modes.forEach(old_chat_mode => {
				old_chat_mode.classList.remove('active');
			});
			chat_mode.classList.add('active');
			query('#twitch-chat').src = chat_mode.getAttribute('target_frame_src');
		};
		chat_mode.addEventListener('click', () => {
			chat_mode.set_channel();
		});
	});
	chat_modes[0].set_channel();
}