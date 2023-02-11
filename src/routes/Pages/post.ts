import { isMobile } from 'react-device-detect';

import asyncComponentLoader from 'src/utils/loader';

const notFoundPath = 'src/pages/NotFound';

const post = [
  {
    path: 'campaign-post/:create',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import('src/sections/post/campaignPost/careateCampaignPost/CreateCampaignPost'),
    ),
  },
  {
    path: 'campaign-post/landing',
    element: asyncComponentLoader(() =>
      isMobile ? import(`${notFoundPath}`) : import('src/sections/post/campaignPost/landing/CampaginLandingPage'),
    ),
  },
  {
    path: 'post-details/:id',
    element: asyncComponentLoader(() =>
      isMobile
        ? import('src/pwa-sections/post/campaignPost/postDetails/CampaignPostDetails')
        : import('src/sections/post/campaignPost/postDetails/CampaignPostDetails'),
    ),
  },
  {
    path: 'share-post',
    element: asyncComponentLoader(() =>
      isMobile ? import(`${notFoundPath}`) : import('src/sections/post/sharePost/SharePostDialog'),
    ),
  },
  {
    path: 'more-media/:id',
    element: asyncComponentLoader(() =>
      isMobile
        ? import('src/pwa-sections/post/more-media')
        : import('src/sections/post/socialPost/MediaDialog/MediaDialog'),
    ),
  },
  {
    path: 'create-social-post',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import('src/sections/post/socialPost/createSocialPost/SocialPostCreateDialog'),
    ),
  },
  {
    path: 'add-social-post-location',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import('src/sections/post/socialPost/createSocialPost/SocialPostAddLocationDialog'),
    ),
  },
  {
    path: 'add-gif',
    element: asyncComponentLoader(() => (isMobile ? import(`${notFoundPath}`) : import('src/components/gif'))),
  },
  {
    path: 'send-post/send-to-connections',
    element: asyncComponentLoader(() =>
      isMobile ? import('src/pwa-sections/post/sendPost/SendToConnections') : import(`${notFoundPath}`),
    ),
  },

  {
    path: 'add-share-location',
    element: asyncComponentLoader(() =>
      isMobile ? import('src/pwa-sections/post/sharePost/SharePostAddLocation') : import(`${notFoundPath}`),
    ),
  },
  {
    path: 'social-post/add-gif',
    element: asyncComponentLoader(() =>
      isMobile ? import('src/pwa-sections/post/create-post/social-post/add-gif') : import(`${notFoundPath}`),
    ),
  },
  {
    path: 'social-post/add-location',
    element: asyncComponentLoader(() =>
      isMobile ? import('src/pwa-sections/post/create-post/social-post/add-location') : import(`${notFoundPath}`),
    ),
  },
  {
    path: 'social-post/create',
    element: asyncComponentLoader(() =>
      isMobile ? import('src/pwa-sections/post/create-post/social-post/create') : import(`${notFoundPath}`),
    ),
  },
];
export default post;
