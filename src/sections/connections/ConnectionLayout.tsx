import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, Button, Container, Divider, Stack, Typography, styled } from '@mui/material';

import useAuth from 'src/hooks/useAuth';
import GoPremium from 'src/sections/home/GoPremium';
import Helpers from 'src/sections/home/Helpers';
import { useDispatch } from 'src/store';
import { onResetConnections } from 'src/store/slices/connection/connections';
import { AccountPrivacyEnum } from 'src/types/serverTypes';

import ConnectionContent from './listContent/ConnectionContent';
import ConnectionSidebar from './sideBar/ConnectionSidebar';

const connectionsType = ['followers', 'followings', 'requests', 'requested'];
const ConnectionLayout = () => {
  const { user } = useAuth();
  const [pageIndex, setPageIndex] = useState<number>(1);
  const dispatch = useDispatch();
  const { type, userId } = useParams();
  const navigation = useNavigate();
  const ConnectionModesStyled = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    height: 68,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: `calc(100% + ${theme.spacing(4)})`,
    gap: 3,
    position: 'fixed',
  }));

  return (
    <>
      <Divider />
      <ConnectionModesStyled>
        <Container sx={{ p: '0px !important' }} maxWidth="lg">
          <Stack spacing={3} direction="row">
            {connectionsType
              .filter((i, ind) => {
                if (userId && ind > 1) {
                  return false;
                } else if (user?.accountPrivacy === AccountPrivacyEnum.Public && ind === 2) {
                  return false;
                }
                return true;
              })
              .map((item, index) => (
                <Button
                  key={index}
                  variant="text"
                  sx={{ backgroundColor: type === item ? (theme) => theme.palette.grey[100] : 'initial' }}
                  onClick={() => {
                    navigation(`${item}${userId ? `/?userId=${userId}` : ''}`);
                    setPageIndex(1);
                    dispatch(onResetConnections());
                  }}
                >
                  <Typography variant="subtitle1" color={type === item ? 'text.primary' : 'text.secondary'}>
                    {item}
                  </Typography>
                </Button>
              ))}
          </Stack>
        </Container>
      </ConnectionModesStyled>

      <Box sx={{ bgcolor: 'background.neutral', height: '88vh', marginTop: '16px' }}>
        <Container sx={{ pt: 2 }}>
          <Container sx={{ p: '0px !important', position: 'relative', left: 0, top: 68 }}>
            <Stack spacing={3} direction="row">
              <Stack spacing={4} sx={{ width: 264 }}>
                <ConnectionSidebar pageIndex={pageIndex} setPageIndex={setPageIndex} />
                <GoPremium />
                <Helpers />
              </Stack>
              <Stack sx={{ width: (theme) => `calc(100% - ${theme.spacing(36)})` }} spacing={3}>
                <ConnectionContent setPageIndex={setPageIndex} />
              </Stack>
            </Stack>
          </Container>
        </Container>
      </Box>
    </>
  );
};

export default ConnectionLayout;
