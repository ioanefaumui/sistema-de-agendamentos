import { test, expect } from "@playwright/test";

test.describe("register", () => {
  test("with invalid email", async ({ page }) => {
    await page.goto("/cadastrar");

    await page.fill('input[name="email"]', "invalid-email");
    await page.fill('input[name="password"]', "123456");
    await page.fill('input[name="passwordCopy"]', "123456");
    await page.getByRole("button", { name: "Cadastrar" }).click();

    await expect(page.getByText("Email inválido")).toBeVisible();
  });

  test("with no password", async ({ page }) => {
    await page.goto("/cadastrar");

    await page.fill('input[name="email"]', "email@example.com");
    await page.fill('input[name="password"]', "");
    await page.fill('input[name="passwordCopy"]', "");
    await page.getByRole("button", { name: "Cadastrar" }).click();

    await expect(page.getByText("Insira sua senha").first()).toBeVisible();
  });

  test("with password mismatch", async ({ page }) => {
    await page.goto("/cadastrar");

    await page.fill('input[name="email"]', "email@example.com");
    await page.fill('input[name="password"]', "password123");
    await page.fill('input[name="passwordCopy"]', "differentPassword");
    await page.getByRole("button", { name: "Register" }).click();

    await expect(page.getByText("As senhas não coincidem")).toBeVisible();
  });

  test("with valid credentials", async ({ page }) => {
    await page.goto("/cadastrar");

    await page.fill('input[name="email"]', "john@example.com");
    await page.fill('input[name="password"]', "secret123");
    await page.fill('input[name="passwordCopy"]', "secret123");
    await page.getByRole("button", { name: "Register" }).click();

    await expect(page).toHaveURL("/login");
  });
});
