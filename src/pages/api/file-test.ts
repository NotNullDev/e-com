import type { Category } from "@prisma/client";
import formidable from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { prisma } from "../../server/db/client";

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

const a = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res });

  if (!session?.user) {
    res.status(401).json({
      error: "Unauthorized",
    });
    return;
  }

  const files: formidable.File[] = [];
  const form = formidable({
    uploadDir: "./public/images",
  });

  form.on("file", (field, file) => {
    files.push(file);
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

  form.parse(req, async (err, fields, _files) => {
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

    if (title === "" || description === "") {
      throw new Error("Title and description are required fields.");
    }

    saveFiles({
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
  const created = await prisma.product.create({
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

  console.log(`Created product with id ${created.id}`);
}

export default a;
