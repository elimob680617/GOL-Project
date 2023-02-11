import { isMobile } from 'react-device-detect';
import { Route, Routes } from 'react-router-dom';

import Box from '@mui/material/Box';

import Layout from 'src/Layout';
import NotFound from 'src/pages/NotFound';
import asyncComponentLoader from 'src/utils/loader';
import { AnyProps } from 'src/utils/loader/types';

import authRoutes from './auth';
import campaigns from './campaigns';
import chatRoutes from './chat';
import connectionRoutes from './connections';
import helpRoutes from './help';
import homeRoutes from './home';
import homePostRoutes from './homePost';
import notification from './notification';
import paymentRoutes from './payment';
import postRoutes from './post';
import ngoProfileRoutes from './profile/ngo';
import postProfileRoutes from './profile/post';
import userProfileRoutes from './profile/user';
import reportRoutes from './report';
import searchRoutes from './search';
import { getPageHeight } from './utils';

const Home = asyncComponentLoader(() => (isMobile ? import('src/pwa-sections/home') : import('src/sections/home')));
const NgoMainProfile = asyncComponentLoader(() =>
  isMobile
    ? import('src/pwa-sections/profile/ngo/owner/ngoMain/MainNGO')
    : import('src/sections/profile/ngo/owner/ngoMain/Main'),
);
const UserMainProfile = asyncComponentLoader(() =>
  isMobile
    ? import('src/pwa-sections/profile/user/owner/userMain/Main')
    : import('src/sections/profile/user/owner/userMain/Main'),
);

function Pages() {
  const renderRoutes = (
    routes: {
      path: string;
      element: (props: AnyProps) => JSX.Element;
    }[],
  ) =>
    routes?.map((route, idx) => <Route path={route.path} element={<route.element />} key={`${route.path}-${idx}`} />);

  return (
    <Box sx={{ height: (theme) => getPageHeight(theme) }}>
      <Box sx={{ height: (theme) => getPageHeight(theme) }}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={isMobile ? undefined : <Home />}>
              <Route index element={isMobile ? <Home /> : undefined} />
              {renderRoutes(homeRoutes)}
              {renderRoutes(homePostRoutes)}
            </Route>
            <Route path="profile/*">
              <Route path="ngo" element={isMobile ? undefined : <NgoMainProfile />}>
                <Route index element={isMobile ? <NgoMainProfile /> : undefined} />
                {renderRoutes(ngoProfileRoutes)}
              </Route>
              <Route path="user/*" element={isMobile ? undefined : <UserMainProfile />}>
                <Route index element={isMobile ? <UserMainProfile /> : undefined} />
                {renderRoutes(userProfileRoutes)}
              </Route>
              {renderRoutes(postProfileRoutes)}
            </Route>
            <Route path="report/*">{renderRoutes(reportRoutes)}</Route>
            <Route path="connections/*">{renderRoutes(connectionRoutes)}</Route>
            <Route path="help/*">{renderRoutes(helpRoutes)}</Route>
            <Route path="chat/*">{renderRoutes(chatRoutes)}</Route>

            <Route path="post/*">{renderRoutes(postRoutes)}</Route>
            <Route path="search/*">{renderRoutes(searchRoutes)}</Route>
            <Route path="notification">{renderRoutes(notification)}</Route>
            <Route path="campaigns">{renderRoutes(campaigns)}</Route>
          </Route>

          <Route path="auth/*">{renderRoutes(authRoutes)}</Route>
          <Route path="payment/*">{renderRoutes(paymentRoutes)}</Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default Pages;
