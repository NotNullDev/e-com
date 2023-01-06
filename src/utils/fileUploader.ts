import { Client } from "minio";

const IMAGE_ENDPOINT = process.env.FILE_UPLOADER_ENDPOINT || "localhost";
const PORT = Number(process.env.FILE_UPLOADER_PORT) || 9000;
const ACCESS_KEY = process.env.FILE_UPLOADER_ACCESS_KEY || "";
const SECRET_KEY = process.env.FILE_UPLOADER_SECRET_KEY || "";
const USE_SSL = process.env.FILE_UPLOADER_USE_SSL == "true" || false;
const NEXT_PUBLIC_IMAGE_SERVER_URL =
  process.env.NEXT_PUBLIC_IMAGE_SERVER_URL || "";
const FILE_UPLOADER_ENDPOINT = process.env.FILE_UPLOADER_ENDPOINT || "";

export const IMAGE_URL_PREFIX = `${
  USE_SSL ? "https" : "http"
}://${IMAGE_ENDPOINT}:${PORT}/e-com`;

const client = new Client({
  endPoint: IMAGE_ENDPOINT,
  port: PORT,
  useSSL: USE_SSL,
  accessKey: ACCESS_KEY,
  secretKey: SECRET_KEY,
});

const expiryTime = 24 * 60 * 60;

export async function getPreSignedUrl(fileName: string): Promise<string> {
  let preSingedUrl = "";
  console.log(`img url prefix ${IMAGE_URL_PREFIX}`);
  try {
    preSingedUrl = await new Promise<string>((resolve, reject) => {
      client.presignedPutObject("e-com", fileName, expiryTime, (err, url) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(url);
      });
    });

    if (process.env.NODE_ENV === "production") {
      preSingedUrl = preSingedUrl.replace(
        "http://minio:9000",
        "https://minio.notnulldev.com"
      ); // FK envs in nextjs
    }
  } catch (e) {
    console.log(e); // print error to the console
    throw e;
  }

  console.log(`presigned url: ${preSingedUrl}`);
  return preSingedUrl;
}
