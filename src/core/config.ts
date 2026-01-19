import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export type TemplateKey =
  | "cursor-rules"
  | "cursor-manual-rules"
  | "cursor-test-rules"
  | "cursor-api-rules"
  | "cursor-backend-rules"
  | "cursor-frontend-rules"
  | "cursor-server-rules"
  | "cursor-commands"
  | "cursor-command-create-pr"
  | "cursor-command-create-branch"
  | "cursor-command-update-readme"
  | "cursor-command-release"
  | "agents";

export const TEMPLATE_MAP: Record<
  TemplateKey,
  { from: string; to: string }
> = {
  "cursor-rules": {
    from: "cursor/rules/rules.mdc",
    to: ".cursor/rules/rules.mdc",
  },
  "cursor-manual-rules": {
    from: "cursor/rules/manual-rules.mdc",
    to: ".cursor/rules/manual-rules.mdc",
  },
  "cursor-test-rules": {
    from: "cursor/rules/test-rules.mdc",
    to: ".cursor/rules/test-rules.mdc",
  },
  "cursor-api-rules": {
    from: "cursor/rules/api-rules.mdc",
    to: ".cursor/rules/api-rules.mdc",
  },
  "cursor-backend-rules": {
    from: "cursor/rules/backend-rules.mdc",
    to: "backend/.cursor/rules/backend-rules.mdc",
  },
  "cursor-frontend-rules": {
    from: "cursor/rules/frontend-rules.mdc",
    to: "frontend/.cursor/rules/frontend-rules.mdc",
  },
  "cursor-server-rules": {
    from: "cursor/rules/server-rules.mdc",
    to: "backend/server/.cursor/rules/server-rules.mdc",
  },
  "cursor-commands": {
    from: "cursor/commands",
    to: ".cursor/commands",
  },
  "cursor-command-create-pr": {
    from: "cursor/commands/create-pr.md",
    to: ".cursor/commands/create-pr.md",
  },
  "cursor-command-create-branch": {
    from: "cursor/commands/create-branch.md",
    to: ".cursor/commands/create-branch.md",
  },
  "cursor-command-update-readme": {
    from: "cursor/commands/update-readme.md",
    to: ".cursor/commands/update-readme.md",
  },
  "cursor-command-release": {
    from: "cursor/commands/release.md",
    to: ".cursor/commands/release.md",
  },
  agents: {
    from: "agents/Agents.md",
    to: "AGENTS.md",
  },
};

export function getOptions() {
  return Object.keys(TEMPLATE_MAP).map((k) => ({
    value: k as TemplateKey,
    label: k.replace(/-/g, " "),
  }));
}

// templates/cursor/rules/ディレクトリ内のルールファイルを動的に検出
export function getAvailableRules(): Array<{ value: TemplateKey; label: string }> {
  // テンプレートルートを取得（generator.tsと同じロジック）
  function getTemplateRoot() {
    const cwdTemplatesPath = path.join(process.cwd(), "templates");
    if (fs.existsSync(cwdTemplatesPath)) {
      return cwdTemplatesPath;
    }
    
    // フォールバック: 相対パスで探す
    const fallbackPath = path.join(__dirname, "..", "..", "templates");
    if (fs.existsSync(fallbackPath)) {
      return fallbackPath;
    }
    
    throw new Error("テンプレートディレクトリが見つかりません");
  }
  
  const templateRoot = getTemplateRoot();
  const rulesDir = path.join(templateRoot, "cursor", "rules");
  
  if (!fs.existsSync(rulesDir)) {
    return [];
  }
  
  const files = fs.readdirSync(rulesDir);
  return files
    .filter((file: string) => file.endsWith(".mdc"))
    .map((file: string) => {
      const name = file.replace(".mdc", "");
      const key = `cursor-${name}` as TemplateKey;
      return {
        value: key,
        label: name.replace(/-/g, " "),
      };
    })
    .filter((item: { value: TemplateKey; label: string }) => {
      // TEMPLATE_MAPに存在するもののみを返す
      return TEMPLATE_MAP[item.value] !== undefined;
    });
}

