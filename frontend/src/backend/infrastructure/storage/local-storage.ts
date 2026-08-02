import { IStorageProvider } from "../../core/ports";

/**
 * Local Filesystem Storage Provider — for development use only.
 * Drop-in replacement for R2StorageProvider. Swap via DI container.
 */
export class LocalStorageProvider implements IStorageProvider {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  }

  async uploadFile(fileBytes: Uint8Array, fileName: string, mimeType: string, pathPrefix: string = "general"): Promise<string> {
    const key = `${pathPrefix}/${Date.now()}-${fileName}`;
    console.log(`[LocalStorage] Would upload: ${key} (${mimeType}, ${fileBytes.length} bytes)`);
    return `${this.baseUrl}/uploads/${key}`;
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    console.log(`[LocalStorage] Would delete: ${fileUrl}`);
    return true;
  }
}
