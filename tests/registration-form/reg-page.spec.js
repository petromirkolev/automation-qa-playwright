import { test, expect } from '@playwright/test';
import { RegistrationPage } from './page-objects/RegistrationPage.js';
import { validInput } from './test-data/valid-input.js';
import {
  validPasswordStrength,
  invalidPassword,
} from './test-data/password.js';
import { confirmEmailInput } from './test-data/confirm-email.js';
import { invalidEmailInput } from './test-data/invalid-email.js';

/**
 * User Registration Form test suite
 */
test.describe('Automation test suite - User registration form', () => {
  /** @type {RegistrationPage} */
  let regPage;

  test.beforeEach(async ({ page }) => {
    await page.goto('./');
    regPage = new RegistrationPage(page);
    await regPage.waitForPageLoad();
  });

  test.describe('Application smoke tests', () => {
    test('App loads and main UI is visible', async () => {
      await regPage.waitForPageLoad();
    });

    test('Registration with valid data (UI + API)', async () => {
      await regPage.fillForm(
        validInput.email,
        validInput.email,
        validInput.password,
      );

      const response = await regPage.submitAndWaitForApi();

      expect(response.status()).toBe(200);

      await expect(regPage.loc.submissionStatus).toHaveText(
        'Registration successful!',
      );
      await expect(regPage.loc.submissionStatus).toContainClass('success');
    });
  });

  test.describe('Invalid email address field tests', () => {
    for (const key of Object.keys(invalidEmailInput)) {
      const { value, testDescription, errorMessage } = invalidEmailInput[key];

      test(testDescription, async () => {
        await regPage.fillEmail(value);

        await regPage.expectLineError({
          message: errorMessage,
          field: 'email',
        });
      });
    }
  });

  test.describe('Confirm email field tests', () => {
    for (const key of Object.keys(confirmEmailInput)) {
      const { email, confirmEmail, testDescription, errorMessage, errorField } =
        confirmEmailInput[key];

      test(testDescription, async () => {
        await regPage.fillEmail(email);
        await regPage.fillConfirmEmail(confirmEmail);

        await regPage.expectLineError({
          message: errorMessage,
          field: errorField,
        });
      });
    }
  });

  test.describe('Password field tests', () => {
    for (const key of Object.keys(invalidPassword)) {
      const { invalidPasswordValue, testDescription, errorMessage } =
        invalidPassword[key];

      test(testDescription, async () => {
        await regPage.fillPassword(invalidPasswordValue);

        await expect(regPage.loc.passError).toHaveText(errorMessage);
      });
    }
  });

  test.describe('Password visibility tests', () => {
    test('Show password reveals the typed password', async () => {
      const password = 'Petromir123?';

      await regPage.fillPassword(password);
      await regPage.loc.showPassword.click();

      await expect(regPage.loc.passwordInput).toHaveAttribute('type', 'text');
      await expect(regPage.loc.passwordInput).toHaveValue(password);
      await expect(regPage.loc.showPassword).toHaveAttribute(
        'title',
        'Hide password',
      );
    });
  });

  test.describe('Password strength indicator tests', () => {
    const expected = {
      weak: { width: '20%', color: 'rgb(231, 76, 60)' },
      moderate: { width: '40%', color: 'rgb(243, 156, 18)' },
      strong: { width: '80%', color: 'rgb(52, 152, 219)' },
      veryStrong: { width: '100%', color: 'rgb(39, 174, 96)' },
    };

    for (const strength of Object.keys(validPasswordStrength)) {
      test(`Password strength indicator: ${strength}`, async () => {
        await regPage.fillPassword(validPasswordStrength[strength]);

        const width = await regPage.loc.strengthBar.evaluate(
          (el) => el.style.width,
        );
        const color = await regPage.loc.strengthBar.evaluate(
          (el) => el.style.backgroundColor,
        );

        expect(width).toBe(expected[strength].width);
        expect(color).toBe(expected[strength].color);
      });
    }
  });

  test.describe('API endpoint tests', () => {
    test('Valid inputs but API unavailable shows clear error and no success', async ({
      page,
    }) => {
      await page.route('**/api.php', (route) => route.abort('failed'));

      await page.goto('./');
      regPage = new RegistrationPage(page);
      await regPage.waitForPageLoad();

      await regPage.fillForm(
        validInput.email,
        validInput.email,
        validInput.password,
      );
      await regPage.loc.submitBtn.click();

      await expect(
        page.getByText('Network error. Please try again later.'),
      ).toBeVisible();
      await expect(regPage.loc.submissionStatus).not.toContainClass('success');
    });
  });
});
