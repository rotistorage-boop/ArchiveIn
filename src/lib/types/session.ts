import type { InferSelectModel } from 'drizzle-orm';
import { session, user } from '$lib/server/db/schema';

export type Session = InferSelectModel<typeof session>;
export type User = InferSelectModel<typeof user>;

export interface SessionWithUser {
	id: string;
	userId: string;
	expiresAt: Date;
	user: {
		id: string;
		username: string;
		email: string;
	};
}
