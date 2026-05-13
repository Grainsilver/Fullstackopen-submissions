import js from "@eslint/js"
import globals from "globals"
import { defineConfig } from "eslint/config"

export default defineConfig([
  js.configs.recommended,

  
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      ecmaVersion: "latest",
      globals: globals.node,
    },
    rules: {
      indent: ["error", 2],
      "linebreak-style": ["error", "windows"],
      quotes: ["error", "single"],
      semi: ["error", "never"],
      "no-unused-vars": ["warn"],
      eqeqeq: "error",
    },
  },

  
  {
    files: ["**/*.test.js", "**/__tests__/**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      ecmaVersion: "latest",
      globals: { ...globals.node, ...globals.jest },
    },
    rules: {
      "no-unused-vars": ["warn"], 
      "no-console": "off",        
    },
  },

  {
    ignores: ["dist/**"],
  },
])

