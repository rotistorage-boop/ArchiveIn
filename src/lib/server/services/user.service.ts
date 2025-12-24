import { db } from '$lib/server/db';
import { user, session } from '$lib/server/db/schema';
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

export async function deleteUser(id: string) {
	// Delete user's sessions first
	await db.delete(session).where(eq(session.userId, id));
	// Then delete the user
	await db.delete(user).where(eq(user.id, id));
}

export async function getUserById(id: string) {
	return db.query.user.findFirst({
		where: eq(user.id, id)
	});
}
