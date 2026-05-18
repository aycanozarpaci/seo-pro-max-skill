import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const PKG_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "package.json",
);

let version = "0.0.0-dev";
try {
  version = JSON.parse(readFileSync(PKG_PATH, "utf8")).version || version;
} catch {
  // package.json missing (running from a snapshot); fall back to default
}

export const PKG_VERSION = version;
