import { FC } from 'react';

import { Stack, Typography } from '@mui/material';

import Image from 'src/components/Image';

const NgoNotFound: FC = () => (
  <Stack alignItems="center" spacing={3}>
    <Image src="/images/notfound/ngoNotFound.svg" width={100} height={100} alt="ngo-not-found" />
    <Typography variant="body2" color="text.secondary">
      No Data Found
    </Typography>
  </Stack>
);

export default NgoNotFound;
