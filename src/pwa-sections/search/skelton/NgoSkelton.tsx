import { FC } from 'react';

import { Skeleton, Stack } from '@mui/material';

const NgoSkelton: FC = () => (
  <Stack direction="row" alignItems="center" spacing={2}>
    <Skeleton sx={{ borderRadius: 1 }} variant="rectangular" width={48} height={48} />
    <Skeleton variant="rectangular" width={144} height={20} sx={{ borderRadius: 3 }} />
  </Stack>
);

export default NgoSkelton;
