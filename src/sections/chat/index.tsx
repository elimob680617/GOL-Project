import { Outlet } from 'react-router-dom';

import { Box, Container, Grid, styled } from '@mui/material';

import ConnectionsList from 'src/sections/chat/contacts/ConnectionsList';

const RootStyle = styled('div')(() => ({
  height: '100%',
  marginTop: '16px',
}));

const Index = () => {
  return (
    <Box sx={{ bgcolor: 'background.neutral', height: '100vh' }}>
      <Container
        maxWidth="lg"
        sx={(theme) => ({
          [theme.breakpoints.up('sm')]: {
            px: 0,
          },
        })}
      >
        <RootStyle>
          <Grid container spacing={2}>
            <Grid item xs={5}>
              <ConnectionsList />
            </Grid>
            <Grid item xs={7}>
              <Outlet />
            </Grid>
          </Grid>
        </RootStyle>
      </Container>
    </Box>
  );
};

export default Index;
