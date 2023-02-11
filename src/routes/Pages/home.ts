import { isMobile } from 'react-device-detect';

import asyncComponentLoader from 'src/utils/loader';

const notFoundPath = 'src/pages/NotFound';

const wizard = [
  {
    path: 'wizard-list',
    element: asyncComponentLoader(() =>
      isMobile
        ? import('src/pwa-sections/profile/user/wizard/WizardList')
        : import('src/sections/profile/user/wizard/WizardList'),
    ),
  },
  {
    path: 'wizard-list-ngo',
    element: asyncComponentLoader(() =>
      isMobile
        ? import('src/pwa-sections/profile/ngo/wizard/NgoWizardList')
        : import('src/sections/profile/ngo/wizard/WizardList'),
    ),
  },
];
const payment = [
  {
    path: 'payment',
    element: asyncComponentLoader(() => import('src/sections/Payment/PaymentFormDialog')),
  },
  {
    path: 'success-payment',
    element: asyncComponentLoader(() => import('src/sections/Payment/SuccessRedirectToApplication')),
  },
  {
    path: 'payment/failed-payment',
    element: asyncComponentLoader(() => import('src/sections/Payment/FailedRedirectToApplication')),
  },
];

/* #region  AfterRegistration */

const afterRegistration = [
  {
    path: 'welcome',
    element: asyncComponentLoader(() =>
      isMobile ? import(`${notFoundPath}`) : import(`src/sections/auth/sign-up/questions/common/WelcomeWellDoneDialog`),
    ),
  },
  {
    path: 'done',
    element: asyncComponentLoader(() =>
      isMobile ? import(`${notFoundPath}`) : import(`src/sections/auth/sign-up/questions/common/WelcomeWellDoneDialog`),
    ),
  },
  {
    path: 'suggest-people',
    element: asyncComponentLoader(() =>
      isMobile ? import(`${notFoundPath}`) : import(`src/sections/auth/sign-up/questions/common/SelectConnection`),
    ),
  },
  {
    path: 'location',
    element: asyncComponentLoader(() =>
      isMobile ? import(`${notFoundPath}`) : import(`src/sections/auth/sign-up/questions/common/SelectLocation`),
    ),
  },
  {
    path: 'gender',
    element: asyncComponentLoader(() =>
      isMobile ? import(`${notFoundPath}`) : import(`src/sections/auth/sign-up/questions/normal/SelectGender`),
    ),
  },
  {
    path: 'categories',
    element: asyncComponentLoader(() =>
      isMobile ? import(`${notFoundPath}`) : import(`src/sections/auth/sign-up/questions/normal/SelectCategory`),
    ),
  },
  {
    path: 'reasons',
    element: asyncComponentLoader(() =>
      isMobile ? import(`${notFoundPath}`) : import(`src/sections/auth/sign-up/questions/ngo/SelectJoinReason`),
    ),
  },
  {
    path: 'fields',
    element: asyncComponentLoader(() =>
      isMobile ? import(`${notFoundPath}`) : import(`src/sections/auth/sign-up/questions/ngo/SelectWorkField`),
    ),
  },
];
/* #endregion */

const exportFiles = [...afterRegistration, ...wizard, ...payment];
export default exportFiles;
