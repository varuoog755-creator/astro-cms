import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

export const ALLOWED_MIME_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
  'application/pdf': 'pdf',
  'video/mp4': 'mp4',
  'audio/mpeg': 'mp3',
};

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export interface SaveFileResult {
  filename: string;
  url: string;
  path: string;
  size: number;
  mimeType: string;
}

export async function validateAndSaveFile(file: File): Promise<SaveFileResult> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds maximum limit of 50MB. (Uploaded: ${(file.size / 1024 / 1024).toFixed(2)}MB)`);
  }

  const mimeType = file.type.toLowerCase();
  if (!ALLOWED_MIME_TYPES[mimeType]) {
    throw new Error(`Invalid file type: "${mimeType}". Allowed formats: JPG, PNG, WEBP, GIF, SVG, PDF, MP4, MP3.`);
  }

  const ext = ALLOWED_MIME_TYPES[mimeType];
  const randomHash = crypto.randomBytes(8).toString('hex');
  const sanitizedOriginal = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
  const filename = `${Date.now()}_${randomHash}_${sanitizedOriginal}`;

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadsDir, { recursive: true });

  const targetPath = path.join(uploadsDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());

  await fs.writeFile(targetPath, buffer);

  const url = `/uploads/${filename}`;

  return {
    filename,
    url,
    path: targetPath,
    size: file.size,
    mimeType,
  };
}

export async function deleteStoredFile(url: string): Promise<void> {
  try {
    if (url.startsWith('/uploads/')) {
      const filename = url.replace('/uploads/', '');
      const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
      await fs.unlink(filePath).catch(() => {});
    }
  } catch (err) {
    console.error('Failed to delete file:', err);
  }
}
