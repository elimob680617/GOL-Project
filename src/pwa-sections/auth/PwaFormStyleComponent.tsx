import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Container, styled } from '@mui/material';

import { Icon } from 'src/components/Icon';
import Logo from 'src/components/Logo';
import { PATH_AUTH } from 'src/routes/paths';

const RootStyle = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.neutral,
  padding: theme.spacing(2, 0),
  height: '100%',
}));

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

// const ImageStyle = styled('img')(({ theme }) => ({
//   cursor: 'pointer',
// }));

type Props = {
  children: ReactNode;
  title: string;
};

const PwaFormStyleComponent = (props: Props) => {
  const { children, title } = props;
  const navigate = useNavigate();
  return (
    <RootStyle>
      <Container maxWidth="sm">
        <HeaderStyle>
          {title !== 'Sign In' && (
            <Box
              px={2}
              onClick={() => {
                if (title === 'User Type Selection') {
                  navigate(PATH_AUTH.signIn);
                } else {
                  navigate(-1);
                }
              }}
            >
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

export default PwaFormStyleComponent;
