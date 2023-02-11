import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { Box, IconButton, Stack, Typography, styled } from '@mui/material';

import fakeImage from 'src/assets/fake-images/image 1.png';
import { Icon } from 'src/components/Icon';

import HomeMessages from './home.messages';

const ImageStyle = styled('img')(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
}));

const WrapperStyle = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  position: 'relative',
  height: '140px',
  overflow: 'hidden',
}));

const Ads: FC = () => (
  <WrapperStyle>
    <ImageStyle src={fakeImage} />
    <Stack direction="row" justifyContent="space-between">
      <Typography
        variant="caption"
        sx={{ fontWeight: '400', fontSize: '12px', lineHeight: '15px', color: 'common.white' }}
      >
        <FormattedMessage {...HomeMessages.ads} />
        {/* Ads */}
      </Typography>
      <Stack direction="row">
        <IconButton>
          <Icon name="Exclamation-Mark-1" type="solid" color="common.white" />
        </IconButton>
        <IconButton>
          <Icon name="Close" type="linear" color="common.white" />
        </IconButton>
      </Stack>
    </Stack>
  </WrapperStyle>
);

export default Ads;
