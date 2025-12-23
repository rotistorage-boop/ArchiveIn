import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function getUsers() {
	const users = await db.query.user.findMany();
	return users.map((user) => ({
		...user,
		lastLogin: new Date().toLocaleString()
	}));
}

export async function updateUserRole(id: string, role: string) {
	await db.update(user).set({ role }).where(eq(user.id, id));
}
