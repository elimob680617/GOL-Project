import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Box, Divider, IconButton, Stack, Typography } from '@mui/material';

import { Icon } from 'src/components/Icon';
import Image from 'src/components/Image';
import ProfileMainMessage from 'src/pwa-sections/profile/components/profileMain.messages';

interface MainProfileChangePhotoDialogProps {
  isProfilePhoto?: boolean;
  onRemove: () => void;
  onUpload: () => void;
}

function MainProfileChangePhoto(props: MainProfileChangePhotoDialogProps) {
  const { isProfilePhoto = false, onRemove, onUpload } = props;
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  function handleRemove() {
    onRemove();
  }

  function handleUpload() {
    onUpload();
  }

  return (
    <>
      <Stack spacing={2} sx={{ minHeight: '50%', py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => navigate(-1)}>
              <Icon name="left-arrow-1" color="text.primary" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              {isProfilePhoto
                ? formatMessage(ProfileMainMessage.changeProfilePhoto)
                : formatMessage(ProfileMainMessage.changeCoverPhoto)}
            </Typography>
          </Box>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }} onClick={handleUpload}>
            <Image width={20} height={20} src={'/icons/upload_photo.svg'} alt="upload" />
            <Typography variant="body2">
              <FormattedMessage {...ProfileMainMessage.uploadFromSystem} />
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer' }} onClick={handleRemove}>
            <Image width={20} height={20} src={'/icons/delete_photo.svg'} alt="remove" />
            <Typography variant="body2" color="error">
              <FormattedMessage {...ProfileMainMessage.removePhoto} />
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </>
  );
}

export default MainProfileChangePhoto;
