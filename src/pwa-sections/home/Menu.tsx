import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { Stack, Typography } from '@mui/material';

import HomeMessages from 'src/sections/home/home.messages';

const Menu: FC = () => (
  <Stack spacing={3}>
    <Stack spacing={1} sx={{ cursor: 'pointer' }} direction="row" alignItems="center">
      <img src="/icons/calender/24/Outline.svg" width={24} height={24} alt="campaign" />
      <Typography variant="subtitle2" sx={{ fontWeight: '400', fontSize: '14px', lineHeight: '17.5px' }}>
        <FormattedMessage {...HomeMessages.campagins} />
      </Typography>
    </Stack>
    <Stack spacing={1} sx={{ cursor: 'pointer' }} direction="row" alignItems="center">
      <img src="/icons/grid/24/Outline.svg" width={24} height={24} alt="campaign" />
      <Typography variant="subtitle2" sx={{ fontWeight: '400', fontSize: '14px', lineHeight: '17.5px' }}>
        <FormattedMessage {...HomeMessages.pages} />
      </Typography>
    </Stack>
    <Stack spacing={1} sx={{ cursor: 'pointer' }} direction="row" alignItems="center">
      <img src="/icons/account/24/Outline.svg" width={24} height={24} alt="campaign" />
      <Typography variant="subtitle2" sx={{ fontWeight: '400', fontSize: '14px', lineHeight: '17.5px' }}>
        <FormattedMessage {...HomeMessages.groups} />
      </Typography>
    </Stack>

    <Stack spacing={1} sx={{ cursor: 'pointer' }} direction="row" alignItems="center">
      <img src="/icons/Save/24/Outline.svg" width={24} height={24} alt="campaign" />
      <Typography variant="subtitle2" sx={{ fontWeight: '400', fontSize: '14px', lineHeight: '17.5px' }}>
        <FormattedMessage {...HomeMessages.saved} />
      </Typography>
    </Stack>

    <Stack spacing={1} sx={{ cursor: 'pointer' }} direction="row" alignItems="center">
      <img src="/icons/arrow/nft-arrow.svg" width={24} height={24} alt="campaign" />
      <Typography variant="subtitle2" sx={{ fontWeight: '400', fontSize: '14px', lineHeight: '17.5px' }}>
        <FormattedMessage {...HomeMessages.nft} />
      </Typography>
    </Stack>
  </Stack>
);

export default Menu;
