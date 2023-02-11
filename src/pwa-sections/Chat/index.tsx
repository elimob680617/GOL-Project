import { Outlet } from 'react-router-dom';

import { Box, Container, styled } from '@mui/material';

import MainBottomNavigationBar from 'src/components/botton-bars/MainBottomNavigationBar';

const RootStyle = styled('div')(() => ({
  height: '100%',
}));

const Index = () => {
  return (
    <Container
      maxWidth="lg"
      sx={(theme) => ({
        [theme.breakpoints.up('sm')]: {
          px: 0,
        },
      })}
    >
      <RootStyle>
        <Outlet />
        <Box sx={{ position: 'absolute', bottom: 0, right: 0, left: 0 }}>
          <MainBottomNavigationBar />
        </Box>
      </RootStyle>
    </Container>
  );
};

export default Index;
