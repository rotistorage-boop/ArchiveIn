import { redirect } from '@sveltejs/kit';
import { google } from 'googleapis';
import {
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GOOGLE_OAUTH_REDIRECT_URI
} from '$env/static/private';
import type { RequestHandler } from './$types';

const oauth2Client = new google.auth.OAuth2(
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GOOGLE_OAUTH_REDIRECT_URI
);

export const GET: RequestHandler = async ({ cookies }) => {
	// Generate a random state for CSRF protection
	const state = crypto.randomUUID();

	// Store state in cookie for verification
	cookies.set('oauth_state', state, {
		path: '/',
		httpOnly: true,
		secure: false, // Set to true in production
		maxAge: 60 * 10 // 10 minutes
	});

	const authUrl = oauth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: [
			'https://www.googleapis.com/auth/userinfo.email',
			'https://www.googleapis.com/auth/userinfo.profile'
		],
		state,
		prompt: 'select_account'
	});

	throw redirect(302, authUrl);
};
