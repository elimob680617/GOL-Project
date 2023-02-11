import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

//mui
import { Typography } from '@mui/material';

import ReportGardenMessagePwa from './ReportGarden.message.pwa';
import { reportTabs } from './ReportMain';
//component
import Overview from './overview/Overview';
import Successful from './successful/Successful';

const ReportBody: FC<{ reportType: reportTabs }> = ({ reportType }) => {
  const searchedBodies = {
    Overview: <Overview />,
    Successful: <Successful />,
    Finished: (
      <Typography>
        <FormattedMessage {...ReportGardenMessagePwa.finished} />
      </Typography>
    ),
    Active: (
      <Typography>
        <FormattedMessage {...ReportGardenMessagePwa.active} />
      </Typography>
    ),
    Interrupted: (
      <Typography>
        <FormattedMessage {...ReportGardenMessagePwa.interrupted} />
      </Typography>
    ),
  };

  const conditionalRendering = (type: reportTabs) => searchedBodies[type];

  return <> {conditionalRendering(reportType)} </>;
};

export default ReportBody;
