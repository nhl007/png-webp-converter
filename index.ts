import { existsSync, mkdirSync, readdir } from "fs";
import path from "path";
import sharp from "sharp";
import { argv } from "node:process";

async function convertPngToWebp(
  quality = 80,
  inputPath: string,
  outputPath: string
) {
  return (
    sharp(inputPath)
      // .resize({
      //   width: 1180,
      // })
      .webp({ quality: quality })
      .toFile(outputPath)
      .then(() => {
        console.log(`Converted: ${inputPath} -> ${outputPath}`);
      })
      .catch((err) => {
        console.error(`Error converting ${inputPath}:`, err);
      })
  );
}

function getPngFilesFromFolder(folderPath: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    readdir(folderPath, (err, files) => {
      if (err) {
        return reject(err);
      }

      const pngFiles = files.filter(
        (file) =>
          path.extname(file).toLowerCase() === ".png" ||
          path.extname(file).toLowerCase() === ".jpeg"
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
      let outputFileName = "";

      file.includes(".jpeg")
        ? (outputFileName = file.replace(".jpeg", ".webp"))
        : (outputFileName = file.replace(".png", ".webp"));
      const outputPath = path.join(outputFolder, outputFileName);

      await convertPngToWebp(100, inputPath, outputPath);
    }

    console.log("All files converted successfully.");
  } catch (error) {
    console.error("Error during conversion:", error);
  }
}

if (argv.length < 3) {
  console.error("Input Folder Missing!");
  process.exit(1);
}

const inputFolder = argv[2];
const outputFolder = argv[3] ? argv[3] : "./out";

console.log("Input Folder: ", inputFolder, "\n Output Folder: ", outputFolder);

convertAllPngFiles(inputFolder, outputFolder);
