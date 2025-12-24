import {
	IMAGEKIT_PUBLIC_KEY,
	IMAGEKIT_PRIVATE_KEY,
	IMAGEKIT_URL_ENDPOINT,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GOOGLE_REDIRECT_URI,
	GOOGLE_REFRESH_TOKEN,
	GOOGLE_DRIVE_FOLDER_ID
} from '$env/static/private';
import ImageKit from 'imagekit';
import { google } from 'googleapis';
import { Readable } from 'stream';

// Initialize ImageKit
const imagekit = new ImageKit({
	publicKey: IMAGEKIT_PUBLIC_KEY ? IMAGEKIT_PUBLIC_KEY.trim() : '',
	privateKey: IMAGEKIT_PRIVATE_KEY ? IMAGEKIT_PRIVATE_KEY.trim() : '',
	urlEndpoint: IMAGEKIT_URL_ENDPOINT ? IMAGEKIT_URL_ENDPOINT.trim() : ''
});

// Initialize Google Drive with OAuth2
function getDriveClient() {
	const oauth2Client = new google.auth.OAuth2(
		GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET,
		GOOGLE_REDIRECT_URI || 'http://localhost:3000/oauth2callback'
	);

	oauth2Client.setCredentials({
		refresh_token: GOOGLE_REFRESH_TOKEN
	});

	return google.drive({ version: 'v3', auth: oauth2Client });
}

export const storageService = {
	async uploadToImageKit(buffer: Buffer, fileName: string, folder: string = '/gallery/webp/') {
		try {
			const response = await imagekit.upload({
				file: buffer,
				fileName: fileName,
				folder: folder,
				useUniqueFileName: true
			});
			return {
				url: response.url,
				fileId: response.fileId
			};
		} catch (error) {
			console.error('ImageKit Upload Error:', error);
			throw new Error('Failed to upload image to ImageKit');
		}
	},

	async deleteFromImageKit(fileId: string) {
		try {
			await imagekit.deleteFile(fileId);
		} catch (error) {
			console.error('ImageKit Delete Error:', error);
			// Verify if we should throw or just log. Usually just log to avoid blocking main flow.
		}
	},

	async ensureDriveFolderHierarchy(pathSegments: string[]) {
		try {
			const drive = getDriveClient();
			let parentId = GOOGLE_DRIVE_FOLDER_ID;

			for (const segment of pathSegments) {
				// Check if folder exists
				const query = `mimeType='application/vnd.google-apps.folder' and name='${segment}' and '${parentId}' in parents and trashed=false`;
				const listResponse = await drive.files.list({
					q: query,
					fields: 'files(id, name)',
					spaces: 'drive'
				});

				if (listResponse.data.files && listResponse.data.files.length > 0) {
					// Folder exists
					parentId = listResponse.data.files[0].id!;
				} else {
					// Create folder
					const fileMetadata = {
						name: segment,
						mimeType: 'application/vnd.google-apps.folder',
						parents: [parentId]
					};
					const createResponse = await drive.files.create({
						requestBody: fileMetadata,
						fields: 'id'
					});
					parentId = createResponse.data.id!;
				}
			}
			return parentId;
		} catch (error) {
			console.error('Google Drive Folder Structure Error:', error);
			// Fallback to root folder if hierarchy creation fails
			return GOOGLE_DRIVE_FOLDER_ID;
		}
	},

	async uploadToGoogleDrive(
		buffer: Buffer,
		fileName: string,
		mimeType: string,
		folderPath: string[] = []
	) {
		try {
			const drive = getDriveClient();
			let folderId = GOOGLE_DRIVE_FOLDER_ID;

			if (folderPath.length > 0) {
				folderId = await this.ensureDriveFolderHierarchy(folderPath);
			}

			const fileMetadata = {
				name: fileName,
				parents: folderId ? [folderId] : []
			};

			const media = {
				mimeType: mimeType,
				body: Readable.from(buffer)
			};

			const response = await drive.files.create({
				requestBody: fileMetadata,
				media: media,
				fields: 'id, webViewLink, webContentLink'
			});

			return {
				fileId: response.data.id,
				url: response.data.webViewLink // Viewable link
			};
		} catch (error) {
			console.error('Google Drive Upload Error:', error);
			throw new Error('Failed to upload image to Google Drive');
		}
	},

	async deleteFromGoogleDrive(fileId: string) {
		try {
			const drive = getDriveClient();
			await drive.files.delete({
				fileId: fileId
			});
		} catch (error) {
			console.error('Google Drive Delete Error:', error);
			// Log only, don't crash main flow
		}
	}
};
