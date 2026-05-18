import { test, expect } from '@playwright/test';

export class RegistrationPage {
  constructor() {
    this.page = page;

    this.loc = {
      emailLabel: page.getByText('Email Address'),
      confirmEmailLabel: page.getByText('Confirm Email'),
      passLabel: page.getByText('Password'),

      emailInput: page.locator('[data-cy="email-input"]'),
      confirmEmailInput: page.locator('.email-confirm'),
      passwordInput: page.locator('[data-automation="password-field"]'),

      submitBtn: page.locator('#submitBtn'),
      submissionStatus: page.locator('#submission-status'),

      emailError: page.locator('#emailError'),
      confirmEmailError: page.locator('#confirmEmailError'),
      passError: page.locator('#passwordError'),

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

  async fillForm(email, confirmEmail, password) {
    await this.fillEmail(email);
    await this.fillConfirmEmail(confirmEmail);
    await this.fillPassword(password);
  }

  async submitAndWaitForApi() {
    const baseUrl = test.info().project.use.baseURL;

    const [response] = await Promise.all([
      this.page.waitForResponse((r) => r.url() === `${baseUrl}api.php`),
      this.loc.submitBtn.click(),
    ]);

    return response;
  }

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

  async waitForPageLoad() {
    await expect(this.loc.emailLabel).toBeVisible();
    await expect(this.loc.confirmEmailLabel).toBeVisible();
    await expect(this.loc.passLabel).toBeVisible();
    await expect(this.loc.submitBtn).toBeVisible();
  }
}
