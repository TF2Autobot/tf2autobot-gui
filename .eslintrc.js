module.exports = {
    root: true,
    parser: "vue-eslint-parser",
    env: {
        commonjs: true,
        es6: true,
        node: true
    },
    extends: [
        'plugin:vue/vue3-recommended'
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
    },
    parserOptions: {
        parser: "@typescript-eslint/parser",
        project: './tsconfig.eslint.json'
    },
    rules: {
        'indent': ['error', 4],
        'no-tabs': 0,
        'max-len': 0,
        'linebreak-style': 0,
        'quote-props': ['warn', 'consistent-as-needed', {
            numbers: false
        }],
        'no-trailing-spaces': ['error', {
            skipBlankLines: true,
            ignoreComments: true
        }],
        'comma-dangle': ['error', 'never'],
        'require-jsdoc': 2,
        'space-before-function-paren': ['error', {
            anonymous: 'never',
            named: 'never',
            asyncArrow: 'always'
        }],
        'curly': ['warn', 'all'], // May be ignored if its a single line statement with an immediate return / continue / break. Otherwise follow this rule.
        'object-curly-spacing': ['error', 'always'],
        'object-property-newline': ['error', {
            allowAllPropertiesOnSameLine: false
        }],
        'new-cap': 0,
        'no-useless-catch': 'error',
        'arrow-spacing': 2,
        'camelcase': 'error'
    }
};
