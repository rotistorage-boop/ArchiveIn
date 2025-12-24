import { redirect, error } from '@sveltejs/kit';
import { google } from 'googleapis';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { eq } from 'drizzle-orm';
import {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_OAUTH_REDIRECT_URI
} from '$env/static/private';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import * as auth from '$lib/server/auth';
import { emailService } from '$lib/server/services/email.service';
import type { RequestHandler } from './$types';

const ADMIN_EMAILS = ['rotistorage@gmail.com', 'fahrezazamroni@gmail.com'];

const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_OAUTH_REDIRECT_URI
);

function generateUserId() {
    const bytes = crypto.getRandomValues(new Uint8Array(15));
    return encodeBase32LowerCase(bytes);
}

function getUserRole(email: string): string {
    if (ADMIN_EMAILS.includes(email)) {
        return 'admin';
    }
    // Support subdomains like @student.trunojoyo.ac.id, @mail.trunojoyo.ac.id, etc.
    if (email.includes('trunojoyo.ac.id')) {
        return 'trunojoyo'; // Can access archive
    }
    return 'guest'; // Gallery only
}

function getRedirectUrl(role: string): string {
    if (role === 'admin') {
        return '/dashboard';
    }
    // All other users go to home (archive visible based on role in frontend)
    return '/';
}

export const GET: RequestHandler = async ({ url, cookies }) => {
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const storedState = cookies.get('oauth_state');

    // Verify state for CSRF protection
    if (!state || !storedState || state !== storedState) {
        return new Response('Invalid state parameter', { status: 400 });
    }

    // Clear the state cookie
    cookies.delete('oauth_state', { path: '/' });

    if (!code) {
        return new Response('Missing authorization code', { status: 400 });
    }

    try {
        // Exchange code for tokens
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // Fetch user profile
        const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
        const { data: profile } = await oauth2.userinfo.get();

        if (!profile.email) {
            return new Response('Could not get email from Google', { status: 400 });
        }

        // Determine user role based on email
        const role = getUserRole(profile.email);

        // Check if user exists
        const [existingUser] = await db
            .select()
            .from(table.user)
            .where(eq(table.user.email, profile.email));

        let userId: string;
        const isNewUser = !existingUser;

        if (existingUser) {
            // Update existing user
            userId = existingUser.id;
            await db
                .update(table.user)
                .set({
                    name: profile.name,
                    avatar: profile.picture,
                    googleId: profile.id,
                    role // Update role in case it changed
                })
                .where(eq(table.user.id, userId));
        } else {
            // Create new user
            userId = generateUserId();

            await db.insert(table.user).values({
                id: userId,
                email: profile.email,
                name: profile.name,
                avatar: profile.picture,
                googleId: profile.id,
                role
            });
        }

        // Create session
        const sessionToken = auth.generateSessionToken();
        const session = await auth.createSession(sessionToken, userId);

        // Set session cookie
        cookies.set('auth-session', sessionToken, {
            path: '/',
            expires: session.expiresAt,
            httpOnly: true,
            sameSite: 'lax'
        });

        // Send email notification (non-blocking)
        const userInfo = { email: profile.email, name: profile.name || 'Unknown', role };
        if (isNewUser) {
            emailService.sendRegistrationNotification(userInfo);
        } else {
            emailService.sendLoginNotification(userInfo);
        }

        // Redirect based on role
        const redirectUrl = getRedirectUrl(role);
        return new Response(null, {
            status: 302,
            headers: { Location: redirectUrl }
        });
    } catch (err) {
        console.error('OAuth callback error:', err);
        return new Response('Authentication failed', { status: 500 });
    }
};
