const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    projectId: "qgf6zd",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
