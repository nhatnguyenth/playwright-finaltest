import { test, expect } from '../core/fixtures/page.fixtures';
import accounts from '../resources/accounts.json';

test('Update Full Name - API + UI + Cleanup', async ({
  page,
  profilePage,
}) => {
  let token: string;
  let originalName: string;

  const newName = 'Auto Test Full Name';

  // ==========================================
  // 1. LOGIN API - GET TOKEN
  // ==========================================

  await test.step('1. Login API - Get authentication token', async () => {
    await page.goto('/api-docs/');

    const loginResult = await page.evaluate(
      async ({ username, password }) => {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password,
          }),
        });

        return {
          status: response.status,
          body: await response.text(),
        };
      },
      {
        username: accounts.username,
        password: accounts.password,
      },
    );

    console.log('Login status:', loginResult.status);

    expect(loginResult.status).toBe(200);

    const loginBody = JSON.parse(loginResult.body);

    token = loginBody.token;

    expect(token).toBeTruthy();

    console.log('Logged-in user:', loginBody.user);
  });

  // ==========================================
  // 2. GET CURRENT PROFILE
  // ==========================================

  await test.step(
    '2. Get current profile and save original Full Name',
    async () => {
      const profileResult = await page.evaluate(
        async (token) => {
          const response = await fetch('/api/profile', {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          return {
            status: response.status,
            body: await response.text(),
          };
        },
        token,
      );

      console.log('Profile status:', profileResult.status);

      expect(profileResult.status).toBe(200);

      const profileBody = JSON.parse(profileResult.body);

      originalName = profileBody.name;

      console.log('Original name:', originalName);

      expect(originalName).toBeTruthy();
    },
  );

  // ==========================================
  // 3. UPDATE FULL NAME VIA API
  // ==========================================

  await test.step(
    `3. Update Full Name to "${newName}" via API`,
    async () => {
      const updateProfileResult = await page.evaluate(
        async ({ token, newName }) => {
          const response = await fetch('/api/profile', {
            method: 'PATCH',
            headers: {
              accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: newName,
            }),
          });

          return {
            status: response.status,
            body: await response.text(),
          };
        },
        {
          token,
          newName,
        },
      );

      console.log(
        'Update profile status:',
        updateProfileResult.status,
      );

      expect(updateProfileResult.status).toBe(200);

      const updatedUser = JSON.parse(updateProfileResult.body);

      expect(updatedUser.name).toBe(newName);

      console.log('Updated name:', updatedUser.name);
    },
  );

  // ==========================================
  // 4. LOGIN UI
  // ==========================================

  await test.step('4. Login to UI', async () => {
    await page.goto('/login');

    await page.getByTestId('login-username').fill(accounts.username);

    await page
      .getByTestId('login-password')
      .fill(accounts.password);

    await page.getByTestId('login-submit').click();

    await expect(page).not.toHaveURL(/login/);
  });

  // ==========================================
  // 5. OPEN PROFILE
  // ==========================================

  await test.step('5. Open Profile page', async () => {
    await profilePage.open();

    await expect(profilePage.profileName).toBeVisible();
  });

  // ==========================================
  // 6. VERIFY FULL NAME ON UI
  // ==========================================

  await test.step(
    `6. Verify Full Name is "${newName}" on UI`,
    async () => {
      await expect(profilePage.profileName).toHaveValue(newName);

      console.log(
        'UI Full Name:',
        await profilePage.getFullName(),
      );
    },
  );

  // ==========================================
  // 7. CLEANUP - RESTORE ORIGINAL NAME
  // ==========================================

  await test.step(
    `7. Restore original Full Name "${originalName}"`,
    async () => {
      const restoreResult = await page.evaluate(
        async ({ token, originalName }) => {
          const response = await fetch('/api/profile', {
            method: 'PATCH',
            headers: {
              accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: originalName,
            }),
          });

          return {
            status: response.status,
            body: await response.text(),
          };
        },
        {
          token,
          originalName,
        },
      );

      console.log('Restore status:', restoreResult.status);

      expect(restoreResult.status).toBe(200);

      const restoredUser = JSON.parse(restoreResult.body);

      expect(restoredUser.name).toBe(originalName);

      console.log('Restored name:', restoredUser.name);
    },
  );
});