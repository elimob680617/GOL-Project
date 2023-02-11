import { Dialog, Stack } from '@mui/material';

import { PaymentsResult } from 'src/components/payment';

const PaymentResultDialog = () => {
  return (
    <Dialog open={true}>
      <Stack sx={{ py: 3, px: 10.5 }}>
        <PaymentsResult isSuccess={true} />
      </Stack>
    </Dialog>
  );
};

export default PaymentResultDialog;
