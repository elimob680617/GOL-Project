import { FormattedMessage } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';

import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import NormalAndNgoProfileContactInfoMessages from 'src/sections/profile/UserProfileContactInfo.messages';

function ConfirmDeletePhoneNumber() {
  const router = useNavigate();

  const handleClickDeleteButton = async () => {
    router(PATH_APP.profile.user.contactInfo.phoneNumber.confirm);
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => router(-1)}>
      <Stack spacing={2} sx={{ minWidth: 600, minHeight: 194, py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => router(-1)}>
              <Icon name="left-arrow" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.deletePhoneQuestion} />
            </Typography>
          </Box>
          <Link to={PATH_APP.profile.user.contactInfo.phoneNumber.edit}>
            <IconButton>
              <Icon name="Close" />
            </IconButton>
          </Link>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer' }}>
            <Icon name="trash" size={24} color="error.main" />
            <Box>
              <Typography variant="body2" color="error" onClick={() => handleClickDeleteButton()}>
                <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.deletePhone} />
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }}>
            <Icon name="Close" size={24} />

            <Link to={PATH_APP.profile.user.contactInfo.root}>
              <Typography variant="body2" color="text.primary">
                <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.discard} />
              </Typography>
            </Link>
          </Box>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default ConfirmDeletePhoneNumber;
