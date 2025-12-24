// src/routes/(admin)/dashboard/+layout.server.ts
import { redirect, error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { env } from '$env/dynamic/private';

const ADMIN_EMAILS = (env.ADMIN_EMAILS || '').split(',').map((e) => e.trim());

export const load: LayoutServerLoad = async ({ locals }) => {
	// Check if user is authenticated
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	// Check if user is admin (by email)
	if (!ADMIN_EMAILS.includes(locals.user.email)) {
		throw error(403, {
			message: 'Forbidden: Admin access required'
		});
	}

	return {
		user: {
			id: locals.user.id,
			name: locals.user.name || 'Admin',
			email: locals.user.email,
			avatar: locals.user.avatar,
			role: locals.user.role || 'admin'
		}
	};
};
