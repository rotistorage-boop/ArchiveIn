import { db } from '$lib/server/db';

export async function getGallery() {
	return db.query.galleryGroup.findMany({
		with: {
			items: {
				columns: {
					id: true,
					title: true,
					imageUrl: true,
					date: true
				}
			}
		}
	});
}
