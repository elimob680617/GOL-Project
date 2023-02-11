import { isMobile } from 'react-device-detect';

import asyncComponentLoader from 'src/utils/loader';

// const notFoundPath = 'src/pages/NotFound';

const chat = [
  {
    path: ':id',
    element: asyncComponentLoader(() =>
      isMobile ? import('src/pwa-sections/Chat/messages/ChatBox') : import('src/sections/chat/messages/ChatBox'),
    ),
  },
  // {
  //   path: 'profile/:id',
  //   element: asyncComponentLoader(() => (isMobile ? import(`${notFoundPath}`) : import(`${notFoundPath}`))),
  // },
  // {
  //   path: 'user/:id',
  //   element: asyncComponentLoader(() => (isMobile ? import('src/sections/chat') : import(`${notFoundPath}`))),
  // },
];
export default chat;
