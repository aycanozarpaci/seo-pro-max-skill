import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { TARGETS, TARGET_KEYS, resolveDest } from "./targets.mjs";
import { detectPlatforms } from "./detect-platform.mjs";
import { confirm, pick } from "./prompt.mjs";

const PKG_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export async function install(args) {
  const targets = await pickTargets(args);
  let installed = 0;
  let skipped = 0;
  let wouldWrite = 0;

  for (const key of targets) {
    const result = await installOne(key, args);
    if (result === "installed") installed++;
    else if (result === "skipped") skipped++;
    else if (result === "dry-run") wouldWrite++;
  }

  const verb = args["dry-run"] ? "would install" : "installed";
  console.log(
    `\n${args["dry-run"] ? "ℹ" : "✓"} ${verb} ${args["dry-run"] ? wouldWrite : installed} target(s)` +
      (skipped ? `, skipped ${skipped}` : "") +
      ".",
  );
}

async function pickTargets(args) {
  const raw = args.target;

  if (!raw || raw === "auto") {
    const detected = detectPlatforms();
    if (detected.length === 0) {
      const choice = await pick(
        "No platform auto-detected. Pick one:",
        [...TARGET_KEYS, "all"],
      );
      return choice === "all" ? TARGET_KEYS : [choice];
    }
    if (detected.length === 1) {
      console.log(`✓ Detected: ${TARGETS[detected[0]].name}`);
      return detected;
    }
    const labels = detected.map((k) => `${k} (${TARGETS[k].name})`);
    const choice = await pick(
      "Multiple platforms detected. Install where?",
      [...labels, "all detected", "all targets"],
    );
    if (choice === "all detected") return detected;
    if (choice === "all targets") return TARGET_KEYS;
    return [detected[labels.indexOf(choice)]];
  }

  if (raw === "all") return TARGET_KEYS;

  if (!TARGETS[raw]) {
    throw new Error(
      `Unknown target "${raw}". Valid: ${TARGET_KEYS.join(", ")}, all, auto.`,
    );
  }
  return [raw];
}

async function installOne(key, args) {
  const t = TARGETS[key];
  const scope = args.scope || t.defaultScope;
  const dest = resolveDest(t, scope);
  if (!dest) {
    console.log(`✗ ${t.name}: no ${scope}-scope path defined; skipping`);
    return "skipped";
  }

  const src = resolve(PKG_ROOT, t.source);
  if (!existsSync(src)) {
    throw new Error(
      `Source file missing: ${t.source}. Run "node scripts/build-platforms.mjs" first.`,
    );
  }

  const content = readFileSync(src, "utf8");
  const destAbs = resolve(process.cwd(), dest);
  const exists = existsSync(destAbs);

  if (exists) {
    const sameContent = readFileSync(destAbs, "utf8") === content;
    if (sameContent) {
      console.log(`= ${t.name}: already up-to-date at ${dest}`);
      return "skipped";
    }
    if (t.sharedFile) {
      console.log(
        `! ${t.name}: ${dest} exists and is a SHARED file (other rules may live in it).`,
      );
      console.log(
        `  Overwriting would clobber existing content. Suggested: copy the contents of`,
      );
      console.log(`  ${t.source} into ${dest} manually under a "## SEO Setup" section.`);
      if (!args.yes && !(await confirm(`Overwrite ${dest} anyway?`))) {
        console.log(`✗ ${t.name}: skipped (shared-file safety).`);
        return "skipped";
      }
    } else if (!args.yes && !(await confirm(`${dest} exists. Overwrite?`))) {
      console.log(`✗ ${t.name}: skipped.`);
      return "skipped";
    }
  }

  if (args["dry-run"]) {
    console.log(
      `+ ${t.name}: would write ${content.length} bytes -> ${dest}`,
    );
    return "dry-run";
  }

  mkdirSync(dirname(destAbs), { recursive: true });
  writeFileSync(destAbs, content);
  console.log(`✓ ${t.name}: installed -> ${dest}`);
  return "installed";
}
