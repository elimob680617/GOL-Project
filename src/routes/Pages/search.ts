import { isMobile } from 'react-device-detect';

import asyncComponentLoader from 'src/utils/loader';

const search = [
  {
    path: ':index',
    element: asyncComponentLoader(() =>
      isMobile ? import('src/pwa-sections/search/SearchMain') : import('src/sections/search/SearchMain'),
    ),
  },
];
export default search;
