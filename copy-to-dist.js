const fs = require("fs").promises;
const path = require("path");

/**
 * Recursively copy all files from srcDir to destDir
 * @param {string} srcDir
 * @param {string} destDir
 */
async function copyAllFiles(srcDir, destDir) {
  const entries = await fs.readdir(srcDir, { withFileTypes: true });
  await fs.mkdir(destDir, { recursive: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      await copyAllFiles(srcPath, destPath);
    } else if (entry.isFile()) {
      await fs.copyFile(srcPath, destPath);
      // console.log(`Copied: ${srcPath} -> ${destPath}`);
    }
  }
}

/**
 * Recursively delete a folder
 * @param {string} dir
 */
async function deleteFolder(dir) {
  try {
    await fs.rm(dir, { recursive: true, force: true });
    // console.log(`Deleted: ${dir}`);
  } catch (err) {
    console.error(`Error deleting ${dir}: ${err.message}`);
  }
}

// Main logic
(async () => {
  const sourceDir = "./out";
  const destinationDir = "./dist";

  // Step 1: Delete destination directory before copying
  await deleteFolder(destinationDir);

  // Step 2: Copy files from source to destination
  await copyAllFiles(sourceDir, destinationDir);

  // Step 3: Delete source directory in background
  deleteFolder(sourceDir); // Runs without await
})();
