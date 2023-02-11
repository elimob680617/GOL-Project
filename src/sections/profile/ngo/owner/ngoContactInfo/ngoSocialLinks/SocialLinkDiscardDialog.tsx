import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useUpsertUserSocialMediaMutation } from 'src/_graphql/profile/contactInfo/mutations/upsertUserSocialMedia.generated';
import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import NormalAndNgoProfileContactInfoMessages from 'src/sections/profile/UserProfileContactInfo.messages';
import { useDispatch, useSelector } from 'src/store';
import { emptyEmail } from 'src/store/slices/profile/contactInfo-slice-eli';
import { emptySocialMedia, userSocialMediasSelector } from 'src/store/slices/profile/socialMedia-slice';
import { AudienceEnum } from 'src/types/serverTypes';

export default function SocialLinkDiscardDialog() {
  const router = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const personSocialMedia = useSelector(userSocialMediasSelector);

  const [upsertUserSocialMedia] = useUpsertUserSocialMediaMutation();

  function handlerDiscardSocialLink() {
    dispatch(emptySocialMedia({ audience: AudienceEnum.Public }));
    router(PATH_APP.profile.ngo.contactInfo.root);
  }

  const handleSaveChangeSocialLink = async () => {
    const resData: any = await upsertUserSocialMedia({
      filter: {
        dto: {
          id: personSocialMedia?.id,
          userName: personSocialMedia?.userName,
          socialMediaId: personSocialMedia?.socialMediaDto?.id,
          audience: personSocialMedia?.audience,
        },
      },
    });

    if (resData.data?.upsertUserSocialMedia?.isSuccess) {
      router(PATH_APP.profile.ngo.contactInfo.root);
      dispatch(emptySocialMedia({ audience: AudienceEnum.Public }));
    }
    if (!resData.data?.upsertUserSocialMedia?.isSuccess) {
      enqueueSnackbar(resData.data?.upsertUserSocialMedia?.messagingKey, { variant: 'error' });
    }
  };

  const handleBackRoute = () => {
    dispatch(emptyEmail({ audience: AudienceEnum.Public }));
    dispatch(emptySocialMedia({ audience: AudienceEnum.Public }));
    router(PATH_APP.profile.ngo.contactInfo.root);
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
              <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.saveChangeQuestion} />
            </Typography>
          </Box>

          <IconButton onClick={handleBackRoute}>
            <Icon name="Close-1" />
          </IconButton>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer' }} onClick={handleSaveChangeSocialLink}>
            <Icon name="Save" />
            <Typography variant="body2" color="text.primary">
              <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.saveChange} />
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }} onClick={handlerDiscardSocialLink}>
            <Icon name="Close-1" color="error.main" />
            <Typography variant="body2" color="error">
              <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.discard} />
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Dialog>
  );
}
