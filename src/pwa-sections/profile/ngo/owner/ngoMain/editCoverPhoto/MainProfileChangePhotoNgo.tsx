import { FormattedMessage, useIntl } from 'react-intl';

import { LoadingButton } from '@mui/lab';
import { Box, Divider, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useUpdateOrganizationUserFieldMutation } from 'src/_graphql/profile/mainProfileNOG/mutations/updateOrganizationUserField.generated';
import Image from 'src/components/Image';
import useAuth from 'src/hooks/useAuth';
import ProfileMainMessage from 'src/pwa-sections/profile/components/profileMain.messages';

// types !
interface MainProfileChangePhotoDialogProps {
  isProfilePhoto?: boolean;
  onClose: () => void;
  onUpload: () => void;
}
export enum OrgUserFieldEnum {
  AvatarUrl = 'AVATAR_URL',
  CoverUrl = 'COVER_URL',
}
// ===================================================
function MainProfileChangePhotoNgo(props: MainProfileChangePhotoDialogProps) {
  // props !

  const { isProfilePhoto = false, onClose, onUpload } = props;
  // services !!
  const [updateOrganizationUserField, { isLoading: isLoadingField }] = useUpdateOrganizationUserFieldMutation();
  // tools
  const { enqueueSnackbar } = useSnackbar();
  const { initialize } = useAuth();
  const { formatMessage } = useIntl();
  const handleRemove = async () => {
    if (isProfilePhoto) {
      const resAvatarNgo: any = await updateOrganizationUserField({
        filter: {
          dto: {
            field: OrgUserFieldEnum.AvatarUrl,
            avatarUrl: null,
          },
        },
      });
      if (resAvatarNgo?.data?.updateOrganizationUserField?.isSuccess) {
        enqueueSnackbar('The Profile photo has been successfully deleted', { variant: 'success' });
        initialize();
      } else {
        enqueueSnackbar('It was not successful', { variant: 'error' });
      }
    } else {
      const resCover: any = await updateOrganizationUserField({
        filter: {
          dto: {
            field: OrgUserFieldEnum.CoverUrl,
            coverUrl: null,
          },
        },
      });
      if (resCover?.data?.updateOrganizationUserField?.isSuccess) {
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
            <Image width={20} height={20} src={'/icons/upload_photo.svg'} alt="upload" />
            <Typography variant="body2">
              <FormattedMessage {...ProfileMainMessage.uploadFromSystem} />
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer' }} onClick={handleRemove}>
            <Image width={20} height={20} src={'/icons/delete_photo.svg'} alt="remove" />
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

export default MainProfileChangePhotoNgo;
