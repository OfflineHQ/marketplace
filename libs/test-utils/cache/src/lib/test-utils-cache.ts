import { kv } from '@vercel/kv';
import * as fs from 'fs';
import * as path from 'path';

async function readAndParseJson(directoryPath: string, file: string) {
  const data = await fs.promises.readFile(
    path.join(directoryPath, file),
    'utf8'
  );
  return JSON.parse(data);
}

async function processFiles(
  directoryPath: string,
  fileProcessor: (directoryPath: string, file: string) => Promise<void>
) {
  const files = await fs.promises.readdir(directoryPath);
  const jsonFiles = files.filter((file) => path.extname(file) === '.json');
  await Promise.all(
    jsonFiles.map((file) => fileProcessor(directoryPath, file))
  );
}

export async function readFileAndSeed(directoryPath: string, file: string) {
  const jsonObj = await readAndParseJson(directoryPath, file);
  kv.mset(jsonObj);
}

export async function readFileAndDelete(directoryPath: string, file: string) {
  const jsonObj = await readAndParseJson(directoryPath, file);
  const multi = kv.multi();
  for (const key in jsonObj) {
    multi.del(key);
  }
  multi.exec();
}

export default async function init() {
  const directoryPath = path.join(__dirname, './../../seeds/');
  await processFiles(directoryPath, readFileAndSeed);
}

export async function readDirectoryAndDelete(directoryPath: string) {
  await processFiles(directoryPath, readFileAndDelete);
}

export async function batchDelete(key: string) {
  try {
    await kv.del(key);
  } catch (error) {
    throw new Error(
      `Error during batch create of redis data : ${
        error instanceof Error ? error.message : error
      }`
    );
  }
}
