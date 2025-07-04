let live_chat;
let live_chat_input;
let emote_panel;
let chat_target;
let chat_encrypt;
let chat_target_id;
let seventv = {};

function make_badge(platform, badge, parent) {
	const elem = document.createElement('div');
	elem.classList.add('badge');
	elem.title = badge.text;
	let html;
	if (platform === 'twtv') {
		switch (badge.type) {
			case 'broadcaster': {
				html = '<img alt="Broadcaster" src="https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/1">';
				break;
			}
			case 'moderator': {
				html = '<img alt="Moderator" src="https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/1">';
				break;
			}
			case 'premium': {
				html = '<img alt="Prime Gaming" src="https://static-cdn.jtvnw.net/badges/v1/bbbe0db0-a598-423e-86d0-f9fb98ca1933/1">';
				break;
			}
			case 'vip': {
				html = '<img alt="" src="https://static-cdn.jtvnw.net/badges/v1/b817aba4-fad8-49e2-b88a-7cc744dfa6ec/1">';
				break;
			}
			case 'subscriber': {
				html = '<img alt="1-Month Subscriber" src="https://files.kick.com/channel_subscriber_badges/508485/original">';
				break;
			}
			case 'turbo': {
				html = '<img alt="Turbo" src="https://static-cdn.jtvnw.net/badges/v1/bd444ec6-8f34-4bf9-91f4-af1e3428d80f/1">';
				break;
			}
			case 'partner': {
				html = '<img alt="Turbo" src="https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/1">';
				break;
			}
		}
	} else if (platform === 'kick') {
		switch (badge.type) {
			case 'broadcaster': {
				html = `<svg viewBox="0 0 32 32"><path d="M15.6773 22.1533C17.3698 22.1533 18.8182 21.5507 20.0233 20.3461C21.2282 19.1415 21.8307 17.6924 21.8307 16V6.15401C21.8307 4.46162 21.2286 3.01305 20.0233 1.80784C18.8182 0.602907 17.3698 0 15.6773 0C13.9849 0 12.5363 0.602907 11.3311 1.80784C10.1259 3.01285 9.52344 4.46162 9.52344 6.15401V16C9.52344 17.6923 10.1262 19.1415 11.3311 20.3461C12.5361 21.5507 13.9849 22.1533 15.6773 22.1533Z" fill="url(#paint0_linear_209_29909)"></path><path d="M15.6773 22.1533C17.3698 22.1533 18.8182 21.5507 20.0233 20.3461C21.2282 19.1415 21.8307 17.6924 21.8307 16V6.15401C21.8307 4.46162 21.2286 3.01305 20.0233 1.80784C18.8182 0.602907 17.3698 0 15.6773 0C13.9849 0 12.5363 0.602907 11.3311 1.80784C10.1259 3.01285 9.52344 4.46162 9.52344 6.15401V16C9.52344 17.6923 10.1262 19.1415 11.3311 20.3461C12.5361 21.5507 13.9849 22.1533 15.6773 22.1533Z" fill="white" fill-opacity="0.3"></path><path d="M26.3888 12.6731C26.1459 12.4295 25.8568 12.3076 25.5234 12.3076C25.1904 12.3076 24.902 12.4295 24.6581 12.6731C24.4147 12.9167 24.293 13.2051 24.293 13.5383V16C24.293 18.3718 23.4498 20.4006 21.7639 22.0864C20.0785 23.7723 18.0495 24.6153 15.6775 24.6153C13.3057 24.6153 11.2769 23.7723 9.59089 22.0864C7.90509 20.401 7.06226 18.3719 7.06226 16V13.5383C7.06226 13.2051 6.94041 12.9167 6.69692 12.6731C6.45329 12.4295 6.16514 12.3076 5.83159 12.3076C5.49804 12.3076 5.20956 12.4295 4.96606 12.6731C4.72237 12.9167 4.60059 13.2051 4.60059 13.5383V16C4.60059 18.8333 5.54627 21.2981 7.4371 23.3941C9.32799 25.4901 11.6645 26.6919 14.4467 26.9994V29.5381H9.52373C9.19038 29.5381 8.90196 29.6601 8.6584 29.9037C8.41477 30.1472 8.29293 30.4357 8.29293 30.7691C8.29293 31.1019 8.41477 31.391 8.6584 31.6344C8.90196 31.8778 9.19038 32 9.52373 32H21.831C22.1643 32 22.4531 31.8779 22.6963 31.6344C22.9402 31.391 23.0622 31.1019 23.0622 30.7691C23.0622 30.4358 22.9402 30.1472 22.6963 29.9037C22.4532 29.6601 22.1644 29.5381 21.831 29.5381H16.9086V26.9994C19.6904 26.6919 22.0267 25.4901 23.9178 23.3941C25.8089 21.2981 26.7548 18.8333 26.7548 16V13.5383C26.7548 13.2051 26.6327 12.9169 26.3888 12.6731Z" fill="url(#paint1_linear_209_29909)"></path><defs><linearGradient id="paint0_linear_209_29909" x1="5.22969e-08" y1="-5.22969e-08" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stop-color="#FF1CD2"></stop><stop offset="1" stop-color="#B20DFF"></stop></linearGradient><linearGradient id="paint1_linear_209_29909" x1="-5.88081e-07" y1="-8.98822e-07" x2="4.72839" y2="35.6202" gradientUnits="userSpaceOnUse"><stop stop-color="#FF1CD2"></stop><stop offset="1" stop-color="#B20DFF"></stop></linearGradient></defs></svg>`;
				break;
			}
			case 'moderator': {
				html = `<svg viewBox="0 0 32 32"><g clip-path="url(#clip0_817_50667)"><path d="M30 0C31.1046 0 32 0.895431 32 2V30C32 31.1046 31.1046 32 30 32H2C0.895431 32 0 31.1046 0 30V2C0 0.895431 0.895431 0 2 0H30ZM16.2197 2.99316C15.8292 2.60266 15.1962 2.60265 14.8057 2.99316L8.36328 9.43555C7.97294 9.82608 7.97284 10.4591 8.36328 10.8496L10.0918 12.5781C10.4823 12.9686 11.1153 12.9685 11.5059 12.5781L11.585 12.499L13.9414 14.8564L3.57129 25.2275C2.70357 26.0954 2.7035 27.5023 3.57129 28.3701C4.43911 29.2376 5.84612 29.2377 6.71387 28.3701L17.084 17.999L19.4414 20.3564L19.3633 20.4346C18.9728 20.8251 18.9728 21.4581 19.3633 21.8486L21.0918 23.5771C21.4823 23.9676 22.1154 23.9676 22.5059 23.5771L28.9482 17.1348C29.3386 16.7443 29.3386 16.1112 28.9482 15.7207L27.2197 13.9922C26.8293 13.6017 26.1962 13.6018 25.8057 13.9922L25.7266 14.0703L23.3701 11.7139C24.2377 10.8461 24.2376 9.4391 23.3701 8.57129C22.5023 7.7035 21.0954 7.70357 20.2275 8.57129L17.8701 6.21387L17.9482 6.13574C18.3388 5.74522 18.3388 5.11221 17.9482 4.72168L16.2197 2.99316Z" fill="url(#paint0_linear_817_50667)"></path><path d="M30 0C31.1046 0 32 0.895431 32 2V30C32 31.1046 31.1046 32 30 32H2C0.895431 32 0 31.1046 0 30V2C0 0.895431 0.895431 0 2 0H30ZM16.2197 2.99316C15.8292 2.60266 15.1962 2.60265 14.8057 2.99316L8.36328 9.43555C7.97294 9.82608 7.97284 10.4591 8.36328 10.8496L10.0918 12.5781C10.4823 12.9686 11.1153 12.9685 11.5059 12.5781L11.585 12.499L13.9414 14.8564L3.57129 25.2275C2.70357 26.0954 2.7035 27.5023 3.57129 28.3701C4.43911 29.2376 5.84612 29.2377 6.71387 28.3701L17.084 17.999L19.4414 20.3564L19.3633 20.4346C18.9728 20.8251 18.9728 21.4581 19.3633 21.8486L21.0918 23.5771C21.4823 23.9676 22.1154 23.9676 22.5059 23.5771L28.9482 17.1348C29.3386 16.7443 29.3386 16.1112 28.9482 15.7207L27.2197 13.9922C26.8293 13.6017 26.1962 13.6018 25.8057 13.9922L25.7266 14.0703L23.3701 11.7139C24.2377 10.8461 24.2376 9.4391 23.3701 8.57129C22.5023 7.7035 21.0954 7.70357 20.2275 8.57129L17.8701 6.21387L17.9482 6.13574C18.3388 5.74522 18.3388 5.11221 17.9482 4.72168L16.2197 2.99316Z" fill="url(#paint1_linear_817_50667)"></path><path d="M30 0C31.1046 0 32 0.895431 32 2V30C32 31.1046 31.1046 32 30 32H2C0.895431 32 0 31.1046 0 30V2C0 0.895431 0.895431 0 2 0H30ZM16.2197 2.99316C15.8292 2.60266 15.1962 2.60265 14.8057 2.99316L8.36328 9.43555C7.97294 9.82608 7.97284 10.4591 8.36328 10.8496L10.0918 12.5781C10.4823 12.9686 11.1153 12.9685 11.5059 12.5781L11.585 12.499L13.9414 14.8564L3.57129 25.2275C2.70357 26.0954 2.7035 27.5023 3.57129 28.3701C4.43911 29.2376 5.84612 29.2377 6.71387 28.3701L17.084 17.999L19.4414 20.3564L19.3633 20.4346C18.9728 20.8251 18.9728 21.4581 19.3633 21.8486L21.0918 23.5771C21.4823 23.9676 22.1154 23.9676 22.5059 23.5771L28.9482 17.1348C29.3386 16.7443 29.3386 16.1112 28.9482 15.7207L27.2197 13.9922C26.8293 13.6017 26.1962 13.6018 25.8057 13.9922L25.7266 14.0703L23.3701 11.7139C24.2377 10.8461 24.2376 9.4391 23.3701 8.57129C22.5023 7.7035 21.0954 7.70357 20.2275 8.57129L17.8701 6.21387L17.9482 6.13574C18.3388 5.74522 18.3388 5.11221 17.9482 4.72168L16.2197 2.99316Z" fill="url(#paint2_linear_817_50667)"></path></g><defs><linearGradient id="paint0_linear_817_50667" x1="18.8102" y1="-12.7222" x2="2.88536" y2="39.1063" gradientUnits="userSpaceOnUse"><stop stop-color="#FF6A4A"></stop><stop offset="1" stop-color="#C70C00"></stop></linearGradient><linearGradient id="paint1_linear_817_50667" x1="15.7467" y1="-4.75575" x2="16.321" y2="39.0672" gradientUnits="userSpaceOnUse"><stop stop-color="#FFC900"></stop><stop offset="0.99" stop-color="#FF9500"></stop></linearGradient><linearGradient id="paint2_linear_817_50667" x1="-14.9543" y1="46.9544" x2="32.0001" y2="-0.000509222" gradientUnits="userSpaceOnUse"><stop stop-color="#0095FF"></stop><stop offset="0.99" stop-color="#00C7FF"></stop></linearGradient><clipPath id="clip0_817_50667"><rect width="32" height="32" fill="white"></rect></clipPath></defs></svg>`;
				break;
			}
			case 'verified': {
				html = `<svg viewBox="0 0 16 16"><path fill="#1EFF00" d="M16 6.83512L13.735 4.93512L13.22 2.02512H10.265L8 0.120117L5.735 2.02012H2.78L2.265 4.93012L0 6.83512L1.48 9.39512L0.965 12.3051L3.745 13.3151L5.225 15.8751L8.005 14.8651L10.785 15.8751L12.265 13.3151L15.045 12.3051L14.53 9.39512L16.01 6.83512H16ZM6.495 12.4051L2.79 8.69512L4.205 7.28012L6.495 9.57512L11.29 4.78012L12.705 6.19512L6.5 12.4001L6.495 12.4051Z"></path></svg>`
				break;
			}
			case 'vip': {
				html = `<svg viewBox="0 0 32 32"><g clip-path="url(#clip0_746_28171)"><path d="M30 0C31.1046 0 32 0.895431 32 2V30C32 31.1046 31.1046 32 30 32H2C0.895431 32 0 31.1046 0 30V2C0 0.895431 0.895431 4.10637e-08 2 0H30ZM15.9648 5C15.7748 5.00005 15.588 5.05204 15.4238 5.15039C15.2596 5.24878 15.124 5.39057 15.0303 5.56055L9.82812 15.0176L3.55078 11.8906C3.36913 11.7985 3.16534 11.7607 2.96387 11.7822C2.76241 11.8038 2.57048 11.8842 2.41113 12.0127C2.25235 12.1408 2.13185 12.3126 2.06348 12.5078C1.99511 12.7031 1.98143 12.9144 2.02441 13.1172L4.58301 25.127C4.63544 25.3782 4.77165 25.6034 4.96777 25.7627C5.16376 25.9217 5.40762 26.0056 5.65723 26H26.251C26.5009 26.0057 26.7453 25.9219 26.9414 25.7627C27.1376 25.6034 27.2737 25.3782 27.3262 25.127L29.9697 13.1172C30.0187 12.9103 30.0086 12.6932 29.9404 12.4922C29.8722 12.2912 29.7485 12.1151 29.585 11.9844C29.4215 11.8537 29.2249 11.7743 29.0186 11.7559C28.8122 11.7374 28.6049 11.7802 28.4219 11.8799L22.1025 15.0283L16.9004 5.56055C16.8066 5.39054 16.6701 5.24878 16.5059 5.15039C16.3416 5.05207 16.1549 5 15.9648 5Z" fill="url(#paint0_linear_746_28171)"></path><path d="M30 0C31.1046 0 32 0.895431 32 2V30C32 31.1046 31.1046 32 30 32H2C0.895431 32 0 31.1046 0 30V2C0 0.895431 0.895431 4.10637e-08 2 0H30ZM15.9648 5C15.7748 5.00005 15.588 5.05204 15.4238 5.15039C15.2596 5.24878 15.124 5.39057 15.0303 5.56055L9.82812 15.0176L3.55078 11.8906C3.36913 11.7985 3.16534 11.7607 2.96387 11.7822C2.76241 11.8038 2.57048 11.8842 2.41113 12.0127C2.25235 12.1408 2.13185 12.3126 2.06348 12.5078C1.99511 12.7031 1.98143 12.9144 2.02441 13.1172L4.58301 25.127C4.63544 25.3782 4.77165 25.6034 4.96777 25.7627C5.16376 25.9217 5.40762 26.0056 5.65723 26H26.251C26.5009 26.0057 26.7453 25.9219 26.9414 25.7627C27.1376 25.6034 27.2737 25.3782 27.3262 25.127L29.9697 13.1172C30.0187 12.9103 30.0086 12.6932 29.9404 12.4922C29.8722 12.2912 29.7485 12.1151 29.585 11.9844C29.4215 11.8537 29.2249 11.7743 29.0186 11.7559C28.8122 11.7374 28.6049 11.7802 28.4219 11.8799L22.1025 15.0283L16.9004 5.56055C16.8066 5.39054 16.6701 5.24878 16.5059 5.15039C16.3416 5.05207 16.1549 5 15.9648 5Z" fill="url(#paint1_linear_746_28171)"></path></g><defs><linearGradient id="paint0_linear_746_28171" x1="18.8102" y1="-12.7222" x2="2.88536" y2="39.1063" gradientUnits="userSpaceOnUse"><stop stop-color="#FF6A4A"></stop><stop offset="1" stop-color="#C70C00"></stop></linearGradient><linearGradient id="paint1_linear_746_28171" x1="15.7467" y1="-4.75575" x2="16.321" y2="39.0672" gradientUnits="userSpaceOnUse"><stop stop-color="#FFC900"></stop><stop offset="0.99" stop-color="#FF9500"></stop></linearGradient><clipPath id="clip0_746_28171"><rect width="32" height="32" fill="white"></rect></clipPath></defs></svg>`;
				break;
			}
			case 'og': {
				html = `<svg viewBox="0 0 32 32"><g clip-path="url(#clip0_614_6266)"><path d="M22.8226 17.2693V28.0037C22.8226 28.2177 22.8929 28.383 23.0336 28.4996C23.1742 28.5969 23.3969 28.6455 23.7017 28.6455H24.5104V32H21.838C19.9627 32 18.6265 31.6694 17.8294 31.0082C17.0559 30.347 16.6691 29.472 16.6691 28.383V16.8901C16.6691 15.8011 17.0559 14.926 17.8294 14.2648C18.6265 13.6036 19.9627 13.273 21.838 13.273H24.6511V16.6276H23.7017C23.3969 16.6276 23.1742 16.6859 23.0336 16.8026C22.8929 16.8998 22.8226 17.0554 22.8226 17.2693ZM32.0002 21.6447V24.8826H24.0885V21.6447H32.0002ZM25.8466 19.6904V17.2693C25.8466 17.0554 25.7763 16.8998 25.6357 16.8026C25.495 16.6859 25.2723 16.6276 24.9676 16.6276H24.0182V13.273H26.8312C28.7066 13.273 30.031 13.6036 30.8046 14.2648C31.6017 14.926 32.0002 15.8011 32.0002 16.8901V19.6904H25.8466ZM25.8466 28.0037V23.8908H32.0002V28.383C32.0002 29.472 31.6017 30.347 30.8046 31.0082C30.031 31.6694 28.7066 32 26.8312 32H24.1588V28.6455H24.9676C25.2723 28.6455 25.495 28.5969 25.6357 28.4996C25.7763 28.383 25.8466 28.2177 25.8466 28.0037Z" fill="white"></path><path d="M22.8226 17.2693V28.0037C22.8226 28.2177 22.8929 28.383 23.0336 28.4996C23.1742 28.5969 23.3969 28.6455 23.7017 28.6455H24.5104V32H21.838C19.9627 32 18.6265 31.6694 17.8294 31.0082C17.0559 30.347 16.6691 29.472 16.6691 28.383V16.8901C16.6691 15.8011 17.0559 14.926 17.8294 14.2648C18.6265 13.6036 19.9627 13.273 21.838 13.273H24.6511V16.6276H23.7017C23.3969 16.6276 23.1742 16.6859 23.0336 16.8026C22.8929 16.8998 22.8226 17.0554 22.8226 17.2693ZM32.0002 21.6447V24.8826H24.0885V21.6447H32.0002ZM25.8466 19.6904V17.2693C25.8466 17.0554 25.7763 16.8998 25.6357 16.8026C25.495 16.6859 25.2723 16.6276 24.9676 16.6276H24.0182V13.273H26.8312C28.7066 13.273 30.031 13.6036 30.8046 14.2648C31.6017 14.926 32.0002 15.8011 32.0002 16.8901V19.6904H25.8466ZM25.8466 28.0037V23.8908H32.0002V28.383C32.0002 29.472 31.6017 30.347 30.8046 31.0082C30.031 31.6694 28.7066 32 26.8312 32H24.1588V28.6455H24.9676C25.2723 28.6455 25.495 28.5969 25.6357 28.4996C25.7763 28.383 25.8466 28.2177 25.8466 28.0037Z" fill="url(#paint0_linear_614_6266)"></path><path d="M22.8228 3.99625V14.7307C22.8228 14.9446 22.8931 15.1099 23.0338 15.2266C23.1744 15.3238 23.3971 15.3724 23.7019 15.3724H24.5106V18.727H21.8382C19.9629 18.727 18.6267 18.3964 17.8296 17.7352C17.056 17.074 16.6693 16.1989 16.6693 15.1099V3.61704C16.6693 2.52804 17.056 1.65295 17.8296 0.99177C18.6267 0.33059 19.9629 0 21.8382 0H24.6513V3.35452H23.7019C23.3971 3.35452 23.1744 3.41286 23.0338 3.52953C22.8931 3.62677 22.8228 3.78234 22.8228 3.99625ZM32.0004 8.37171V11.6095H24.0887V8.37171H32.0004ZM25.8468 6.41734V3.99625C25.8468 3.78234 25.7765 3.62677 25.6358 3.52953C25.4952 3.41286 25.2725 3.35452 24.9677 3.35452H24.0183V0H26.8314C28.7067 0 30.0312 0.33059 30.8048 0.99177C31.6018 1.65295 32.0004 2.52804 32.0004 3.61704V6.41734H25.8468ZM25.8468 14.7307V10.6178H32.0004V15.1099C32.0004 16.1989 31.6018 17.074 30.8048 17.7352C30.0312 18.3964 28.7067 18.727 26.8314 18.727H24.159V15.3724H24.9677C25.2725 15.3724 25.4952 15.3238 25.6358 15.2266C25.7765 15.1099 25.8468 14.9446 25.8468 14.7307Z" fill="#00FFF2"></path><path d="M9.38855 7.81748V4.28795C9.38855 4.07404 9.31822 3.91846 9.17757 3.82123C9.03691 3.70455 8.81421 3.64621 8.50947 3.64621H7.34909V0H10.3731C12.2485 0 13.573 0.33059 14.3465 0.99177C15.1436 1.65295 15.5421 2.52804 15.5421 3.61704V7.81748H9.38855ZM9.38855 14.439V7.43828H15.5421V15.1099C15.5421 16.1989 15.1436 17.074 14.3465 17.7352C13.573 18.3964 12.2485 18.727 10.3731 18.727H7.34909V15.0807H8.50947C8.81421 15.0807 9.03691 15.0321 9.17757 14.9349C9.31822 14.8182 9.38855 14.6529 9.38855 14.439ZM6.15354 4.28795V7.81748H0V3.61704C0 2.52804 0.386794 1.65295 1.16038 0.99177C1.95741 0.33059 3.29361 0 5.16897 0H8.193V3.64621H7.03262C6.72787 3.64621 6.50517 3.70455 6.36452 3.82123C6.22387 3.91846 6.15354 4.07404 6.15354 4.28795ZM6.15354 7.43828V14.439C6.15354 14.6529 6.22387 14.8182 6.36452 14.9349C6.50517 15.0321 6.72787 15.0807 7.03262 15.0807H8.193V18.727H5.16897C3.29361 18.727 1.95741 18.3964 1.16038 17.7352C0.386794 17.074 0 16.1989 0 15.1099V7.43828H6.15354Z" fill="white"></path><path d="M9.38855 7.81748V4.28795C9.38855 4.07404 9.31822 3.91846 9.17757 3.82123C9.03691 3.70455 8.81421 3.64621 8.50947 3.64621H7.34909V0H10.3731C12.2485 0 13.573 0.33059 14.3465 0.99177C15.1436 1.65295 15.5421 2.52804 15.5421 3.61704V7.81748H9.38855ZM9.38855 14.439V7.43828H15.5421V15.1099C15.5421 16.1989 15.1436 17.074 14.3465 17.7352C13.573 18.3964 12.2485 18.727 10.3731 18.727H7.34909V15.0807H8.50947C8.81421 15.0807 9.03691 15.0321 9.17757 14.9349C9.31822 14.8182 9.38855 14.6529 9.38855 14.439ZM6.15354 4.28795V7.81748H0V3.61704C0 2.52804 0.386794 1.65295 1.16038 0.99177C1.95741 0.33059 3.29361 0 5.16897 0H8.193V3.64621H7.03262C6.72787 3.64621 6.50517 3.70455 6.36452 3.82123C6.22387 3.91846 6.15354 4.07404 6.15354 4.28795ZM6.15354 7.43828V14.439C6.15354 14.6529 6.22387 14.8182 6.36452 14.9349C6.50517 15.0321 6.72787 15.0807 7.03262 15.0807H8.193V18.727H5.16897C3.29361 18.727 1.95741 18.3964 1.16038 17.7352C0.386794 17.074 0 16.1989 0 15.1099V7.43828H6.15354Z" fill="url(#paint1_linear_614_6266)"></path><path d="M9.38839 21.0905V17.561C9.38839 17.3471 9.31807 17.1915 9.17741 17.0943C9.03676 16.9776 8.81406 16.9193 8.50932 16.9193H7.34893V13.273H10.373C12.2483 13.273 13.5728 13.6036 14.3464 14.2648C15.1434 14.926 15.5419 15.8011 15.5419 16.8901V21.0905H9.38839ZM9.38839 27.712V20.7113H15.5419V28.383C15.5419 29.472 15.1434 30.347 14.3464 31.0082C13.5728 31.6694 12.2483 32 10.373 32H7.34893V28.3538H8.50932C8.81406 28.3538 9.03676 28.3052 9.17741 28.2079C9.31807 28.0913 9.38839 27.926 9.38839 27.712ZM6.15339 17.561V21.0905H-0.000152588V16.8901C-0.000152588 15.8011 0.386641 14.926 1.16023 14.2648C1.95726 13.6036 3.29346 13.273 5.16882 13.273H8.19285V16.9193H7.03247C6.72772 16.9193 6.50502 16.9776 6.36437 17.0943C6.22371 17.1915 6.15339 17.3471 6.15339 17.561ZM6.15339 20.7113V27.712C6.15339 27.926 6.22371 28.0913 6.36437 28.2079C6.50502 28.3052 6.72772 28.3538 7.03247 28.3538H8.19285V32H5.16882C3.29346 32 1.95726 31.6694 1.16023 31.0082C0.386641 30.347 -0.000152588 29.472 -0.000152588 28.383V20.7113H6.15339Z" fill="#00FFF2"></path></g><defs><linearGradient id="paint0_linear_614_6266" x1="23.9622" y1="0.695162" x2="24.4274" y2="31.9986" gradientUnits="userSpaceOnUse"><stop stop-color="#00FFF2"></stop><stop offset="1" stop-color="#006399"></stop></linearGradient><linearGradient id="paint1_linear_614_6266" x1="7.77104" y1="0" x2="7.91062" y2="32.567" gradientUnits="userSpaceOnUse"><stop stop-color="#00FFF2"></stop><stop offset="1" stop-color="#006399"></stop></linearGradient><clipPath id="clip0_614_6266"><rect width="32" height="32" fill="white"></rect></clipPath></defs></svg>`;
				break;
			}
			case 'subscriber': {
				html = '<img alt="1-Month Subscriber" src="https://files.kick.com/channel_subscriber_badges/508485/original">';
				break;
			}
		}
	}
	if (!html) {
		return;
	}
	elem_set_inner_html(elem, html);
	elem_append(parent, elem);
}

