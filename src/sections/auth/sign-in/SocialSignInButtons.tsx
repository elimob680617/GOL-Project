// import { useEffect } from 'react';
// import GoogleLogin from 'react-google-login';
import { Link as MuiLink, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

import appleIcon from 'src/assets/icons/appleIcon.svg';
import facebookIcon from 'src/assets/icons/facebookIcon.svg';
// import { gapi } from 'gapi-script';
import googleIcon from 'src/assets/icons/googleIcon.svg';
import Image from 'src/components/Image';

const SocialButtonStyle = styled(Stack)(({ theme }) => ({
  width: 55,
  height: 35,
  borderRadius: theme.spacing(1),
  alignItems: 'center',
  padding: theme.spacing(1.5, 4),
  justifyContent: 'center',
  borderWidth: '1PX',
  borderStyle: 'solid',
  borderColor: theme.palette.grey[300],
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
    cursor: 'pointer',
    borderWidth: '1PX',
    borderStyle: 'solid',
    borderColor: theme.palette.grey[100],
  },
}));

// const GmailLoginButton = styled(Button)(({ theme }) => ({
//   backgroundColor: theme.palette.background.paper,
//   border: '1px solid',
//   borderColor: theme.palette.grey[300],
//   paddingInline: theme.spacing(4),
//   paddingTop: theme.spacing(3),
//   paddingBottom: theme.spacing(3),
//   cursor: 'pointer',
//   '&:hover': {
//     backgroundColor: theme.palette.grey[100],
//     cursor: 'pointer',
//     border: '1px solid',
//     borderColor: theme.palette.grey[100],
//   },
// }));

function SocialSignInButtons() {
  const googleLink =
    'https://devids.aws.gardenoflove.co/External/Challenge?scheme=Google&returnUrl=https://dev.aws.gardenoflove.co';
  // useEffect(() => {
  //   const initClient = () => {
  //     gapi.client.init({
  //       clientId: { process: process.env.REACT_APP_GOOGLE_CLIENT_ID },
  //       scope: '',
  //     });
  //   };
  //   gapi.load('client:auth2', initClient);
  // });

  // const handleFailure = (result: any) => {
  //   console.log('Login failed: result:', result);
  //   console.log('Failed to login. 😢');
  // };

  // const handleLogin = (googleData: any) => {
  //   console.log('Login Success: currentUser:', googleData.profileObj);
  //   alert(`Logged in successfully welcome ${googleData.profileObj.name} 😍. \n See console for full profile object.`);
  //   // refreshTokenSetup(googleData);
  // };

  return (
    <Stack mt={2} direction="row" spacing={4} justifyContent="center">
      {/* <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID as string}
        render={(renderProps) => (
          <GmailLoginButton onClick={renderProps.onClick} disabled={renderProps.disabled}>
            <img src={googleIcon} alt="google icon" />
          </GmailLoginButton>
        )}
        buttonText=""
        onSuccess={handleLogin}
        onFailure={handleFailure}
        cookiePolicy={'single_host_origin'}
        isSignedIn={true}
      ></GoogleLogin> */}
      <MuiLink underline="none" target={'_blank'} href={googleLink}>
        <SocialButtonStyle>
          <Image alt="google" src={googleIcon} />
        </SocialButtonStyle>
      </MuiLink>
      <MuiLink underline="none" target={'_blank'} href={googleLink}>
        <SocialButtonStyle>
          <Image alt="apple" src={appleIcon} />
        </SocialButtonStyle>
      </MuiLink>
      <MuiLink underline="none" target={'_blank'} href={googleLink}>
        <SocialButtonStyle>
          <Image alt="facebook" src={facebookIcon} />
        </SocialButtonStyle>
      </MuiLink>
    </Stack>
  );
}
export default SocialSignInButtons;
