import 'dotenv/config';

import { db } from './index';
import {
	user,
	semester,
	mataKuliah,
	academicItem,
	academicItemBlock,
	praktikum,
	praktikumItem,
	asprak,
	galleryGroup,
	galleryItem
} from './schema';

async function seed() {
	console.log('🌱 Seeding database with dotenv...');

	/* =========================
	   USER
	========================= */
	await db.insert(user).values({
		id: 'admin',
		username: 'roti18',
		passwordHash: 'hashed-password'
	});

	/* =========================
	   SEMESTER
	========================= */
	const [sem1] = await db
		.insert(semester)
		.values({
			name: 'Semester 1',
			startYear: 2024,
			endYear: 2024
		})
		.returning();

	const [sem2] = await db
		.insert(semester)
		.values({
			name: 'Semester 2',
			startYear: 2024,
			endYear: 2024
		})
		.returning();

	/* =========================
	   MATA KULIAH (SESUI DATA LO)
	========================= */
	const matkulList = [
		// Gasal 2024
		{ semesterId: sem1.id, code: 'IF2212', name: 'Matematika Teknik' },
		{ semesterId: sem1.id, code: 'IF2217', name: 'Matematika Diskret' },
		{ semesterId: sem1.id, code: 'UNG109', name: 'Bahasa Indonesia' },
		{ semesterId: sem1.id, code: 'UNG120', name: 'Pancasila' },
		{ semesterId: sem1.id, code: 'IF2211', name: 'Pengantar Teknologi Informasi' },
		{ semesterId: sem1.id, code: 'UNG101', name: 'Pendidikan Agama Islam' },
		{ semesterId: sem1.id, code: 'UNG110', name: 'Bahasa Inggris' },

		// Genap 2024
		{ semesterId: sem2.id, code: 'IF2215', name: 'Metode Statistika' },
		{ semesterId: sem2.id, code: 'IF2216', name: 'Komputasi Aljabar Linier' },
		{ semesterId: sem2.id, code: 'IF2213', name: 'Algoritma & Dasar Pemrograman' },
		{ semesterId: sem2.id, code: 'IF2219', name: 'Dasar Pemrograman Web' },
		{ semesterId: sem2.id, code: 'UNG118', name: 'Kewarganegaraan' },
		{ semesterId: sem2.id, code: 'IF2218', name: 'Organisasi Komputer & Sistem Operasi' }
	];

	const matkulInserted = await db
		.insert(mataKuliah)
		.values(
			matkulList.map((m) => ({
				...m,
				dosen: 'Dr. Andi Pratama',
				jam: 'Senin 13:00–15:30'
			}))
		)
		.returning();

	/* =========================
	   ITEM + BLOCK + PRAKTIKUM
	========================= */
	for (const mk of matkulInserted) {
		const [item] = await db
			.insert(academicItem)
			.values({
				mataKuliahId: mk.id,
				type: 'tugas',
				title: `${mk.name} — Tugas 1`,
				heroImage: null,
				link: 'https://drive.google.com/file/example',
				linkPlatform: 'gdrive'
			})
			.returning();

		await db.insert(academicItemBlock).values([
			{
				itemId: item.id,
				type: 'text',
				content: `Dokumentasi awal ${mk.name}.`,
				order: 0
			},
			{
				itemId: item.id,
				type: 'image',
				imageUrl: 'https://picsum.photos/1200/800',
				caption: 'Screenshot tugas',
				order: 1
			}
		]);

		const [prak] = await db
			.insert(praktikum)
			.values({
				mataKuliahId: mk.id,
				title: `${mk.name} Praktikum`
			})
			.returning();

		await db.insert(praktikumItem).values({
			praktikumId: prak.id,
			type: 'tugas_praktikum',
			title: 'Tugas Praktikum 1',
			link: 'https://drive.google.com/file/praktikum',
			linkPlatform: 'gdrive'
		});

		await db.insert(asprak).values({
			name: 'Asprak Default',
			mataKuliahId: mk.id
		});
	}

	/* =========================
	   GALLERY
	========================= */
	const [group] = await db
		.insert(galleryGroup)
		.values({
			title: 'Campus Life',
			description: 'Dokumentasi perkuliahan'
		})
		.returning();

	await db.insert(galleryItem).values({
		groupId: group.id,
		title: 'Suasana Kelas',
		description: 'Kegiatan perkuliahan',
		imageUrl: 'https://picsum.photos/800/600',
		yearTaken: 2024
	});

	console.log('✅ Seed selesai (dotenv aktif)');
	process.exit(0);
}

seed().catch((e) => {
	console.error(e);
	process.exit(1);
});
