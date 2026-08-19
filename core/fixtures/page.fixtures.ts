import { test as base, expect } from '@playwright/test';

import { LoginPage } from '../../page-objects/login-page';
import { ProductPage } from '../../page-objects/product-page';
import { CheckoutPage } from '../../page-objects/checkout-page';
import { ProfilePage } from '../../page-objects/profile-page';

export const test = base.extend<{
  loginPage: LoginPage;
  productPage: ProductPage;
  checkoutPage: CheckoutPage;
  profilePage: ProfilePage;
}>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  profilePage: async ({ page }, use) => {
    await use(new ProfilePage(page));
  },
});

export { expect };