import axios from "axios";
import Receipt from "../models/Receipt.js";
import fs from "fs";

export const uploadReceipt = async (req, res) => {
  try {
    const filePath = req.file.path;

    const imageFile = fs.readFileSync(filePath, { encoding: "base64" });

    const response = await axios.post(
      "https://api.ocr.space/parse/image",
      {},
      {
        params: {
          language: "eng",
          isOverlayRequired: false,
          base64Image: `data:image/png;base64,${imageFile}`,
          apikey: process.env.OCR_SPACE_KEY,
        },
      }
    );

    const result = response.data.ParsedResults[0].ParsedText;

    const receipt = await Receipt.create({
      fileName: req.file.filename,
      ocrText: result,
      totalAmount: extractAmount(result),
      items: extractItems(result),
    });

    res.json({ success: true, receipt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "OCR Failed" });
  }
};

function extractAmount(text) {
  const match = text.match(/[0-9]+\.[0-9]+/);
  return match ? Number(match[0]) : 0;
}

function extractItems(text) {
  return text.split("\n").filter((line) => line.length > 2);
}
