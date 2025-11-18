import fs from "fs";
import path from "path";
import { TEMPLATE_MAP, TemplateKey } from "./config.js";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templateRoot = path.join(__dirname, "..", "..", "templates");

export async function generate(name: TemplateKey | "all") {
  if (name === "all") {
    (Object.keys(TEMPLATE_MAP) as TemplateKey[]).forEach((key) => {
      copy(TEMPLATE_MAP[key]);
    });
  } else {
    copy(TEMPLATE_MAP[name]);
  }
}

function copy(def: { from: string; to: string }) {
  const src = path.join(templateRoot, def.from);
  const dest = path.join(process.cwd(), def.to);

  if (!fs.existsSync(src)) {
    console.log(`(テンプレートなし) Skip: ${def.from}`);
    return;
  }

  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    // ディレクトリの場合は再帰的にコピー
    fs.mkdirSync(dest, { recursive: true });
    copyDirectory(src, dest);
    console.log(`✔ ${def.to}/`);
  } else {
    // ファイルの場合は通常通りコピー
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    console.log(`✔ ${def.to}`);
  }
}

function copyDirectory(src: string, dest: string) {
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

