#!/usr/bin/env node
import { install } from "../cli/install.mjs";
import { update } from "../cli/update.mjs";
import { uninstall } from "../cli/uninstall.mjs";
import { doctor } from "../cli/doctor.mjs";
import { PKG_VERSION } from "../cli/version.mjs";

const HELP = `
seo-pro-max v${PKG_VERSION}
Production-grade SEO setup skill for AI coding agents.

Usage:
  npx seo-pro-max <command> [options]

Commands:
  install     Install the skill into a detected (or specified) platform
  update      Re-fetch the bundled skill into your existing install
  uninstall   Remove the skill from a platform
  doctor      Show what is installed where, and the version

Options:
  --target <name>   claude | cursor | windsurf | cline | roo | copilot |
                    aider | continue | zed | plain-llm | all | auto (default)
  --scope <where>   user | project    (defaults per platform)
  --yes, -y         Skip confirmation prompts
  --dry-run         Show what would happen, do not write
  --version, -v     Print the version and exit
  --help, -h        Print this help and exit

Examples:
  npx seo-pro-max install
  npx seo-pro-max install --target cursor
  npx seo-pro-max install --target all --yes
  npx seo-pro-max update --target claude
  npx seo-pro-max uninstall --target windsurf
  npx seo-pro-max doctor

Docs: https://github.com/aycanozarpaci/seo-pro-max-skill
`;

const COMMANDS = { install, update, uninstall, doctor };

const [, , rawCmd, ...rest] = process.argv;
const args = parseArgs(rest);

if (rawCmd === "--version" || rawCmd === "-v" || args.version) {
  console.log(PKG_VERSION);
  process.exit(0);
}

if (!rawCmd || rawCmd === "--help" || rawCmd === "-h" || args.help) {
  console.log(HELP.trim());
  process.exit(rawCmd ? 0 : 1);
}

const fn = COMMANDS[rawCmd];
if (!fn) {
  console.error(`✗ Unknown command: ${rawCmd}`);
  console.error(`  Run 'npx seo-pro-max --help' for usage.`);
  process.exit(1);
}

try {
  await fn(args);
} catch (err) {
  console.error(`✗ ${err.message}`);
  if (process.env.DEBUG) console.error(err.stack);
  process.exit(1);
}

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "-y") {
      out.yes = true;
      continue;
    }
    if (a === "-v") {
      out.version = true;
      continue;
    }
    if (a === "-h") {
      out.help = true;
      continue;
    }
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith("--") || next.startsWith("-")) {
        out[key] = true;
      } else {
        out[key] = next;
        i++;
      }
      continue;
    }
    out._.push(a);
  }
  return out;
}
