export interface ArchiveItem {
	id: string;
	title?: string;
	semesterTitle?: string;
	semesterStartYear?: number;
	semesterEndYear?: number;
	children?: ArchiveItem[];
	description?: string;
	documentation?: DocumentationItem[];
	link?: string;
	linkPlatform?: string;
	dosen?: string;
	jam?: string;
	aspraks?: { name: string }[];
}

export interface DocumentationItem {
	image: string;
	caption: string;
	subtitle: string;
}
