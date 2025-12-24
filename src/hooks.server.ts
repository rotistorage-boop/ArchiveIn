import { redirect, error, type Handle } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import { env } from '$env/dynamic/private';

const ADMIN_EMAILS = (env.ADMIN_EMAILS || '').split(',').map((e) => e.trim());

// Simple in-memory rate limiting for auth endpoints
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // 10 requests per window

function getRateLimitKey(event: { getClientAddress: () => string }) {
	return event.getClientAddress();
}

function checkRateLimit(event: { getClientAddress: () => string }): boolean {
	const key = getRateLimitKey(event);
	const now = Date.now();
	const entry = rateLimitMap.get(key);

	if (!entry || now > entry.resetTime) {
		rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
		return true;
	}

	if (entry.count >= RATE_LIMIT_MAX) {
		return false; // Rate limited
	}

	entry.count++;
	return true;
}

const handleAuth: Handle = async ({ event, resolve }) => {
	// Rate limit auth endpoints
	if (event.url.pathname.startsWith('/login/google')) {
		if (!checkRateLimit(event)) {
			throw error(429, 'Too many requests. Please wait and try again.');
		}
	}

	const sessionToken = event.cookies.get(auth.sessionCookieName);

	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
	} else {
		const { session, user } = await auth.validateSessionToken(sessionToken);

		if (session) {
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} else {
			auth.deleteSessionTokenCookie(event);
		}

		event.locals.user = user;
		event.locals.session = session;
	}

	// Layer 3: Dashboard only for admin emails
	if (event.url.pathname.startsWith('/dashboard')) {
		if (!event.locals.user) {
			throw redirect(303, '/login');
		}
		if (!ADMIN_EMAILS.includes(event.locals.user.email)) {
			// Non-admins cannot access dashboard
			throw redirect(303, '/');
		}
	}

	// Resolve and add security headers
	const response = await resolve(event);

	// Add security headers
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

	return response;
};

export const handle: Handle = handleAuth;
