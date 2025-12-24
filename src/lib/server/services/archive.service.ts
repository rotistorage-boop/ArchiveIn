import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import {
	semester,
	mataKuliah,
	academicItem,
	academicItemBlock,
	academicItemLink,
	praktikum,
	praktikumItem,
	praktikumItemBlock,
	praktikumItemLink
} from '$lib/server/db/schema';
import type {
	SemesterForArchive,
	MataKuliahForArchive,
	AcademicItem as AcademicItemType,
	PraktikumItem as PraktikumItemType
} from '$lib/types/academic';
import type { ArchiveItem, DocumentationItem } from '$lib/types/archive';

// In-memory cache for archive tree
let archiveCache: ArchiveItem[] | null = null;
let archiveCacheTime: number = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function invalidateArchiveCache() {
	archiveCache = null;
	archiveCacheTime = 0;
	console.log('[Archive] Cache invalidated');
}

// Helper to format type names (e.g., 'tugas_praktikum' -> 'Tugas Praktikum')
function formatTypeName(str: string): string {
	if (!str) return 'Unknown';
	return str
		.split('_')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

// Helper to sanitize folder names
function sanitizeForPath(str: string): string {
	return str
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

// Helper: Get storage path info
export async function getStoragePathInfo(
	mataKuliahId: number,
	itemType: string,
	itemTitle: string
) {
	const mk = await db.query.mataKuliah.findFirst({
		where: eq(mataKuliah.id, mataKuliahId),
		with: { semester: true }
	});

	if (!mk) return { imageKitPath: '/archive', drivePath: ['archive'] };

	const semesterSlug = sanitizeForPath(mk.semester?.name || 'unknown-semester');
	const mkSlug = sanitizeForPath(mk.name);
	const typeSlug = sanitizeForPath(itemType);
	const titleSlug = sanitizeForPath(itemTitle);

	// ImageKit: /archive/semester-1/matematika-diskrit/materi/aljabar-linier/
	const imageKitPath = `/archive/${semesterSlug}/${mkSlug}/${typeSlug}/${titleSlug}/`;

	// Drive: ['archive', 'semester-1', 'matematika-diskrit', 'materi', 'aljabar-linier']
	const drivePath = ['archive', semesterSlug, mkSlug, typeSlug, titleSlug];

	return { imageKitPath, drivePath };
}

// Helper: Delete files for an item
export async function deleteItemFiles(item: any) {
	try {
		const { storageService } = await import('./storage.service');

		// 1. Delete Hero Image
		if (item.heroImageFileId) {
			console.log(`Deleting Hero ImageKit: ${item.heroImageFileId}`);
			await storageService.deleteFromImageKit(item.heroImageFileId);
		}
		if (item.heroImageGoogleId) {
			console.log(`Deleting Hero Drive: ${item.heroImageGoogleId}`);
			await storageService.deleteFromGoogleDrive(item.heroImageGoogleId);
		}

		// 2. Delete Block Images
		if (item.blocks && item.blocks.length > 0) {
			for (const block of item.blocks) {
				if (block.type === 'image') {
					if (block.imageFileId) {
						console.log(`Deleting Block ImageKit: ${block.imageFileId}`);
						await storageService.deleteFromImageKit(block.imageFileId);
					}
					if (block.imageGoogleId) {
						console.log(`Deleting Block Drive: ${block.imageGoogleId}`);
						await storageService.deleteFromGoogleDrive(block.imageGoogleId);
					}
				}
			}
		}
	} catch (error) {
		console.error('Error deleting item files:', error);
	}
}

export async function getArchiveOverview(): Promise<SemesterForArchive[]> {
	return db.query.semester.findMany({
		with: {
			mataKuliahs: {
				with: {
					academicItems: {
						with: {
							blocks: true,
							links: true
						}
					},
					praktikums: {
						with: {
							praktikumItems: {
								with: {
									blocks: true,
									links: true
								}
							}
						}
					},
					aspraks: true
				}
			}
		}
	});
}

function transformLeafNodeToArchiveItem(item: AcademicItemType | PraktikumItemType): ArchiveItem {
	const description =
		item.blocks?.find((b) => b.type === 'text' && b.content)?.content || undefined;

	const documentation: DocumentationItem[] =
		item.blocks
			?.filter((b) => b.type === 'image' && b.imageWebpUrl)
			.map((b) => ({
				image: b.imageWebpUrl!,
				caption: b.caption || '',
				subtitle: ''
			})) || [];

	const links =
		item.links?.map((l) => ({
			title: l.title,
			url: l.url,
			platform: l.platform || undefined
		})) || [];

	return {
		id: item.id.toString(),
		title: item.title || 'Tanpa Judul',
		children: [],
		description: description,
		documentation: documentation,
		links: links.length > 0 ? links : undefined
	};
}

function transformMataKuliahToArchiveItem(mk: MataKuliahForArchive): ArchiveItem {
	const children: ArchiveItem[] = [];

	// 1. Group academic items by type
	if (Array.isArray(mk.academicItems) && mk.academicItems.length > 0) {
		const academicItemGroups: Record<string, AcademicItemType[]> = {};
		for (const item of mk.academicItems) {
			if (item && item.type) {
				const type = formatTypeName(item.type);
				if (!academicItemGroups[type]) {
					academicItemGroups[type] = [];
				}
				academicItemGroups[type].push(item);
			}
		}

		for (const [type, items] of Object.entries(academicItemGroups)) {
			children.push({
				id: `${mk.id}-type-${type.toLowerCase()}`,
				title: type,
				children: items.map(transformLeafNodeToArchiveItem)
			});
		}
	}

	// 2. Handle Praktikum items with deep nesting and extra safety checks
	const praktikums = mk.praktikums;
	if (Array.isArray(praktikums) && praktikums.length > 0) {
		const allPraktikumItems: PraktikumItemType[] = praktikums
			.filter((p) => p && typeof p === 'object' && Array.isArray(p.praktikumItems))
			.flatMap((p) => p.praktikumItems);

		if (allPraktikumItems.length > 0) {
			const praktikumItemGroups: Record<string, PraktikumItemType[]> = {};
			for (const item of allPraktikumItems) {
				if (item && item.type) {
					const type = formatTypeName(item.type);
					if (!praktikumItemGroups[type]) {
						praktikumItemGroups[type] = [];
					}
					praktikumItemGroups[type].push(item);
				}
			}

			if (Object.keys(praktikumItemGroups).length > 0) {
				children.push({
					id: `${mk.id}-type-praktikum`,
					title: 'Praktikum',
					children: Object.entries(praktikumItemGroups).map(([type, items]) => ({
						id: `${mk.id}-praktikum-type-${type.toLowerCase().replace(' ', '-')}`,
						title: type,
						children: items.map(transformLeafNodeToArchiveItem)
					}))
				});
			}
		}
	}

	return {
		id: mk.id.toString(),
		title: mk.name,
		children: children,
		dosen: mk.dosen,
		jam: mk.jam,
		aspraks: mk.aspraks
	};
}

function transformSemestersToArchiveItems(semesters: SemesterForArchive[]): ArchiveItem[] {
	return semesters.map((semester) => ({
		id: semester.id.toString(),
		title: semester.name,
		semesterTitle: semester.name,
		semesterStartYear: semester.startYear,
		semesterEndYear: semester.endYear,
		children: semester.mataKuliahs.map(transformMataKuliahToArchiveItem)
	}));
}

export async function getArchiveTree(): Promise<ArchiveItem[]> {
	// Return cached data if valid
	const now = Date.now();
	if (archiveCache && now - archiveCacheTime < CACHE_TTL_MS) {
		console.log(
			`[Archive] Returned from cache (age: ${Math.round((now - archiveCacheTime) / 1000)}s)`
		);
		return archiveCache;
	}

	const start = Date.now();
	const overview = await getArchiveOverview();
	const result = transformSemestersToArchiveItems(overview);

	// Update cache
	archiveCache = result;
	archiveCacheTime = Date.now();

	console.log(
		`[Archive] Loaded from DB in ${Date.now() - start}ms, cached for ${CACHE_TTL_MS / 1000}s`
	);
	return result;
}

/* =========================
   ADMIN CRUD OPERATIONS
========================= */

// Get flat data for admin dashboard
export async function getArchiveAdminData() {
	const semesters = await db.query.semester.findMany();
	const mataKuliahs = await db.query.mataKuliah.findMany({
		with: {
			semester: true
		}
	});
	const academicItems = await db.query.academicItem.findMany({
		with: {
			mataKuliah: true,
			links: true
		}
	});

	return { semesters, mataKuliahs, academicItems };
}

// Semester CRUD
export async function createSemester(data: { name: string; startYear: number; endYear: number }) {
	return db.insert(semester).values(data).returning();
}

export async function updateSemester(
	id: number,
	data: { name?: string; startYear?: number; endYear?: number }
) {
	return db.update(semester).set(data).where(eq(semester.id, id)).returning();
}

export async function deleteSemester(id: number) {
	// Cascade delete will handle children in DB, but we need to handle files?
	// This generates a LOT of files to delete.
	// For now, let's trust the user knows what they are doing or handle it later for Semester level.
	// Ideally we would walk the tree and delete everything.
	return db.delete(semester).where(eq(semester.id, id));
}

// Mata Kuliah CRUD
export async function createMataKuliah(data: {
	semesterId: number;
	name: string;
	code?: string;
	dosen: string;
	jam: string;
}) {
	return db.insert(mataKuliah).values(data).returning();
}

export async function updateMataKuliah(
	id: number,
	data: { semesterId?: number; name?: string; code?: string; dosen?: string; jam?: string }
) {
	return db.update(mataKuliah).set(data).where(eq(mataKuliah.id, id)).returning();
}

export async function deleteMataKuliah(id: number) {
	// 1. Find all items (Academic)
	const items = await db.query.academicItem.findMany({
		where: eq(academicItem.mataKuliahId, id),
		with: { blocks: true }
	});

	// 2. Delete files for each item
	for (const item of items) {
		await deleteItemFiles(item);
	}

	// 3. Find and delete Praktikums (and their items)
	const praktikums = await db.query.praktikum.findMany({
		where: eq(praktikum.mataKuliahId, id),
		with: {
			praktikumItems: {
				with: { blocks: true }
			}
		}
	});

	for (const p of praktikums) {
		for (const item of p.praktikumItems) {
			await deleteItemFiles(item);
		}
	}

	return db.delete(mataKuliah).where(eq(mataKuliah.id, id));
}

// Academic Item CRUD
export async function createAcademicItem(data: {
	mataKuliahId: number;
	type: string;
	title: string;
	heroImageWebpUrl?: string;
	heroImageOriginalUrl?: string;
	heroImageFileId?: string;
	heroImageGoogleId?: string;
	links?: { title: string; url: string; platform?: string; order: number }[];
	blocks?: {
		type: 'text' | 'image';
		content?: string;
		imageWebpUrl?: string;
		imageOriginalUrl?: string;
		imageFileId?: string;
		imageGoogleId?: string;
		caption?: string;
		width?: string;
		order: number;
	}[];
}) {
	return await db.transaction(async (tx) => {
		// 1. Create Main Item
		const [newItem] = await tx
			.insert(academicItem)
			.values({
				mataKuliahId: data.mataKuliahId,
				type: data.type,
				title: data.title,
				heroImageWebpUrl: data.heroImageWebpUrl,
				heroImageOriginalUrl: data.heroImageOriginalUrl,
				heroImageFileId: data.heroImageFileId,
				heroImageGoogleId: data.heroImageGoogleId
			})
			.returning();

		// 2. Create Links
		if (data.links && data.links.length > 0) {
			await tx.insert(academicItemLink).values(
				data.links.map((link) => ({
					itemId: newItem.id,
					...link
				}))
			);
		}

		// 3. Create Blocks
		if (data.blocks && data.blocks.length > 0) {
			await tx.insert(academicItemBlock).values(
				data.blocks.map((block) => ({
					itemId: newItem.id,
					...block
				}))
			);
		}

		return newItem;
	});
}

export async function updateAcademicItem(
	id: number,
	data: {
		mataKuliahId?: number;
		type?: string;
		title?: string;
		heroImageWebpUrl?: string;
		heroImageOriginalUrl?: string;
		heroImageFileId?: string;
		heroImageGoogleId?: string;
		links?: { title: string; url: string; platform?: string; order: number }[];
	}
) {
	return await db.transaction(async (tx) => {
		// 1. Update Main Item
		const [updatedItem] = await tx
			.update(academicItem)
			.set({
				mataKuliahId: data.mataKuliahId,
				type: data.type,
				title: data.title,
				heroImageWebpUrl: data.heroImageWebpUrl,
				heroImageOriginalUrl: data.heroImageOriginalUrl,
				heroImageFileId: data.heroImageFileId,
				heroImageGoogleId: data.heroImageGoogleId
			})
			.where(eq(academicItem.id, id))
			.returning();

		// 2. Update Links if provided
		// For this simple update, we'll replace existing links if new links array is passed
		if (data.links) {
			await tx.delete(academicItemLink).where(eq(academicItemLink.itemId, id));
			if (data.links.length > 0) {
				await tx.insert(academicItemLink).values(
					data.links.map((link) => ({
						itemId: id,
						...link
					}))
				);
			}
		}

		return updatedItem;
	});
}

export async function deleteAcademicItem(id: number) {
	// 1. Get the item with blocks to know what files to delete
	const item = await db.query.academicItem.findFirst({
		where: eq(academicItem.id, id),
		with: { blocks: true }
	});

	if (item) {
		// 2. Delete files from storage
		await deleteItemFiles(item);
	}

	// 3. Delete from DB
	return db.delete(academicItem).where(eq(academicItem.id, id));
}

// =========================
// PRAKTIKUM CRUD
// =========================

export async function createPraktikum(data: {
	mataKuliahId: number;
	title: string;
	asprak?: string;
}) {
	return db.insert(praktikum).values(data).returning();
}

export async function updatePraktikum(id: number, data: { title?: string; asprak?: string }) {
	return db.update(praktikum).set(data).where(eq(praktikum.id, id)).returning();
}

export async function deletePraktikum(id: number) {
	// 1. Get all items in this praktikum
	const p = await db.query.praktikum.findFirst({
		where: eq(praktikum.id, id),
		with: {
			praktikumItems: {
				with: { blocks: true }
			}
		}
	});

	if (p && p.praktikumItems) {
		for (const item of p.praktikumItems) {
			await deleteItemFiles(item);
		}
	}

	return db.delete(praktikum).where(eq(praktikum.id, id));
}

// =========================
// PRAKTIKUM ITEM CRUD
// =========================

export async function createPraktikumItem(data: {
	praktikumId: number;
	type: string;
	title: string;
	heroImageWebpUrl?: string;
	heroImageOriginalUrl?: string;
	heroImageFileId?: string;
	heroImageGoogleId?: string;
	links?: { title: string; url: string; platform?: string; order: number }[];
	blocks?: {
		type: 'text' | 'image';
		content?: string;
		imageWebpUrl?: string;
		imageOriginalUrl?: string;
		imageFileId?: string;
		imageGoogleId?: string;
		caption?: string;
		width?: string;
		order: number;
	}[];
}) {
	return await db.transaction(async (tx) => {
		const [newItem] = await tx
			.insert(praktikumItem)
			.values({
				praktikumId: data.praktikumId,
				type: data.type,
				title: data.title,
				heroImageWebpUrl: data.heroImageWebpUrl,
				heroImageOriginalUrl: data.heroImageOriginalUrl,
				heroImageFileId: data.heroImageFileId,
				heroImageGoogleId: data.heroImageGoogleId
			})
			.returning();

		if (data.links && data.links.length > 0) {
			await tx.insert(praktikumItemLink).values(
				data.links.map((link) => ({
					itemId: newItem.id,
					...link
				}))
			);
		}

		if (data.blocks && data.blocks.length > 0) {
			await tx.insert(praktikumItemBlock).values(
				data.blocks.map((block) => ({
					itemId: newItem.id,
					...block
				}))
			);
		}
		return newItem;
	});
}

export async function updatePraktikumItem(
	id: number,
	data: {
		praktikumId?: number;
		type?: string;
		title?: string;
		heroImageWebpUrl?: string;
		heroImageOriginalUrl?: string;
		heroImageFileId?: string;
		heroImageGoogleId?: string;
	}
) {
	return db.update(praktikumItem).set(data).where(eq(praktikumItem.id, id)).returning();
}

export async function deletePraktikumItem(id: number) {
	const item = await db.query.praktikumItem.findFirst({
		where: eq(praktikumItem.id, id),
		with: { blocks: true }
	});

	if (item) {
		await deleteItemFiles(item);
	}

	return db.delete(praktikumItem).where(eq(praktikumItem.id, id));
}
