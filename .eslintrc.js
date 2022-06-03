module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
        jest: true,
    },
    extends: [
        "airbnb-base",
    ],
    parserOptions: {
        ecmaVersion: "latest",
    },
    rules: {
        indent: ["error", 4],
        quotes: [2, "double", "avoid-escape"],
        "class-methods-use-this": "off",
        radix: "off",
        "max-len": "off",
        "no-restricted-syntax": "off",
        "no-await-in-loop": "off",
    },
};
