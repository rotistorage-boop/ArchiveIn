import { google } from 'googleapis';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } from '$env/static/private';
import { env } from '$env/dynamic/private';

const ADMIN_EMAILS = (env.ADMIN_EMAILS || '').split(',').map((e) => e.trim());
const NOTIFICATION_EMAIL = ADMIN_EMAILS[0] || 'rotistorage@gmail.com';

// Track if Gmail is enabled (will be set to false if scope is missing)
let gmailEnabled = true;

function getGmailClient() {
	const oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);

	oauth2Client.setCredentials({
		refresh_token: GOOGLE_REFRESH_TOKEN
	});

	return google.gmail({ version: 'v1', auth: oauth2Client });
}

function createEmailContent(to: string, subject: string, body: string): string {
	const email = [
		`To: ${to}`,
		`Subject: ${subject}`,
		'Content-Type: text/html; charset=utf-8',
		'MIME-Version: 1.0',
		'',
		body
	].join('\r\n');

	// Base64url encode
	return Buffer.from(email)
		.toString('base64')
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');
}

export const emailService = {
	isEnabled() {
		return gmailEnabled;
	},

	async sendRegistrationNotification(user: { email: string; name: string; role: string }) {
		if (!gmailEnabled) return;

		try {
			const gmail = getGmailClient();
			const time = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

			const subject = `New Registration: ${user.name}`;
			const body = `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
					<h2 style="color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 10px;">
						New User Registered
					</h2>
					<div style="background: #1a1a1a; color: #fff; padding: 20px; border-radius: 8px; margin: 20px 0;">
						<p style="margin: 10px 0;"><strong>Name:</strong> ${user.name}</p>
						<p style="margin: 10px 0;"><strong>Email:</strong> ${user.email}</p>
						<p style="margin: 10px 0;"><strong>Role:</strong> ${user.role}</p>
						<p style="margin: 10px 0;"><strong>Time:</strong> ${time}</p>
					</div>
					<p style="color: #666; font-size: 12px;">This email was sent automatically from ArchiveIn.</p>
				</div>
			`;

			const rawMessage = createEmailContent(NOTIFICATION_EMAIL, subject, body);
			await gmail.users.messages.send({
				userId: 'me',
				requestBody: { raw: rawMessage }
			});

			console.log(`[Email] Registration notification sent for ${user.email}`);
		} catch (error: any) {
			if (error?.message?.includes('insufficient authentication scopes')) {
				gmailEnabled = false;
				console.warn('[Email] Gmail scope not enabled. Email notifications disabled.');
			} else {
				console.error('[Email] Failed to send registration notification:', error?.message);
			}
		}
	},

	async sendLoginNotification(user: { email: string; name: string; role: string }) {
		if (!gmailEnabled) return;

		try {
			const gmail = getGmailClient();
			const time = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

			const subject = `Login: ${user.name}`;
			const body = `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
					<h2 style="color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
						User Login
					</h2>
					<div style="background: #1a1a1a; color: #fff; padding: 20px; border-radius: 8px; margin: 20px 0;">
						<p style="margin: 10px 0;"><strong>Name:</strong> ${user.name}</p>
						<p style="margin: 10px 0;"><strong>Email:</strong> ${user.email}</p>
						<p style="margin: 10px 0;"><strong>Role:</strong> ${user.role}</p>
						<p style="margin: 10px 0;"><strong>Time:</strong> ${time}</p>
					</div>
					<p style="color: #666; font-size: 12px;">This email was sent automatically from ArchiveIn.</p>
				</div>
			`;

			const rawMessage = createEmailContent(NOTIFICATION_EMAIL, subject, body);
			await gmail.users.messages.send({
				userId: 'me',
				requestBody: { raw: rawMessage }
			});

			console.log(`[Email] Login notification sent for ${user.email}`);
		} catch (error: any) {
			if (error?.message?.includes('insufficient authentication scopes')) {
				gmailEnabled = false;
				console.warn('[Email] Gmail scope not enabled. Email notifications disabled.');
			} else {
				console.error('[Email] Failed to send login notification:', error?.message);
			}
		}
	}
};
