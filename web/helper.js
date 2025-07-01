function get_utf8_size(string) {
	return new TextEncoder().encode(string).length;
}

function add_event(elem, event, func) {
	elem.addEventListener(event, func);
}

function remove_event(elem, event, func) {
	elem.removeEventListener(event, func);
}

function set_interval(func, delay) {
	return window.setInterval(func, delay);
}

function clear_interval(interval_id) {
	return window.clearInterval(interval_id);
}

function get_document_body() {
	return window.document.body;
}

function elem_create(tag_name) {
	return window.document.createElement(tag_name);
}

function elem_create_div() {
	return elem_create(`div`);
}

function elem_create_span() {
	return elem_create(`span`);
}

function elem_create_html(html) {
	const template = elem_create(`template`);
	elem_set_inner_html(template, html);
	return template.content.firstChild;
}

function elem_append(elem, child) {
	elem.append(child);
}

function elem_prepend(elem, child) {
	elem.prepend(child);
}

function elem_remove(elem) {
	if (elem) {
		elem.remove();
	}
}

function elem_set_id(elem, id) {
	elem.id = id;
}

function elem_set_title(elem, title) {
	elem.title = title;
}

function elem_set_inner_html(elem, html) {
	elem.innerHTML = html;
}

function elem_set_inner_text(elem, text) {
	elem.innerText = text;
}

function elem_class_add(elem, ...tokens) {
	elem.classList.add(...tokens);
}

function elem_class_rem(elem, ...tokens) {
	elem.classList.remove(...tokens);
}

function elem_class_toggle(elem, token, force) {
	elem.classList.toggle(token, force);
}

function toggle_visible(elem) {
	set_visible(elem, elem.style.display != '');
}

function set_visible(elem, visible) {
	elem.style.display = visible ? '' : 'none';
}

function fade_in(element) {
	const start_time = Date.now();
	function update() {
		const moment = Math.min((Date.now() - start_time) / 100, 1);
		element.style.opacity = moment;
		if (moment >= 1) {
			clear_interval(interval);
		}
	}
	const interval = set_interval(update, 0);
	update();
}

function fade_out(element, callback) {
	const start_time = Date.now();
	function update() {
		const moment = Math.max(1 - ((Date.now() - start_time) / 100), 0);
		element.style.opacity = moment;
		if (moment <= 0) {
			if (callback) {
				callback();
			}
			clear_interval(interval);
		}
	}
	const interval = set_interval(update, 0);
	update();
}