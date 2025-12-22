import type { InferSelectModel } from 'drizzle-orm';
import {
	semester,
	mataKuliah,
	academicItem,
	academicItemBlock,
	praktikum,
	praktikumItem,
	praktikumItemBlock,
	asprak
} from '$lib/server/db/schema';

/* =========================
   BLOCK
========================= */

export type AcademicItemBlock = InferSelectModel<typeof academicItemBlock>;
export type PraktikumItemBlock = InferSelectModel<typeof praktikumItemBlock>;


/* =========================
   ITEM
========================= */

export type AcademicItem = InferSelectModel<typeof academicItem> & {
	blocks: AcademicItemBlock[];
};

export type PraktikumItem = InferSelectModel<typeof praktikumItem> & {
	blocks: PraktikumItemBlock[];
};

/* =========================
   PRAKTIKUM
========================= */

export type Praktikum = InferSelectModel<typeof praktikum> & {
	praktikumItems: PraktikumItem[];
};

/* =========================
   ASPRAK
========================= */

export type Asprak = InferSelectModel<typeof asprak>;

/* =========================
   MATA KULIAH
========================= */

// This type reflects the exact structure returned by the deep query in getArchiveOverview
export type MataKuliahForArchive = InferSelectModel<typeof mataKuliah> & {
	academicItems: AcademicItem[];
	praktikums: Praktikum[];
	aspraks: Asprak[];
};

/* =========================
   SEMESTER
========================= */

// This type reflects the exact structure returned by the deep query in getArchiveOverview
export type SemesterForArchive = InferSelectModel<typeof semester> & {
	mataKuliahs: MataKuliahForArchive[];
};
