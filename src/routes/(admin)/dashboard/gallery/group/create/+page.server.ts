import { createGalleryGroup } from '$lib/server/services/gallery.service';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;

		if (!title) {
			return fail(400, { error: 'Title is required' });
		}

		try {
			await createGalleryGroup({ title, description });
		} catch (error) {
			console.error('Failed to create gallery group:', error);
			return fail(500, { error: 'Failed to create gallery group' });
		}
		throw redirect(303, '/dashboard/gallery');
	}
};
