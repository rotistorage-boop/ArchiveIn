import { writable, get } from 'svelte/store';
import type { ArchiveItem } from '$lib/types/archive';

/* =========================
   TYPES
========================= */

export type PageType = 'gallery' | 'archive' | 'detail';

export interface PhotoData {
	src: string;
	title: string;
	desc: string;
	date?: string;
}

/* =========================
   STATE
========================= */

export const currentPage = writable<PageType>('gallery');
export const navigationPath = writable<string[]>([]);
export const currentItems = writable<ArchiveItem[]>([]);
let initialArchiveData: ArchiveItem[] = [];

export const selectedDetail = writable<ArchiveItem | null>(null);
export const selectedPhoto = writable<PhotoData | null>(null);

/* =========================
   LIFECYCLE
========================= */

export function initializeArchive(data: ArchiveItem[]) {
	initialArchiveData = data;
	currentItems.set(data);
}

/* =========================
   NAVIGATION
========================= */

export function navigateTo(path: string[]) {
	let items = initialArchiveData;

	for (const title of path) {
		const item = items.find((i) => i.title === title);
		if (item && item.children) {
			items = item.children;
		} else {
			// fallback aman
			navigationPath.set([]);
			currentItems.set(initialArchiveData);
			return;
		}
	}

	navigationPath.set(path);
	currentItems.set(items);
}

export function selectItem(item: ArchiveItem) {
	const path = get(navigationPath);

	// CASE 1: MASUK LEVEL BARU
	if (item.children && item.children.length > 0) {
		const newPath = [...path, item.title!];
		navigateTo(newPath);
		return;
	}

	// CASE 2: ITEM DETAIL
	selectedDetail.set(item);
	currentItems.set([item]);
	currentPage.set('detail');
}

export function goBack() {
	const path = get(navigationPath);

	if (path.length > 0) {
		const newPath = path.slice(0, -1);
		navigateTo(newPath);
	} else {
		currentPage.set('gallery');
	}
}

export function goToArchive() {
	navigateTo([]);
	currentPage.set('archive');
}

/* =========================
   PHOTO MODAL
========================= */

export function openPhoto(photo: PhotoData) {
	selectedPhoto.set(photo);
}

export function closePhoto() {
	selectedPhoto.set(null);
}
