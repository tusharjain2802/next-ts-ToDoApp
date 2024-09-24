import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/dbConnect";
import List from "@/models/List";

function decryptData(ciphertext: string) {
  return atob(ciphertext); // decode base64
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === "POST") {
    const email = decryptData(req.body.email);
    const data = req.body.data;

    try {
      const user = await List.findOne({ name: email });
      if (!user) {
        const newList = new List({ name: email, items: [data] });
        await newList.save();
        return res.status(200).json({ success: true, message: "List created and data saved" });
      }

      await List.findOneAndUpdate(
        { name: email },
        { $push: { items: data } },
        { new: true }
      );
      res.status(200).json({ success: true, message: "Data added" });
    } catch {
      res.status(500).json({ error: "Server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
