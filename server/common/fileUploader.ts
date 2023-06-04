import { Client, type ClientOptions } from "minio";

const s3ClientOptions = {
  endPoint: process.env.FILE_UPLOADER_ENDPOINT || "localhost",
  port: Number(process.env.FILE_UPLOADER_PORT) || 9000,
  useSSL: process.env.FILE_UPLOADER_USE_SSL == "true" || false,
  accessKey: process.env.FILE_UPLOADER_ACCESS_KEY ?? "",
  secretKey: process.env.FILE_UPLOADER_SECRET_KEY ?? "",
} satisfies ClientOptions;

const client = new Client(s3ClientOptions);

const expiryTime = 24 * 60 * 60;

export async function getPreSignedUrl(fileName: string): Promise<string> {
  let preSingedUrl = "";
  console.dir("presigning url for client:");
  console.dir(s3ClientOptions);
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
    throw e;
  }

  return preSingedUrl;
}
