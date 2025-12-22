import type { InferSelectModel } from 'drizzle-orm';
import { galleryGroup, galleryItem } from '$lib/server/db/schema';

export type GalleryItem = InferSelectModel<typeof galleryItem> & {
	date: string; // Added, replacing yearTaken from schema change
};

export type GalleryGroup = InferSelectModel<typeof galleryGroup> & {
	items: GalleryItem[];
};
