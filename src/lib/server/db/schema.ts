import { relations } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

/* =========================
   USER & SESSION (BASE)
========================= */

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	email: text('email').notNull().unique(),
	name: text('name'),
	avatar: text('avatar'),
	googleId: text('google_id').unique(),
	role: text('role').notNull().default('user'),
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
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
	aspraks: many(asprak)
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
	// Types: 'tugas' | 'materi' | 'uas' | 'uts' | 'tugas_akhir'

	title: text('title').notNull(),
	heroImageWebpUrl: text('hero_image_webp_url'),
	heroImageOriginalUrl: text('hero_image_original_url'),
	heroImageFileId: text('hero_image_file_id'),
	heroImageGoogleId: text('hero_image_google_id')
});

export const academicItemRelations = relations(academicItem, ({ one, many }) => ({
	mataKuliah: one(mataKuliah, {
		fields: [academicItem.mataKuliahId],
		references: [mataKuliah.id]
	}),
	blocks: many(academicItemBlock),
	links: many(academicItemLink)
}));

export const academicItemLink = sqliteTable('academic_item_link', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	itemId: integer('item_id')
		.notNull()
		.references(() => academicItem.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
	url: text('url').notNull(),
	platform: text('platform'), // optional platform hint/icon
	order: integer('order').notNull().default(0)
});

export const academicItemLinkRelations = relations(academicItemLink, ({ one }) => ({
	item: one(academicItem, {
		fields: [academicItemLink.itemId],
		references: [academicItem.id]
	})
}));

/* =========================
   CONTENT BLOCK (TEXT + IMAGE HIGHLIGHT)
   Flexible content: Text paragraphs, Images, Code blocks, etc.
========================= */

export const academicItemBlock = sqliteTable('academic_item_block', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	itemId: integer('item_id')
		.notNull()
		.references(() => academicItem.id, { onDelete: 'cascade' }),

	type: text('type').notNull(),
	// 'text' | 'image' | 'header'

	content: text('content'), // html/markdown text
	imageWebpUrl: text('image_webp_url'),
	imageOriginalUrl: text('image_original_url'),
	imageFileId: text('image_file_id'), // ImageKit ID
	imageGoogleId: text('image_google_id'), // Drive ID

	caption: text('caption'),
	width: text('width'), // 'full' | 'half' - for layouting hints

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
		.references(() => mataKuliah.id, { onDelete: 'cascade' })
		.notNull(),
	title: text('title').notNull(),
	asprak: text('asprak') // Added asprak column
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
	// Types: 'tugas_praktikum' | 'tugas_pra_praktikum' | 'uas_praktikum' | 'uts_praktikum' | 'tugas_akhir' | 'materi'

	title: text('title').notNull(),
	heroImageWebpUrl: text('hero_image_webp_url'),
	heroImageOriginalUrl: text('hero_image_original_url'),
	heroImageFileId: text('hero_image_file_id'),
	heroImageGoogleId: text('hero_image_google_id')
});

export const praktikumItemRelations = relations(praktikumItem, ({ one, many }) => ({
	praktikum: one(praktikum, {
		fields: [praktikumItem.praktikumId],
		references: [praktikum.id]
	}),
	blocks: many(praktikumItemBlock),
	links: many(praktikumItemLink)
}));

export const praktikumItemLink = sqliteTable('praktikum_item_link', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	itemId: integer('item_id')
		.notNull()
		.references(() => praktikumItem.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
	url: text('url').notNull(),
	platform: text('platform'),
	order: integer('order').notNull().default(0)
});

export const praktikumItemLinkRelations = relations(praktikumItemLink, ({ one }) => ({
	item: one(praktikumItem, {
		fields: [praktikumItemLink.itemId],
		references: [praktikumItem.id]
	})
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

	content: text('content'),
	imageWebpUrl: text('image_webp_url'),
	imageOriginalUrl: text('image_original_url'),
	imageFileId: text('image_file_id'),
	imageGoogleId: text('image_google_id'),

	caption: text('caption'),
	width: text('width'), // 'full' | 'half'

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

	// Changed from simple imageUrl to detailed storage
	imageWebpUrl: text('image_webp_url').notNull(),
	imageOriginalUrl: text('image_original_url').notNull(),
	imagekitFileId: text('imagekit_file_id'), // Nullable for backwards compatibility or manual insertion
	googleDriveFileId: text('google_drive_file_id'),

	date: text('date').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
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
