import { generate } from "../core/generator.js";
import { TEMPLATE_MAP, TemplateKey } from "../core/config.js";

export default async function add(args: string[]) {
  const key = args[0] as TemplateKey;

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

  await generate(key);
  console.log(`✔ added: ${key}`);
}

