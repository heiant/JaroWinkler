const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse"); //
const mammoth = require("mammoth");

async function extractTextFromPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);
  return data.text;
}

async function extractTextFromWord(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const result = await mammoth.extractRawText({ buffer: dataBuffer });
  return result.value;
}

async function extractTextFromFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".pdf") {
    return await extractTextFromPDF(filePath);
  } else if (ext === ".doc" || ext === ".docx") {
    return await extractTextFromWord(filePath);
  } else {
    throw new Error("Unsupported file type");
  }
}

module.exports = {
  extractTextFromFile,
};
