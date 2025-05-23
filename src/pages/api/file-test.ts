import formidable from "formidable";
import { readFileSync } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import { Category, product } from "../../../common/db/schema";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import { db } from "../../db/db";
import { IMAGE_URL_PREFIX } from "../../utils/CONST";

//set bodyparser
export const config = {
  api: {
    bodyParser: false,
  },
};

type ProductWriteModel = {
  title: string;
  description: string;
  files: formidable.File[];
  previewImage: formidable.File;
  price: number;
  stock: number;
  shippingTimeDays: number;
  categories: Category[];
  userId: string;
};

const apiKey = process.env.FILE_SERVER_API_KEY || "";

const a = async (req: NextApiRequest, res: NextApiResponse) => {
  if (1 === 1) throw "haha";
  const session = await getServerAuthSession({ req, res });

  if (!session?.user) {
    res.status(401).json({
      error: "Unauthorized",
    });
    return;
  }

  const headers = new Headers();

  headers.append("Content-Type", req.headers["content-type"] || "");
  headers.append("Content-Length", req.headers["content-length"] || "");
  headers.append("api-key", apiKey);

  await fetch("http://localhost:4500", {
    method: "POST",
    headers,
    body: req.body,
  });

  const files: formidable.File[] = [];
  const form = formidable({
    maxFileSize: 10 * 1024 * 1024,
  });

  form.on("file", async (field, file) => {
    if (file.mimetype?.startsWith("image/")) {
      files.push(file);
    }
  });

  // form.once("end", () => {
  //   files.forEach((file) => {
  //     console.log(`${file.originalFilename} ${file.mimetype}`);
  //     res.status(200).json({
  //       status: "ok",
  //     });
  //   });
  // });

  form.once("error", (err) => {
    console.log(err);
    res.status(400).json({
      error: "Could not process files.",
    });
  });

  await new Promise<void>(function (resolve, reject) {
    form.parse(req, async (err, fields, _files) => {
      try {
        if (err) {
          reject(err);
        }

        if (!session.user?.id) {
          throw new Error("User not found.");
        }

        console.log("fields:");
        console.dir(fields);

        const { title, description, price, stock, shippingTime, categories } =
          fields;

        const previewImageIdentificator: {
          name: string;
          size: number;
        } = JSON.parse(fields.previewImageIdentificator as string);

        if (previewImageIdentificator.name.length === 0) {
          throw new Error("Preview image is required");
        }

        const previewImage = files.find(
          (f) =>
            f.originalFilename === previewImageIdentificator.name &&
            f.size === previewImageIdentificator.size
        );

        if (!previewImage) {
          throw new Error("Could not find preview image.");
        }

        console.log(previewImage.originalFilename);

        if (title === "") {
          throw new Error("Title is required field.");
        }

        if (description === "") {
          throw new Error("Description is required field.");
        }

        await saveFiles({
          categories: categories as Category[],
          description: description as string,
          files,
          previewImage,
          price: Number(price),
          shippingTimeDays: Number(shippingTime),
          stock: Number(stock),
          title: title as string,
          userId: session.user.id,
        });
        resolve();
        return;
      } catch (e: any) {
        console.log(`sending error: ${e}`);
        res.status(400).json({
          error: e.toString(),
        });
        reject(e);
      }
    });
  });

  res.status(200).json({
    status: "ok",
  });
};

async function saveFiles({
  categories,
  description,
  files,
  previewImage,
  price,
  shippingTimeDays,
  stock,
  title,
  userId,
}: ProductWriteModel) {
  const fileUploadPromises: Promise<void>[] = [];

  for (const f of files) {
    fileUploadPromises.push(uploadFromMemory(f));
  }

  await Promise.all(fileUploadPromises);

  const created = await db
    .insert(product)
    .values({
      title,
      description,
      images: files.map((f) => `${IMAGE_URL_PREFIX}/${f.newFilename}`),
      boughtCount: 0n,
      previewImageUrl: `${IMAGE_URL_PREFIX}/${previewImage.newFilename}`,
      price,
      stock,
      dealType: "NONE",
      views: 0n,
      rating: 5,
      shippingTime: shippingTimeDays,
      categories,
      userId,
    })
    .returning({ id: product.id });

  console.log(`Created product with id ${created[0]?.id}`);
}

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// The ID of your GCS bucket
const bucketName = process.env.GCLOUD_BUCKET_NAME || "";

// Creates a client
const storage = new Storage();

async function uploadFromMemory(file: formidable.File) {
  const fileContent = readFileSync(file.filepath);
  const gCloudFile = storage.bucket(bucketName).file(file.newFilename);
  await gCloudFile.save(fileContent);
  // await gCloudFile.setMetadata({ contentType: file.mimetype });
}

export default a;
