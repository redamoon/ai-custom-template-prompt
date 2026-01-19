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

