// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: [
    'plugin:vue/strongly-recommended',
    'eslint:recommended'
  ],

  rules: {
    'generator-star-spacing': 0,
    'arrow-parens': 0,
    'prefer-const': 2,
    'no-trailing-spaces': 'error',
    'no-debugger': 0,
    'no-extra-semi': 'error',
    semi: ['error', 'never'],
    quotes: ['error', 'single'],
    'no-var': 'error',
    'vue/attributes-order': 'error',
    'no-unused-vars': 'error',
    'vue/no-v-html': 'error',
    'vue/order-in-components': 'error',
    'vue/this-in-template': 'error',
    'vue/script-indent': 'error',
    'vue/multi-word-component-names': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },

  parserOptions: {
    parser: 'babel-eslint'
  },

  overrides: [
    {
      files: ['*.vue'],
      rules: {
        indent: 'off',
        'vue/script-indent': ['error', 2, { baseIndent: 1 }]
      }
    }
  ]
}
