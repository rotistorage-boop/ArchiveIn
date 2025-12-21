import { writable, get } from 'svelte/store';
import type { ArchiveItem } from '$lib/data/archive-data';
import { archiveData } from '$lib/data/archive-data';

export type PageType = 'archive' | 'detail' | 'gallery';

export interface PhotoData {
	src: string;
	title: string;
	desc: string;
}

export const currentPage = writable<PageType>('gallery');
export const navigationPath = writable<string[]>([]);
export const currentItems = writable<ArchiveItem[]>(archiveData);
export const selectedDetail = writable<ArchiveItem | null>(null);
export const selectedPhoto = writable<PhotoData | null>(null);

export function navigateTo(path: string[]) {
	let items = archiveData;
	for (const id of path) {
		const item = items.find((i) => i.id === id);
		if (item && item.children) {
			items = item.children;
		} else {
			// Path is invalid, reset to root
			navigationPath.set([]);
			currentItems.set(archiveData);
			return;
		}
	}
	navigationPath.set(path);
	currentItems.set(items);
}

export function selectItem(item: ArchiveItem) {
	const path = get(navigationPath);
	if (item.children && item.children.length > 0) {
		const newPath = [...path, item.id];
		navigateTo(newPath);
	} else {
		selectedDetail.set(item);
		currentPage.set('detail');
	}
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
