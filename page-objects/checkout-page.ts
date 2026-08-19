import { Page } from '@playwright/test';

export class CheckoutPage {
  constructor(private page: Page) {}

  async fillBuyerInformation(
    name: string,
    phone: string,
    address: string
  ) {
    await this.page.getByTestId('checkout-name').fill(name);
    await this.page.getByTestId('checkout-phone').fill(phone);
    await this.page.getByTestId('checkout-address').fill(address);
  }

  async submitPayment() {
    await this.page.getByTestId('checkout-submit').click();
  }
}