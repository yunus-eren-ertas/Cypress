const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "qgf6zd",
  e2e: {
    specPattern: "e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "support/e2e.js",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
