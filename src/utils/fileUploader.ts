import { Client } from "minio";

export const IMAGE_URL_PREFIX = "http://localhost:9000/e-com";

const client = new Client({
  endPoint: "localhost",
  port: 9000,
  useSSL: false,
  accessKey: "TuKlzUOQTv1atr9n",
  secretKey: "qSihu44ilJB4c32fHJ0dsy1tbua9RUjI",
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
