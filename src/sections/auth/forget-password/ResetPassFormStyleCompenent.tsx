import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Container, styled } from '@mui/material';

import { Icon } from 'src/components/Icon';
import Logo from 'src/components/Logo';

type Props = {
  children: ReactNode;
  title: string;
};
const RootStyle = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  // backgroundColor: theme.palette.grey[200],
  padding: theme.spacing(3, 0),
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    alignItems: 'center',
  },
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));
const HeaderStyle = styled(Box)(({ theme }) => ({
  lineHeight: 0,
  position: 'relative',
  width: '100%',
  display: 'flex',
  alignItems: 'center !important',
  justifyContent: 'start',
  marginBottom: theme.spacing(4),
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(3, 3),
  },
}));

const LogoStyle = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: '42%',
  top: '50%',
  transform: 'translate(0, -50%)',
}));

const ResetPassFormStyleCompenent = (props: Props) => {
  const { children, title } = props;
  const navigate = useNavigate();
  return (
    <RootStyle>
      <Container maxWidth="sm">
        <HeaderStyle>
          {title !== 'Success Reset Password' && (
            <Box px={2} onClick={() => navigate(-1)} sx={{ cursor: 'pointer' }}>
              <Icon name="left-arrow" />
            </Box>
          )}
          <LogoStyle>
            <Logo sx={{ width: 94, height: 82 }} />
          </LogoStyle>
        </HeaderStyle>
        {children}
      </Container>
    </RootStyle>
  );
};

export default ResetPassFormStyleCompenent;
