import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/dbConnect";
import List from "@/models/List";

function decryptData(ciphertext: string) {
  return atob(ciphertext);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === "POST") {
    const email = decryptData(req.body.email);
    const { index } = req.body;

    try {
      const list = await List.findOne({ name: email });
      if (!list) {
        return res.status(404).json({ error: "List not found" });
      }

      list.items.splice(index, 1);
      await list.save();
      res.status(200).json({ success: true, message: "Item deleted" });
    } catch {
      res.status(500).json({ error: "Server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
