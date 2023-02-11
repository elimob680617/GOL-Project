import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Dialog, DialogContent, DialogTitle, Divider, Typography, styled } from '@mui/material';

import { Icon } from 'src/components/Icon';
import { PaymentStatusRecord } from 'src/components/payment';
import useSecondCountdown from 'src/hooks/useSecondCountdown';
import { PATH_APP } from 'src/routes/paths';

const DialogContentStyle = styled(DialogContent)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'wrap',
  paddingInline: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  // width: '100%',
  // gap: theme.spacing(1.5),
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

const DonationStatusDialog = (props: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
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
      <DialogContentStyle sx={{ px: 3, pb: 3 }}>
        <PaymentStatusRecord second={seconds} />
      </DialogContentStyle>
    </Dialog>
  );
};

export default DonationStatusDialog;
