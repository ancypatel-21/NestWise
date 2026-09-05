import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Minimal .env loader so integration tests can reach the dev database.
try {
  const env = readFileSync(resolve(process.cwd(), ".env"), "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*"?([^"\n]*)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {
  // no .env — tests that need the DB will be skipped
}
