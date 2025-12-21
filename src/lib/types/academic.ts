import type { InferSelectModel } from 'drizzle-orm';
import {
	semester,
	mataKuliah,
	academicItem,
	academicItemBlock,
	praktikum,
	praktikumItem,
	asprak
} from '$lib/server/db/schema';

/* =========================
   BLOCK
========================= */

export type AcademicItemBlock = InferSelectModel<typeof academicItemBlock>;

/* =========================
   ITEM
========================= */

export type AcademicItem = InferSelectModel<typeof academicItem> & {
	blocks: AcademicItemBlock[];
};

/* =========================
   PRAKTIKUM
========================= */

export type PraktikumItem = InferSelectModel<typeof praktikumItem>;

export type Praktikum = InferSelectModel<typeof praktikum> & {
	items: PraktikumItem[];
};

/* =========================
   ASPRAK
========================= */

export type Asprak = InferSelectModel<typeof asprak>;

/* =========================
   MATA KULIAH
========================= */

export type MataKuliah = InferSelectModel<typeof mataKuliah> & {
	items: AcademicItem[];
	praktikum?: Praktikum | null;
	asprak?: Asprak[];
};

/* =========================
   SEMESTER
========================= */

export type Semester = InferSelectModel<typeof semester> & {
	mataKuliahs: MataKuliah[];
};

export type MataKuliahForArchive = Pick<InferSelectModel<typeof mataKuliah>, 'id' | 'name'>;

export type SemesterForArchive = Pick<
	InferSelectModel<typeof semester>,
	'id' | 'name' | 'startYear' | 'endYear'
> & {
	mataKuliahs: MataKuliahForArchive[];
};
