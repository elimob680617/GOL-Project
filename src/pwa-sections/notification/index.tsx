import { Box, Stack } from '@mui/material';

import MainBottomNavigationBar from 'src/components/botton-bars/MainBottomNavigationBar';
import { bottomNavbar } from 'src/config';
import NotifSection from 'src/pwa-sections/notification/NotifSection';

function Notification() {
  return (
    <Box sx={{ height: '100%', maxWidth: '100%' }}>
      <Stack
        sx={{ height: `calc(100% - ${bottomNavbar.height}px)`, overflowY: 'auto', maxWidth: '100%' }}
        spacing={0.5}
      >
        <NotifSection />
      </Stack>
      <Box sx={{ marginTop: '0!important' }}>
        <MainBottomNavigationBar />
      </Box>
    </Box>
  );
}

export default Notification;
