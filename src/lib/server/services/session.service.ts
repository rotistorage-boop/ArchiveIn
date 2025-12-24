import { db } from '$lib/server/db';
import { session, user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { SessionWithUser } from '$lib/types/session';

export async function getSessions(): Promise<SessionWithUser[]> {
	const sessions = await db
		.select({
			id: session.id,
			userId: session.userId,
			expiresAt: session.expiresAt,
			user: {
				id: user.id,
				name: user.name,
				email: user.email
			}
		})
		.from(session)
		.innerJoin(user, eq(session.userId, user.id));

	return sessions;
}

export async function deleteSession(id: string): Promise<void> {
	await db.delete(session).where(eq(session.id, id));
}
