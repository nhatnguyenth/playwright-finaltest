import { test, expect } from '../core/fixtures/page.fixtures';
import accounts from '../resources/accounts.json';

test.describe('Checkout', () => {
  test('User can complete payment successfully', async ({
    page,
    loginPage,
    productPage,
    checkoutPage,
  }) => {
    await page.goto('/login');

    await loginPage.login(
      accounts.username,
      accounts.password
    );
    console.log('After login URL:', page.url());

    await expect(page).not.toHaveURL(/login/);
    
    await productPage.addFirstProductToCart();

    await productPage.openCart();

    await page.getByRole('button', { name: 'Thanh toán ngay' }).click();

    await checkoutPage.fillBuyerInformation(
      'Nhat Nguyen',
      '0974992761',
      '239 Xuân Thủy'
    );

    await checkoutPage.submitPayment();

    // TODO: thêm assertion xác nhận thanh toán thành công
  });
});