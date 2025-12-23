import 'dotenv/config';
import { db } from './index';
import { galleryGroup, galleryItem } from './schema';

async function seedGalleryExtra() {
	console.log('🖼️ Seeding extra gallery data...');

	/* =========================
	   CREATE 2 NEW GROUPS
	========================= */
	const [groupA] = await db
		.insert(galleryGroup)
		.values({
			title: 'Studio & Process',
			description: 'Design process, studio session, and iterations'
		})
		.returning();

	const [groupB] = await db
		.insert(galleryGroup)
		.values({
			title: 'Campus & Daily',
			description: 'Daily campus life documentation'
		})
		.returning();

	/* =========================
	   19 GALLERY ITEMS
	========================= */

	const items = [
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
		items.map((item, i) => {
			const date = new Date();
			date.setDate(date.getDate() - Math.floor(Math.random() * 365));
			return {
				...item,
				description: `Documentation — ${item.title}`,
				imageWebpUrl: `https://picsum.photos/seed/gallery-${i + 20}/800/800.webp`,
				imageOriginalUrl: `https://picsum.photos/seed/gallery-${i + 20}/800/800`,
				imagekitFileId: `dummy_seed_id_${i}`,
				date: date.toISOString().split('T')[0]
			};
		})
	);

	console.log('✅ Extra gallery seed complete');
	process.exit(0);
}

seedGalleryExtra().catch((err) => {
	console.error('❌ Gallery seed failed', err);
	process.exit(1);
});
