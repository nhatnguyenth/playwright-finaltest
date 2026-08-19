import { Page, Locator } from '@playwright/test';

export class ProfilePage {
  readonly page: Page;
  readonly profileName: Locator;

  constructor(page: Page) {
    this.page = page;
    this.profileName = page.getByTestId('profile-name');
  }

  async open() {
    await this.page.getByTestId('header-profile-link').click();
  }

  async getFullName() {
    return await this.profileName.inputValue();
  }
}