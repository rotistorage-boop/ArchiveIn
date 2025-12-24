import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		if (event.locals.user.role === 'admin') {
			throw redirect(302, '/dashboard');
		}
		throw redirect(302, '/');
	}
	return {};
};
