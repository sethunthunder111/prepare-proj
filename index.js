#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const { performance } = require("perf_hooks"); // For timing

// --- Configuration ---
const EXCLUDED_DIRS = [
  "node_modules",
  ".git",
  "dist",
  "build",
  "out",
  ".next",
  ".nuxt",
  ".venv", // Keep previous suggestions
];
const EXCLUDED_FILES = [".env", "*.zip"]; // Exclude zips more broadly

// --- Argument Parsing ---
// ... (keep the yargs part from the previous optional argument version) ...
const argv = yargs(hideBin(process.argv))
  .command(
    "$0 [folder]",
    "Zips the contents of a folder (defaults to current directory), excluding specified items.",
    (yargs) => {
      yargs.positional("folder", {
        describe:
          "Optional path to the folder to zip. If omitted, uses the current directory.",
        type: "string",
      });
    }
  )
  .alias("h", "help")
  .help().argv;

// --- Main Logic ---
async function createZipArchive(targetFolderInput) {
  const startTime = performance.now(); // Start timing
  console.log("Starting process...");

  const sourceFolder = targetFolderInput || process.cwd();
//   console.log(
//     `Target: ${
//       targetFolderInput ? `'${targetFolderInput}'` : "Current Directory"
//     }`
//   );

  const sourceFullPath = path.resolve(sourceFolder);
  try {
    const stats = await fs.promises.stat(sourceFullPath);
    if (!stats.isDirectory()) {
      const targetDesc = targetFolderInput
        ? `'${sourceFolder}'`
        : "Current working directory";
      console.error(`Error: ${targetDesc} is not a directory.`);
      process.exit(1);
    }
  } catch (err) {
    // ... (error handling as before) ...
    process.exit(1);
  }

  const baseFolderName = path.basename(sourceFullPath);
  const outputFileName = `${baseFolderName}.zip`;
  const outputFullPath = path.resolve(process.cwd(), outputFileName);

  // --- Self-Exclusion Check ---
  // Ensure we don't try to zip the output file if it's inside the source folder
  let effectiveExclusions = [
    ...EXCLUDED_DIRS.map((dir) => `${dir}/**`),
    ...EXCLUDED_DIRS.map((dir) => `${dir}`),
    ...EXCLUDED_FILES,
  ];
  if (path.dirname(outputFullPath) === sourceFullPath) {
    effectiveExclusions.push(outputFileName);
  }
  // --- End Self-Exclusion Check ---


  const output = fs.createWriteStream(outputFullPath);
  const archive = archiver("zip", {
    zlib: { level: 9 },
  });

  let fileCount = 0;
  let lastLoggedPath = "";

  // --- Event Listeners ---
  output.on("close", function () {
    const endTime = performance.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    console.log("--------------------------------------------------");
    console.log(`✅ Success! Archive created: ${outputFileName}`);
    console.log(`   Total files processed: ${fileCount}`);
    console.log(
      `   Final size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`
    );
    console.log(`   Duration: ${duration} seconds`);
    console.log("--------------------------------------------------");
  });

  archive.on("warning", function (err) {
    console.warn("Archiver Warning:", err); // Log warnings more prominently
  });

  archive.on("error", function (err) {
    console.error("Archiver Error:", err);
    fs.unlink(outputFullPath, () => {});
    process.exit(1);
  });

  // Log entry data - THIS CAN BE VERY VERBOSE
  // archive.on('entry', function(entryData) {
  //     if (entryData && entryData.name) {
  //         fileCount++;
  //         lastLoggedPath = entryData.name; // Store the last path attempted
  //         // Only log every N files to avoid flooding console
  //         if (fileCount % 200 === 0) {
  //             console.log(`   ... processing file #${fileCount}: ${entryData.name}`);
  //         }
  //     }
  // });

  archive.pipe(output);

  try {
    // Using glob directly
    archive.glob("**/*", {
      cwd: sourceFullPath,
      ignore: effectiveExclusions, // Use the potentially updated list
      dot: true,
      // follow: false, // Explicitly disable following symlinks (usually default)
    });
  } catch (globError) {
    console.error("Error during glob operation:", globError);
    process.exit(1);
  }

  console.log("Finalizing archive (writing data)...");
  try {
    await archive.finalize();
  } catch (finalizeError) {
    console.error("Error during archive finalization:", finalizeError);
    // Log the last path processed before the error, might give a clue
    console.error(
      "Last path processed before finalize error (approx):",
      lastLoggedPath
    );
    fs.unlink(outputFullPath, () => {}); // Attempt cleanup
    process.exit(1);
  }
}

// --- Run ---
createZipArchive(argv.folder).catch((err) => {
  console.error("An unexpected error occurred outside the main function:", err);
  process.exit(1);
});
