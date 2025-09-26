import json from "@eslint/json";
import jsonc from "eslint-plugin-jsonc";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { ignores: ["**/*.js", "**/*.cjs", "**/*.mjs"] },
  {
    files: ["config/resources/*.json"],
    plugins: { json, jsonc },
    language: "json/json",
    extends: ["json/recommended"],
    rules: {
      "jsonc/key-name-casing": [
        "error",
        {
          camelCase: false,
          PascalCase: false,
          SCREAMING_SNAKE_CASE: false,
          "kebab-case": true,
          snake_case: false,
          ignores: [],
        },
      ],
    },
  },
]);
