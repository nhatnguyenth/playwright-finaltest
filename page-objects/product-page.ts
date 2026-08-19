import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class ProductPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async addFirstProductToCart() {
    await this.page
      .getByRole('button', { name: 'Thêm vào giỏ 🛒' })
      .first()
      .click();
  }

  async openCart() {
    await this.page
      .getByRole('button', { name: '🛒 1' })
      .click();
  }

  async verifyCartQuantity(quantity: number) {
    await expect(
      this.page.getByRole('button', { name: new RegExp(`🛒\\s*${quantity}`) })
    ).toBeVisible();
  }
  async verifyCartPage() {
    await expect(this.page).toHaveURL(/cart/i);
  }
}