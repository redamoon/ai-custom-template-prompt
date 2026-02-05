import { outro, cancel, confirm, isCancel, multiselect, select } from "@clack/prompts";
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
    // インストールモードを選択
    const mode = await select({
      message: "インストールモードを選択してください",
      options: [
        { value: "all", label: "🚀 すべて一括インストール", hint: "rules, commands, skills, agents" },
        { value: "category", label: "📁 カテゴリ単位で選択", hint: "Rules, Commands, Skills, Agents から選択" },
        { value: "individual", label: "📋 個別に選択", hint: "テンプレートを1つずつ選択" },
      ],
    });

    if (isCancel(mode)) {
      cancel("キャンセルされました");
      return;
    }

    if (mode === "all") {
      await generate("all", dryRun);
      if (dryRun) {
        outro("Dry run完了しました！");
      } else {
        outro("完了しました！");
      }
      return;
    }

    const templates = getTemplatesByCategory();

    if (mode === "category") {
      // カテゴリ単位で選択
      const selectedCategories = await multiselect({
        message: "インストールするカテゴリを選択してください（スペースで選択、Enterで確定）",
        options: templates.map((cat) => ({
          value: cat.name,
          label: `${getCategoryIcon(cat.name)} ${cat.name}`,
          hint: `${cat.items.length}個のテンプレート`,
        })),
        required: true,
      });

      if (isCancel(selectedCategories)) {
        cancel("キャンセルされました");
        return;
      }

      const selectedTemplates: TemplateKey[] = [];
      for (const category of templates) {
        if ((selectedCategories as string[]).includes(category.name)) {
          selectedTemplates.push(...category.items.map((item) => item.value));
        }
      }

      await processTemplates(selectedTemplates, dryRun);
      return;
    }

    // 個別選択モード
    const selectedTemplates: TemplateKey[] = [];

    for (const category of templates) {
      const categoryTemplates = await multiselect({
        message: `${getCategoryIcon(category.name)} ${category.name} からインストールするテンプレートを選択`,
        options: category.items.map((item) => ({
          value: item.value,
          label: item.label,
        })),
        required: false,
      });

      if (isCancel(categoryTemplates)) {
        cancel("キャンセルされました");
        return;
      }

      selectedTemplates.push(...(categoryTemplates as TemplateKey[]));
    }

    if (selectedTemplates.length === 0) {
      cancel("テンプレートが選択されませんでした");
      return;
    }

    await processTemplates(selectedTemplates, dryRun);
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

function getCategoryIcon(name: string): string {
  const icons: Record<string, string> = {
    Rules: "📏",
    Commands: "⚡",
    Skills: "🎯",
    Agents: "🤖",
  };
  return icons[name] || "📦";
}

async function processTemplates(selectedTemplates: TemplateKey[], dryRun: boolean) {
  // 選択されたテンプレートを表示
  console.log(`\n📦 選択されたテンプレート (${selectedTemplates.length}個):`);
  selectedTemplates.forEach((template, index) => {
    console.log(`  ${index + 1}. ${String(template)}`);
  });
  console.log("");

  // 選択されたテンプレートを処理
  for (const template of selectedTemplates) {
    await generate(template, dryRun);
  }

  if (dryRun) {
    outro("Dry run完了しました！");
  } else {
    outro("完了しました！");
  }
}

