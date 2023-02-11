import { useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { useNavigate } from 'react-router-dom';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';

import { Box, Dialog, DialogContent, DialogTitle, Divider, Typography, styled } from '@mui/material';

import { Icon } from 'src/components/Icon';
import { PaymentStatusRecord } from 'src/components/payment';
import useSecondCountdown from 'src/hooks/useSecondCountdown';
import { PATH_APP } from 'src/routes/paths';

/* #region  styledComponents */
const DialogContentStyle = styled(DialogContent)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'wrap',
  paddingInline: theme.spacing(3),
  paddingBottom: theme.spacing(3),
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

const DonationStatusComponent = (props: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const { open, setOpen } = props;
  const navigate = useNavigate();
  const {
    isFinished,
    countdown: { seconds },
  } = useSecondCountdown({ init: 10 });

  useEffect(() => {
    if (isFinished) {
      setOpen(false);
      navigate(PATH_APP.home.payment.form);
    }
  }, [isFinished, navigate, setOpen]);

  return (
    <>
      {isMobile ? (
        <BottomSheet open={open} onDismiss={() => setOpen(false)}>
          <Box mt={2} mx={2}>
            <PaymentStatusRecord second={seconds} openDialog={setOpen} />
          </Box>
        </BottomSheet>
      ) : (
        <Dialog open={open as boolean} maxWidth="xs">
          <DialogTitle
            sx={{ display: 'flex', flexDirection: 'row', mb: 2 }}
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle1" color="text.primary">
              My Donation
            </Typography>
            <Box
              onClick={() => {
                setOpen(false);
              }}
            >
              <Icon name="Close-1" />
            </Box>
          </DialogTitle>
          <Divider />
          <DialogContentStyle>
            <PaymentStatusRecord second={seconds} openDialog={setOpen} />
          </DialogContentStyle>
        </Dialog>
      )}
    </>
  );
};

export default DonationStatusComponent;
