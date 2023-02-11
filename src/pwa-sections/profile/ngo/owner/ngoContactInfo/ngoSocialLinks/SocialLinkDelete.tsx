import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Box, Divider, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useDeleteUserSocialMediaMutation } from 'src/_graphql/profile/contactInfo/mutations/deleteUserSocialMedia.generated';
import { Icon } from 'src/components/Icon';
import NormalAndNgoProfileContactInfoMessages from 'src/pwa-sections/profile/UserProfileContactInfoPwa.messages';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { emptySocialMedia, userSocialMediasSelector } from 'src/store/slices/profile/socialMedia-slice';
import { AudienceEnum } from 'src/types/serverTypes';

export default function SocialLinkDelete() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const personSocialMedia = useSelector(userSocialMediasSelector);
  const [deleteUserSocialMedia] = useDeleteUserSocialMediaMutation();
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();

  function handlerDiscardSocialLink() {
    // navigate(PATH_APP.profile.ngo.contactInfo.ngoSocialLinks);
    navigate(PATH_APP.profile.ngo.contactInfo.root);
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
      navigate(PATH_APP.profile.ngo.contactInfo.root);
      dispatch(emptySocialMedia({ audience: AudienceEnum.Public }));
      enqueueSnackbar(formatMessage(NormalAndNgoProfileContactInfoMessages.deleteSocialSuccessfull), {
        variant: 'success',
      });
    }
  };

  // const handleBackRoute = () => {
  //   dispatch(emptySocialMedia({ audience: AudienceEnum.Public }));
  //   navigate(PATH_APP.profile.ngo.contactInfo.root);
  // };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.deleteSocialQuestion} />
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
          <Icon name="trash" color="error.main" />
          <Typography variant="body2" color="error" onClick={() => handleDeleteSocialLink()}>
            <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.deleteSocial} />
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
          <Icon name="Close-1" color="grey.500" />
          <Typography variant="body2" color="text.primary" onClick={handlerDiscardSocialLink}>
            <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.discard} />
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}
