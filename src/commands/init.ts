import { outro, cancel, confirm, isCancel } from "@clack/prompts";
import { getTemplatesByCategory, TemplateKey } from "../core/config.js";
import { generate } from "../core/generator.js";

const ASCII_BANNER = `
\x1b[36m
   █████╗ ██╗    ████████╗███████╗███╗   ███╗██████╗ ██╗     
  ██╔══██╗██║    ╚══██╔══╝██╔════╝████╗ ████║██╔══██╗██║     
  ███████║██║       ██║   █████╗  ██╔████╔██║██████╔╝██║     
  ██╔══██║██║       ██║   ██╔══╝  ██║╚██╔╝██║██╔═══╝ ██║     
  ██║  ██║██║       ██║   ███████╗██║ ╚═╝ ██║██║     ███████╗
  ╚═╝  ╚═╝╚═╝       ╚═╝   ╚══════╝╚═╝     ╚═╝╚═╝     ╚══════╝
\x1b[0m
  \x1b[90m┌─────────────────────────────────────────────────────────┐
  │  AI Custom Template Prompt - Cursor Rules & Agents CLI  │
  └─────────────────────────────────────────────────────────┘\x1b[0m
`;

export default async function init(dryRun = false) {
  console.log(ASCII_BANNER);

  try {
    // すべてインストールするか確認
    const installAll = await confirm({
      message: "すべてのテンプレート（rules, commands, agents）を一括でインストールしますか？",
    });

    if (isCancel(installAll)) {
      cancel("キャンセルされました");
      return;
    }

    if (installAll) {
      await generate("all", dryRun);
      if (dryRun) {
        outro("Dry run完了しました！");
      } else {
        outro("完了しました！");
      }
      return;
    }

    // 個別選択モード
    console.log("\n📋 個別選択モード\n");

    const templates = getTemplatesByCategory();
    const selectedTemplates: TemplateKey[] = [];

    // カテゴリごとにテンプレートを確認
    for (const category of templates) {
      console.log(`\n--- ${category.name} ---\n`);

      for (const template of category.items) {
        const install = await confirm({
          message: `[${category.name}] ${template.label} をインストールしますか？`,
          initialValue: false,
        });

        if (isCancel(install)) {
          cancel("キャンセルされました");
          return;
        }

        if (install) {
          selectedTemplates.push(template.value);
        }
      }
    }

    // 選択されていない場合の処理
    if (selectedTemplates.length === 0) {
      cancel("テンプレートが選択されませんでした");
      return;
    }

    // 選択されたテンプレートを表示
    console.log(`\n📦 選択されたテンプレート (${selectedTemplates.length}個):`);
    selectedTemplates.forEach((template, index) => {
      console.log(`  ${index + 1}. ${String(template)}`);
    });
    console.log("");

    // 選択されたテンプレートを処理
    for (const template of selectedTemplates) {
      console.log(`\n🔧 処理中: ${template}`);
      await generate(template, dryRun);
    }

    if (dryRun) {
      outro("Dry run完了しました！");
    } else {
      outro("完了しました！");
    }
  } catch (error) {
    // Ctrl+Cなどでキャンセルされた場合
    if (error && typeof error === "object" && "message" in error) {
      const err = error as { message?: string };
      if (err.message === "User force closed the prompt with 0x03") {
        cancel("キャンセルされました");
        return;
      }
    }
    throw error;
  }
}

