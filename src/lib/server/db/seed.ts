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
	praktikumItemBlock,
	asprak,
	galleryGroup,
	galleryItem
} from './schema';
import type { InferSelectModel } from 'drizzle-orm';
import { hash } from '@node-rs/argon2';

async function seedUsers() {
	console.log('  Seeding users...');
	const passwordHash = await hash('password', {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});
	await db.insert(user).values({
		id: 'admin',
		username: 'roti18',
		passwordHash: passwordHash,
		email: 'admin@local.host'
	});
}

async function seedSemesters() {
	console.log('  Seeding semesters...');
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
	return { sem1, sem2 };
}

async function seedMataKuliahs(sem1Id: number, sem2Id: number) {
	console.log('  Seeding mata kuliahs...');
	const matkulList = [
		// Gasal 2024
		{ semesterId: sem1Id, code: 'IF2212', name: 'Matematika Teknik' },
		{ semesterId: sem1Id, code: 'IF2217', name: 'Matematika Diskret' },
		{ semesterId: sem1Id, code: 'UNG109', name: 'Bahasa Indonesia' },
		{ semesterId: sem1Id, code: 'UNG120', name: 'Pancasila' },
		{ semesterId: sem1Id, code: 'IF2211', name: 'Pengantar Teknologi Informasi' },
		{ semesterId: sem1Id, code: 'UNG101', name: 'Pendidikan Agama Islam' },
		{ semesterId: sem1Id, code: 'UNG110', name: 'Bahasa Inggris' },

		// Genap 2024
		{ semesterId: sem2Id, code: 'IF2215', name: 'Metode Statistika' },
		{ semesterId: sem2Id, code: 'IF2216', name: 'Komputasi Aljabar Linier' },
		{ semesterId: sem2Id, code: 'IF2213', name: 'Algoritma & Dasar Pemrograman' },
		{ semesterId: sem2Id, code: 'IF2219', name: 'Dasar Pemrograman Web' },
		{ semesterId: sem2Id, code: 'UNG118', name: 'Kewarganegaraan' },
		{ semesterId: sem2Id, code: 'IF2218', name: 'Organisasi Komputer & Sistem Operasi' }
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
	return matkulInserted;
}

async function seedAcademicItemsPraktikums(
	matkulInserted: (InferSelectModel<typeof mataKuliah> & { id: number })[]
) {
	console.log('  Seeding academic items and praktikums...');
	for (const mk of matkulInserted) {
		const [item] = await db
			.insert(academicItem)
			.values({
				mataKuliahId: mk.id,
				type: 'tugas',
				title: `${mk.name} — Tugas 1`,
				heroImageWebpUrl: null,
				heroImageOriginalUrl: null,
				heroImageFileId: null
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
				imageWebpUrl: 'https://picsum.photos/1200/800.webp',
				imageOriginalUrl: 'https://picsum.photos/1200/800', // Dummy
				caption: 'Screenshot tugas',
				order: 1
			}
		]);

		// Insert Link
		const { academicItemLink } = await import('./schema');
		await db.insert(academicItemLink).values({
			itemId: item.id,
			title: 'Google Drive',
			url: 'https://drive.google.com/file/example',
			platform: 'gdrive'
		});

		const [prak] = await db
			.insert(praktikum)
			.values({
				mataKuliahId: mk.id,
				title: `${mk.name} Praktikum`
			})
			.returning();

		const [prakItem] = await db
			.insert(praktikumItem)
			.values({
				praktikumId: prak.id,
				type: 'tugas_praktikum',
				title: 'Tugas Praktikum 1'
			})
			.returning();

		// Insert Link
		const { praktikumItemLink } = await import('./schema');
		await db.insert(praktikumItemLink).values({
			itemId: prakItem.id,
			title: 'Drive Praktikum',
			url: 'https://drive.google.com/file/praktikum',
			platform: 'gdrive'
		});

		await db.insert(praktikumItemBlock).values([
			{
				itemId: prakItem.id,
				type: 'text',
				content: 'Ini adalah deskripsi untuk tugas praktikum.',
				order: 0
			},
			{
				itemId: prakItem.id,
				type: 'image',
				imageWebpUrl: 'https://picsum.photos/1200/800.webp',
				imageOriginalUrl: 'https://picsum.photos/1200/800',
				caption: 'Gambar untuk praktikum',
				order: 1
			}
		]);

		await db.insert(asprak).values({
			name: 'Asprak Default',
			mataKuliahId: mk.id
		});
	}
}

async function seedGallery() {
	console.log('  Seeding gallery...');
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
		imageWebpUrl: 'https://picsum.photos/800/600.webp',
		imageOriginalUrl: 'https://picsum.photos/800/600',
		imagekitFileId: 'dummy_file_id',
		date: '15/03/2024'
	});
}

async function seed() {
	console.log('🌱 Seeding database with dotenv...');
	await seedUsers();
	const { sem1, sem2 } = await seedSemesters();
	const matkulInserted = await seedMataKuliahs(sem1.id, sem2.id);
	await seedAcademicItemsPraktikums(matkulInserted);
	await seedGallery();
	console.log('✅ Seed selesai (dotenv aktif)');
	process.exit(0);
}

seed().catch((e) => {
	console.error(e);
	process.exit(1);
});
