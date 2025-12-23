import {
	getGalleryGroupsWithItems,
	updateGalleryGroup,
	getGalleryItems,
	updateGalleryItem
} from '$lib/server/services/gallery.service';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const id = parseInt(params.id);
	const groups = await getGalleryGroupsWithItems();
	const group = groups.find((g: any) => g.id === id);
	const allItems = await getGalleryItems(); // Fetch all items potentially to act on

	if (!group) throw redirect(303, '/dashboard/gallery');

	return { group, allItems };
};

export const actions: Actions = {
	updateGroup: async ({ request, params }) => {
		const formData = await request.formData();
		const id = parseInt(params.id);
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;

		try {
			await updateGalleryGroup(id, { title, description });
		} catch (error) {
			console.error('Failed to update gallery group:', error);
			return fail(500, { error: 'Failed to update gallery group' });
		}
		throw redirect(303, '/dashboard/gallery');
	},

	updateItems: async ({ request, params }) => {
		const formData = await request.formData();
		const groupId = parseInt(params.id);
		const selectedItemIds = formData.getAll('selectedItems').map((id) => parseInt(id as string));
		const removedItemIds = formData.getAll('removedItems').map((id) => parseInt(id as string));

		try {
			// 1. Add selected items to this group
			for (const itemId of selectedItemIds) {
				// We only need to update the groupId (other fields remain)
				// BUT updateGalleryItem requires title/desc/date if passed fully,
				// So we should create a specific service method OR
				// we will use a raw update query here or a new service method "moveGalleryItems".
				// For now, let's assume updateGalleryItem can handle partial updates if we relax the service or fetch first.
				// Actually, simpler: let's fetch the item, update groupId, save.
				const { getGalleryItemById } = await import('$lib/server/services/gallery.service');
				const item = await getGalleryItemById(itemId);
				if (item) {
					await updateGalleryItem(itemId, {
						...item,
						groupId: groupId,
						description: item.description ?? '',
						imagekitFileId: item.imagekitFileId ?? undefined,
						googleDriveFileId: item.googleDriveFileId ?? undefined
					});
				}
			}

			// 2. Remove unchecked items (set groupId to null)
			for (const itemId of removedItemIds) {
				const { getGalleryItemById } = await import('$lib/server/services/gallery.service');
				const item = await getGalleryItemById(itemId);
				if (item) {
					await updateGalleryItem(itemId, {
						...item,
						groupId: null,
						description: item.description ?? '',
						googleDriveFileId: item.googleDriveFileId ?? undefined,
						imagekitFileId: item.imagekitFileId ?? undefined
					});
				}
			}
		} catch (error) {
			console.error('Failed to update group items:', error);
			return fail(500, { error: 'Failed to update group items' });
		}
		// Stay on page to show updates
		return { success: true };
	}
};
