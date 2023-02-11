import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { Stack, Typography } from '@mui/material';

import SearchMessages from '../Search.messages';

const PageNotFound: FC = () => (
  <Stack alignItems="center" spacing={3}>
    <img src="/images/notfound/pageNotFound.svg" width={100} height={100} alt="ngo-not-found" />
    <Typography variant="body2" color="text.secondary">
      <FormattedMessage {...SearchMessages.notFound} />
    </Typography>
  </Stack>
);

export default PageNotFound;
