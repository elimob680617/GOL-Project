import { isMobile } from 'react-device-detect';
import { BottomSheet } from 'react-spring-bottom-sheet';

import { Box, Dialog, DialogContent, DialogTitle, Divider, Stack, Typography } from '@mui/material';

import { Icon } from '../Icon';

const CancelPayment = () => {
  return (
    <>
      {!isMobile ? (
        <Dialog open>
          <DialogTitle>
            <Stack direction="row" justifyContent="space-between" alignItems="center" pb={2}>
              <Typography>Your donation can change lives. Are you sure you want to cancel it?</Typography>
              <Icon name="Close-1" />
            </Stack>
          </DialogTitle>
          <Divider />
          <DialogContent>
            <Stack spacing={3} pl={2} pb={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Icon name="Close" color="error.main" />
                <Typography color="error.main">Cancel</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Icon name="Close-1" />
                <Typography>Discard</Typography>
              </Box>
            </Stack>
          </DialogContent>
        </Dialog>
      ) : (
        <BottomSheet open>
          <Stack spacing={3} pl={2} pb={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Icon name="Close" color="error.main" />
              <Typography color="error.main">Cancel</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Icon name="Close-1" />
              <Typography>Discard</Typography>
            </Box>
          </Stack>
        </BottomSheet>
      )}
    </>
  );
};

export default CancelPayment;
