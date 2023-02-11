//mui
import { FormattedMessage } from 'react-intl';

import { Stack, Typography } from '@mui/material';

import noData from 'src/assets/icons/noData.png';

import DonatedMoneyMessages from '../DonatedMoney.messages';

//...
//............................................................

function NoResult() {
  return (
    <Stack alignItems="center" justifyContent="center">
      <img src={noData} alt="noData" loading="lazy" />
      <Typography variant="body2" color="text.secondary">
        <FormattedMessage {...DonatedMoneyMessages.noDataFound} />
      </Typography>
    </Stack>
  );
}

export default NoResult;
