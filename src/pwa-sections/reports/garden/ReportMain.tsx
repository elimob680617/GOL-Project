import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';

import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, IconButton, Stack, Tab, Typography } from '@mui/material';

import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';

import ReportGardenMessagePwa from './ReportGarden.message.pwa';
import Overview from './overview/Overview';
import Successful from './successful/Successful';

export type reportTabs = 'Overview' | 'Successful' | 'Finished' | 'Active' | 'Interrupted';
type Params = {
  tab: string;
};
function ReportMain() {
  const { formatMessage } = useIntl();
  const router = useNavigate();
  const { tab } = useParams<Params>();
  const [tabValue, setTabValue] = useState('');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    router(`${PATH_APP.report.garden}/${newValue}`);
  };
  useEffect(() => {
    if (tab) {
      setTabValue(tab);
    }
  }, [tab]);

  return (
    <Stack sx={{ bgcolor: 'background.neutral' }}>
      <Stack direction="row" alignItems="center" sx={{ bgcolor: 'background.paper' }} spacing={3} p={2} mb={1}>
        <IconButton onClick={() => router(-1)}>
          <Icon name="left-arrow-1" />
        </IconButton>
        <Typography variant="subtitle1" color="text.primary">
          <FormattedMessage {...ReportGardenMessagePwa.applicationReportOf} values={{ brand: 'GOL' }} />
        </Typography>
      </Stack>
      {/*...........................................TabList*/}
      <Box sx={{ width: '100%', typography: 'subtitle1' }}>
        <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
            <TabList
              onChange={handleChange}
              aria-label="lab API tabs example"
              variant="scrollable"
              sx={{
                px: 2,
                py: 2,
                '& .MuiTabs-flexContainer': { gap: 3 },
                '& .MuiTabs-indicator': { display: 'none' },
                '& .Mui-selected': {
                  backgroundColor: 'background.neutral',
                  borderRadius: 1,
                  maxHeight: '34px !important',
                },
              }}
            >
              <Tab
                label={formatMessage(ReportGardenMessagePwa.overview)}
                value="overview"
                style={{ minHeight: 34, height: 34 }}
              />
              <Tab
                label={formatMessage(ReportGardenMessagePwa.successful)}
                value="successful"
                style={{ minHeight: 34, height: 34 }}
              />
              <Tab
                label={formatMessage(ReportGardenMessagePwa.finished)}
                value="finished"
                style={{ minHeight: 34, height: 34 }}
              />
              <Tab
                label={formatMessage(ReportGardenMessagePwa.active)}
                value="active"
                style={{ minHeight: 34, height: 34 }}
              />
              <Tab
                label={formatMessage(ReportGardenMessagePwa.interrupted)}
                value="interrupted"
                style={{ minHeight: 34, height: 34 }}
              />
            </TabList>
          </Box>
          {/**********Overview*********/}
          <TabPanel value="overview">
            <Overview />
          </TabPanel>
          {/**********Successful*********/}
          <TabPanel value="successful">
            <Successful />
          </TabPanel>
          <TabPanel value="finished">
            <FormattedMessage {...ReportGardenMessagePwa.finished} />
          </TabPanel>
          <TabPanel value="active">
            <FormattedMessage {...ReportGardenMessagePwa.active} />
          </TabPanel>
          <TabPanel value="interrupted">
            <FormattedMessage {...ReportGardenMessagePwa.interrupted} />
          </TabPanel>
        </TabContext>
      </Box>
    </Stack>
  );
}

export default ReportMain;
