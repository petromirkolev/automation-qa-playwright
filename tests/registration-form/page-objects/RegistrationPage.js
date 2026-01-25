export class RegistrationPage {
  constructor(page) {
    this.page = page;
    this.loc = {
      emailLabel: page.getByText('Email Address'),
      confirmEmailLabel: page.getByText('Confirm Email'),
      passLabel: page.getByText('Password'),
      emailInput: page.locator('[data-cy="email-input"]'),
      confirmEmailInput: page.locator('.email-confirm'),
      passwordInput: page.locator('[data-automation="password-field"]'),
      confirmBtn: page.locator('#submitBtn'),
      submissionStatus: page.locator('#submission-status'),
    };
  }
}