function scroll_chat() {
	setTimeout(() => {
		live_chat.scrollTop = live_chat.scrollHeight;
	}, 0);
}

function add_live_message(platform, user_name_str, user_color_str, badges, content_html_str) {
	const message = document.createElement('div');
	message.classList.add('message');
	const user_button = document.createElement('button');
	const user_name = document.createElement('span');
	user_name.classList.add('name');
	user_name.innerText = user_name_str;
	user_name.style.color = user_color_str;
	user_button.addEventListener('click', () => {
		if (platform === 'twtv') {
			window.open(`https://twitch.tv/${user_name_str}`, '_blank');
		} else if (platform === 'kick') {
			window.open(`https://kick.com/${user_name_str}`, '_blank');
		}
	});
	user_button.classList.add('user');
	for (const badge of badges) {
		make_badge(platform, badge, user_button);
	}
	user_button.appendChild(user_name);
	message.appendChild(user_button);
	const content_element = document.createElement('div');
	content_element.classList.add('content');
	content_element.innerHTML = `: ${content_html_str}`;
	message.appendChild(content_element);
	const scrolled = live_chat.scrollTop >= live_chat.scrollHeight - live_chat.clientHeight;
	live_chat.appendChild(message);
	if (scrolled) {
		scroll_chat();
	}
}

