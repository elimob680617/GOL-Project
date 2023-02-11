import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useDeleteUserSocialMediaMutation } from 'src/_graphql/profile/contactInfo/mutations/deleteUserSocialMedia.generated';
import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import NormalAndNgoProfileContactInfoMessages from 'src/sections/profile/UserProfileContactInfo.messages';
import { useDispatch, useSelector } from 'src/store';
import { emptySocialMedia, userSocialMediasSelector } from 'src/store/slices/profile/socialMedia-slice';
import { AudienceEnum } from 'src/types/serverTypes';

export default function SocialLinkDeleteDialog() {
  const router = useNavigate();
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const personSocialMedia = useSelector(userSocialMediasSelector);
  const [deleteUserSocialMedia] = useDeleteUserSocialMediaMutation();
  const dispatch = useDispatch();

  function handlerDiscardSocialLink() {
    // dispatch(emptySocialMedia({ audience: AudienceEnum.Public }));
    router(PATH_APP.profile.user.contactInfo.root);
  }
  const handleDeleteSocialLink = async () => {
    const resDataDelete: any = await deleteUserSocialMedia({
      filter: {
        dto: {
          id: personSocialMedia?.id,
        },
      },
    });

    if (resDataDelete.data.deleteUserSocialMedia?.isSuccess) {
      router(PATH_APP.profile.user.contactInfo.root);
      dispatch(emptySocialMedia({ audience: AudienceEnum.Public }));
      enqueueSnackbar(formatMessage(NormalAndNgoProfileContactInfoMessages.deleteSocialSuccessfull), {
        variant: 'success',
      });
    }
  };
  const handleBackRoute = () => {
    dispatch(emptySocialMedia({ audience: AudienceEnum.Public }));
    router(PATH_APP.profile.user.contactInfo.root);
  };
  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={handleBackRoute}>
      <Stack spacing={2} sx={{ py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => router(-1)}>
              <Icon name="left-arrow" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.deleteSocialQuestion} />
            </Typography>
          </Box>

          <IconButton onClick={handleBackRoute}>
            <Icon name="Close" />
          </IconButton>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
            <Icon name="trash" size={24} color="error.main" />
            <Typography variant="body2" color="error" onClick={() => handleDeleteSocialLink()}>
              <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.deleteSocial} />
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
            <Icon name="Close" size={24} />
            <Typography variant="body2" color="text.primary" onClick={handlerDiscardSocialLink}>
              <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.discard} />
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Dialog>
  );
}
