module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
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
    },
};
