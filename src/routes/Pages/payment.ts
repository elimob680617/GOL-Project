import asyncComponentLoader from 'src/utils/loader';

const payment = [
  {
    path: 'success-payment',
    element: asyncComponentLoader(() => import('src/sections/Payment/SuccessRedirectToApplication')),
  },
  {
    path: 'unsuccess-payment',
    element: asyncComponentLoader(() => import('src/sections/Payment/FailedRedirectToApplication')),
  },
];
const exportFiles = [...payment];
export default exportFiles;
