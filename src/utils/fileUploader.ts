import { Client } from "minio";

export const IMAGE_URL_PREFIX = "http://localhost:9000/e-com";

const ENDPOINT = process.env.FILE_UPLOADER_ENDPOINT || "localhost";
const PORT = Number(process.env.FILE_UPLOADER_PORT) || 9000;
const ACCESS_KEY = process.env.FILE_UPLOADER_ACCESS_KEY || "";
const SECRET_KEY = process.env.FILE_UPLOADER_SECRET_KEY || "";
const USE_SSL = process.env.FILE_UPLOADER_USE_SSL == "true" || false;

const client = new Client({
  endPoint: ENDPOINT,
  port: PORT,
  useSSL: USE_SSL,
  accessKey: ACCESS_KEY,
  secretKey: SECRET_KEY,
});

const expiryTime = 24 * 60 * 60;

export async function getPreSignedUrl(fileName: string): Promise<string> {
  let preSingedUrl = "";
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
  } catch (e) {
    console.log(e);
  }
  return preSingedUrl;
}
