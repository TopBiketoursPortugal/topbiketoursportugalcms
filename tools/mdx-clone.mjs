import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  copyFileSync
} from 'fs';
import { join, dirname, basename } from 'path';
import { v7 as uuidv7 } from 'uuid'; // For generating GUIDs
import simpleGit from 'simple-git'; // For Git operations

// Initialize simple-git
const git = simpleGit();

// Function to get newly added .mdx files
async function getNewMdxFiles() {
  const status = await git.status();
  const newFiles = status.created.filter(
    (file) =>
      file.endsWith('.mdx') &&
      !file.includes('/pt/') &&
      !file.includes('\\pt\\')
  );
  return newFiles;
}

/**
 * Turn a verbatim copy of an English entry into an unpublished Portuguese
 * stub. Three edits, each load-bearing:
 *
 *   id       a fresh one, or the copy collides with the entry it came from
 *   language `pt`, or the copy resolves to its original's URL — routes.mjs
 *            trusts frontmatter over the folder, so a stub left at `en` fails
 *            the build with a duplicate-url error
 *   draft    keeps it out of the collections until someone translates it
 *            (src/schemas/published-glob.ts)
 *
 * `path` is deliberately left alone: the `/pt/` prefix already makes the URL
 * unique, and the English slug is the right placeholder until a translator
 * picks a Portuguese one.
 */
function prepareStub(file) {
  const content = readFileSync(file, 'utf8');
  const newGuid = uuidv7();

  let updated = content.replace(
    /(id: ['"]?)[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}(['"]?)/gis,
    `$1${newGuid}$2`
  );
  updated = updated.replace(/^language:.*$/m, 'language: pt');
  if (!/^draft:/m.test(updated)) {
    updated = updated.replace(/^---\r?\n/, '---\ndraft: true\n');
  }

  writeFileSync(file, updated, 'utf8');
  console.log(`Prepared Portuguese stub: ${file}`);
}

// Function to create a clone of the file in the /pt subfolder
async function cloneFileToPt(file) {
  const fileDir = dirname(file); // Get the directory of the original file
  const fileName = basename(file); // Get the filename (e.g., teste1.mdx)
  const ptDir = join(fileDir, 'pt'); // Create the /pt subfolder path
  const ptFilePath = join(ptDir, fileName); // Define the path for the cloned file

  // Check if the file already exists in the Git status
  const status = await git.status();
  const allFiles = [
    ...status.not_added,
    ...status.created,
    ...status.modified,
    ...status.staged
  ];

  if (allFiles.includes(ptFilePath)) {
    console.warn(`File already tracked in Git: ${ptFilePath}. Skipping clone.`);
    return;
  }

  // Create the /pt subfolder if it doesn't exist
  if (!existsSync(ptDir)) {
    mkdirSync(ptDir, { recursive: true });
  }

  // Copy the file to the /pt subfolder
  copyFileSync(file, ptFilePath);
  console.log(`Cloned: ${ptFilePath}`);
  return ptFilePath;
}

// Main function
async function main() {
  try {
    const newMdxFiles = await getNewMdxFiles();

    if (newMdxFiles.length === 0) {
      console.log('No new .mdx files added. Skipping clone process.');
      return;
    }

    for (const file of newMdxFiles) {
      if (existsSync(file)) {
        // Clone the file to the /pt subfolder
        const ptFilePath = await cloneFileToPt(file);

        if (existsSync(ptFilePath)) {
          prepareStub(ptFilePath);

          // Stage it, so the stub lands in the same commit as its original.
          await git.add(ptFilePath);
        } else {
          console.warn(`File PT does not exist: ${ptFilePath}`);
        }
      } else {
        console.warn(`File does not exist: ${file}`);
      }
    }

    console.log('Pre-commit hook completed successfully.');
  } catch (error) {
    console.error('Error in pre-commit hook:', error);
    process.exit(1); // Exit with a non-zero code to prevent the commit
  }
}

// Run the script
main();
