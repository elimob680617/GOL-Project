import { isMobile } from 'react-device-detect';

import asyncComponentLoader from 'src/utils/loader';

const campaigns = [
  {
    path: '/campaigns',
    element: asyncComponentLoader(() =>
      isMobile
        ? import('../../pwa-sections/campaignLanding/index')
        : import('../../sections/post/campaignPost/landing'),
    ),
  },
  {
    path: '/campaigns/reports',
    element: asyncComponentLoader(() =>
      isMobile
        ? import('src/pwa-sections/campaignLanding/Reports')
        : import('../../sections/post/campaignPost/landing'),
    ),
  },
  {
    path: '/campaigns/reports/overview',
    element: asyncComponentLoader(() =>
      isMobile
        ? import('src/pwa-sections/campaignLanding/Reports')
        : import('../../sections/post/campaignPost/landing'),
    ),
  },
  {
    path: '/campaigns/reports/overview/:id',
    element: asyncComponentLoader(() =>
      isMobile
        ? import('src/pwa-sections/campaignLanding/Reports')
        : import('../../sections/post/campaignPost/landing'),
    ),
  },
  {
    path: '/campaigns/reports/successful',
    element: asyncComponentLoader(() =>
      isMobile
        ? import('src/pwa-sections/campaignLanding/Reports')
        : import('../../sections/post/campaignPost/landing'),
    ),
  },
  {
    path: '/campaigns/reports/finished',
    element: asyncComponentLoader(() =>
      isMobile
        ? import('src/pwa-sections/campaignLanding/Reports')
        : import('../../sections/post/campaignPost/landing'),
    ),
  },
  {
    path: '/campaigns/reports/active',
    element: asyncComponentLoader(() =>
      isMobile
        ? import('src/pwa-sections/campaignLanding/Reports')
        : import('../../sections/post/campaignPost/landing'),
    ),
  },
  {
    path: '/campaigns/reports/interrupted',
    element: asyncComponentLoader(() =>
      isMobile
        ? import('src/pwa-sections/campaignLanding/Reports')
        : import('../../sections/post/campaignPost/landing'),
    ),
  },
  {
    path: '/campaigns/reports/donorList',
    element: asyncComponentLoader(() =>
      isMobile
        ? import('src/pwa-sections/reports/ngo/component/DonorList')
        : import('../../sections/post/campaignPost/landing'),
    ),
  },
];
export default campaigns;
