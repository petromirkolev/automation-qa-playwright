const invalidPassword = {
  invalidPasswordEmptySpaces: {
    invalidPasswordValue: '         ',
    testDescription: 'Fill in invalid password empty spaces.',
    errorMessage: 'Password must contain at least one capital letter',
  },
  invalidPasswordTooShort: {
    invalidPasswordValue: 'T3stt',
    testDescription: 'Fill in invalid password too short.',
    errorMessage: 'Password must be between 6 and 20 characters',
  },
  invalidPasswordNoUppercase: {
    invalidPasswordValue: 't3sting',
    testDescription: 'Fill in invalid password no uppercase.',
    errorMessage: 'Password must contain at least one capital letter',
  },
  invalidPasswordTooLong: {
    invalidPasswordValue: 'T3stingT3stingT3stingT3stingT3stingT3sting',
    testDescription: 'Fill in invalid password too long.',
    errorMessage: 'Password must be between 6 and 20 characters',
  },
  invalidPasswordNoDigit: {
    invalidPasswordValue: 'Testing',
    testDescription: 'Fill in invalid password no digit.',
    errorMessage: 'Password must contain at least one digit',
  },
};

const validPasswordStrength = {
  weak: 'Aaaaaa',
  moderate: 'T3sting',
  strong: 'T3sting123!',
  veryStrong: 'T3sting!Strong',
};

export { validPasswordStrength, invalidPassword };
