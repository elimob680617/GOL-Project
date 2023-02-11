import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Box, Dialog, DialogContent, DialogTitle, Divider, IconButton, Stack, Typography } from '@mui/material';

import { Icon } from 'src/components/Icon';
import GeneralMessagess from 'src/language/general.messages';

import AudienceProfileMessages from './Audience.messages';

interface AudienceDiscardProp {
  open: boolean;
  isLoading: boolean;
  handleShow: React.Dispatch<
    React.SetStateAction<{
      parent: boolean;
      child: boolean;
      warning: boolean;
    }>
  >;
  onClose?: React.Dispatch<React.SetStateAction<boolean>>;
  handleSave: () => Promise<void>;
  // onChange: (value: AudienceEnum) => void;
}
const DiscardDialog = (props: AudienceDiscardProp) => {
  const { open, handleSave, handleShow } = props;
  return (
    <Dialog fullWidth={true} open={open} keepMounted>
      <DialogTitle sx={{ p: 0, pt: 3 }}>
        <Stack direction="row" mb={2} mx={2} spacing={2}>
          <IconButton
            sx={{ p: 0 }}
            onClick={() => {
              handleShow((prev) => ({ ...prev, child: true, warning: false }));
            }}
          >
            <Icon name="left-arrow-1" />
          </IconButton>
          <Typography variant="subtitle1" color="text.primary">
            <FormattedMessage {...AudienceProfileMessages.saveChangeMessage} />
          </Typography>
        </Stack>
        <Divider />
      </DialogTitle>
      <DialogContent sx={{ px: 0, pb: 3 }}>
        <Stack spacing={3} px={2} mt={2}>
          <Box sx={{ display: 'flex', gap: 1, cursor: 'pointer' }} onClick={handleSave}>
            <Icon name="Save" />
            <Typography variant="body2" color="text.primary">
              <FormattedMessage {...AudienceProfileMessages.saveChange} />
            </Typography>
          </Box>
          <Box
            sx={{ display: 'flex', gap: 1, cursor: 'pointer' }}
            onClick={() => handleShow((prev) => ({ ...prev, child: true, warning: false }))}
          >
            <Icon name="trash" color="error.main" />
            <Typography variant="body2" color="error">
              <FormattedMessage {...GeneralMessagess.discardWord} />
            </Typography>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default DiscardDialog;
