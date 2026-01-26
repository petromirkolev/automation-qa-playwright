export const invalidEmailInput = {
  invalidEmailTooLong: {
    value: 'test@test1234567891234.net',
    testDescription: 'Fill in invalid email address above max length.',
    errorMessage: 'Email must not exceed 25 characters',
  },
  invalidEmailEmpty: {
    value: '            ',
    testDescription: 'Fill in invalid email address only empty spaces.',
    errorMessage: 'Email is required',
  },
  invalidEmailNoTld: {
    value: 'test@test.',
    testDescription: 'Fill in invalid email with no TLD.',
    errorMessage: 'Please enter a valid email address',
  },
  invalidEmailNoDot: {
    value: 'test@test',
    testDescription: 'Fill in invalid email with no dot in domain.',
    errorMessage: 'Please enter a valid email address',
  },
  invalidEmailNoAt: {
    value: 'testtest.net',
    testDescription: 'Fill in invalid email with no @ symbol.',
    errorMessage: 'Please enter a valid email address',
  },
  invalidEmailNoDomain: {
    value: 'test@test.',
    testDescription: 'Fill in invalid email with no domain.',
    errorMessage: 'Please enter a valid email address',
  },
  invalidEmailNoUser: {
    value: '@test.net',
    testDescription: 'Fill in invalid email with no user part.',
    errorMessage: 'Please enter a valid email address',
  },
  invalidEmailNoUserOrDomain: {
    value: '@.net',
    testDescription: 'Fill in invalid email with no user and no domain.',
    errorMessage: 'Please enter a valid email address',
  },
  invalidEmailNoUserOrTld: {
    value: '@test.',
    testDescription: 'Fill in invalid email with no user and no TLD.',
    errorMessage: 'Please enter a valid email address',
  },
  invalidEmailNoUserOrDomainOrTld: {
    value: '@test',
    testDescription:
      'Fill in invalid email with no user, no domain, and no TLD.',
    errorMessage: 'Please enter a valid email address',
  },
};
