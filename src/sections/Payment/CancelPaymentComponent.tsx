import { isMobile } from 'react-device-detect';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';

import { Dialog, DialogContent, DialogTitle, Divider, Stack, Typography } from '@mui/material';

import { Icon } from 'src/components/Icon';
import CancelPayment from 'src/components/payment/CancelPayment';

const CancelPaymentComponent = () => {
  return (
    <>
      {isMobile ? (
        <BottomSheet open={true}>
          {/* <Box mt={2} mx={2}> */}
          <CancelPayment />
          {/* </Box> */}
        </BottomSheet>
      ) : (
        <Dialog open>
          <DialogTitle>
            <Stack direction="row" justifyContent="space-between" alignItems="center" pb={2}>
              <Typography>Your donation can change lives. Are you sure you want to cancel it?</Typography>
              <Icon name="Close-1" />
            </Stack>
          </DialogTitle>
          <Divider />
          <DialogContent>
            <CancelPayment />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default CancelPaymentComponent;
