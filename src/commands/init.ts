import { intro, outro, select, confirm, isCancel, cancel } from "@clack/prompts";
import { getOptions, getAvailableRules } from "../core/config.js";
import { generate } from "../core/generator.js";
import { TemplateKey } from "../core/config.js";

export default async function init(dryRun = false) {
  intro("ai-custom-template-prompt Setup");

  const opts = [
    { value: "all", label: "すべて入れる" },
    { value: "rules", label: "ルールを選択" },
    ...getOptions(),
  ];

  const selectedTemplates: (TemplateKey | "all" | "rules")[] = [];

  // 複数選択のループ
  while (true) {
    // 選択済みの項目をチェックマーク付きで表示
    const remainingOpts = opts
      .filter((opt) => {
        if (opt.value === "all") return !selectedTemplates.includes("all");
        if (opt.value === "rules") return !selectedTemplates.includes("rules");
        return !selectedTemplates.includes(opt.value as TemplateKey);
      })
      .map((opt) => ({
        value: opt.value,
        label: (opt.value === "all" && selectedTemplates.includes("all")) ||
               (opt.value === "rules" && selectedTemplates.includes("rules")) ||
               (opt.value !== "all" && opt.value !== "rules" && selectedTemplates.includes(opt.value as TemplateKey))
          ? `✓ ${opt.label}` 
          : opt.label,
      }));

    if (remainingOpts.length === 0) {
      break;
    }

    const selected = await select({
      message: selectedTemplates.length === 0
        ? "セットアップするテンプレートを選択（矢印キーで移動、Enterで選択）:"
        : `追加でテンプレートを選択（既に選択済み: ${selectedTemplates.length}個）:`,
      options: [
        ...remainingOpts,
        { value: "done", label: "✅ 選択完了して実行" },
      ],
    });

    if (isCancel(selected)) {
      cancel("キャンセルされました");
      return;
    }

    if (selected === "done") {
      break;
    }

    // 「すべて入れる」が選択された場合は、それだけを実行して終了
    if (selected === "all") {
      await generate("all", dryRun);
      if (dryRun) {
        outro("Dry run完了しました！");
      } else {
        outro("完了しました！");
      }
      return;
    }

    // 選択済みの場合は選択解除、未選択の場合は選択
    if (selected === "all" || selected === "rules") {
      if (selectedTemplates.includes(selected)) {
        selectedTemplates.splice(selectedTemplates.indexOf(selected), 1);
        console.log(`\n✓ "${selected}" の選択を解除しました`);
      } else {
        selectedTemplates.push(selected);
        console.log(`\n✓ "${selected}" を選択しました`);
      }
    } else {
      const templateKey = selected as TemplateKey;
      if (selectedTemplates.includes(templateKey)) {
        selectedTemplates.splice(selectedTemplates.indexOf(templateKey), 1);
        console.log(`\n✓ "${String(templateKey)}" の選択を解除しました`);
      } else {
        selectedTemplates.push(templateKey);
        console.log(`\n✓ "${String(templateKey)}" を選択しました`);
      }
    }

    // rulesを選択した場合は、利用可能なルールファイルを選択
    if (selected === "rules") {
      const availableRules = getAvailableRules();
      
      if (availableRules.length === 0) {
        console.log("⚠️  利用可能なルールファイルが見つかりませんでした。");
        continue;
      }

      const selectedRules: TemplateKey[] = [];

      // ルールの複数選択ループ
      while (true) {
        const remainingRules = availableRules
          .filter((rule) => !selectedRules.includes(rule.value))
          .map((rule) => ({
            value: rule.value,
            label: selectedRules.includes(rule.value)
              ? `✓ ${rule.label}`
              : rule.label,
          }));

        if (remainingRules.length === 0) {
          break;
        }

        const selectedRule = await select({
          message: selectedRules.length === 0
            ? "追加するルールを選択（矢印キーで移動、Enterで選択）:"
            : `追加でルールを選択（既に選択済み: ${selectedRules.length}個）:`,
          options: [
            ...remainingRules,
            { value: "done", label: "✅ ルール選択完了" },
          ],
        });

        if (isCancel(selectedRule)) {
          console.log("⚠️  ルールの選択がキャンセルされました。");
          break;
        }

        if (selectedRule === "done") {
          break;
        }

        const ruleKey = selectedRule as TemplateKey;
        if (selectedRules.includes(ruleKey)) {
          selectedRules.splice(selectedRules.indexOf(ruleKey), 1);
          console.log(`\n✓ ルール "${String(ruleKey)}" の選択を解除しました`);
        } else {
          selectedRules.push(ruleKey);
          console.log(`\n✓ ルール "${String(ruleKey)}" を選択しました`);
        }
      }

      // 選択されたルールをテンプレートリストに追加（rules自体は削除）
      const rulesIndex = selectedTemplates.indexOf("rules");
      if (rulesIndex !== -1) {
        selectedTemplates.splice(rulesIndex, 1);
      }
      selectedTemplates.push(...selectedRules);
    }

    // 続けて選択するか確認
    const continueSelecting = await confirm({
      message: `続けてテンプレートを選択しますか？（現在 ${selectedTemplates.length} 個選択済み）`,
      initialValue: true,
    });

    if (isCancel(continueSelecting) || !continueSelecting) {
      break;
    }
  }

  // 選択されていない場合の処理
  if (selectedTemplates.length === 0) {
    cancel("テンプレートが選択されませんでした");
    return;
  }

  // "all"と"rules"を除外して、実際のテンプレートキーのみを取得
  const templatesToGenerate = selectedTemplates.filter(
    (t): t is TemplateKey => t !== "all" && t !== "rules"
  );

  // 選択されたテンプレートを表示
  if (templatesToGenerate.length > 0) {
    console.log(`\n📦 選択されたテンプレート (${templatesToGenerate.length}個):`);
    templatesToGenerate.forEach((template, index) => {
      console.log(`  ${index + 1}. ${String(template)}`);
    });
    console.log("");

    // 選択されたテンプレートを処理
    for (const tool of templatesToGenerate) {
      console.log(`\n🔧 処理中: ${tool}`);
      await generate(tool, dryRun);
    }
  } else {
    cancel("実行するテンプレートがありませんでした");
    return;
  }

  if (dryRun) {
    outro("Dry run完了しました！");
  } else {
    outro("完了しました！");
  }
}

