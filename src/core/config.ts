export type TemplateKey =
  | "cursor-rules"
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

