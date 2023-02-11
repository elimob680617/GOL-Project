import { isMobile } from 'react-device-detect';

import asyncComponentLoader from 'src/utils/loader';

const notFoundPath = 'src/pages/NotFound';

const help = [
  {
    path: ':help',
    element: asyncComponentLoader(() =>
      isMobile ? import('src/pwa-sections/help/HelpCenter') : import('src/sections/help/HelpCenter'),
    ),
  },
  {
    path: 'articles/:id',
    element: asyncComponentLoader(() =>
      isMobile ? import('src/pwa-sections/help/HelpArticle') : import(`${notFoundPath}`),
    ),
  },
  {
    path: 'category',
    element: asyncComponentLoader(() =>
      isMobile ? import('src/pwa-sections/help/HelpItems') : import(`${notFoundPath}`),
    ),
  },
];
export default help;
