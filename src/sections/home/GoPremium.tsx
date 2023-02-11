import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { Stack, Typography, styled } from '@mui/material';

import { Icon } from 'src/components/Icon';

import HomeMessages from './home.messages';

const WrapperStyle = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderRadius: 16,
  padding: theme.spacing(1.5),
}));

const GoPremium: FC = () => (
  <WrapperStyle spacing={2} alignItems="center" direction="row">
    <Icon size={58} name="Premium" />
    <Stack spacing={1}>
      <Typography sx={{ fontWeight: 500, fontSize: '16px', lineHeight: '20px', color: 'common.white' }}>
        <FormattedMessage {...HomeMessages.freePremium} />
      </Typography>
      <Typography sx={{ fontWeight: 400, fontSize: '12px', lineHeight: '15px', color: '#ffffff' }}>
        <FormattedMessage {...HomeMessages.premiumDescription} />
      </Typography>
    </Stack>
  </WrapperStyle>
);

export default GoPremium;
