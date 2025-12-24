import 'dotenv/config';

import { db } from './index';
import {
	user,
	semester,
	mataKuliah,
	academicItem,
	academicItemBlock,
	academicItemLink,
	praktikum,
	praktikumItem,
	praktikumItemBlock,
	praktikumItemLink,
	asprak,
	galleryGroup,
	galleryItem
} from './schema';
import type { InferSelectModel } from 'drizzle-orm';

async function seedUsers() {
	console.log('  Seeding users...');
	// Note: With Google OAuth, users are created on first login
	// This seed creates an initial admin user for testing
	await db.insert(user).values({
		id: 'admin',
		email: 'rotistorage@gmail.com',
		name: 'Admin',
		role: 'admin'
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
				imageOriginalUrl: 'https://picsum.photos/1200/800',
				caption: 'Screenshot tugas',
				order: 1
			}
		]);

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

	// Default Group
	const [defaultGroup] = await db
		.insert(galleryGroup)
		.values({
			title: 'ArchiveIn',
			description: 'Dokumentasi perkuliahan utama'
		})
		.returning();

	// Studio & Process Group
	const [groupA] = await db
		.insert(galleryGroup)
		.values({
			title: 'Studio & Process',
			description: 'Design process, studio sessions, and iterations'
		})
		.returning();

	// Campus & Daily Group
	const [groupB] = await db
		.insert(galleryGroup)
		.values({
			title: 'Campus & Daily',
			description: 'Daily life documentation'
		})
		.returning();

	// Initial Item
	await db.insert(galleryItem).values({
		groupId: defaultGroup.id,
		title: 'Suasana Kelas',
		description: 'Kegiatan perkuliahan di gedung teknik',
		imageWebpUrl: 'https://picsum.photos/seed/main/800/600.webp',
		imageOriginalUrl: 'https://picsum.photos/seed/main/800/600',
		imagekitFileId: 'dummy_file_id_0',
		date: '2024-03-15'
	});

	// Bulk Items
	const extraItems = [
		// === GROUP A (10 items)
		{ groupId: groupA.id, title: 'Wireframe Wall' },
		{ groupId: groupA.id, title: 'Early Layout Study' },
		{ groupId: groupA.id, title: 'Spacing Exploration' },
		{ groupId: groupA.id, title: 'Component Breakdown' },
		{ groupId: groupA.id, title: 'Prototype Review' },
		{ groupId: groupA.id, title: 'Interaction Mapping' },
		{ groupId: groupA.id, title: 'Dark UI Test' },
		{ groupId: groupA.id, title: 'Iteration Notes' },
		{ groupId: groupA.id, title: 'Visual Rhythm' },
		{ groupId: groupA.id, title: 'Final Polish' },

		// === GROUP B (9 items)
		{ groupId: groupB.id, title: 'Morning Class' },
		{ groupId: groupB.id, title: 'Hallway Light' },
		{ groupId: groupB.id, title: 'Study Corner' },
		{ groupId: groupB.id, title: 'Late Afternoon' },
		{ groupId: groupB.id, title: 'Discussion Break' },
		{ groupId: groupB.id, title: 'Empty Classroom' },
		{ groupId: groupB.id, title: 'Library Silence' },
		{ groupId: groupB.id, title: 'Sunset Corridor' },
		{ groupId: groupB.id, title: 'Last Lecture' }
	];

	await db.insert(galleryItem).values(
		extraItems.map((item, i) => {
			const date = new Date();
			date.setDate(date.getDate() - Math.floor(Math.random() * 365));
			return {
				...item,
				description: `Documentation — ${item.title}`,
				imageWebpUrl: `https://picsum.photos/seed/gallery-${i + 20}/800/800.webp`,
				imageOriginalUrl: `https://picsum.photos/seed/gallery-${i + 20}/800/800`,
				imagekitFileId: `dummy_seed_id_${i + 1}`,
				date: date.toISOString().split('T')[0]
			};
		})
	);
}

async function seed() {
	console.log('🌱 Combined Seeding database...');
	try {
		await seedUsers();
		const { sem1, sem2 } = await seedSemesters();
		const matkulInserted = await seedMataKuliahs(sem1.id, sem2.id);
		await seedAcademicItemsPraktikums(matkulInserted);
		await seedGallery();
		console.log('✅ Combined Seed complete');
	} catch (error) {
		console.error('❌ Seeding failed:', error);
		process.exit(1);
	}
	process.exit(0);
}

seed();
