import { FormattedMessage } from 'react-intl';

import { Stack, Typography } from '@mui/material';

import ReportGardenMessages from '../ReportGarden.message';

//...
//............................................................

function NoResult() {
  return (
    <Stack alignItems="center" justifyContent="center">
      <img loading="lazy" src="/src/assets/icons/noData.png" alt="noData" />
      <Typography variant="body2" color="text.secondary">
        <FormattedMessage {...ReportGardenMessages.noDataFound} />
      </Typography>
    </Stack>
  );
}

export default NoResult;
