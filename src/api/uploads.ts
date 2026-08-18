import { apiFetch } from './client';

interface RequestUploadInput {
  contentType: string;
  declaredSizeBytes: number;
}

interface RequestUploadResult {
  upload_url: string;
  object_key: string;
}

export function requestUploadUrl({ contentType, declaredSizeBytes }: RequestUploadInput): Promise<RequestUploadResult> {
  return apiFetch<RequestUploadResult>('/api/uploads/request', {
    method: 'POST',
    body: JSON.stringify({ content_type: contentType, declared_size_bytes: declaredSizeBytes }),
  });
}

/** PUTs directly to Storage — never through the BE, which only ever issues the URL. */
export async function uploadToStorage(uploadUrl: string, blob: Blob, contentType: string): Promise<void> {
  const res = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: blob,
  });
  if (!res.ok) {
    throw new Error(`Upload to storage failed: ${res.status}`);
  }
}
