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

    try {
      const user = await List.findOne({ name: email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json({ success: true, items: user.items });
    } catch{
      res.status(500).json({ error: "Server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
