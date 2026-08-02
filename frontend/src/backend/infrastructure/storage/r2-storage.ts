import { IStorageProvider } from "../../core/ports";

/**
 * Cloudflare R2 Storage Provider
 * Uses the S3-compatible REST API directly with AWS Signature V4.
 * All credentials are injected via environment variables — no hardcoding.
 *
 * Compatible providers (swap via STORAGE_PROVIDER env var):
 *   - Cloudflare R2 (default)
 *   - AWS S3 (same S3 API)
 *   - MinIO (self-hosted, same S3 API)
 */
export class R2StorageProvider implements IStorageProvider {
  private readonly accountId: string;
  private readonly accessKeyId: string;
  private readonly secretAccessKey: string;
  private readonly bucketName: string;
  private readonly publicUrl: string;
  private readonly endpoint: string;
  private readonly region: string;

  constructor() {
    this.accountId = process.env.R2_ACCOUNT_ID ?? "YOUR_ACCOUNT_ID";
    this.accessKeyId = process.env.R2_ACCESS_KEY_ID ?? "YOUR_ACCESS_KEY";
    this.secretAccessKey = process.env.R2_SECRET_ACCESS_KEY ?? "YOUR_SECRET_KEY";
    this.bucketName = process.env.R2_BUCKET ?? "noblenests-prod-assets";
    this.publicUrl = process.env.R2_PUBLIC_URL ?? "https://cdn.noblenests.co";
    this.region = process.env.R2_REGION ?? "auto";
    this.endpoint = process.env.R2_ENDPOINT ?? `https://${this.accountId}.r2.cloudflarestorage.com`;
  }

  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    pathPrefix: string = "general"
  ): Promise<string> {
    const key = `${pathPrefix}/${Date.now()}-${sanitizeFileName(fileName)}`;
    const url = `${this.endpoint}/${this.bucketName}/${key}`;

    // Convert Node.js Buffer to Uint8Array for Web Crypto / fetch compatibility
    const bodyBytes = new Uint8Array(fileBuffer);
    const headers = await this.buildAuthHeaders("PUT", key, mimeType, bodyBytes);

    const response = await fetch(url, {
      method: "PUT",
      headers,
      // Uint8Array is a valid BodyInit in Node.js 18+ and all modern environments
      body: bodyBytes,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`R2 Upload failed [${response.status}]: ${errorText}`);
    }

    return `${this.publicUrl}/${key}`;
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    const key = fileUrl.replace(`${this.publicUrl}/`, "");
    const url = `${this.endpoint}/${this.bucketName}/${key}`;
    const empty = new Uint8Array(0);

    const headers = await this.buildAuthHeaders("DELETE", key, "", empty);

    const response = await fetch(url, { method: "DELETE", headers });
    return response.ok;
  }

  /**
   * Builds AWS Signature V4 Authorization headers.
   * Uses the Web Crypto API (no external dependencies required).
   */
  private async buildAuthHeaders(
    method: string,
    key: string,
    contentType: string,
    body: Uint8Array
  ): Promise<Record<string, string>> {
    const now = new Date();
    const dateStamp = now.toISOString().slice(0, 10).replace(/-/g, "");
    const amzDate = now.toISOString().replace(/[:-]/g, "").slice(0, 15) + "Z";
    const service = "s3";

    const payloadHash = await sha256Hex(body);
    const host = new URL(this.endpoint).host;

    const canonicalHeaders =
      (contentType ? `content-type:${contentType}\n` : "") +
      `host:${host}\n` +
      `x-amz-content-sha256:${payloadHash}\n` +
      `x-amz-date:${amzDate}\n`;

    const signedHeaders = contentType
      ? "content-type;host;x-amz-content-sha256;x-amz-date"
      : "host;x-amz-content-sha256;x-amz-date";

    const canonicalRequest = [
      method,
      `/${this.bucketName}/${key}`,
      "",
      canonicalHeaders,
      signedHeaders,
      payloadHash,
    ].join("\n");

    const credentialScope = `${dateStamp}/${this.region}/${service}/aws4_request`;
    const stringToSign = [
      "AWS4-HMAC-SHA256",
      amzDate,
      credentialScope,
      await sha256Hex(new TextEncoder().encode(canonicalRequest)),
    ].join("\n");

    const signingKey = await getSigningKey(this.secretAccessKey, dateStamp, this.region, service);
    const signature = await hmacHex(signingKey, stringToSign);

    const authHeader = [
      `AWS4-HMAC-SHA256 Credential=${this.accessKeyId}/${credentialScope}`,
      `SignedHeaders=${signedHeaders}`,
      `Signature=${signature}`,
    ].join(", ");

    return {
      ...(contentType ? { "Content-Type": contentType } : {}),
      "x-amz-date": amzDate,
      "x-amz-content-sha256": payloadHash,
      Authorization: authHeader,
    };
  }
}

// ─── Web Crypto Helpers (zero external dependencies) ─────────────────────────

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

async function sha256Hex(data: Uint8Array | ArrayBuffer): Promise<string> {
  // crypto.subtle accepts both ArrayBuffer and Uint8Array as BufferSource
  const hash = await crypto.subtle.digest("SHA-256", data as BufferSource);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacSha256(key: Uint8Array | ArrayBuffer, data: string | Uint8Array): Promise<ArrayBuffer> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key as BufferSource,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  const dataBytes = typeof data === "string" ? new TextEncoder().encode(data) : data;
  return crypto.subtle.sign("HMAC", cryptoKey, dataBytes as BufferSource);
}

async function hmacHex(key: Uint8Array | ArrayBuffer, data: string): Promise<string> {
  const result = await hmacSha256(key, data);
  return Array.from(new Uint8Array(result))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function getSigningKey(
  secret: string,
  date: string,
  region: string,
  service: string
): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const kDate = await hmacSha256(encoder.encode("AWS4" + secret), date);
  const kRegion = await hmacSha256(kDate, region);
  const kService = await hmacSha256(kRegion, service);
  return hmacSha256(kService, "aws4_request");
}
