import crypto from "crypto";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

const projectRoot = process.cwd();
const candidateFiles = [
  join(projectRoot, ".env.local"),
  join(projectRoot, ".env"),
  join(projectRoot, "backend", ".env.local"),
  join(projectRoot, "backend", ".env"),
];

function readLocalEnvValue(key: string) {
  for (const filePath of candidateFiles) {
    if (!existsSync(filePath)) continue;
    const file = readFileSync(filePath, "utf8");
    const line = file.split(/\r?\n/).find((entry) => entry.startsWith(`${key}=`));
    if (!line) continue;
    const value = line.slice(key.length + 1).trim();
    if (value) return value.replace(/^"|"$/g, "");
  }
  return null;
}

function readConfiguredValue(key: string, fallback: string) {
  const envValue = process.env[key]?.trim();
  if (envValue) return envValue.replace(/^"|"$/g, "");
  const fileValue = readLocalEnvValue(key)?.trim();
  if (fileValue) return fileValue.replace(/^"|"$/g, "");
  return fallback;
}

function parseImageSource(source: string) {
  const match = source.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) return null;
  return { mime: match[1], payload: match[2] };
}

function mimeFromFileName(fileName: string) {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  return "image/png";
}

function localPathToDataUrl(source: string) {
  if (!source.startsWith("/uploads/")) return null;
  const relativePath = source.replace(/^\//, "");
  const filePath = join(projectRoot, "public", relativePath);
  if (!existsSync(filePath)) return null;
  const buffer = readFileSync(filePath);
  const mime = mimeFromFileName(filePath);
  return `data:${mime};base64,${buffer.toString("base64")}`;
}

function signature(timestamp: number, folder: string) {
  const apiSecret = readConfiguredValue("CLOUDINARY_API_SECRET", "");
  const base = `folder=${folder}&timestamp=${timestamp}`;
  return crypto.createHash("sha1").update(`${base}${apiSecret}`).digest("hex");
}

async function uploadToCloudinary(source: string, folder: string) {
  const cloudName = readConfiguredValue("CLOUDINARY_CLOUD_NAME", "");
  const apiKey = readConfiguredValue("CLOUDINARY_API_KEY", "");
  const apiSecret = readConfiguredValue("CLOUDINARY_API_SECRET", "");

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary credentials are missing");
  }

  const parsed = parseImageSource(source);
  if (!parsed) return source;

  const timestamp = Math.floor(Date.now() / 1000);
  const fileData = `data:${parsed.mime};base64,${parsed.payload}`;
  const uploadFolder = readConfiguredValue("CLOUDINARY_UPLOAD_FOLDER", folder);
  const form = new FormData();
  form.append("file", fileData);
  form.append("api_key", apiKey);
  form.append("timestamp", String(timestamp));
  form.append("folder", uploadFolder);
  form.append("signature", signature(timestamp, uploadFolder));

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: form,
  });

  const raw = await response.text();
  let data: any = {};
  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = {};
    }
  }

  if (!response.ok) {
    throw new Error(data?.error?.message ?? "Cloudinary upload failed");
  }

  return data?.secure_url ?? source;
}

export async function persistImageSource(source: string, folder = "lands") {
  if (!source) return source;
  if (source.startsWith("http://") || source.startsWith("https://")) {
    return source;
  }

  const maybeDataUrl = source.startsWith("/uploads/") ? localPathToDataUrl(source) : source;
  if (!maybeDataUrl) return source;
  return uploadToCloudinary(maybeDataUrl, folder);
}

export async function persistImageSources(items: string[] | undefined, folder = "lands") {
  if (!items?.length) return items ?? [];
  return Promise.all(items.map((item) => persistImageSource(item, folder)));
}
