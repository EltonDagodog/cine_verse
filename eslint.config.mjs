import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Downgrade react/no-unescaped-entities from "error" to "warn"
      "react/no-unescaped-entities": "warn",
      // Downgrade react-hooks/exhaustive-deps from "error" to "warn" (optional)
      "react-hooks/exhaustive-deps": "warn",
      // Add other custom rules as needed
    },
  },
];

export default eslintConfig;