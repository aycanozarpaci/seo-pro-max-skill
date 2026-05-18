import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { TARGETS, TARGET_KEYS, resolveDest } from "./targets.mjs";
import { detectPlatforms } from "./detect-platform.mjs";
import { PKG_VERSION } from "./version.mjs";

const PKG_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export async function doctor() {
  console.log(`seo-pro-max v${PKG_VERSION}\n`);

  const detected = detectPlatforms();
  if (detected.length === 0) {
    console.log("Detected platforms: none in this directory or user profile.");
  } else {
    console.log(`Detected platforms: ${detected.join(", ")}`);
  }
  console.log("");

  const rows = [];
  for (const key of TARGET_KEYS) {
    const t = TARGETS[key];
    for (const scope of ["project", "user"]) {
      const dest = resolveDest(t, scope);
      if (!dest) continue;
      const abs = resolve(process.cwd(), dest);
      if (!existsSync(abs)) continue;

      const src = resolve(PKG_ROOT, t.source);
      const bundled = existsSync(src) ? readFileSync(src, "utf8") : null;
      const local = readFileSync(abs, "utf8");

      let status = "ok";
      if (bundled === null) status = "?";
      else if (bundled === local) status = "up-to-date";
      else status = "outdated";

      const size = statSync(abs).size;
      rows.push({
        target: key,
        name: t.name,
        scope,
        dest,
        size,
        status,
      });
    }
  }

  if (rows.length === 0) {
    console.log("Installed: nothing.\n");
    console.log("Run `npx seo-pro-max install` to set up.");
    return;
  }

  console.log("Installed:");
  for (const r of rows) {
    const marker =
      r.status === "up-to-date" ? "✓" : r.status === "outdated" ? "↻" : "?";
    console.log(
      `  ${marker} [${r.scope}] ${r.name.padEnd(22)} ${r.dest}  (${r.size} bytes, ${r.status})`,
    );
  }

  const outdated = rows.filter((r) => r.status === "outdated");
  if (outdated.length > 0) {
    console.log(
      `\nℹ ${outdated.length} install(s) differ from the bundled skill. Run \`npx seo-pro-max update\` to refresh.`,
    );
  }
}
