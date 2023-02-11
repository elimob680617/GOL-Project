import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useUpsertWebsiteMutation } from 'src/_graphql/profile/contactInfo/mutations/upsertWebsite.generated';
import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import NormalAndNgoProfileContactInfoMessages from 'src/sections/profile/UserProfileContactInfo.messages';
import { useDispatch, useSelector } from 'src/store';
import { userWebsiteSelector, websiteAdded } from 'src/store/slices/profile/userWebsite-slice';
import { AudienceEnum } from 'src/types/serverTypes';

export default function WebsiteDiscardDialog() {
  const router = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const personWebsite = useSelector(userWebsiteSelector);
  const [upsertUserWebsite] = useUpsertWebsiteMutation();

  function handlerDiscardWebsite() {
    dispatch(websiteAdded({ audience: AudienceEnum.Public }));
    router(PATH_APP.profile.user.contactInfo.root);
  }

  const handleSaveChangeWebsite = async () => {
    const resData: any = await upsertUserWebsite({
      filter: {
        dto: {
          id: personWebsite?.id,
          webSiteUrl: personWebsite?.webSiteUrl,
          audience: personWebsite?.audience,
        },
      },
    });

    if (resData.data?.upsertWebSite?.isSuccess) {
      router(PATH_APP.profile.user.contactInfo.root);
      dispatch(websiteAdded({ audience: AudienceEnum.Public }));
    }
    if (!resData.data?.upsertWebSite?.isSuccess) {
      enqueueSnackbar(resData.data?.upsertWebSite?.messagingKey, { variant: 'error' });
    }
  };

  const handleBackRoute = () => {
    dispatch(websiteAdded({ audience: AudienceEnum.Public }));
    router(PATH_APP.profile.user.contactInfo.root);
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={handleBackRoute}>
      <Stack spacing={2} sx={{ py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={handleBackRoute}>
              <Icon name="left-arrow" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.saveChangeQuestion} />
            </Typography>
          </Box>

          <IconButton onClick={handleBackRoute}>
            <Icon name="Close" />
          </IconButton>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer' }} onClick={handleSaveChangeWebsite}>
            <Icon name="Save" size={24} />
            <Typography variant="body2" color="text.primary">
              <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.saveChange} />
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }} onClick={handlerDiscardWebsite}>
            <Icon name="Close" size={24} color="error.main" />
            <Typography variant="body2" color="error">
              <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.discard} />
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Dialog>
  );
}
