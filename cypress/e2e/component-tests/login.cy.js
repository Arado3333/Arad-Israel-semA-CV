describe("Login Component", () => {
    it("displays personalized greeting", () => {
        cy.visit("/");
        cy.contains("Welcome Back,").should("exist");
    });
});
