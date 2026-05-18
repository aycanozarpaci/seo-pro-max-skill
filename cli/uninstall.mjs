import { existsSync, rmSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { TARGETS, TARGET_KEYS, resolveDest } from "./targets.mjs";
import { confirm } from "./prompt.mjs";

export async function uninstall(args) {
  const target = args.target;
  if (!target) {
    throw new Error(
      "uninstall requires --target <name> (or --target all). Run 'doctor' first to see what's installed.",
    );
  }

  const keys = target === "all" ? TARGET_KEYS : [target];
  if (target !== "all" && !TARGETS[target]) {
    throw new Error(
      `Unknown target "${target}". Valid: ${TARGET_KEYS.join(", ")}, all.`,
    );
  }

  let removed = 0;
  for (const key of keys) {
    const t = TARGETS[key];
    for (const scope of ["project", "user"]) {
      const dest = resolveDest(t, scope);
      if (!dest) continue;
      const abs = resolve(process.cwd(), dest);
      if (!existsSync(abs)) continue;

      if (t.sharedFile) {
        console.log(
          `! ${t.name}: ${dest} is a SHARED file (other rules may live in it). Not auto-removing.`,
        );
        console.log(`  Edit the file manually to remove the seo-pro-max section.`);
        continue;
      }

      if (!args.yes && !(await confirm(`Remove ${dest}?`))) {
        console.log(`✗ ${t.name}: skipped.`);
        continue;
      }

      if (args["dry-run"]) {
        console.log(`- ${t.name}: would remove ${dest}`);
        removed++;
        continue;
      }

      rmSync(abs, { force: true });
      tryRemoveEmptyParents(dirname(abs));
      console.log(`✓ ${t.name}: removed ${dest}`);
      removed++;
    }
  }

  console.log(
    `\n${args["dry-run"] ? "ℹ" : "✓"} ${args["dry-run"] ? "would remove" : "removed"} ${removed} file(s).`,
  );
}

function tryRemoveEmptyParents(dir, depth = 0) {
  if (depth > 4) return;
  try {
    if (readdirSync(dir).length === 0) {
      rmSync(dir, { recursive: false, force: true });
      tryRemoveEmptyParents(dirname(dir), depth + 1);
    }
  } catch {
    // Stop at first error (permission, not-a-dir, etc.)
  }
}
