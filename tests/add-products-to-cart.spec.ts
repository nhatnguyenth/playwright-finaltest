import { test, expect } from '../core/fixtures/page.fixtures';
import accounts from '../resources/accounts.json';

test.describe('Add product to cart', () => {
  test('User can add product to cart', async ({
    page,
    loginPage,
    productPage,
  }) => {
    await page.goto('https://testing.platformforge.dev/login');

    await loginPage.login(
      accounts.username,
      accounts.password
    );

    await productPage.addFirstProductToCart();

    await productPage.openCart();

    await expect(page).toHaveURL(/cart/);
  });
});