/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  endOfLine: "lf",
  printWidth: 120,
  useTabs: false,
  tabWidth: 2,
  singleQuote: false,
  htmlWhitespaceSensitivity: "css",
  jsxSingleQuote: false,
  singleAttributePerLine: true,
  bracketSpacing: true,
  arrowParens: "always",
  semi: true,
  trailingComma: "all",
};

export default config
