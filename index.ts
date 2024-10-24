import { existsSync, mkdirSync, readdir } from "fs";
import path from "path";
import sharp from "sharp";

async function convertPngToWebp(
  quality = 80,
  inputPath: string,
  outputPath: string
) {
  return sharp(inputPath)
    .resize({
      width: 1180,
    })
    .webp({ quality: quality }) // Maximum quality
    .toFile(outputPath)
    .then(() => {
      console.log(`Converted: ${inputPath} -> ${outputPath}`);
    })
    .catch((err) => {
      console.error(`Error converting ${inputPath}:`, err);
    });
}

function getPngFilesFromFolder(folderPath: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    readdir(folderPath, (err, files) => {
      if (err) {
        return reject(err);
      }

      const pngFiles = files.filter(
        (file) => path.extname(file).toLowerCase() === ".png"
      );
      resolve(pngFiles);
    });
  });
}

async function convertAllPngFiles(folderPath: string, outputFolder: string) {
  try {
    const pngFiles = await getPngFilesFromFolder(folderPath);

    if (!existsSync(outputFolder)) {
      mkdirSync(outputFolder);
    }

    for await (const file of pngFiles) {
      const inputPath = path.join(folderPath, file);
      const outputFileName = file.replace(".png", ".webp");
      const outputPath = path.join(outputFolder, outputFileName);

      // Convert each PNG file to WebP
      await convertPngToWebp(100, inputPath, outputPath);
    }

    console.log("All files converted successfully.");
  } catch (error) {
    console.error("Error during conversion:", error);
  }
}

// Usage Example
const inputFolder = "./in";
const outputFolder = "./out";

convertAllPngFiles(inputFolder, outputFolder);
