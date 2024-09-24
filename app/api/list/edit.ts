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
    const { index, newText } = req.body;

    try {
      const list = await List.findOne({ name: email });
      if (!list) {
        return res.status(404).json({ error: "List not found" });
      }

      if (index >= 0 && index < list.items.length) {
        list.items[index] = newText;
        await list.save();
        return res.status(200).json({ success: true, message: "Item updated" });
      }

      return res.status(400).json({ error: "Invalid item index" });
    } catch {
      res.status(500).json({ error: "Server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
