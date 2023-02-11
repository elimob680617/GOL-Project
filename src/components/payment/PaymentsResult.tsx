import { Box, Button, Stack, Typography } from '@mui/material';

import FailedPayment from 'src/assets/paymentsvg/failed-paymennt.svg';
import SuccessPayment from 'src/assets/paymentsvg/success-payment.svg';

const PaymentsResult = (props: { isSuccess: boolean }) => {
  const { isSuccess } = props;
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid',
        borderRadius: 2,
        borderColor: 'grey.100',
        minWidth: 328,
        minHeight: 476,
        px: 2,
        py: 3,
        gap: 5,
        maxWidth: 328,
      }}
    >
      <Stack alignItems="center">
        {isSuccess ? (
          <img loading="lazy" alt="" src={SuccessPayment} />
        ) : (
          <img loading="lazy" alt="" src={FailedPayment} />
        )}
      </Stack>
      {isSuccess ? (
        <Stack spacing={3} alignItems="center" py={2}>
          <Typography variant="subtitle2" color="grey.700" textAlign="center">
            Your Donation to Global Giving Campain was successfully.
          </Typography>
          <Button variant="contained" color="primary" sx={{ minWidth: 126 }}>
            Return to Post
          </Button>
        </Stack>
      ) : (
        <Stack spacing={3} alignItems="center" py={2}>
          <Typography variant="subtitle2" color="error.main" textAlign="center">
            Sorry, there was a problem with Stripe Banking.
          </Typography>
          <Button variant="text" color="primary" sx={{ minWidth: 126 }}>
            Try again
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default PaymentsResult;
