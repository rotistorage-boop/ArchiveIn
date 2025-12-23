import { db } from '$lib/server/db';
import { praktikum } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { Praktikum } from '$lib/types/academic';

export async function getPraktikumByMatkul(mataKuliahId: number): Promise<Praktikum | null> {
	const result = await db.query.praktikum.findFirst({
		where: eq(praktikum.mataKuliahId, mataKuliahId),
		with: {
			praktikumItems: {
				with: {
					blocks: true,
					links: true
				}
			}
		}
	});

	if (!result) return null;

	return result;
}
