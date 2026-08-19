import { Page } from '@playwright/test';
import { ContentType } from 'allure-js-commons';
import { test } from '@playwright/test';

export class ReportUtils {
  static async captureScreenshot(
    title: string,
    page: Page,
    fn: () => Promise<void>
  ): Promise<void> {

    // Screenshot BEFORE action
    const beforeScreenshot = await page.screenshot();

    await test.info().attach(`${title} - Before`, {
      body: beforeScreenshot,
      contentType: ContentType.PNG,
    });

    // Execute action
    await fn();

    // Screenshot AFTER action
    const afterScreenshot = await page.screenshot();

    await test.info().attach(`${title} - After`, {
      body: afterScreenshot,
      contentType: ContentType.PNG,
    });
  }
}