import { isMobile } from 'react-device-detect';

import { Box, Dialog, DialogContent, DialogTitle, Divider, Stack, Typography, styled } from '@mui/material';

import { Icon } from 'src/components/Icon';
import DonatePaymentForm from 'src/components/payment/DonatePaymentForm';

/* #region  styledComponents */
const DialogContentStyle = styled(DialogContent)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'wrap',
  paddingInline: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  [theme.breakpoints.down('md')]: { paddingInline: theme.spacing(2), paddingBottom: theme.spacing(2) },
  '&::-webkit-scrollbar': {
    width: 12,
  },

  '&::-webkit-scrollbar-track': {
    background: theme.palette.grey[0],
    borderRadius: 8,
  },

  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.grey[300],
    borderRadius: 10,
    border: `4px solid ${theme.palette.grey[0]}`,
  },
}));
/* #endregion */

const PaymentFormDialog = () => {
  // const { open, setOpen } = props;
  return (
    <Dialog
      open={true}
      fullScreen={isMobile}
      maxWidth="sm"
      sx={{ '& .MuiDialog-paper': { margin: isMobile ? 0 : 'inharit' } }}
    >
      <DialogTitle
        sx={{ display: 'flex', flexDirection: 'row', mb: 2 }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack direction="row" alignItems="center" width={'100%'} justifyContent="space-between">
          {isMobile && (
            // <Box onClick={() => setOpen(true)}>
            <Stack flex={1}>
              <Icon name="left-arrow-1" />
            </Stack>
          )}
          <Stack flex={2}>
            <Typography variant="subtitle1" color="text.primary">
              Make a Donation
            </Typography>
          </Stack>
        </Stack>
        {!isMobile && (
          // <Box onClick={() => setOpen(true)}>
          <Box>
            <Icon name="Close-1" />
          </Box>
        )}
      </DialogTitle>
      <Divider />
      <DialogContentStyle>
        <DonatePaymentForm />
      </DialogContentStyle>
    </Dialog>
  );
};

export default PaymentFormDialog;
