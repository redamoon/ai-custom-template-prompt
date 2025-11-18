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

  fs.mkdirSync(path.dirname(dest), { recursive: true });

  if (!fs.existsSync(src)) {
    console.log(`(テンプレートなし) Skip: ${def.from}`);
    return;
  }

  fs.copyFileSync(src, dest);
  console.log(`✔ ${def.to}`);
}

