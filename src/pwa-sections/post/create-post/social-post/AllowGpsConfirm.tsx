import * as React from 'react';
import { FC } from 'react';

import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface IAllowGpsConfirmProps extends DialogProps {
  confirm: () => void;
  close: () => void;
}

const AllowGpsConfirm: FC<IAllowGpsConfirmProps> = (props) => {
  const { open, close, confirm } = props;

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={close}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle sx={{ marginBottom: 2 }}>
        <Typography
          variant="subtitle1"
          sx={[
            (theme) => ({
              color: theme.palette.text.primary,
              fontWeight: 500,
              fontSize: '16px',
              lineHeight: '20px',
            }),
          ]}
        >
          Allow Garden of love to access your location?
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ paddingBottom: 0 }}>
        <DialogContentText id="alert-dialog-slide-description">
          Garden of love uses this to provide more relevant and personalized experiences, like helping you to check in,
          find local events and get better ads.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button sx={{ width: 'fit-content' }} variant="text" onClick={close}>
          <Typography sx={{ color: 'text.primary' }} variant="subtitle1">
            Deny
          </Typography>
        </Button>
        <Button sx={{ width: 'fit-content' }} variant="text" onClick={confirm}>
          <Typography sx={{ color: 'primary.dark' }} variant="subtitle1">
            Allow
          </Typography>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AllowGpsConfirm;
