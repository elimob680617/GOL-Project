import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Box, Divider, Stack, Typography } from '@mui/material';

import { Icon } from 'src/components/Icon';
import NormalAndNgoProfileContactInfoMessages from 'src/pwa-sections/profile/UserProfileContactInfoPwa.messages';
import { PATH_APP } from 'src/routes/paths';

function ConfirmDeletePhoneNumber() {
  const navigate = useNavigate();

  const handleClickDeleteButton = async () => {
    navigate(PATH_APP.profile.ngo.contactInfo.phoneNumber.confirm);
  };

  function handleDiscard() {
    navigate(PATH_APP.profile.ngo.contactInfo.root);
  }

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.deletePhoneQuestion} />
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer' }}>
          <Icon name="trash" color="error.main" />
          <Box>
            <Typography variant="body2" color="error" onClick={() => handleClickDeleteButton()}>
              <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.deletePhone} />
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }}>
          <Icon name="Close-1" />
          <Typography variant="body2" color="text.primary" onClick={handleDiscard}>
            <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.discard} />
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}

export default ConfirmDeletePhoneNumber;
