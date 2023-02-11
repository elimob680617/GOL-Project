import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { Stack, Typography } from '@mui/material';

import SearchMessages from '../Search.messages';

const HashtagNotFound: FC = () => (
  <Stack alignItems="center" spacing={3}>
    <img src="/images/notfound/hashtagNotFound.svg" width={100} height={100} alt="fundrasing-not-found" />
    <Typography variant="body2" color="text.secondary">
      <FormattedMessage {...SearchMessages.notFound} />
    </Typography>
  </Stack>
);

export default HashtagNotFound;
