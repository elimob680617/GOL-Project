import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import ProfileMainMessage from 'src/sections/profile/components/profileMain.messages';
import { useDispatch } from 'src/store';
import { updateMainInfo } from 'src/store/slices/profile/userMainInfo-slice';

function MainProfileChangePhotoDialog() {
  const location = useLocation();
  const isProfilePhoto = location.pathname.includes('avatar');
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const router = useNavigate();

  function handleRemove() {
    if (isProfilePhoto)
      dispatch(
        updateMainInfo({
          avatarUrl: undefined,
        }),
      );
    else
      dispatch(
        updateMainInfo({
          coverUrl: undefined,
        }),
      );
    router(-1);
  }

  return (
    <Dialog fullWidth={true} open={true} keepMounted>
      <Stack spacing={2} sx={{ minWidth: 600, minHeight: 194, py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => router(-1)}>
              <Icon name="left-arrow" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              {isProfilePhoto
                ? formatMessage(ProfileMainMessage.changeProfilePhoto)
                : formatMessage(ProfileMainMessage.changeCoverPhoto)}
            </Typography>
          </Box>
          {/* <IconButton onClick={() => router.back()}>
            <CloseSquare />
          </IconButton> */}
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Link
            to={isProfilePhoto ? PATH_APP.profile.user.userEditAvatar : PATH_APP.profile.user.userEditCover}
            style={{ textDecoration: 'none' }}
          >
            <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
              <Icon name="upload-image" />
              <Typography variant="body2">
                <FormattedMessage {...ProfileMainMessage.uploadFromSystem} />
              </Typography>
            </Box>
          </Link>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer' }} onClick={handleRemove}>
            <Icon name="remove-image" color="error.main" />
            <Typography variant="body2" color="error">
              <FormattedMessage {...ProfileMainMessage.removePhoto} />
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default MainProfileChangePhotoDialog;
