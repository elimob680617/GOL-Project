import { Link, useNavigate } from 'react-router-dom';

import { Box, Divider, Stack, Typography } from '@mui/material';

import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch } from 'src/store';
import { emptyEmail } from 'src/store/slices/profile/contactInfo-slice-eli';
import { AudienceEnum } from 'src/types/serverTypes';

export default function EmailDelete() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handlerDiscardEmail() {
    dispatch(emptyEmail({ audience: AudienceEnum.Public }));
    navigate(PATH_APP.profile.user.contactInfo.email.root);
  }

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            Are you sure to delete this Email?
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer' }}>
          <Icon name="trash" color="error.main" />
          <Link to={PATH_APP.profile.user.contactInfo.email.confirm}>
            <Typography variant="body2" color="error">
              Delete Email
            </Typography>
          </Link>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }}>
          <Icon name="Close-1" color="grey.500" />
          <Typography variant="body2" color="text.primary" onClick={handlerDiscardEmail}>
            Discard
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}
