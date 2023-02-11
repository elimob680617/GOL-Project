import { Stack, Typography } from '@mui/material';

import { Icon } from '../Icon';

const CheckPrivacyErrorMessage = () => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ bgcolor: 'error.main', borderRadius: 1, maxWidth: '100%', maxHeight: 48, px: 1, py: 1.5 }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <Icon name="forbidden" color="grey.0" />
        <Typography variant="caption" color="grey.0">
          Please check our Privacy & Terms Policy.
        </Typography>
      </Stack>
      <Icon name="Close" color="grey.0" />
    </Stack>
  );
};

export default CheckPrivacyErrorMessage;
