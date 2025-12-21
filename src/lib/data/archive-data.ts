export interface GalleryItemData {
	id: string;
	src: string;
	title: string;
	desc: string;
}

export const galleryData: GalleryItemData[] = [
	{
		id: 'kyoto',
		src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
		title: 'KYOTO',
		desc: 'Street documentation, evening.'
	},
	{
		id: 'forest',
		src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
		title: 'FOREST',
		desc: 'Observation, static.'
	},
	{
		id: 'peak',
		src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800',
		title: 'PEAK',
		desc: 'Altitude study.'
	}
];

export interface ArchiveItem {
	id: string;
	title: string;
	children?: ArchiveItem[];
	description?: string;
	documentation?: DocumentationItem[];
}

export interface DocumentationItem {
	image: string;
	caption: string;
	subtitle: string;
}

export const archiveData: ArchiveItem[] = [
	{
		id: 'semester-1',
		title: 'Semester 1 (01/09/2025 - 31/12/2025)',
		children: [
			{
				id: 'algoritma-dan-pemrograman',
				title: 'Algoritma dan Pemrograman',
				children: [
					{
						id: 'tugas',
						title: 'Tugas',
						children: [
							{
								id: 'tugas-1',
								title: 'Tugas 1: Tipe Data',
								description: 'Membuat program sederhana yang menggunakan berbagai tipe data.',
								documentation: [
									{
										image: 'https://images.unsplash.com/photo-1559027615-c8c1c63f6cbb?w=1200',
										caption: 'Gambar 1',
										subtitle: 'Contoh program tipe data'
									}
								]
							}
						]
					},
					{
						id: 'praktikum',
						title: 'Praktikum',
						children: [
							{
								id: 'praktikum-1',
								title: 'Praktikum 1: Instalasi IDE',
								description: 'Menginstal dan mengkonfigurasi Integrated Development Environment.',
								documentation: []
							}
						]
					}
				]
			}
		]
	}
];