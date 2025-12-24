import {
	getGalleryGroupsWithItems,
	getUncategorizedGalleryItems
} from '$lib/server/services/gallery.service';
import { getArchiveTree } from '$lib/server/services/archive.service';
import type { PageServerLoad } from './$types';

// Roles that can access archive
const ARCHIVE_ALLOWED_ROLES = ['admin', 'trunojoyo'];

export const load: PageServerLoad = async ({ locals }) => {
	const gallery = await getGalleryGroupsWithItems();
	const uncategorizedItems = await getUncategorizedGalleryItems();

	// Only load archive if user has permission (admin or trunojoyo)
	const canAccessArchive = locals.user && ARCHIVE_ALLOWED_ROLES.includes(locals.user.role);
	const archive = canAccessArchive ? await getArchiveTree() : [];

	return {
		gallery,
		uncategorizedItems,
		archive,
		user: locals.user,
		canAccessArchive
	};
};
