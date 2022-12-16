import formidable from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";

//set bodyparser
export const config = {
  api: {
    bodyParser: false,
  },
};

const a = async (req: NextApiRequest, res: NextApiResponse) => {
  // const data = await new Promise((resolve, reject) => {
  console.log(req.headers);
  const form = formidable();
  const files: formidable.File[] = [];

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

  form.parse(req);
  res.assignSocket;
};

function handleFiles(files: formidable.File[]) {
  files.forEach((f) => {
    console.log(`${f.originalFilename} ${f.originalFilename}`);
  });
}

export default a;
