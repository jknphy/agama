import { test, expect } from '@playwright/test';
import { mainPagePath } from "../lib/installer";

test.describe('La pagina principal', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(mainPagePath());
    });

    test('tiene titulo "Agama"', async ({ page }) => {
        // Expect a title "to contain" a substring.
        await expect(page).toHaveTitle(/Agama/);
    });
})
