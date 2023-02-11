import { isMobile } from 'react-device-detect';

import asyncComponentLoader from 'src/utils/loader/';

const postProfile = [
  {
    path: 'posts/:userId',
    element: asyncComponentLoader(() =>
      isMobile
        ? import('src/pwa-sections/profile/components/posts/Posts')
        : import('src/sections/profile/components/posts/Posts'),
    ),
  },
];
export default postProfile;
