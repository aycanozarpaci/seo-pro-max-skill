import { homedir } from "node:os";
import { join } from "node:path";

const HOME = homedir();

// Each target describes where the skill goes for both user (global) and
// project (workspace) scopes, plus how we detect that the platform is in
// use, and which file under platforms/ to copy from.
//
// Detection rules:
//   detectUser    — absolute paths that exist on the user's machine when the
//                   IDE/agent is installed at all (used by `auto` mode)
//   detectProject — paths to look for in the current working directory that
//                   suggest this is a workspace already using that platform
//
// Either / both can be omitted; targets like "plain-llm" are manual-only.
export const TARGETS = {
  claude: {
    name: "Claude Code",
    source: "platforms/claude-code/seo-pro-max/SKILL.md",
    defaultScope: "user",
    userPath: join(HOME, ".claude", "skills", "seo-pro-max", "SKILL.md"),
    projectPath: ".claude/skills/seo-pro-max/SKILL.md",
    detectUser: [join(HOME, ".claude")],
    detectProject: [".claude"],
  },
  cursor: {
    name: "Cursor",
    source: "platforms/cursor/seo-pro-max.mdc",
    defaultScope: "project",
    projectPath: ".cursor/rules/seo-pro-max.mdc",
    detectProject: [".cursor"],
  },
  windsurf: {
    name: "Windsurf",
    source: "platforms/windsurf/.windsurfrules",
    defaultScope: "project",
    projectPath: ".windsurfrules",
    detectProject: [".windsurfrules", ".windsurf"],
  },
  cline: {
    name: "Cline",
    source: "platforms/cline/.clinerules",
    defaultScope: "project",
    projectPath: ".clinerules",
    detectProject: [".clinerules"],
  },
  roo: {
    name: "Roo Code",
    source: "platforms/roo/.roo/rules/seo-pro-max.md",
    defaultScope: "project",
    projectPath: ".roo/rules/seo-pro-max.md",
    detectProject: [".roo"],
  },
  copilot: {
    name: "GitHub Copilot Chat",
    source: "platforms/copilot/.github/copilot-instructions.md",
    defaultScope: "project",
    projectPath: ".github/copilot-instructions.md",
    detectProject: [".github"],
    // Copilot uses ONE instructions file. If one exists, we never overwrite
    // it silently — install asks, and the user can choose to skip and merge
    // manually.
    sharedFile: true,
  },
  aider: {
    name: "Aider",
    source: "platforms/aider/CONVENTIONS.md",
    defaultScope: "project",
    projectPath: "CONVENTIONS.md",
    detectProject: [".aider.conf.yml", ".aider", "CONVENTIONS.md"],
    sharedFile: true,
  },
  continue: {
    name: "Continue.dev",
    source: "platforms/plain-llm/system-prompt.md",
    defaultScope: "user",
    userPath: join(HOME, ".continue", "rules", "seo-pro-max.md"),
    detectUser: [join(HOME, ".continue")],
  },
  zed: {
    name: "Zed AI",
    source: "platforms/plain-llm/system-prompt.md",
    defaultScope: "user",
    userPath: join(HOME, ".config", "zed", "rules", "seo-pro-max.md"),
    detectUser: [join(HOME, ".config", "zed"), join(HOME, ".zed")],
  },
  "plain-llm": {
    name: "Plain LLM / Custom GPT",
    source: "platforms/plain-llm/system-prompt.md",
    defaultScope: "project",
    projectPath: "seo-pro-max-prompt.md",
  },
};

export const TARGET_KEYS = Object.keys(TARGETS);

export function resolveDest(target, scope) {
  if (scope === "user" && target.userPath) return target.userPath;
  if (scope === "project" && target.projectPath) return target.projectPath;
  // Fall back to whichever scope is defined.
  return target.userPath || target.projectPath || null;
}
