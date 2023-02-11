import { useIntl } from 'react-intl';

import { Box } from '@mui/material';

import { HeaderCampaignLanding, MenuItemCampaignLanding } from 'src/components/campaignLanding';

import NgoReportMain from '../reports/ngo/NgoReportMain';
import campaignLandingMessages from './campaignLandingMessages';

function Reports() {
  const { formatMessage } = useIntl();
  return (
    <Box>
      <HeaderCampaignLanding title={formatMessage(campaignLandingMessages.campaignLanding)} />
      <Box display={'flex'} sx={{ overflow: 'auto' }}>
        <MenuItemCampaignLanding active="reports" />
      </Box>
      <NgoReportMain />
    </Box>
  );
}

export default Reports;
