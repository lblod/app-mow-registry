import * as fs from "node:fs";
import path from "node:path";

export const RESOURCE_TYPES: string[] = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'resource_types.json'), "utf8")
);