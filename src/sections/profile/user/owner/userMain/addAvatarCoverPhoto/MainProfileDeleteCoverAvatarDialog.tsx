import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useUpdateProfileFiledMutation } from 'src/_graphql/profile/mainProfile/mutations/updatePersonProfile.generated';
import { Icon } from 'src/components/Icon';
import useAuth from 'src/hooks/useAuth';
import { PATH_APP } from 'src/routes/paths';
import ProfileMainMessage from 'src/sections/profile/components/profileMain.messages';
import { ProfileFieldEnum } from 'src/types/serverTypes';

function MainProfileDeleteCoverAvatarDialog() {
  const location = useLocation();
  const isProfilePhoto = location.pathname.includes('avatar');
  const { initialize } = useAuth();
  const { formatMessage } = useIntl();
  const [updateProfileField, { isLoading: isLoadingField }] = useUpdateProfileFiledMutation();

  const router = useNavigate();

  const handleRemove = async () => {
    if (isProfilePhoto) {
      const res: any = await updateProfileField({
        filter: {
          dto: {
            field: ProfileFieldEnum.AvatarUrl,
            avatarUrl: null,
          },
        },
      });
      if (res?.data?.updateProfileFiled?.isSuccess) initialize();
    } else {
      await updateProfileField({
        filter: {
          dto: {
            field: ProfileFieldEnum.CoverUrl,
            coverUrl: null,
          },
        },
      });
    }
    router(PATH_APP.profile.user.root);
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
                ? formatMessage(ProfileMainMessage.deleteAvatarPhoto)
                : formatMessage(ProfileMainMessage.deleteCoverPhoto)}
            </Typography>
          </Box>
          <IconButton onClick={() => router(-1)}>
            <Icon name="Close-1" />
          </IconButton>
        </Stack>
        <Divider />
        <Stack sx={{ px: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer' }}>
            <LoadingButton
              onClick={handleRemove}
              loading={isLoadingField}
              startIcon={<Icon name="trash" color="error.main" />}
            >
              <Typography variant="body2" color="error">
                <FormattedMessage {...ProfileMainMessage.deletePhoto} />
              </Typography>
            </LoadingButton>
          </Box>
          <Link to={PATH_APP.profile.user.root} style={{ textDecoration: 'none' }}>
            <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
              <LoadingButton sx={{ color: 'surface.onSurface' }} startIcon={<Icon name="Close-1" />}>
                <Typography variant="body2">
                  <FormattedMessage {...ProfileMainMessage.discard} />
                </Typography>
              </LoadingButton>
            </Box>
          </Link>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default MainProfileDeleteCoverAvatarDialog;
