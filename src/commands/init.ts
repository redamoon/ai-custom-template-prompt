import { intro, outro, cancel } from "@clack/prompts";
import { checkbox } from "@inquirer/prompts";
import { getOptions, getAvailableRules } from "../core/config.js";
import { generate } from "../core/generator.js";
import { TemplateKey } from "../core/config.js";

export default async function init(dryRun = false) {
  intro("ai-custom-template-prompt Setup");

  const opts = [
    { name: "すべて入れる", value: "all" },
    { name: "ルールを選択", value: "rules" },
    ...getOptions().map((opt) => ({
      name: opt.label,
      value: opt.value,
    })),
  ].map((opt) => ({
    name: opt.name,
    value: opt.value,
  }));

  try {
    // メインのテンプレート選択
    const selectedValues = await checkbox({
      message: "セットアップするテンプレートを選択（スペースキーで選択/解除、Enterで確定）:",
      choices: opts,
    });

    // キャンセルされた場合（Ctrl+Cなど）
    if (!selectedValues || selectedValues.length === 0) {
      cancel("テンプレートが選択されませんでした");
      return;
    }

    // 「すべて入れる」が選択された場合は、それだけを実行して終了
    if (selectedValues.includes("all")) {
      await generate("all", dryRun);
      if (dryRun) {
        outro("Dry run完了しました！");
      } else {
        outro("完了しました！");
      }
      return;
    }

    // 選択されたテンプレートを処理
    const selectedTemplates: (TemplateKey | "rules")[] = selectedValues.filter(
      (v): v is TemplateKey | "rules" => v !== "all"
    );

    // 「ルールを選択」が含まれている場合の処理
    let finalTemplates: TemplateKey[] = [];
    const hasRules = selectedTemplates.includes("rules");

    if (hasRules) {
      const availableRules = getAvailableRules();

      if (availableRules.length === 0) {
        console.log("⚠️  利用可能なルールファイルが見つかりませんでした。");
        // rulesを除外して続行
        finalTemplates = selectedTemplates.filter(
          (t): t is TemplateKey => t !== "rules"
        );
      } else {
        // ルール選択のcheckbox
        const ruleChoices = availableRules.map((rule) => ({
          name: rule.label,
          value: rule.value,
        }));
        const selectedRules = await checkbox<TemplateKey>({
          message: "追加するルールを選択（スペースキーで選択/解除、Enterで確定）:",
          choices: ruleChoices,
        });

        // rules以外のテンプレートと選択されたルールを結合
        finalTemplates = [
          ...selectedTemplates.filter((t): t is TemplateKey => t !== "rules"),
          ...(selectedRules || []),
        ];
      }
    } else {
      finalTemplates = selectedTemplates.filter(
        (t): t is TemplateKey => t !== "rules"
      );
    }

    // 選択されていない場合の処理
    if (finalTemplates.length === 0) {
      cancel("実行するテンプレートがありませんでした");
      return;
    }

    // 選択されたテンプレートを表示
    console.log(`\n📦 選択されたテンプレート (${finalTemplates.length}個):`);
    finalTemplates.forEach((template, index) => {
      console.log(`  ${index + 1}. ${String(template)}`);
    });
    console.log("");

    // 選択されたテンプレートを処理
    for (const tool of finalTemplates) {
      console.log(`\n🔧 処理中: ${tool}`);
      await generate(tool, dryRun);
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

