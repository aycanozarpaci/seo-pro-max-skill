import { existsSync } from "node:fs";
import { isAbsolute, resolve } from "node:path";
import { TARGETS } from "./targets.mjs";

function exists(p, cwd) {
  if (!p) return false;
  const full = isAbsolute(p) ? p : resolve(cwd, p);
  try {
    return existsSync(full);
  } catch {
    return false;
  }
}

// Returns an ordered list of target keys whose detection signals fired.
// Project-scope signals are prioritized over user-scope so that running the
// installer from inside a Cursor workspace picks Cursor first even if Claude
// Code is also installed globally.
export function detectPlatforms(cwd = process.cwd()) {
  const project = [];
  const user = [];

  for (const [key, t] of Object.entries(TARGETS)) {
    let projectHit = false;
    let userHit = false;

    for (const p of t.detectProject || []) {
      if (exists(p, cwd)) {
        projectHit = true;
        break;
      }
    }
    for (const p of t.detectUser || []) {
      if (exists(p, cwd)) {
        userHit = true;
        break;
      }
    }

    if (projectHit) project.push(key);
    else if (userHit) user.push(key);
  }

  return [...project, ...user];
}
