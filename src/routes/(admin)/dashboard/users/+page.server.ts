import { getUsers, deleteUser } from '$lib/server/services/user.service';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const users = await getUsers();
	return {
		users
	};
};

export const actions: Actions = {
	delete: async ({ request, locals }) => {
		// Ensure admin only
		if (!locals.user || locals.user.role !== 'admin') {
			return fail(403, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const userId = formData.get('userId') as string;

		if (!userId) {
			return fail(400, { message: 'User ID is required' });
		}

		// Prevent self-deletion
		if (userId === locals.user.id) {
			return fail(400, { message: 'Cannot delete yourself' });
		}

		try {
			await deleteUser(userId);
			return { success: true };
		} catch (error) {
			console.error('Failed to delete user:', error);
			return fail(500, { message: 'Failed to delete user' });
		}
	}
};
