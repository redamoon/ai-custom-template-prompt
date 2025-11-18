import { intro, select, outro } from "@clack/prompts";
import { getOptions } from "../core/config.js";
import { generate } from "../core/generator.js";
import { TemplateKey } from "../core/config.js";

export default async function init() {
  intro("ai-custom-template-prompt Setup");

  const opts = [
    { value: "all", label: "すべて入れる" },
    ...getOptions(),
  ];

  const tool = await select({
    message: "セットアップするテンプレートを選択:",
    options: opts,
  });

  if (typeof tool === "symbol") {
    outro("キャンセルされました");
    return;
  }

  await generate(tool as TemplateKey | "all");

  outro("完了しました！");
}

