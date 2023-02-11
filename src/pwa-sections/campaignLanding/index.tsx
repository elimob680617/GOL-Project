import { Box } from '@mui/material';

import CampaignLanding from 'src/pwa-sections/campaignLanding/CampaignLanding';

function Campaign() {
  return (
    <Box
      sx={{
        bgcolor: (theme) => theme.palette.background.neutral,
        minHeight: '100%',
        height: 'auto',
        overflowX: 'hidden',
      }}
    >
      <CampaignLanding />
    </Box>
  );
}

export default Campaign;
