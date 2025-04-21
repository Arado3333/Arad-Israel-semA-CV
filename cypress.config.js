import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        specPattern: [
            "cypress/e2e/**/*.cy.js",
            "cypress/**/*.cy.js", // Added our custom folder
        ],
        baseUrl: "http://localhost:5173",
    },
});
