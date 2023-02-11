import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

//mui
import { Box, Container, Stack, Typography } from '@mui/material';

//icon
import { Icon } from 'src/components/Icon';

import ReportGardenMessages from './ReportGarden.message';
//components
import Campaigns from './campaigns/Campaigns';
import Donors from './donors/Donors';
import Total from './total/Total';

//.............................................................................
function ReportMain() {
  const router = useNavigate();
  return (
    <Box bgcolor="background.neutral">
      <Container maxWidth="lg" sx={{ p: '0px !important' }}>
        <Stack spacing={3} pb={3}>
          <Stack direction="row" spacing={3} px={4} py={2} sx={{ bgcolor: 'background.paper', borderRadius: 1, mt: 5 }}>
            <Box sx={{ cursor: 'pointer' }} onClick={() => router(-1)}>
              <Icon name="left-arrow" color="grey.500" />
            </Box>
            <Typography variant="body1" color="text.primary">
              <FormattedMessage {...ReportGardenMessages.applicationReport} values={{ brand: 'Garden of Love' }} />
            </Typography>
          </Stack>
          <Stack p={2} sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
            <Total />
          </Stack>
          <Stack sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
            <Campaigns />
          </Stack>
          <Stack sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
            <Donors />
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export default ReportMain;
