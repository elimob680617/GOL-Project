import { useState } from 'react';
// image
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Card, Container, Stack, Typography } from '@mui/material';
// @mui
import { styled } from '@mui/material/styles';

// components
import Logo from 'src/components/Logo';
import useAuth from 'src/hooks/useAuth';
import { basicInfoSelector } from 'src/store/slices/auth';

//...........................................................

const RootStyle = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.neutral,
  padding: theme.spacing(3, 0),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const HeaderStyle = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center !important',
  justifyContent: 'center',
  padding: theme.spacing(1),
  marginBottom: theme.spacing(8),
  marginTop: theme.spacing(2),
}));

const ContentStyle = styled(Card)(({ theme }) => ({
  maxWidth: 416,
  margin: 'auto',
  padding: theme.spacing(4),
}));
const LogoStyle = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '30%',
  left: '38%',
  transform: 'translate(0, -50%)',
}));

export default function SuccessSignUp() {
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { username, password }: any = useSelector(basicInfoSelector);

  const handleLogin = async () => {
    setLoading(true);
    await login(username, password);

    navigate(`/home/?showQuestion=true`);
  };
  return (
    <RootStyle>
      <Container maxWidth="sm">
        <HeaderStyle>
          <LogoStyle>
            <Logo />
          </LogoStyle>
        </HeaderStyle>
        <ContentStyle>
          <img src={'src/assets/images/SuccessSignUp.png'} alt="success" />
          <Stack alignItems="center" spacing={3}>
            <Typography variant="subtitle2" color="gray.700" textAlign="center">
              Your account has been created successfully.
            </Typography>
            <LoadingButton loading={loading} size="large" variant="contained" onClick={handleLogin}>
              <Typography variant="button" color="Background.paper.">
                {' '}
                Start exploring
              </Typography>
            </LoadingButton>
          </Stack>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
