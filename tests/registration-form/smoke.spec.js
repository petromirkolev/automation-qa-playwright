import { test, expect } from '@playwright/test';
import { RegistrationPage } from './page-objects/RegistrationPage.js';

test.describe('Automation test suite - User registration form', () => {
  let regPage;

  test.beforeEach(async ({ page }) => {
    regPage = new RegistrationPage(page);
    await page.goto('./');
  });

  test.describe('Smoke tests', () => {
    test('App loads and main UI is visible', async () => {
      await expect(regPage.loc.emailLabel).toBeVisible();
      await expect(regPage.loc.confirmEmailLabel).toBeVisible();
      await expect(regPage.loc.passLabel).toBeVisible();
    });

    test('Registration with valid data', async () => {
      await regPage.loc.emailInput.fill('test@test.com');
      await regPage.loc.confirmEmailInput.fill('test@test.com');
      await regPage.loc.passwordInput.fill('Petromir123?');
      await regPage.loc.confirmBtn.click();
    });
    // Confirm button is disabled on initial load
    test('Confirm button is disabled on initial load', async () => {});
  });

  test.describe('Email address field tests', () => {});
});

// Email Address field
// Invalid email: empty input shows required error and disables Confirm
// Invalid email: whitespace-only shows validation error and disables Confirm
// Invalid email: missing “@” shows validation error and disables Confirm
// Invalid email: missing user part shows validation error and disables Confirm
// Invalid email: missing domain shows validation error and disables Confirm
// Invalid email: missing dot in domain shows validation error and disables Confirm
// Invalid email: missing TLD shows validation error and disables Confirm
// Invalid email: above max length shows validation error and disables Confirm
// Valid email removes error state and enables Confirm only if other fields valid
// Confirm Email field
// Invalid email + invalid confirm email shows “enter a valid email” and disables Confirm
// Valid email + different confirm email shows “emails do not match” and disables Confirm
// Email whitespace + confirm whitespace shows error state and disables Confirm
// Matching confirm email clears mismatch error
// Password field
// Invalid password: whitespace-only shows error and disables Confirm
// Invalid password: too short shows length error and disables Confirm
// Invalid password: too long shows length error and disables Confirm
// Invalid password: missing uppercase shows rule error and disables Confirm
// Invalid password: missing digit shows rule error and disables Confirm
// Valid password clears error state (assuming other fields valid)
// Password visibility
// Toggle password visibility changes input type password ↔ text
// Toggle password visibility keeps password value unchanged
// Toggle password visibility updates toggle button label/title appropriately
// Password strength indicator
// Strength indicator shows “Weak” for weak password
// Strength indicator shows “Moderate” for moderate password
// Strength indicator shows “Strong” for strong password
// Strength indicator shows “Very Strong” for very strong password
// API endpoint tests
// API: invalid email + password too long returns 400 with validation errors
// API: invalid email + password missing uppercase returns 400 with validation errors
// API: invalid email + password missing digit returns 400 with validation errors
// API: invalid email + password too short returns 400 with validation errors
// API: valid email + confirm email mismatch returns 400 with validation errors
// API: valid email + confirm email + valid password returns 200 and success message
// Generic user flows
// Submit with no input shows required errors and keeps Confirm disabled
// Submit with valid inputs shows “Registration successful” and receives 200 OK
// Valid inputs but API unavailable shows a clear error and does not show success
