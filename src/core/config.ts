export type TemplateKey =
  | "cursor-rules"
  | "cursor-manual-rules"
  | "cursor-test-rules"
  | "cursor-api-rules"
  | "cursor-backend-rules"
  | "cursor-frontend-rules"
  | "cursor-server-rules"
  | "cursor-prompts"
  | "claude-hooks"
  | "agents";

export const TEMPLATE_MAP: Record<
  TemplateKey,
  { from: string; to: string }
> = {
  "cursor-rules": {
    from: "cursor/rules.mdc",
    to: ".cursor/rules.mdc",
  },
  "cursor-manual-rules": {
    from: "cursor/manual-rules.mdc",
    to: ".cursor/rules/manual-rules.mdc",
  },
  "cursor-test-rules": {
    from: "cursor/test-rules.mdc",
    to: ".cursor/rules/test-rules.mdc",
  },
  "cursor-api-rules": {
    from: "cursor/api-rules.mdc",
    to: ".cursor/rules/api-rules.mdc",
  },
  "cursor-backend-rules": {
    from: "cursor/backend-rules.mdc",
    to: "backend/.cursor/rules/backend-rules.mdc",
  },
  "cursor-frontend-rules": {
    from: "cursor/frontend-rules.mdc",
    to: "frontend/.cursor/rules/frontend-rules.mdc",
  },
  "cursor-server-rules": {
    from: "cursor/server-rules.mdc",
    to: "backend/server/.cursor/rules/server-rules.mdc",
  },
  "cursor-prompts": {
    from: "cursor/prompts.mdc",
    to: ".cursor/prompts.mdc",
  },
  "claude-hooks": {
    from: "claude/custom-hooks.md",
    to: "ai/claude/custom-hooks.md",
  },
  agents: {
    from: "agents/Agents.md",
    to: "ai/agents/Agents.md",
  },
};

export function getOptions() {
  return Object.keys(TEMPLATE_MAP).map((k) => ({
    value: k as TemplateKey,
    label: k.replace(/-/g, " "),
  }));
}

