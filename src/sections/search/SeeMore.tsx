import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { Box, Button, Stack, Typography, styled } from '@mui/material';

import SearchMessages from './Search.messages';

const ReloadButtonStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
}));

const SearchSeeMore: FC<{ loading: boolean; seeMore: () => void }> = ({ loading, seeMore }) => (
  <ReloadButtonStyle>
    <Button
      onClick={() => seeMore()}
      variant="secondary"
      endIcon={
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{
            '& img': {
              ...(loading && {
                animation: 'rotating 0.5s linear infinite',
              }),
              '@-webkit-keyframes rotating': {
                from: {
                  transform: 'rotate(0deg)',
                },
                to: {
                  transform: 'rotate(360deg)',
                },
              },
            },
          }}
        >
          <img src="/icons/search/reload.svg" alt="reload" />
        </Stack>
      }
    >
      <Typography color="gray.900">
        <FormattedMessage {...SearchMessages.seeMore} />
      </Typography>
    </Button>
  </ReloadButtonStyle>
);

export default SearchSeeMore;
