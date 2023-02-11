import { isMobile } from 'react-device-detect';

import asyncComponentLoader from 'src/utils/loader';

const connections = [
  {
    path: ':type',
    element: asyncComponentLoader(() =>
      isMobile
        ? import('src/pwa-sections/connections/ConnectionLayout')
        : import('src/sections/connections/ConnectionLayout'),
    ),
  },
];
export default connections;
