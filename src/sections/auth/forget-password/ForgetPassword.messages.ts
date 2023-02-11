import { defineMessages } from 'react-intl';

const scope = 'auth.forgetPassword';

const ForgetPasswordMessages = defineMessages({
  continue: {
    id: `${scope}.continue`,
    defaultMessage: 'Continue',
  },
  resend: {
    id: `${scope}.resend`,
    defaultMessage: 'Resend',
  },
  validEmailMessage: {
    id: `${scope}.validEmailMessage`,
    defaultMessage: 'Please use a valid email address.',
  },

  validPhoneNoMessage: {
    id: `${scope}.validPhoneNoMessage`,
    defaultMessage: 'Please use a valid phone number address.',
  },
  EmailPlaceholder: {
    id: `${scope}.EmailPlaceholder`,
    defaultMessage: 'Email address',
  },
  PhoneNoPlaceholder: {
    id: `${scope}.PhoneNoPlaceholder`,
    defaultMessage: 'Enter phone number',
  },
  usingPhoneNoMessage: {
    id: `${scope}.usingPhoneNoMessage`,
    defaultMessage: 'Using Phone Number',
  },
  usingEmailMessage: {
    id: `${scope}.usingEmailMessage`,
    defaultMessage: 'Using Email',
  },
  verificationEmailAlertMessage: {
    id: `${scope}.verificationEmailAlertMessage`,
    defaultMessage: 'Enter the 5-digit verification code sent to {partialEmail}',
  },
  resetPasswordLabel: {
    id: `${scope}.resetPasswordLabel`,
    defaultMessage: 'New password',
  },
});

export default ForgetPasswordMessages;
