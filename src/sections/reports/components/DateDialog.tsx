import { useEffect, useState } from 'react';

import { Box, Dialog, DialogProps, Divider, IconButton, Stack, Typography } from '@mui/material';

import DatePicker from 'src/components/DatePicker';
import { Icon } from 'src/components/Icon';

interface DateDialogProps extends DialogProps {
  value: Date | null;
  isFromDate: boolean;
  minDate?: Date | null;
}

function DateDialog(props: DateDialogProps) {
  const { value, open, onClose, isFromDate, minDate } = props;
  const [expireDate, setExpireDate] = useState<Date | null | undefined>(value);

  const handleChange = (date: Date) => {
    setExpireDate(date);
    handleClose(date);
  };

  const handleClose = (date?: Date) => {
    onClose!(date || {}, 'backdropClick');
  };

  useEffect(() => {
    // if (!value) return;
    setExpireDate(value);
  }, [value]);

  return (
    <Dialog maxWidth="xs" open={open} onClose={() => handleClose()}>
      <Stack sx={{ marginBottom: 2, pt: 3, px: 2 }} direction="row" justifyContent="space-between" alignItems="center">
        {/* <IconButton sx={{ p: 0 }} onClick={() => router.back()}>
        <ArrowLeft />
      </IconButton> */}
        <Typography variant="subtitle1">{isFromDate ? 'From Date' : 'To Date'}</Typography>
        <IconButton sx={{ p: 0 }} onClick={() => handleClose()}>
          <Icon name="Close-1" />
        </IconButton>
      </Stack>
      <Divider />

      <Box sx={{ p: 3 }}>
        <DatePicker
          value={expireDate || undefined}
          views={['month', 'year', 'day']}
          onChange={handleChange}
          minDate={minDate || undefined}
        />
      </Box>
    </Dialog>
  );
}

export default DateDialog;
