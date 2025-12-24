// src/lib/types/user.ts

export type UserRole = 'user' | 'admin';

export interface User {
	id: string;
	email: string;
	name?: string | null;
	avatar?: string | null;
	role?: string;
	googleId?: string | null;
	createdAt?: Date | null;
}

export interface UserWithLastLogin extends User {
	lastLogin: string;
}

export interface Session {
	id: string;
	userId: string;
	expiresAt: Date;
}

export interface SessionWithDetails extends Session {
	userEmail: string;
	userName: string | null;
	device: string;
}

// Form types
export interface UserUpdateInput {
	id: string;
	role: UserRole;
}

// Response types
export interface UserListResponse {
	users: UserWithLastLogin[];
	total: number;
}

export interface SessionListResponse {
	sessions: SessionWithDetails[];
	total: number;
}
