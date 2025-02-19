import { test, expect } from "@playwright/test";

test.describe("login", () => {
  test("with invalid email", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[name="email"]', "a9di0adwi09daiw");
    await page.fill('input[name="password"]', "123456");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText("Email inválido")).toBeVisible();
  });

  test("with no password", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[name="email"]', "email@example.com");
    await page.fill('input[name="password"]', "");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText("Insira sua senha")).toBeVisible();
  });

  test("with valid credential", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[name="email"]', "john@example.com");
    await page.fill('input[name="password"]', "secret123");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL("/servicos");
  });
});
