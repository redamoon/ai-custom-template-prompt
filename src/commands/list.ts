import { TEMPLATE_MAP } from "../core/config.js";

export default async function list() {
  console.log("利用可能なテンプレート:\n");
  for (const key of Object.keys(TEMPLATE_MAP)) {
    const def = TEMPLATE_MAP[key as keyof typeof TEMPLATE_MAP];
    console.log(`  - ${key}`);
    console.log(`    → ${def.to}\n`);
  }
}

