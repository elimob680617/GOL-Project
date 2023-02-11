import { FC } from 'react';

import { Divider, Skeleton, Stack } from '@mui/material';

const PostSkelton: FC = () => (
  <Stack justifyContent="space-between" spacing={2} sx={{ height: 322 }}>
    <Stack sx={{ px: 2, paddingTop: 2 }} direction="row" alignItems="center" justifyContent="flex-start" spacing={2}>
      <Skeleton variant="circular" width={48} height={48} />
      <Skeleton variant="rectangular" width={144} height={20} sx={{ borderRadius: 3 }} />
    </Stack>
    <Stack sx={{ width: '100%' }} alignItems="center">
      <Skeleton variant="rectangular" width="100%" height={188} />
    </Stack>
    <Divider sx={{ borderBottomWidth: 'thick', borderColor: (theme) => theme.palette.grey[100] }} />
  </Stack>
);

export default PostSkelton;
