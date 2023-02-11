//mui
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import ProfileMainMessage from 'src/sections/profile/components/profileMain.messages';

function MainProfileNGOChangePhotoDialog() {
  const location = useLocation();
  const isProfilePhoto = location.pathname.includes('avatar');
  const router = useNavigate();
  const { formatMessage } = useIntl();
  const handleRemove = async () => {
    if (isProfilePhoto) {
      router(PATH_APP.profile.ngo.ngoDeleteAvatar);
    } else {
      router(PATH_APP.profile.ngo.ngoDeleteCover);
    }
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted>
      <Stack spacing={2} sx={{ minWidth: 600, minHeight: 194, py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => router(-1)}>
              <Icon name="left-arrow-1" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              {isProfilePhoto
                ? formatMessage(ProfileMainMessage.changeProfilePhoto)
                : formatMessage(ProfileMainMessage.changeCoverPhoto)}
            </Typography>
          </Box>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2, gap: 1 }}>
          <Link to={isProfilePhoto ? PATH_APP.profile.ngo.ngoEditAvatar : PATH_APP.profile.ngo.ngoEditCover}>
            <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
              <Icon name="upload-image" size={24} />
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

export default MainProfileNGOChangePhotoDialog;
