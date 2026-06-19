import { createWriteStream, mkdirSync, readdirSync, rmSync, cpSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { pipeline } from "stream/promises";
import { Readable } from "stream";
import AdmZip from "adm-zip";

const __dirname = dirname(fileURLToPath(import.meta.url));
const coreTag = process.argv[2] || "1.28.0";
const editorTag = process.argv[3] || "0990eb52a4e5cad56287e89e0e557f793c2f064d";

const base = join(__dirname, "h5p");
const tmp = join(base, "tmp");

async function downloadGithubRepo(repo, ref, dest) {
  const isSemver = /^\d+\.\d+/.test(ref);
  const url = isSemver
    ? `https://github.com/h5p/${repo}/archive/refs/tags/${ref}.zip`
    : `https://github.com/h5p/${repo}/archive/${ref}.zip`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${url}: ${res.status}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
}

function extractZip(zipPath, outDir) {
  const zip = new AdmZip(zipPath);
  zip.extractAllTo(outDir, true);
}

function copyExtracted(extractDir, folderPrefix, targetDir) {
  const entries = readdirSync(extractDir).filter((name) => name.startsWith(folderPrefix));
  const folder = entries[0];
  if (!folder) throw new Error(`Missing extracted folder ${folderPrefix}`);
  cpSync(join(extractDir, folder), targetDir, { recursive: true });
}

async function main() {
  mkdirSync(join(base, "core"), { recursive: true });
  mkdirSync(join(base, "editor"), { recursive: true });
  mkdirSync(join(base, "libraries"), { recursive: true });
  rmSync(tmp, { recursive: true, force: true });
  mkdirSync(tmp, { recursive: true });

  console.log(`Downloading H5P core ${coreTag}...`);
  const coreZip = join(tmp, "core.zip");
  const editorZip = join(tmp, "editor.zip");
  await downloadGithubRepo("h5p-php-library", coreTag, coreZip);
  await downloadGithubRepo("h5p-editor-php-library", editorTag, editorZip);

  rmSync(join(base, "core"), { recursive: true, force: true });
  rmSync(join(base, "editor"), { recursive: true, force: true });
  mkdirSync(join(base, "core"), { recursive: true });
  mkdirSync(join(base, "editor"), { recursive: true });

  const coreExtract = join(tmp, "core-extract");
  const editorExtract = join(tmp, "editor-extract");
  mkdirSync(coreExtract, { recursive: true });
  mkdirSync(editorExtract, { recursive: true });
  extractZip(coreZip, coreExtract);
  copyExtracted(coreExtract, "h5p-php-library-", join(base, "core"));
  extractZip(editorZip, editorExtract);
  copyExtracted(editorExtract, "h5p-editor-php-library-", join(base, "editor"));

  rmSync(tmp, { recursive: true, force: true });
  console.log("H5P core/editor ready.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
