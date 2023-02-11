import { FC } from 'react';

import { Button, Dialog, DialogActions, DialogProps, DialogTitle, Typography } from '@mui/material';

interface IWarnDialogProps extends DialogProps {
  actionButtonText: string;
  warnText: string;
  confirm: () => void;
}

const WarnDialog: FC<IWarnDialogProps> = (props) => {
  const { confirm, actionButtonText, warnText, onClose } = props;
  return (
    <Dialog maxWidth="xs" fullWidth={true} {...props}>
      <DialogTitle>
        <Typography>{warnText}</Typography>
      </DialogTitle>

      {/* <DialogContent>
        <Grid mt={2} container alignItems="flex-end" xs={12}>
          {confirmText}
        </Grid>

        <Typography mt={2} variant="subtitle2" color="gray">
          {confirmationResultText || ''}
        </Typography>
      </DialogContent> */}

      <DialogActions>
        <Button
          onClick={() => {
            confirm();
            onClose!({}, 'backdropClick');
          }}
        >
          {actionButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WarnDialog;
