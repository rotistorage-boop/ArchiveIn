import { db } from '$lib/server/db';
import { academicItem, academicItemBlock } from '$lib/server/db/schema';
import { eq, asc } from 'drizzle-orm';
import type { AcademicItem } from '$lib/types/academic';

export async function getAcademicItemDetail(id: number): Promise<AcademicItem | null> {
	const item = await db.query.academicItem.findFirst({
		where: eq(academicItem.id, id),
		with: {
			blocks: {
				orderBy: [asc(academicItemBlock.order)]
			},
			links: true
		}
	});

	if (!item) return null;
	return item;
}
