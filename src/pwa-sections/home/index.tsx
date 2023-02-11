import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { Box } from '@mui/material';

import Drawer from 'src/components/Drawer';
import MainBottomNavigationBar from 'src/components/botton-bars/MainBottomNavigationBar';
import useAuth from 'src/hooks/useAuth';
import WelcomeDialog from 'src/pwa-sections/auth/sign-up/questions/common/WelcomeDialog';
import DrawerMenu from 'src/pwa-sections/home/DrawerMenu';
import HomePosts from 'src/pwa-sections/home/HomePosts';

export default function HomePwaIndex() {
  const query = useParams();
  const { user } = useAuth();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  return (
    <>
      <Box sx={{ height: '100%' }}>
        <HomePosts />
        <MainBottomNavigationBar />
      </Box>
      <Drawer open={openDrawer} onDismiss={() => setOpenDrawer(false)}>
        <DrawerMenu onClose={() => setOpenDrawer(false)} />
      </Drawer>
      {query?.showQuestion === 'true' && !user?.completeQar && <WelcomeDialog openWelcome={true} />}
    </>
  );
}
