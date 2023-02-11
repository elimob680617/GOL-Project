import { Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

import Image from 'src/components/Image';

const SocialButtonStyle = styled('div')(({ theme }) => ({
  width: 88,
  height: 48,
  display: 'flex',
  borderRadius: theme.spacing(1),
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: '1PX',
  borderStyle: 'solid',
  borderColor: theme.palette.grey[300],
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
    cursor: 'pointer',
    border: 'none',
  },
}));

function SocialSignInButtons() {
  return (
    <Stack mt={2} direction="row" spacing={2} justifyContent="center">
      <SocialButtonStyle>
        <Image alt="logo" src="/icons/socials/google.png" width="30px" height="30px" />
      </SocialButtonStyle>
      <SocialButtonStyle>
        <Image alt="apple" src="/icons/socials/apple.png" width="30px" height="30px" />
      </SocialButtonStyle>
      <SocialButtonStyle>
        <Image alt="facebook" src="/icons/socials/facebook2.png" width="11px" height="21px" />
      </SocialButtonStyle>
    </Stack>
  );
}
export default SocialSignInButtons;
