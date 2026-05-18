import { createInterface } from "node:readline/promises";
import { stdin, stdout, stderr } from "node:process";

function isInteractive() {
  return Boolean(stdin.isTTY && stdout.isTTY);
}

export async function confirm(question, { defaultYes = false } = {}) {
  if (!isInteractive()) {
    stderr.write(
      `! Non-interactive shell. Pass --yes to confirm "${question}" automatically.\n`,
    );
    return false;
  }
  const rl = createInterface({ input: stdin, output: stdout });
  const suffix = defaultYes ? "(Y/n)" : "(y/N)";
  const a = (await rl.question(`${question} ${suffix} `)).trim().toLowerCase();
  rl.close();
  if (a === "") return defaultYes;
  return a === "y" || a === "yes";
}

export async function pick(question, choices) {
  if (!isInteractive()) {
    throw new Error(
      `Non-interactive shell — cannot prompt for selection. Pass --target explicitly.`,
    );
  }
  const rl = createInterface({ input: stdin, output: stdout });
  stdout.write(`${question}\n`);
  choices.forEach((c, i) => stdout.write(`  ${i + 1}) ${c}\n`));
  const a = (await rl.question("# ")).trim();
  rl.close();
  const idx = Number(a) - 1;
  if (Number.isInteger(idx) && choices[idx]) return choices[idx];
  if (choices.includes(a)) return a;
  throw new Error(`Invalid selection: ${a}`);
}
