import pluginVue from "eslint-plugin-vue";
import vueTsEslintConfig from "@vue/eslint-config-typescript";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";

export default [
  {
    name: "app/files-to-lint",
    files: ["**/*.{ts,mts,tsx,vue}"],
  },

  {
    name: "app/files-to-ignore",
    ignores: ["**/dist/**", "**/dist-ssr/**", "**/coverage/**"],
  },
  ...pluginVue.configs["flat/essential"],
  ...vueTsEslintConfig(),
  skipFormatting,
  {
    rules: {
      "vue/component-tags-order": [
        "error",
        {
          order: ["template", "script", "style"],
        },
      ],
      "vue/multi-word-component-names": "off",
      quotes: ["warn", "double"],
      "vue/max-attributes-per-line": [
        "warn",
        {
          singleline: { max: 4 },
          multiline: { max: 1 },
        },
      ],
    },
  },
];
