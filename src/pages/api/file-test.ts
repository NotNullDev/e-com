import IncomingForm from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";

type ProductData = {
  title: string;
  description: string;
  files: Uint8Array[][];
};

const i = 0;

export default async function TestFile(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const form = IncomingForm();

  console.log("hello!");
  form.parse(req, (err, fields, files) => {
    if (err) console.log(err);

    console.log("files: ", files);
    console.log("fields: ", fields);
  });

  return res.json({});
}

export const config = {
  api: {
    bodyParser: {
      bodyParser: false,
    },
  },
};
