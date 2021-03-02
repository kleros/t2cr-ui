module.exports = {
  // Don't merge into parent configs.
  root: true,

  // Enable modern browser globals.
  env: {
    es2020: true,
    browser: true,
    node: true,
  },

  // Enable ES Module mode.
  parserOptions: {
    sourceType: "module",
  },

  extends: [
    // Core
    "eslint:recommended",

    // Import Plugin
    "plugin:import/errors",

    // Unicorn Plugin
    "plugin:unicorn/recommended",

    // React Plugin
    "plugin:react/recommended",

    // React Hooks Plugin
    "plugin:react-hooks/recommended",

    // React A11Y Plugin
    "plugin:jsx-a11y/strict",

    // Prettier Plugin
    "plugin:prettier/recommended",
    "prettier/react",

    // MDX Plugin
    "plugin:mdx/recommended",
  ],
  plugins: ["regex"],

  rules: {
    // Core
    "arrow-body-style": "warn", // Don't use unnecessary curly braces for arrow functions.
    "new-cap": "warn", // Require constructor names to begin with a capital letter.
    "new-parens": "warn",
    "no-array-constructor": "warn",
    "no-duplicate-imports": ["warn", { includeExports: true }],
    "no-else-return": ["warn", { allowElseIf: false }],
    "no-extra-bind": "warn",
    "no-iterator": "warn",
    "no-lonely-if": "warn", // In else blocks.
    "no-new-wrappers": "warn",
    "no-proto": "warn",
    "no-return-await": "warn",
    "no-shadow": "warn",
    "no-unneeded-ternary": ["warn", { defaultAssignment: false }],
    "no-unused-expressions": "warn",
    "no-unused-vars": "warn",
    "no-use-before-define": "warn",
    "no-useless-computed-key": "warn",
    "no-useless-concat": "warn",
    "no-useless-constructor": "warn",
    "no-useless-return": "warn",
    "no-var": "warn",
    "object-shorthand": "warn",
    "one-var": ["warn", "never"],
    "operator-assignment": "warn",
    "prefer-arrow-callback": "warn",
    "prefer-const": "warn",
    "prefer-exponentiation-operator": "warn",
    "prefer-numeric-literals": "warn",
    "prefer-object-spread": "warn",
    "prefer-rest-params": "warn",
    "prefer-spread": "warn",
    "prefer-template": "warn",
    "require-await": "warn",
    "spaced-comment": "warn",
    curly: ["warn", "multi"], // Don't use unnecessary curly braces.
    eqeqeq: "warn",

    // Sort named import members alphabetically.
    "sort-imports": [
      "error",
      {
        ignoreDeclarationSort: true,
      },
    ],

    "import/no-useless-path-segments": [
      "error",
      {
        noUselessIndex: true,
      },
    ],
    "import/extensions": "error", // Don't use unnecessary file extensions.
    "import/order": [
      "error",
      {
        pathGroups: [
          {
            pattern: "@kleros/{components,icons}",
            group: "external",
          },
        ],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
        },
      },
    ],
    "import/newline-after-import": "error",
    "import/no-anonymous-default-export": [
      "error",
      { allowCallExpression: false },
    ],

    // Unicorn Plugin
    "unicorn/prevent-abbreviations": [
      "error",
      {
        replacements: {
          acc: false,
          args: false,
          arr: false,
          err: false,
          prop: false,
          props: false,
          ref: false,
          res: false,
        },
      },
    ],
    "unicorn/no-nested-ternary": "off",
    "unicorn/no-null": "off",
    "unicorn/no-array-reduce": "off",
    "unicorn/catch-error-name": [
      "error",
      {
        name: "err",
      },
    ],
    "unicorn/custom-error-definition": "error",
    "unicorn/no-unsafe-regex": "error",
    "unicorn/no-unused-properties": "error",
    "unicorn/prefer-flat-map": "error",
    "unicorn/prefer-replace-all": "error",
    "unicorn/string-content": "error",

    // React Plugin
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react/prefer-stateless-function": "error",
    "react/function-component-definition": "error",
    "react/self-closing-comp": "error",
    "react/jsx-no-useless-fragment": "error",
    "react/jsx-fragments": "error",
    "react/jsx-boolean-value": "error",
    "react/jsx-curly-brace-presence": "error",
    // Force platform agnostic use of the design system.
    "react/forbid-elements": [
      "warn",
      {
        forbid: [
          "!--...--",
          "!DOCTYPE",
          "a",
          "abbr",
          "acronym",
          "address",
          "applet",
          "area",
          "article",
          "aside",
          "audio",
          "b",
          "base",
          "basefont",
          "bdi",
          "bdo",
          "big",
          "blockquote",
          "body",
          "br",
          "button",
          "canvas",
          "caption",
          "center",
          "cite",
          "code",
          "col",
          "colgroup",
          "data",
          "datalist",
          "dd",
          "del",
          "details",
          "dfn",
          "dialog",
          "dir",
          "div",
          "dl",
          "dt",
          "em",
          "embed",
          "fieldset",
          "figcaption",
          "figure",
          "font",
          "footer",
          "form",
          "frame",
          "frameset",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "head",
          "header",
          "hr",
          "html",
          "i",
          "iframe",
          "img",
          "input",
          "ins",
          "kbd",
          "label",
          "legend",
          "li",
          "link",
          "main",
          "map",
          "mark",
          "meta",
          "meter",
          "nav",
          "noframes",
          "noscript",
          "object",
          "ol",
          "optgroup",
          "option",
          "output",
          "p",
          "param",
          "picture",
          "pre",
          "progress",
          "q",
          "rp",
          "rt",
          "ruby",
          "s",
          "samp",
          "script",
          "section",
          "select",
          "small",
          "source",
          "span",
          "strike",
          "strong",
          "style",
          "sub",
          "summary",
          "sup",
          "svg",
          "table",
          "tbody",
          "td",
          "template",
          "textarea",
          "tfoot",
          "th",
          "thead",
          "time",
          "title",
          "tr",
          "track",
          "tt",
          "u",
          "ul",
          "var",
          "video",
          "wbr",
        ],
      },
    ],

    // React Hooks Plugin
    "react-hooks/exhaustive-deps": [
      "error",
      {
        additionalHooks: "usePromise",
      },
    ],

    // MDX Plugin
    "mdx/no-jsx-html-comments": "error",
    "mdx/no-unescaped-entities": "error",
    "mdx/no-unused-expressions": "error",

    // Regex Plugin
    "regex/invalid": [
      "warn",
      [
        "[^\\d]0p[x]", // Don't use pixels unit for zero values.
        "(?=.*[A-F])#[0-9a-fA-F]{1,6}", // Don't use upper case letters in hex colors.
        "@js[x]", // Don't use a custom JSX pragma.
        "Style[d]", // Don't use "styled" components.
        ",\\s+&", // Don't use spaces between comma separated selectors.
      ],
    ],
  },

  settings: {
    react: { version: "detect" },
  },
};
