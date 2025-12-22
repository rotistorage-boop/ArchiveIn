import { relations } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

/* =========================
   USER & SESSION (BASE)
========================= */

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

/* =========================
   SEMESTER
========================= */

export const semester = sqliteTable('semester', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(), // Semester 3
	startYear: integer('start_year').notNull(),
	endYear: integer('end_year').notNull()
});

/* =========================
   MATA KULIAH
========================= */

export const mataKuliah = sqliteTable('mata_kuliah', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	semesterId: integer('semester_id')
		.notNull()
		.references(() => semester.id, { onDelete: 'cascade' }),

	name: text('name').notNull(),
	code: text('code'),

	dosen: text('dosen').notNull(), // Nama dosen
	jam: text('jam').notNull() // "Senin 13:00–15:30"
});

export const semesterRelations = relations(semester, ({ many }) => ({
	mataKuliahs: many(mataKuliah)
}));

export const mataKuliahRelations = relations(mataKuliah, ({ one, many }) => ({
	semester: one(semester, {
		fields: [mataKuliah.semesterId],
		references: [semester.id]
	}),
	academicItems: many(academicItem),
	praktikums: many(praktikum),
	aspraks: many(asprak) // Added
}));

/* =========================
   ACADEMIC ITEM (TUGAS / UTS / UAS / MATERI / TA)
========================= */

export const academicItem = sqliteTable('academic_item', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	mataKuliahId: integer('mata_kuliah_id')
		.notNull()
		.references(() => mataKuliah.id, { onDelete: 'cascade' }),

	type: text('type').notNull(),
	// 'tugas' | 'uts' | 'uas' | 'materi' | 'tugas_akhir'

	title: text('title').notNull(),
	heroImage: text('hero_image'),

	link: text('link'),
	linkPlatform: text('link_platform') // gdrive | figma | pdf | dll
});

export const academicItemRelations = relations(academicItem, ({ one, many }) => ({
	mataKuliah: one(mataKuliah, {
		fields: [academicItem.mataKuliahId],
		references: [mataKuliah.id]
	}),
	blocks: many(academicItemBlock)
}));

/* =========================
   CONTENT BLOCK (TEXT + IMAGE HIGHLIGHT)
========================= */

export const academicItemBlock = sqliteTable('academic_item_block', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	itemId: integer('item_id')
		.notNull()
		.references(() => academicItem.id, { onDelete: 'cascade' }),

	type: text('type').notNull(),
	// 'text' | 'image'

	content: text('content'), // untuk text
	imageUrl: text('image_url'), // untuk image
	caption: text('caption'),

	order: integer('order').notNull()
});

export const academicItemBlockRelations = relations(academicItemBlock, ({ one }) => ({
	item: one(academicItem, {
		fields: [academicItemBlock.itemId],
		references: [academicItem.id]
	})
}));

/* =========================
   PRAKTIKUM
========================= */

export const praktikum = sqliteTable('praktikum', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	mataKuliahId: integer('mata_kuliah_id')
		.notNull()
		.references(() => mataKuliah.id, { onDelete: 'cascade' }),

	title: text('title').notNull()
});

export const praktikumRelations = relations(praktikum, ({ one, many }) => ({
	mataKuliah: one(mataKuliah, {
		fields: [praktikum.mataKuliahId],
		references: [mataKuliah.id]
	}),
	praktikumItems: many(praktikumItem)
}));

/* =========================
   PRAKTIKUM ITEM
========================= */

export const praktikumItem = sqliteTable('praktikum_item', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	praktikumId: integer('praktikum_id')
		.notNull()
		.references(() => praktikum.id, { onDelete: 'cascade' }),

	type: text('type').notNull(),
	// 'pra_praktikum' | 'tugas_praktikum' | 'asistensi' | 'ta_praktikum'

	title: text('title').notNull(),
	link: text('link'),
	linkPlatform: text('link_platform')
});

export const praktikumItemRelations = relations(praktikumItem, ({ one, many }) => ({
	praktikum: one(praktikum, {
		fields: [praktikumItem.praktikumId],
		references: [praktikum.id]
	}),
	blocks: many(praktikumItemBlock)
}));

/* =========================
   PRAKTIKUM ITEM BLOCK
========================= */

export const praktikumItemBlock = sqliteTable('praktikum_item_block', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	itemId: integer('item_id')
		.notNull()
		.references(() => praktikumItem.id, { onDelete: 'cascade' }),

	type: text('type').notNull(),
	// 'text' | 'image'

	content: text('content'), // untuk text
	imageUrl: text('image_url'), // untuk image
	caption: text('caption'),

	order: integer('order').notNull()
});

export const praktikumItemBlockRelations = relations(praktikumItemBlock, ({ one }) => ({
	item: one(praktikumItem, {
		fields: [praktikumItemBlock.itemId],
		references: [praktikumItem.id]
	})
}));

/* =========================
   ASPRAK
========================= */

export const asprak = sqliteTable('asprak', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),

	mataKuliahId: integer('mata_kuliah_id')
		.notNull()
		.references(() => mataKuliah.id, { onDelete: 'cascade' })
});

export const asprakRelations = relations(asprak, ({ one }) => ({
	mataKuliah: one(mataKuliah, {
		fields: [asprak.mataKuliahId],
		references: [mataKuliah.id]
	})
}));

/* =========================
   GALLERY GROUP (FOLDER / ALBUM)
========================= */

export const galleryGroup = sqliteTable('gallery_group', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	title: text('title').notNull(),
	description: text('description')
});

/* =========================
   GALLERY ITEM
========================= */

export const galleryItem = sqliteTable('gallery_item', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	groupId: integer('group_id').references(() => galleryGroup.id, { onDelete: 'set null' }),

	title: text('title').notNull(),
	description: text('description'),
	imageUrl: text('image_url').notNull(),
	date: text('date').notNull() // Replaced yearTaken with date
});

export const galleryGroupRelations = relations(galleryGroup, ({ many }) => ({
	items: many(galleryItem)
}));

export const galleryItemRelations = relations(galleryItem, ({ one }) => ({
	group: one(galleryGroup, {
		fields: [galleryItem.groupId],
		references: [galleryGroup.id]
	})
}));
