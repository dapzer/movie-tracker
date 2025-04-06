import antfu from "@antfu/eslint-config"

export default antfu({
  formatters: true,
  stylistic: {
    semi: false,
    indent: 2,
    quotes: "double",
  },
  typescript: {
    overrides: {
      "accessor-pairs": "warn",
      "style/member-delimiter-style": "warn",
      "ts/consistent-type-imports": "off",
    },
  },
  vue: {
    overrides: {
      "vue/block-order": ["error", {
        order: ["script", "template", "style"],
      }],
      "vue/max-attributes-per-line": ["error", {
        singleline: {
          max: 1,
        },
        multiline: {
          max: 1,
        },
      }],
      "vue/attribute-hyphenation": "warn",
      "vue/html-self-closing": "off",
    },
  },
})
