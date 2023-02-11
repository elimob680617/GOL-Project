import { Link } from 'react-router-dom';

import { Button, Card, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import successForgetPassword from 'src/assets/images/SuccessForgetPassword.png';
import { PATH_AUTH } from 'src/routes/paths';

import ResetPassFormStyleCompenent from '../forget-password/ResetPassFormStyleCompenent';

const ContentStyle = styled(Card)(({ theme }) => ({
  maxWidth: 416,
  margin: 'auto',
  padding: theme.spacing(4),
}));

export default function SuccessResetPassword() {
  return (
    <ResetPassFormStyleCompenent title="Success Reset Password">
      <ContentStyle>
        <img loading="lazy" src={successForgetPassword} alt="success" />
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
    </ResetPassFormStyleCompenent>
  );
}
