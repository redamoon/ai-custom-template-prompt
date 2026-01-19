import { generate } from "../core/generator.js";
import { TEMPLATE_MAP, TemplateKey } from "../core/config.js";

export default async function add(args: string[]) {
  const dryRun = args.includes("--dry-run");
  const filteredArgs = args.filter((arg) => arg !== "--dry-run");
  const key = filteredArgs[0] as TemplateKey;

  if (!key) {
    console.error("Error: テンプレート名を指定してください");
    console.error("使用可能なテンプレート:", Object.keys(TEMPLATE_MAP).join(", "));
    return;
  }

  if (!TEMPLATE_MAP[key]) {
    console.error(`Error: 不明なテンプレート '${key}'`);
    console.error("使用可能なテンプレート:", Object.keys(TEMPLATE_MAP).join(", "));
    return;
  }

  await generate(key, dryRun);
  if (!dryRun) {
    console.log(`✔ added: ${key}`);
  }
}

