import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { fileTypeFromBuffer } from 'file-type';

const __filename = fileURLToPath(import.meta.url);
const _dirname = dirname(__filename);

const UPLOADS_DIR = path.join(_dirname, 'upload');

const PATTERNS = [
  "/JavaScript", "/JS", "/AA", "/OpenAction", "/Launch", "/EmbeddedFile",
  "<?php", "<?= ", "eval(", "shell_exec(", "system(", "exec(", "passthru(", "assert(", "base64_decode(", "preg_replace(", "include", "require"
];

function extractJavaScript(content) {
  const jsMatches = [];
  const regex = /\/JS\s*\(([^)]{1,500})\)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    jsMatches.push(match[1]);
  }
  return jsMatches;
}

function extractPHP(content) {
  const phpMatches = [];
  const phpOpenTag = /<\?(php|=)([\s\S]{1,1000}?)\?>/g;
  let match;
  while ((match = phpOpenTag.exec(content)) !== null) {
    phpMatches.push(`<?${match[1]}${match[2]}?>`);
  }
  return phpMatches;
}

async function scanFile(filePath) {
  const buffer = fs.readFileSync(filePath);
  const type = await fileTypeFromBuffer(buffer);
  const mime = type?.mime || "unknown";
  const isPDF = mime === "application/pdf";

  const content = buffer.toString("latin1");
  const suspicious = PATTERNS.filter(p => content.includes(p));
  const jsPayloads = extractJavaScript(content);
  const phpPayloads = extractPHP(content);

  return {
    file: filePath,
    mime,
    isPDF,
    suspicious: suspicious.length > 0,
    found: suspicious,
    jsCode: jsPayloads.length > 0 ? jsPayloads : null,
    phpCode: phpPayloads.length > 0 ? phpPayloads : null
  };
}

async function scanFolder() {
  const files = fs.readdirSync(UPLOADS_DIR);
  for (const file of files) {
    const fullPath = path.join(UPLOADS_DIR, file);
    if (fs.statSync(fullPath).isFile()) {
      const result = await scanFile(fullPath);
      console.log(result);
    }
  }
}

scanFolder();
