import { select, isCancel, cancel, outro } from "@clack/prompts";
import { generate } from "../core/generator.js";
import { TEMPLATE_MAP, TemplateKey, getTemplatesByCategory } from "../core/config.js";

export default async function add(args: string[]) {
  const dryRun = args.includes("--dry-run");
  const filteredArgs = args.filter((arg) => arg !== "--dry-run");
  let key = filteredArgs[0] as TemplateKey;

  // 引数がない場合は対話式で選択
  if (!key) {
    const templates = getTemplatesByCategory();
    const allOptions: Array<{ value: string; label: string; hint?: string }> = [];

    for (const category of templates) {
      for (const item of category.items) {
        allOptions.push({
          value: item.value,
          label: item.label,
          hint: category.name,
        });
      }
    }

    const selected = await select({
      message: "追加するテンプレートを選択してください",
      options: allOptions,
    });

    if (isCancel(selected)) {
      cancel("キャンセルされました");
      return;
    }

    key = selected as TemplateKey;
  }

  if (!TEMPLATE_MAP[key]) {
    console.error(`Error: 不明なテンプレート '${key}'`);
    console.error("使用可能なテンプレート:", Object.keys(TEMPLATE_MAP).join(", "));
    return;
  }

  await generate(key, dryRun);
  if (!dryRun) {
    outro(`✔ added: ${key}`);
  }
}

