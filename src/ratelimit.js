import { is_dev } from './main.js';

const ratelimits = {
	'todo': { limit: { max: 10, delay: 5 }, users: [] },
};

setInterval(() => {
	const now = Date.now();
	for (const ratelimit_type in ratelimits) {
		const ratelimit = ratelimits[ratelimit_type];
		for (let i = 0; i < ratelimit.users.length; ++i) {
			const user = ratelimit.users[i];
			if ((now - user.time) / 1000 >= ratelimit.limit.delay) {
				if (user.uses <= 1) {
					ratelimit.users.splice(i, 1);
				} else {
					--user.uses;
					user.time = now;
				}
			}
		}
	}
}, 1000);

function get_ratelimit_user(ratelimit, index, id, ip) {
	if (index === -1) {
		const ratelimit_user = {
			id: id,
			ip: ip,
			uses: 0,
			time: Date.now(),
		};
		ratelimit.users.push(ratelimit_user);
		return ratelimit_user;
	}
	const ratelimit_user = ratelimit.users[index];
	if (ratelimit_user.uses >= ratelimit.limit.max) {
		return null;
	}
	return ratelimit_user;
}

export function is_ratelimited(res, req, type) {
	const id = req.getHeader('id');
	if (!id || id.length != 16) return true;
	const ip = is_dev ? 'local' : req.getHeader('cf-connecting-ip');
	const ratelimit = ratelimits[type];
	const ratelimit_user_id = get_ratelimit_user(ratelimit, ratelimit.users.findIndex(user => user.id === id), id, ip);
	if (ratelimit_user_id === null) {
		return true;
	}
	let ratelimit_user_ip = get_ratelimit_user(ratelimit, ratelimit.users.findIndex(user => user.ip === ip), id, ip);
	if (ratelimit_user_ip === null) {
		return true;
	}
	++ratelimit_user_id.uses;
	if (ratelimit_user_ip !== ratelimit_user_id) {
		++ratelimit_user_ip.uses;
	}
	return false;
}