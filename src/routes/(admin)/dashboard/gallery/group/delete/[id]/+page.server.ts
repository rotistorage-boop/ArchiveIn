import {
	getGalleryGroupsWithItems,
	deleteGalleryGroup
} from '$lib/server/services/gallery.service';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const id = parseInt(params.id);
	const groups = await getGalleryGroupsWithItems();
	const group = groups.find((g: any) => g.id === id);

	if (!group) throw redirect(303, '/dashboard/gallery');

	return { group };
};

export const actions: Actions = {
	default: async ({ params }) => {
		const id = parseInt(params.id);

		try {
			await deleteGalleryGroup(id);
		} catch (error) {
			console.error('Failed to delete gallery group:', error);
			return fail(500, { error: 'Failed to delete gallery group' });
		}
		throw redirect(303, '/dashboard/gallery');
	}
};
