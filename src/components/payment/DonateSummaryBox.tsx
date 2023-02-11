import { FC, ReactNode } from 'react';

import { Box, LinearProgress, Stack, Typography, linearProgressClasses, styled } from '@mui/material';

import { Icon } from '../Icon';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 0 : 800],
  },
}));

const DonateSummaryBox: FC<{ children?: ReactNode }> = (props) => {
  const { children } = props;
  return (
    <Box sx={{ bgcolor: 'background.neutral', borderRadius: 1 }} p={2}>
      <Stack spacing={2}>
        <Typography variant="subtitle2">$12222 raised of $30000</Typography>
        <BorderLinearProgress
          variant="determinate"
          // value={(raisedMoneyNum / targetNum) * 100}
          sx={{
            [`& .${linearProgressClasses.bar}`]: {
              borderRadius: 5,
              backgroundColor: (theme) => (theme.palette.mode === 'light' ? 'primary' : 'secondary'),
            },
          }}
        />
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.primary">
            156 people donated.
          </Typography>
          <Box sx={{ bgcolor: 'grey.0', p: 1, borderRadius: 0.5 }}>
            <Typography variant="subtitle2" color="primary.dark">
              330 days left
            </Typography>
          </Box>
        </Stack>
      </Stack>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 0.5 }} mt={1}>
        <Icon name="star" type="solid" color="secondary.main" />
        <Typography variant="button" color="secondary.main">
          4.4
        </Typography>
        <Typography variant="caption" color="text.secondary">
          `(Rated by 12.3k)`
        </Typography>
      </Box>
      <Box mt={3}>{children}</Box>
    </Box>
  );
};

export default DonateSummaryBox;
