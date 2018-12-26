module.exports = {
    "extends": "airbnb-base",
    "settings": {
        "import/resolver": {
            "alias": {
                "map": [
                    ["helpers", "./server/helpers"],
                    ["configs", "./server/configs"],
                    ["routes", "./server/routes"],
                    ["modules", "./server/modules"],
                ],
                "extensions": ['.js', '.json'],
            },
            "ignore": ["\.\/server\/node_modules\/.*", "tmp"],
        }
    },
    "rules": {
        "no-unused-vars": ["error", { "args": "none" }],
        "indent": ["error", 4],
        "arrow-body-style": 0,
        "no-console": 0,
        "no-use-before-define": ["error", { "functions": false }],
        "no-underscore-dangle": 0,
        "import/no-unresolved": 0,
        "no-plusplus": 0,
        "no-restricted-syntax": 0,
        "no-continue": 0,
        "max-len": ["error", { "code": 140, "tabWidth": 4 }],
        "no-param-reassign": ["error", { "props": false }],
    },
};
