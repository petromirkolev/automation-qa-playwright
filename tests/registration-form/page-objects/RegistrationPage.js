import { test, expect } from '@playwright/test';

/**
 * RegistrationPage (POM)
 *
 * Goals: Keep locators in one place, provides small, reusable actions and reusable assertions for validation.
 */
export class RegistrationPage {
  constructor(page) {
    this.page = page;

    this.loc = {
      emailLabel: page.getByText('Email Address'),
      confirmEmailLabel: page.getByText('Confirm Email'),
      passLabel: page.getByText('Password'),

      // Inputs
      emailInput: page.locator('[data-cy="email-input"]'),
      confirmEmailInput: page.locator('.email-confirm'),
      passwordInput: page.locator('[data-automation="password-field"]'),

      // Actions
      submitBtn: page.locator('#submitBtn'),
      submissionStatus: page.locator('#submission-status'),

      // Inline validation errors
      emailError: page.locator('#emailError'),
      confirmEmailError: page.locator('#confirmEmailError'),
      passError: page.locator('#passwordError'),

      // Password UI
      showPassword: page.locator('.toggle-password-btn'),
      strengthBar: page.locator('.strength-bar'),
    };
  }

  async fillEmail(email) {
    await this.loc.emailInput.fill(email);
  }

  async fillConfirmEmail(email) {
    await this.loc.confirmEmailInput.fill(email);
  }

  async fillPassword(password) {
    await this.loc.passwordInput.fill(password);
  }

  /**
   * Convenience method for “happy path” filling. Keeps tests cleaner and reduces repetition.
   */
  async fillForm(email, confirmEmail, password) {
    await this.fillEmail(email);
    await this.fillConfirmEmail(confirmEmail);
    await this.fillPassword(password);
  }

  /**
   * Click submit and wait for the registration endpoint response. Using Promise.all avoids a race condition.
   */
  async submitAndWaitForApi() {
    const baseUrl = test.info().project.use.baseURL;

    const [response] = await Promise.all([
      this.page.waitForResponse((r) => r.url() === `${baseUrl}api.php`),
      this.loc.submitBtn.click(),
    ]);

    return response;
  }

  /**
   * “One-liner” reusable validation assertion.
   */
  async expectLineError({ message, field }) {
    const fieldMap = {
      email: this.loc.emailInput,
      confirmEmail: this.loc.confirmEmailInput,
      password: this.loc.passwordInput,
    };

    await expect(this.page.getByText(message)).toBeVisible();
    await expect(fieldMap[field]).toHaveClass(/error/);
    await expect(this.loc.submitBtn).toBeDisabled();
  }

  /**
   * Basic “page is ready” guard. Only asserts elements that should always exist immediately.
   */
  async waitForPageLoad() {
    await expect(this.loc.emailLabel).toBeVisible();
    await expect(this.loc.confirmEmailLabel).toBeVisible();
    await expect(this.loc.passLabel).toBeVisible();
    await expect(this.loc.submitBtn).toBeVisible();
  }
}
