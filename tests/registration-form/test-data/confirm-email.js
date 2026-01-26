export const confirmEmailInput = {
  invalidBoth: {
    email: 'test@test.',
    confirmEmail: 'test@test.',
    testDescription: 'Fill in invalid email and invalid confirm email.',
    errorMessage: 'Please enter a valid email address',
    errorField: 'email',
  },
  mismatch: {
    email: 'test@test.net',
    confirmEmail: 'test@testa.net',
    testDescription: 'Fill in valid email and different confirm email.',
    errorMessage: 'Emails do not match',
    errorField: 'confirmEmail',
  },
  emptyBoth: {
    email: '                  ',
    confirmEmail: '                  ',
    testDescription: 'Fill in empty spaces for email and confirm email.',
    errorMessage: 'Email is required',
    errorField: 'email',
  },
};
