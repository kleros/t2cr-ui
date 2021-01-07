const withTM = require("next-transpile-modules")([
  "@kleros/icons",
  "@kleros/components",
]);

module.exports = withTM();
