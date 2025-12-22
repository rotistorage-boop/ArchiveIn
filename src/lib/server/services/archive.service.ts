import { db } from '$lib/server/db';
import type {
	SemesterForArchive,
	MataKuliahForArchive,
	AcademicItem as AcademicItemType,
	PraktikumItem as PraktikumItemType
} from '$lib/types/academic';
import type { ArchiveItem, DocumentationItem } from '$lib/types/archive';

// Helper to format type names (e.g., 'tugas_praktikum' -> 'Tugas Praktikum')
function formatTypeName(str: string): string {
	if (!str) return 'Unknown';
	return str
		.split('_')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

export async function getArchiveOverview(): Promise<SemesterForArchive[]> {
	return db.query.semester.findMany({
		with: {
			mataKuliahs: {
				with: {
					academicItems: {
						with: {
							blocks: true
						}
					},
					praktikums: {
						with: {
							praktikumItems: {
								with: {
									blocks: true
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
			?.filter((b) => b.type === 'image' && b.imageUrl)
			.map((b) => ({
				image: b.imageUrl!,
				caption: b.caption || '',
				subtitle: ''
			})) || [];

	return {
		id: item.id.toString(),
		title: item.title || 'Tanpa Judul',
		children: [],
		description: description,
		documentation: documentation,
		link: item.link || undefined,
		linkPlatform: item.linkPlatform || undefined
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
	const overview = await getArchiveOverview();
	return transformSemestersToArchiveItems(overview);
}
