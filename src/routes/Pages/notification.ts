import { isMobile } from 'react-device-detect';

import asyncComponentLoader from 'src/utils/loader';

const notification = [
  {
    path: '/notification',
    element: asyncComponentLoader(() =>
      isMobile ? import('../../pwa-sections/notification') : import('../../sections/notification'),
    ),
  },
];
export default notification;
