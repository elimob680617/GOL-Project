import { FC } from 'react';

import { Button, Dialog, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'inherit !important',
  color: theme.palette.error.main,
}));

const DeleteModal: FC<{ open: boolean; selectedValue: string; onClose: (value: string) => void }> = ({
  open,
  selectedValue,
  onClose,
}) => {
  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <StyledButton variant="text" onClick={() => handleListItemClick('a')}>
        <Typography variant="overline">Delete for me & Panda</Typography>
      </StyledButton>
      <StyledButton variant="text" onClick={() => handleListItemClick('b')}>
        <Typography variant="overline">Delete for me</Typography>
      </StyledButton>
    </Dialog>
  );
};

export default DeleteModal;
