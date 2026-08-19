import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async openUrl(url: string) {
    await this.page.goto(url);
  }

  async enterText(locator: Locator, text: string) {
    await locator.clear();
    await locator.fill(text);
  }

  async typeText(locator: Locator, text: string) {
    await locator.clear();
    await locator.pressSequentially(text);
  }

  async click(locator: Locator) {
    await locator.click();
  }

  async hoverElement(locator: Locator) {
    await locator.hover();
  }

  async getTextContent(locator: Locator): Promise<string> {
    return (await locator.textContent())?.trim() ?? '';
  }

  async expectVisible(locator: Locator) {
    await expect(locator).toBeVisible();
  }

  async waitUntilVisible(locator: Locator) {
    await locator.waitFor({ state: 'visible' });
  }

  async waitUntilHidden(locator: Locator) {
    await locator.waitFor({ state: 'hidden' });
  }
}