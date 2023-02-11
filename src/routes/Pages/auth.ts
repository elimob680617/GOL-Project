import { isMobile } from 'react-device-detect';

import asyncComponentLoader from 'src/utils/loader';

/* #region  signIn */
const signIn = [
  {
    path: 'sign-in',
    element: asyncComponentLoader(() =>
      isMobile ? import(`src/pwa-sections/auth/sign-in/SignInForm`) : import(`src/sections/auth/sign-in/SignInForm`),
    ),
  },
];
/* #endregion */

/* #region  signUp */

const signUp = [
  {
    path: 'sign-up/basic-info',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/auth/sign-up/BasicInfoForm`)
        : import(`src/sections/auth/sign-up/BasicInfoForm`),
    ),
  },
  {
    path: 'sign-up/type-selection',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/auth/sign-up/UserTypeSelection`)
        : import(`src/sections/auth/sign-up/UserTypeSelection`),
    ),
  },
  {
    path: 'sign-up/advanced-info',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/auth/sign-up/AdvanceInfoForm`)
        : import(`src/sections/auth/sign-up/AdvanceInfoForm`),
    ),
  },
  {
    path: 'sign-up/verification',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/auth/sign-up/VerifyRegistration`)
        : import(`src/sections/auth/sign-up/VerifyRegistration`),
    ),
  },
  {
    path: 'sign-up/success-signup',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/auth/sign-up/SuccessSignup`)
        : import(`src/sections/auth/sign-up/SuccessSignUp`),
    ),
  },
];
/* #endregion */

/* #region  forgetPassword */

const forgetPassword = [
  {
    path: 'forget-password',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/auth/forget-password/ForgetPasswordForm`)
        : import(`src/sections/auth/forget-password/ForgetPasswordForm`),
    ),
  },
  {
    path: 'reset-password',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/auth/reset-password/ResetPasswordForm`)
        : import(`src/sections/auth/reset-password/ResetPasswordForm`),
    ),
  },
  {
    path: 'confirmation-forget-password',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/auth/forget-password/ConfirmationForgetPassword`)
        : import(`src/sections/auth/forget-password/ConfirmationForgetPassword`),
    ),
  },
  {
    path: 'verify',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/auth/sign-up/VerifyRegistration`)
        : import(`src/sections/auth/sign-up/VerifyRegistration`),
    ),
  },
  {
    path: 'success-reset-password',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/auth/reset-password/SuccessResetPassword`)
        : import(`src/sections/auth/reset-password/SuccessResetPassword`),
    ),
  },
];
/* #endregion */

const exportFiles = [...signIn, ...signUp, ...forgetPassword];
export default exportFiles;
