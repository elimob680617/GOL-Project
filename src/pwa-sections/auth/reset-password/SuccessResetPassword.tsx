import { Link } from 'react-router-dom';

import { Button, Card, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import ImageSuccess from 'src/assets/images/SuccessForgetPassword.png';
import { PATH_AUTH } from 'src/routes/paths';

import PwaResetPassFormStyleCompenent from '../forget-password/PwaResetPassFormStyleCompenent';

const ContentStyle = styled(Card)(({ theme }) => ({
  margin: 'auto',
  padding: theme.spacing(2),
}));

export default function SuccessResetPassword() {
  return (
    <PwaResetPassFormStyleCompenent title="Success Reset Password">
      <ContentStyle>
        <img loading="lazy" src={ImageSuccess} alt="success" />
        <Stack alignItems="center" spacing={3}>
          <Typography variant="subtitle2" color="gray.700">
            Your Password has been reset successfully
          </Typography>
          <Link to={PATH_AUTH.signIn}>
            <Button size="large" variant="contained" sx={{ mt: 5 }}>
              Log into your account
            </Button>
          </Link>
        </Stack>
      </ContentStyle>
    </PwaResetPassFormStyleCompenent>
  );
}
