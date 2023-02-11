import { isMobile } from 'react-device-detect';

import asyncComponentLoader from 'src/utils/loader';

const notFoundPath = 'src/pages/NotFound';

const homePost = [
  {
    path: 'share-post',
    element: asyncComponentLoader(() =>
      isMobile ? import(`${notFoundPath}`) : import('src/sections/post/sharePost/SharePostDialog'),
    ),
  },
  {
    path: 'share-post/',
    element: asyncComponentLoader(() =>
      isMobile
        ? import('src/pwa-sections/post/sharePost/SharePost')
        : import('src/sections/post/sharePost/SharePostDialog'),
    ),
  },
  {
    path: 'share-post/:id/edit',
    element: asyncComponentLoader(() =>
      isMobile ? import('src/pwa-sections/post/sharePost/SharePost') : import(`${notFoundPath}`),
    ),
  },
  {
    path: 'send-post/',
    element: asyncComponentLoader(() =>
      isMobile
        ? import('src/pwa-sections/post/sendPost/SendPost')
        : import('src/sections/post/sharePost/sendPost/SendPostChatDialog'),
    ),
  },
  {
    path: 'add-share-location',
    element: asyncComponentLoader(() =>
      isMobile
        ? import('src/pwa-sections/post/sharePost/SharePostAddLocation')
        : import('src/sections/post/sharePost/SharePostAddLocationDialog'),
    ),
  },
  {
    path: 'send-to-connections',
    element: asyncComponentLoader(() =>
      isMobile
        ? import('src/pwa-sections/post/sendPost/SendToConnections')
        : import('src/sections/post/sharePost/sendPost/SendToConnectionsDialog'),
    ),
  },
];
export default homePost;
