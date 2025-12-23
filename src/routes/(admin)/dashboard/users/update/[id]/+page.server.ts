import { getUsers, updateUserRole } from '$lib/server/services/user.service';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const users = await getUsers();
	const user = users.find((u: any) => u.id === params.id);

	if (!user) throw redirect(303, '/dashboard/users');

	return { user };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const formData = await request.formData();
		const id = params.id as string;
		const role = formData.get('role') as string;

		try {
			await updateUserRole(id, role);
		} catch (error) {
			console.error('Failed to update user role:', error);
			return fail(500, { error: 'Failed to update user role' });
		}
		throw redirect(303, '/dashboard/users');
	}
};
