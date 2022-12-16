import type { Category } from "@prisma/client";
import formidable from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db/client";

//set bodyparser
export const config = {
  api: {
    bodyParser: false,
  },
};

const a = async (req: NextApiRequest, res: NextApiResponse) => {
  const files: formidable.File[] = [];
  const form = formidable({
    uploadDir: "./public/images",
  });

  form.on("file", (field, file) => {
    files.push(file);
  });

  form.once("end", () => {
    files.forEach((file) => {
      console.log(`${file.originalFilename} ${file.mimetype}`);
      res.status(200).json({
        status: "ok",
      });
    });
  });

  form.once("error", (err) => {
    console.log(err);
    res.status(400).json({
      error: "Could not process files.",
    });
  });

  form.parse(req, async (err, field, _files) => {
    const { title, description } = field;
    if (title === "" || description === "") {
      throw new Error("Title and description are required fields.");
    }
    saveFiles(title, description, files);
  });
  res.assignSocket;
};

function saveFiles(
  title: string,
  description: string,
  files: formidable.File[],
  previewImage: formidable.File,
  price: number,
  stock: number,
  shippingTimeDays: number,
  categories: Category[],
  userId: string
) {
  prisma.product.create({
    data: {
      title,
      description,
      images: files.map((f) => f.filepath),
      boughtCount: 0,
      previewImageUrl: previewImage.filepath,
      price,
      stock,
      dealType: "NONE",
      views: 0,
      rating: 5,
      shippingTime: shippingTimeDays,
      categories,
      userId,
    },
  });
}

export default a;
