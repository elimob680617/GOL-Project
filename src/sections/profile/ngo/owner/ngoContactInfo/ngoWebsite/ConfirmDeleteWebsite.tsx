import { FormattedMessage, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useDeleteWebSiteMutation } from 'src/_graphql/profile/contactInfo/mutations/deleteWebSite.generated';
import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import NormalAndNgoProfileContactInfoMessages from 'src/sections/profile/UserProfileContactInfo.messages';
import { useDispatch } from 'src/store';
import { userWebsiteSelector, websiteCleared } from 'src/store/slices/profile/userWebsite-slice';
import sleep from 'src/utils/sleep';

function ConfirmDeleteWebsite() {
  const router = useNavigate();
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const deleteWebsite = useSelector(userWebsiteSelector);
  const [deletePersonWebsite] = useDeleteWebSiteMutation();

  const handleClickDeleteButton = async () => {
    const resDataDelete: any = await deletePersonWebsite({
      filter: {
        dto: {
          id: deleteWebsite?.id,
        },
      },
    });
    if (resDataDelete.data.deleteWebSite?.isSuccess) {
      router(PATH_APP.profile.ngo.contactInfo.root);
      enqueueSnackbar(formatMessage(NormalAndNgoProfileContactInfoMessages.deleteWebsiteSuccessfull), {
        variant: 'success',
      });
      await sleep(1500);
      dispatch(websiteCleared());
    }
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => router(-1)}>
      <Stack spacing={2} sx={{ minWidth: 600, minHeight: 194, py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => router(-1)}>
              <Icon name="left-arrow-1" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.deleteWebsiteQuestion} />
            </Typography>
          </Box>
          <Link to={PATH_APP.profile.ngo.contactInfo.root}>
            <IconButton>
              <Icon name="Close-1" />
            </IconButton>
          </Link>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer' }}>
            <Icon name="trash" color="error.main" />
            <Box>
              <Typography variant="body2" color="error" onClick={() => handleClickDeleteButton()}>
                <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.deleteWebsite} />
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }}>
            <Icon name="Close-1" />
            <Link to={PATH_APP.profile.ngo.contactInfo.root}>
              <Typography variant="body2" color="text.primary">
                <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.discard} />
              </Typography>
            </Link>
          </Box>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default ConfirmDeleteWebsite;
