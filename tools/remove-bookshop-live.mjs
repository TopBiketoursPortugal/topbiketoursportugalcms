import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, '../src');

async function main() {
  async function walk(dir) {
    let results = [];
    const list = await fs.readdir(dir);
    for (const file of list) {
      const filePath = path.join(dir, file);
      const stat = await fs.stat(filePath);
      if (stat && stat.isDirectory()) {
        results = results.concat(await walk(filePath));
      } else if (filePath.endsWith('.astro') || filePath.endsWith('.ts')) {
        results.push(filePath);
      }
    }
    return results;
  }

  const files = await walk(srcDir);
  let count = 0;
  for (const file of files) {
    const content = await fs.readFile(file, 'utf8');
    if (content.includes('bookshop:live')) {
      const newContent = content.replace(/bookshop:live\s*/g, '');
      await fs.writeFile(file, newContent);
      console.log('Updated', file);
      count++;
    }
  }
  console.log(`Updated ${count} files.`);
}

main().catch(console.error);
