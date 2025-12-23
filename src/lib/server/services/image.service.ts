import sharp from 'sharp';

export const imageService = {
	async processImage(buffer: Buffer): Promise<Buffer> {
		return sharp(buffer)
			.resize({ width: 1920, withoutEnlargement: true })
			.webp({ quality: 75 })
			.toBuffer();
	}
};
