import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { Fields, Files } from "formidable"; 

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method Not Allowed" });

  const form = formidable({
    multiples: false,
    uploadDir: "./public/uploads",
    keepExtensions: true,
  });

  form.parse(req, (err: string, fields: Fields, files: Files) => {
    if (err) return res.status(500).json({ message: "File upload error", error: err });

    // ✅ Safely get single file
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const filePath = `/uploads/${file.newFilename}`;
    return res.status(200).json({ path: filePath });
  });
}
