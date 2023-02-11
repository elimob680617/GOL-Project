import { Outlet } from 'react-router-dom';

import { Box, Container, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

import Ads from 'src/sections/home/Ads';
import GoPremium from 'src/sections/home/GoPremium';
import Helpers from 'src/sections/home/Helpers';
import HomePosts from 'src/sections/home/HomePosts';
import Menu from 'src/sections/home/Menu';
import MyConnectionsDonors from 'src/sections/home/MyConnectionsDonors';
import Tops from 'src/sections/home/Tops';

const RootStyle = styled('div')(({ theme }) => ({
  height: '100%',
  paddingTop: theme.spacing(3),
}));
const HomeIndex = () => {
  return (
    <Box sx={{ width: '100%', bgcolor: 'background.neutral', minHeight: 'calc(100vh - 64px)' }}>
      <Container sx={{ p: { md: 0 } }}>
        <RootStyle>
          <Stack spacing={7.5} direction="row" sx={{ display: 'flex', justifyContent: 'center' }}>
            <Stack spacing={4} sx={{ width: 264 }}>
              <Menu />
              <GoPremium />
              <Helpers />
            </Stack>
            <HomePosts />
            <Stack spacing={1.5} sx={{ width: 264 }}>
              <MyConnectionsDonors />
              <Tops />
              <Ads />
            </Stack>
          </Stack>
        </RootStyle>
      </Container>
      <Outlet />
    </Box>
  );
};

export default HomeIndex;
