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
  backgroundColor: theme.palette.background.neutral,
  padding: theme.spacing(3, 0),
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    alignItems: 'center',
  },
}));
// const ImageStyle = styled('img')(({ theme }) => ({
//   cursor: 'pointer',
// }));
const HeaderStyle = styled('header')(({ theme }) => ({
  lineHeight: 0,
  position: 'relative',
  width: '100%',
  display: 'flex',
  alignItems: 'center !important',
  justifyContent: 'start',
  marginBottom: theme.spacing(6),
  paddingTop: theme.spacing(6),
}));
const LogoStyle = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '90%',
  left: '39%',
  transform: 'translate(0, -50%)',
}));

const PwaResetPassFormStyleCompenent = (props: Props) => {
  const { children, title } = props;
  const navigate = useNavigate();
  return (
    <RootStyle>
      <Container maxWidth="sm">
        <HeaderStyle>
          {title !== 'Success Reset Password' && (
            <Box onClick={() => navigate(-1)}>
              <Icon name="left-arrow-1" />
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

export default PwaResetPassFormStyleCompenent;
