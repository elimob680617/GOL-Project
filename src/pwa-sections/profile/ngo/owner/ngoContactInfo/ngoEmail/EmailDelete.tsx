import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Box, Divider, Stack, Typography } from '@mui/material';

import { Icon } from 'src/components/Icon';
import NormalAndNgoProfileContactInfoMessages from 'src/pwa-sections/profile/UserProfileContactInfoPwa.messages';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch } from 'src/store';
import { emptyEmail } from 'src/store/slices/profile/contactInfo-slice-eli';
import { AudienceEnum } from 'src/types/serverTypes';

export default function EmailDelete() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handlerDiscardEmail() {
    dispatch(emptyEmail({ audience: AudienceEnum.Public }));
    // navigate(PATH_APP.profile.ngo.contactInfo.ngoEmail);
    navigate(PATH_APP.profile.ngo.contactInfo.root);
  }

  function handleRouting() {
    // navigate(PATH_APP.profile.ngo.contactInfo.confirmPasswordEmail);
    navigate(PATH_APP.profile.ngo.contactInfo.root);
  }

  // const handleBackRoute = () => {
  //   dispatch(emptyEmail({ audience: AudienceEnum.Public }));
  //   dispatch(emptySocialMedia({ audience: AudienceEnum.Public }));
  //   navigate(PATH_APP.profile.ngo.contactInfo.list);
  // };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.deleteEmailQuestion} />
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer' }}>
          <Icon name="trash" color="error.main" />
          <Typography variant="body2" color="error" onClick={handleRouting}>
            <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.deleteEmail} />
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }}>
          <Icon name="Close-1" color="text.primary" />

          <Typography variant="body2" color="text.primary" onClick={handlerDiscardEmail}>
            <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.discard} />
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}
