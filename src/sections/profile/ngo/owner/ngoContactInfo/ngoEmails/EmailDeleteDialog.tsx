import { FormattedMessage } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';

import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import NormalAndNgoProfileContactInfoMessages from 'src/sections/profile/UserProfileContactInfo.messages';
import { useDispatch } from 'src/store';
import { emptyEmail } from 'src/store/slices/profile/contactInfo-slice-eli';
import { AudienceEnum } from 'src/types/serverTypes';
import sleep from 'src/utils/sleep';

export default function EmailDeleteDialog() {
  const router = useNavigate();
  const dispatch = useDispatch();

  function handlerDiscardEmail() {
    router(PATH_APP.profile.ngo.contactInfo.root);
  }

  const handleBackRoute = async () => {
    router(PATH_APP.profile.ngo.contactInfo.root);
    await sleep(1500);
    dispatch(emptyEmail({ audience: AudienceEnum.Public }));
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={handleBackRoute}>
      <Stack spacing={2} sx={{ py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => router(-1)}>
              <Icon name="left-arrow-1" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.deleteEmailQuestion} />
            </Typography>
          </Box>

          <IconButton onClick={handleBackRoute}>
            <Icon name="Close-1" />
          </IconButton>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
            <Icon name="trash" color="error.main" />
            <Link to={PATH_APP.profile.ngo.contactInfo.email.confirm}>
              <Typography variant="body2" color="error">
                <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.deleteEmail} />
              </Typography>
            </Link>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
            <Icon name="Close-1" />
            <Typography variant="body2" color="text.primary" onClick={handlerDiscardEmail}>
              <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.discard} />
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Dialog>
  );
}
