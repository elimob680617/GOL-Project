import { useState } from 'react';
import { isMobile } from 'react-device-detect';
import { Link, Outlet, useNavigate } from 'react-router-dom';

import { Avatar, Box, Button, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

import Drawer from 'src/components/Drawer';
import { Icon } from 'src/components/Icon';
import Logo from 'src/components/Logo';
import { HEADER } from 'src/config';
import useAuth from 'src/hooks/useAuth';
import DrawerMenu from 'src/pwa-sections/home/DrawerMenu';
import { PATH_APP } from 'src/routes/paths';
import { UserTypeEnum } from 'src/types/serverTypes';

import Header from './header';

const MainStyle = styled('main')(({ theme }) => ({
  flexGrow: 1,
  [theme.breakpoints.up('lg')]: {
    paddingTop: HEADER.DASHBOARD_DESKTOP_HEIGHT,
    transition: theme.transitions.create('margin-left', {
      duration: theme.transitions.duration.shorter,
    }),
  },
}));

const NoWidthButtonStyle = styled(Button)(({ theme }) => ({
  padding: 0,
  minWidth: 0,
}));

const Layout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  return (
    <>
      {isMobile ? (
        <>
          <Box sx={{ height: '100vh' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" px={2} pt={1}>
              <Stack direction="row" alignItems="center">
                <NoWidthButtonStyle onClick={() => setOpenDrawer(true)}>
                  {/* <Image width={24} height={24} alt="menu" src="/icons/menu/Outline.svg" /> */}
                  <Icon name="Menu" type="solid" color="grey.500" />
                </NoWidthButtonStyle>
                <NoWidthButtonStyle
                  onClick={() =>
                    navigate(
                      user?.userType === UserTypeEnum.Normal ? PATH_APP.profile.user.root : PATH_APP.profile.ngo.root,
                    )
                  }
                >
                  <Avatar
                    sx={{ width: 32, height: 32 }}
                    src={user?.avatarUrl || ''}
                    variant={user?.userType === UserTypeEnum.Normal ? 'circular' : 'rounded'}
                  />
                </NoWidthButtonStyle>
              </Stack>

              <Link to="/">
                <NoWidthButtonStyle>
                  <Logo />
                </NoWidthButtonStyle>
              </Link>
              <Icon name="dollar-coin" type="linear" color="secondary.main" />
            </Stack>
            <Outlet />
          </Box>
          <Drawer open={openDrawer} onDismiss={() => setOpenDrawer(false)}>
            <DrawerMenu onClose={() => setOpenDrawer(false)} />
          </Drawer>
        </>
      ) : (
        <Box
          sx={{
            display: { lg: 'flex' },
            minHeight: { lg: 1 },
          }}
        >
          <Header />
          <MainStyle>
            <Outlet />
          </MainStyle>
        </Box>
      )}
    </>
  );
};

export default Layout;
