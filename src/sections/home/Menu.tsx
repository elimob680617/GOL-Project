import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { Stack, Typography } from '@mui/material';

import { Icon } from 'src/components/Icon';

import HomeMessages from './home.messages';

const Menu: FC = () => (
  <Stack spacing={3}>
    <Stack spacing={1} sx={{ cursor: 'pointer' }} direction="row" alignItems="center">
      <Icon name="Campaign" color="grey.900" />
      <Typography variant="subtitle2" sx={{ fontWeight: '400', fontSize: '14px', lineHeight: '17.5px' }}>
        <FormattedMessage {...HomeMessages.campagins} />
      </Typography>
    </Stack>
    <Stack spacing={1} sx={{ cursor: 'pointer' }} direction="row" alignItems="center">
      <Icon name="Catrgories" color="grey.900" />
      <Typography variant="subtitle2" sx={{ fontWeight: '400', fontSize: '14px', lineHeight: '17.5px' }}>
        <FormattedMessage {...HomeMessages.pages} />
      </Typography>
    </Stack>
    <Stack spacing={1} sx={{ cursor: 'pointer' }} direction="row" alignItems="center">
      <Icon name="Groups" color="grey.900" />
      <Typography variant="subtitle2" sx={{ fontWeight: '400', fontSize: '14px', lineHeight: '17.5px' }}>
        <FormattedMessage {...HomeMessages.groups} />
      </Typography>
    </Stack>

    <Stack spacing={1} sx={{ cursor: 'pointer' }} direction="row" alignItems="center">
      <Icon name="Save" color="grey.900" />
      <Typography variant="subtitle2" sx={{ fontWeight: '400', fontSize: '14px', lineHeight: '17.5px' }}>
        <FormattedMessage {...HomeMessages.saved} />
      </Typography>
    </Stack>

    <Stack spacing={1} sx={{ cursor: 'pointer' }} direction="row" alignItems="center">
      <Icon name="NFT" color="grey.900" />
      <Typography variant="subtitle2" sx={{ fontWeight: '400', fontSize: '14px', lineHeight: '17.5px' }}>
        <FormattedMessage {...HomeMessages.nft} />
      </Typography>
    </Stack>
  </Stack>
);

export default Menu;
