import { isMobile } from 'react-device-detect';

import asyncComponentLoader from 'src/utils/loader';

const notFoundPath = 'src/pages/NotFound';

const report = [
  {
    path: 'garden',
    element: asyncComponentLoader(() =>
      isMobile ? import(`${notFoundPath}`) : import('src/sections/reports/garden/ReportMain'),
    ),
  },
  {
    path: 'ngo',
    element: asyncComponentLoader(() =>
      isMobile ? import(`${notFoundPath}`) : import('src/sections/reports/ngo/ReportMain'),
    ),
  },
  {
    path: 'donated-money',
    element: asyncComponentLoader(() =>
      isMobile ? import(`${notFoundPath}`) : import('src/sections/reports/DonatedMoney'),
    ),
  },
  {
    path: ':garden',
    element: asyncComponentLoader(() =>
      isMobile ? import('src/pwa-sections/reports/garden/ReportMain') : import(`${notFoundPath}`),
    ),
  },
  {
    path: 'donorList',
    element: asyncComponentLoader(() =>
      isMobile ? import('src/pwa-sections/reports/garden/ReportMain') : import(`${notFoundPath}`),
    ),
  },
];
export default report;
