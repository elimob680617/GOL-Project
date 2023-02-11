import { Dialog, DialogContent, DialogTitle, Divider, Stack, Typography } from '@mui/material';

import { Icon } from 'src/components/Icon';
import CancelPayment from 'src/components/payment/CancelPayment';

const CancelPaymentDialog = () => {
  return (
    <Dialog open>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography>Your donation can change lives. Are you sure you want to cancel it?</Typography>
          <Icon name="Close-1" />
        </Stack>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <CancelPayment />
      </DialogContent>
    </Dialog>
  );
};

export default CancelPaymentDialog;
