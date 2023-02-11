//mui
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Box, Container, Stack, Typography } from '@mui/material';

import { Icon } from 'src/components/Icon';
import useAuth from 'src/hooks/useAuth';

import DonatedMoneyMessages from '../DonatedMoney.messages';
import Campaigns from './campaigns/Campaigns';
import Donors from './donors/Donors';
import Total from './total/Total';

//...
//.............................................................................
function ReportMain() {
  const back = useNavigate();
  const { user } = useAuth();
  return (
    <Box sx={{ width: '100%', bgcolor: 'background.neutral', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ p: '0px !important' }}>
        <Stack spacing={3} pb={3}>
          <Container maxWidth="lg" sx={{ p: '0px !important' }}>
            <Stack spacing={3} pb={3}>
              <Stack
                direction="row"
                spacing={3}
                px={4}
                py={2}
                sx={{ bgcolor: 'background.paper', borderRadius: 1, mt: 5 }}
              >
                <Box sx={{ cursor: 'pointer' }} onClick={() => back(-1)}>
                  <Icon name="left-arrow" color="grey.500" />
                </Box>
                <Typography variant="body1" color="text.primary">
                  <FormattedMessage {...DonatedMoneyMessages.reportNGO} />
                </Typography>
              </Stack>
              <Stack p={2} sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                <Total />
              </Stack>
              <Stack sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                <Campaigns id={user?.id} />
              </Stack>
              <Stack sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                <Donors id={user?.id} />
              </Stack>
            </Stack>
          </Container>
        </Stack>
      </Container>
    </Box>
  );
}

export default ReportMain;
