import { useNavigate } from 'react-router-dom';

import { Box, Button, Stack, Typography } from '@mui/material';

import { PATH_APP } from 'src/routes/paths';

import { Icon } from '../Icon';
import DonateSummaryBox from './DonateSummaryBox';

const PaymentStatusRecord = (props: {
  second?: string;
  openDialog?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { second, openDialog } = props;
  const navigate = useNavigate();
  return (
    <Stack spacing={2} justifyContent="center" alignItems="center">
      <Stack spacing={2} justifyContent="center" alignItems="center">
        <Typography variant="body2" color="text.primary">
          Redirecting to payment page
        </Typography>
        <Stack direction="row" spacing={1}>
          <Icon name="timer" />
          <Typography variant="h5" color="grey.700">
            {second}
          </Typography>
        </Stack>
      </Stack>
      <Typography variant="subtitle1" color="text.primary">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vehicula commodo
      </Typography>
      <Box width={'100%'}>
        <DonateSummaryBox>
          <Button
            variant="contained"
            color="primary"
            sx={{ width: '100%' }}
            onClick={() => {
              openDialog!(false);
              navigate(PATH_APP.home.payment.form);
            }}
          >
            Donate
          </Button>
        </DonateSummaryBox>
      </Box>
    </Stack>
  );
};

export default PaymentStatusRecord;
