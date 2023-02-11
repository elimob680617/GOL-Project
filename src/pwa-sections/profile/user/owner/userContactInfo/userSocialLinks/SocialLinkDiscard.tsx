import { useNavigate } from 'react-router-dom';

import { Box, Divider, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useUpsertUserSocialMediaMutation } from 'src/_graphql/profile/contactInfo/mutations/upsertUserSocialMedia.generated';
import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { emptySocialMedia, userSocialMediasSelector } from 'src/store/slices/profile/socialMedia-slice';
import { AudienceEnum } from 'src/types/serverTypes';

export default function SocialLinkDiscard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const personSocialMedia = useSelector(userSocialMediasSelector);

  const [upsertUserSocialMedia] = useUpsertUserSocialMediaMutation();

  function handlerDiscardSocialLink() {
    dispatch(emptySocialMedia({ audience: AudienceEnum.Public }));
    navigate(PATH_APP.profile.user.contactInfo.root);
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
      navigate(PATH_APP.profile.user.contactInfo.root);
      dispatch(emptySocialMedia({ audience: AudienceEnum.Public }));
    }
    if (!resData.data?.upsertUserSocialMedia?.isSuccess) {
      enqueueSnackbar(resData.data?.upsertUserSocialMedia?.messagingKey, { variant: 'error' });
    }
  };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            Do you want to save changes?
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer' }} onClick={handleSaveChangeSocialLink}>
          <Icon name="Save" color="grey.700" />
          <Typography variant="body2" color="text.primary">
            Save Change
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }} onClick={handlerDiscardSocialLink}>
          <Icon name="Close-1" color="grey.500" />
          <Typography variant="body2" color="error">
            Discard
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}
