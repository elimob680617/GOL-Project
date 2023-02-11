import { FC } from 'react';

import { Skeleton, Stack } from '@mui/material';

const PostSkelton: FC = () => (
  <Stack
    justifyContent="space-between"
    spacing={2}
    sx={{ height: 451, border: (theme) => `1px solid ${theme.palette.grey[100]}`, borderRadius: 2, width: '100%' }}
  >
    <Stack sx={{ m: 2 }} direction="row" alignItems="center" justifyContent="flex-start" spacing={2}>
      <Skeleton variant="circular" width={48} height={48} />
      <Skeleton variant="rectangular" width={144} height={20} sx={{ borderRadius: 3 }} />
    </Stack>
    <Stack sx={{ flex: 1, width: '100%' }} alignItems="center" justifyContent="center">
      <Skeleton variant="rectangular" width="100%" height={188} />
    </Stack>
  </Stack>
);

export default PostSkelton;
