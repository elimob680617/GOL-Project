import { FC } from 'react';

import { Stack, Typography, styled } from '@mui/material';

import { ISearchedHashtag } from 'src/types/post';

export const HashtagItemStyle = styled(Stack)(({ theme }) => ({}));

const HashtagItem: FC<ISearchedHashtag> = ({ id, title }) => (
  <>
    <HashtagItemStyle direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{
            width: 48,
            height: 48,
            border: (theme) => `1px solid ${theme.palette.grey[100]}`,
            borderRadius: '48px',
          }}
        >
          #
        </Stack>
        <Typography variant="subtitle1" color="surface.onSurface">
          {title}
        </Typography>
      </Stack>
    </HashtagItemStyle>
  </>
);

export default HashtagItem;
