import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export function fromPackageRoot(relative: string) {
  return resolve(__dirname, "..", "..", relative);
}
