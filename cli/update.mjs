import { install } from "./install.mjs";
import { TARGETS, TARGET_KEYS, resolveDest } from "./targets.mjs";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

// `update` is install in --yes mode, scoped to whatever is currently installed.
export async function update(args) {
  if (!args.target) {
    const installed = findInstalled();
    if (installed.length === 0) {
      console.log(
        "✗ Nothing to update — no install detected. Run `npx seo-pro-max install` first.",
      );
      return;
    }
    console.log(
      `Updating ${installed.length} existing install(s): ${installed.join(", ")}`,
    );
    for (const key of installed) {
      await install({ ...args, target: key, yes: true });
    }
    return;
  }
  await install({ ...args, yes: true });
}

function findInstalled() {
  const found = [];
  for (const key of TARGET_KEYS) {
    const t = TARGETS[key];
    for (const scope of ["project", "user"]) {
      const dest = resolveDest(t, scope);
      if (!dest) continue;
      const abs = resolve(process.cwd(), dest);
      if (existsSync(abs)) {
        found.push(key);
        break;
      }
    }
  }
  return found;
}
