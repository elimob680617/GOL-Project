import { FormattedMessage, useIntl } from 'react-intl';

import { LoadingButton } from '@mui/lab';
import { Box, Divider, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useUpdateProfileFiledMutation } from 'src/_graphql/profile/mainProfile/mutations/updatePersonProfile.generated';
import { Icon } from 'src/components/Icon';
import useAuth from 'src/hooks/useAuth';
import ProfileMainMessage from 'src/pwa-sections/profile/components/profileMain.messages';
import { ProfileFieldEnum } from 'src/types/serverTypes';

// types !
interface MainProfileChangePhotoDialogProps {
  isProfilePhoto?: boolean;
  onClose: () => void;
  onUpload: () => void;
}

// ===================================================
function MainProfileChangePhotoUser(props: MainProfileChangePhotoDialogProps) {
  // props !

  const { isProfilePhoto = false, onClose, onUpload } = props;
  // services !!
  const [updateProfileField, { isLoading: isLoadingField }] = useUpdateProfileFiledMutation();
  // tools
  const { enqueueSnackbar } = useSnackbar();
  const { initialize } = useAuth();
  const { formatMessage } = useIntl();
  const handleRemove = async () => {
    if (isProfilePhoto) {
      const resAvatarUser: any = await updateProfileField({
        filter: {
          dto: {
            field: ProfileFieldEnum.AvatarUrl,
            avatarUrl: null,
          },
        },
      });
      if (resAvatarUser?.data?.updateProfileFiled?.isSuccess) {
        enqueueSnackbar('The Profile photo has been successfully deleted', { variant: 'success' });
      } else {
        enqueueSnackbar('It was not successful', { variant: 'error' });
      }
    } else {
      const resCoverUser: any = await updateProfileField({
        filter: {
          dto: {
            field: ProfileFieldEnum.CoverUrl,
            coverUrl: null,
          },
        },
      });
      if (resCoverUser?.data?.updateProfileFiled?.isSuccess) {
        enqueueSnackbar('The Cover photo has been successfully deleted', { variant: 'success' });
      } else {
        enqueueSnackbar('It was not successful', { variant: 'error' });
      }
    }
    initialize();
    onClose();
  };

  function handleUpload() {
    onUpload();
  }

  return (
    <>
      <Stack spacing={2} sx={{ minHeight: '50%', py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
            <Icon name="upload-image" color="grey.700" size={20} />
            <Typography variant="body2">
              <FormattedMessage {...ProfileMainMessage.uploadFromSystem} />
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer' }} onClick={handleRemove}>
            <Icon name="remove-image" color="error.main" size={20} />
            <LoadingButton loading={isLoadingField} variant="text" color="error">
              <Typography variant="body2" color="error">
                <FormattedMessage {...ProfileMainMessage.removePhoto} />
              </Typography>
            </LoadingButton>
          </Box>
        </Stack>
      </Stack>
    </>
  );
}

export default MainProfileChangePhotoUser;
