import { FormattedMessage, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Box, Divider, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useDeleteWebSiteMutation } from 'src/_graphql/profile/contactInfo/mutations/deleteWebSite.generated';
import { Icon } from 'src/components/Icon';
import NormalAndNgoProfileContactInfoMessages from 'src/pwa-sections/profile/UserProfileContactInfoPwa.messages';
import { PATH_APP } from 'src/routes/paths';
import { userWebsiteSelector } from 'src/store/slices/profile/userWebsite-slice';

function ConfirmDeleteWebsite() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const deleteWebsite = useSelector(userWebsiteSelector);
  const [deletePersonWebsite] = useDeleteWebSiteMutation();
  const { formatMessage } = useIntl();

  const handleClickDeleteButton = async () => {
    const resDataDelete: any = await deletePersonWebsite({
      filter: {
        dto: {
          id: deleteWebsite?.id,
        },
      },
    });
    if (resDataDelete.data.deleteWebSite?.isSuccess) {
      navigate(PATH_APP.profile.ngo.contactInfo.root);
      enqueueSnackbar(formatMessage(NormalAndNgoProfileContactInfoMessages.deleteWebsiteSuccessfull), {
        variant: 'success',
      });
    }
  };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.deleteWebsiteQuestion} />
          </Typography>
        </Box>
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
          <Icon name="Close-1" color="grey.500" />
          <Typography variant="body2" color="text.primary">
            <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.discard} />
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}

export default ConfirmDeleteWebsite;