function parse_message_content(input, platform) {
	if (chat_encrypt && input.trim().startsWith('_8888_')) {
		try {
			input = decodeURIComponent(escape(atob(input.trim().substring(6))));
		} catch {}
	}
	let escaped_input = escape_html(input);
	return escaped_input.split(' ').map(word => {
		if (platform == 'kick') {
			word = word.replace(/\[emote:(\d+):([^\]]*)\]/g, (match, emote_id, emote_name) => {
				const id = parseInt(emote_id, 10);
				if (isNaN(id)) {
					return escape_html(match);
				}
				const safe_emote_name = escape_html(emote_name.trim());
				return `<img class="emote" src="https://files.kick.com/emotes/${id}/fullsize" title="${safe_emote_name}" alt="${safe_emote_name}" loading="lazy">`;
			});
		}
		const seventv_emote = seventv[word];
		if (seventv_emote) {
			return `<img class="emote" src="https://cdn.7tv.app/emote/${seventv_emote}/1x.avif" title="${word}" alt="${word}" loading="lazy">`;
		}
		return word;
	}).join(' ');
}

function escape_reg_exp(string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escape_html(unsafe) {
	return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

async function get_seventv(platform, platform_id) {
	seventv = {};
	elem_set_inner_html(emote_panel, '');
	const res = await fetch('https://7tv.io/v3/gql', {
		headers: {
			'content-type': 'application/json',
		},
		method: 'POST',
		body: JSON.stringify({
			query: `query() { userByConnection(platform: ${platform}, id: "${platform_id}") { emote_sets { id emotes { id name } } } }`
		}),
	});
	const json = await res.json();
	json.data.userByConnection.emote_sets.forEach(emote_set => {
		emote_set.emotes.forEach(emote => {
			seventv[emote.name] = emote.id;
			const emote_elem = elem_create_html(`<button type="button" class="emote"><img src="https://cdn.7tv.app/emote/${emote.id}/1x.avif" title="${emote.name}" alt="${emote.name}" loading="lazy"></button>`);
			emote_elem.addEventListener('click', () => {
				if (live_chat_input.value.length > 0 && !/\s/.test(live_chat_input.value[live_chat_input.value.length - 1])) {
					live_chat_input.value += ' ';
				}
				live_chat_input.value += `${emote.name} `;
			});
			elem_append(emote_panel, emote_elem);
		});
	});
}

function on_kick_message(msg_data) {
	const content_html = parse_message_content(msg_data.content, 'kick');
	add_live_message('kick', msg_data.sender.username, msg_data.sender.identity.color, msg_data.sender.identity.badges, content_html);
}

function on_twitch_message(msg_data) {
	const command_start_index = msg_data.indexOf(' ') + 1;
	const command_end_index = msg_data.indexOf(':', command_start_index + 1);
	const tags = {};
	msg_data.substring(0, command_start_index).substring(1).split(';').forEach(tag => {
		const values = tag.split('=');
		tags[values[0]] = values[1];
	});
	const command = msg_data.substring(command_start_index + 1, command_end_index);
	if (command.includes('PRIVMSG #')) {
		const badges = tags['badges'].split(',').filter(badge => badge.length).map(badge => {
			return {
				type: badge.split('/')[0],
				text: 'Twitch Badge',
			}
		});
		const content = msg_data.substring(command_end_index + 1).replaceAll('\n', '');
		const content_html = parse_message_content(content, 'twtv');
		add_live_message('twtv', tags['display-name'], tags['color'], badges, content_html);
	}
}

function init_chat() {
	live_chat = query('#live-chat');
	live_chat_input = query('#live-chat-input');
	const live_chat_emote = query('#live-chat-emote');
	emote_panel = query('#emote-panel');
	window.addEventListener('pointerdown', event => {
		if (live_chat_emote.contains(event.target) || emote_panel.contains(event.target)) {
			return;
		}
		set_visible(emote_panel, false);
	});
	live_chat_emote.addEventListener('click', () => {
		toggle_visible(emote_panel);
	})
	query('#live-chat-form').addEventListener('submit', event => {
		event.preventDefault();
		if ((chat_platform === 'twtv' && !localStorage.twtv_token) || chat_platform === 'kick' && !localStorage.kick_token) {
			token_modal.show();
			return;
		}
		let content = live_chat_input.value;
		if (chat_encrypt) {
			content = '_8888_' + btoa(unescape(encodeURIComponent(content)));
		}
		live_chat_input.value = '';
		if (chat_platform === 'twtv') {
			ws.send(JSON.stringify({
				type: 'send_twtv_msg',
				auth: localStorage.twtv_token,
				target: chat_target_id,
				content: content,
			}));
		} else if (chat_platform === 'kick') {
			ws.send(JSON.stringify({
				type: 'send_kick_msg',
				auth: localStorage.kick_token,
				target: chat_target_id,
				content: content,
			}));
		}
		return false;
	});
}

async function set_chat_mode(platform, history, target_id, encrypt) {
	chat_target_id = target_id;
	chat_encrypt = encrypt;
	elem_set_inner_html(live_chat, '');
	if (platform === 'twtv') {
		get_seventv('TWITCH', target_id);
	} else if (platform === 'kick') {
		get_seventv('KICK', target_id);
	}
	for (const history_msg_data of history) {
		if (platform === 'twtv') {
			on_twitch_message(history_msg_data);
		} else if (platform === 'kick') {
			on_kick_message(history_msg_data);
		}
	}
}