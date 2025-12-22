export interface ArchiveItem {
	id: string;
	title?: string;
	semesterTitle?: string;
	semesterStartYear?: number;
	semesterEndYear?: number;
	children?: ArchiveItem[];
	description?: string;
	documentation?: DocumentationItem[];
	link?: string; // Added
	linkPlatform?: string; // Added
	dosen?: string; // Added
	jam?: string; // Added
	aspraks?: { name: string }[]; // Added
}

export interface DocumentationItem {
	image: string;
	caption: string;
	subtitle: string;
}