import { google } from 'googleapis';
import readline from 'readline';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load .env manually since this script runs outside SvelteKit
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
	config({ path: envPath });
}

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/oauth2callback';

if (!CLIENT_ID || !CLIENT_SECRET) {
	console.error('❌ Error: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in .env');
	process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const SCOPES = [
	'https://www.googleapis.com/auth/drive.file',
	'https://www.googleapis.com/auth/gmail.send'
];

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const authUrl = oauth2Client.generateAuthUrl({
	access_type: 'offline', // Crucial for getting a Refresh Token
	scope: SCOPES,
	prompt: 'consent' // Force prompts to ensure we get a refresh token
});

console.log('\n=== Google Drive Authorization ===');
console.log('1. Visit this URL to authorize this app:');
console.log(`\n${authUrl}\n`);
console.log('2. After authorizing, you will be redirected to a page that might fail to load.');
console.log('3. LOOK AT THE URL BAR of that failed page.');
console.log(
	'4. Copy the value of the "code" parameter (everything after "code=" and before "&" if any).'
);

rl.question('\nPaste the code here: ', async (code) => {
	try {
		const { tokens } = await oauth2Client.getToken(code);

		console.log('\n✅ Authorization Successful!');
		console.log('\nAdd this REFRESH TOKEN to your .env file:');
		console.log(`\nGOOGLE_REFRESH_TOKEN="${tokens.refresh_token}"\n`);

		if (!tokens.refresh_token) {
			console.warn(
				'⚠️ No refresh token returned. Did you login differently? You might need to revoke access and try again.'
			);
		}
	} catch (error) {
		console.error('\n❌ Error retrieving access token:', error);
	} finally {
		rl.close();
	}
});
