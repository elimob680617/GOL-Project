import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Box, Divider, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useDeleteWebSiteMutation } from 'src/_graphql/profile/contactInfo/mutations/deleteWebSite.generated';
import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import { userWebsiteSelector } from 'src/store/slices/profile/userWebsite-slice';

function ConfirmDeleteWebsite() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const deleteWebsite = useSelector(userWebsiteSelector);
  const [deletePersonWebsite] = useDeleteWebSiteMutation();

  function handlerDiscardWebsite() {
    navigate(PATH_APP.profile.user.contactInfo.root);
  }

  const handleClickDeleteButton = async () => {
    const resDataDelete: any = await deletePersonWebsite({
      filter: {
        dto: {
          id: deleteWebsite?.id,
        },
      },
    });
    if (resDataDelete.data.deleteWebSite?.isSuccess) {
      navigate(PATH_APP.profile.user.contactInfo.root);
      enqueueSnackbar('The website has been successfully deleted', { variant: 'success' });
    }
  };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            Are you sure to delete this Website?
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer' }}>
          <Icon name="trash" color="error.main" />
          <Box>
            <Typography variant="body2" color="error" onClick={() => handleClickDeleteButton()}>
              Delete Website
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }}>
          <Icon name="Close-1" color="grey.500" />
          <Typography variant="body2" color="text.primary" onClick={handlerDiscardWebsite}>
            Discard
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}

export default ConfirmDeleteWebsite;
