import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useDeleteCertificateMutation } from 'src/_graphql/profile/certificates/mutations/deleteCertificate.generated';
import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import UserCertificates from 'src/sections/profile/UserCertificates.messages';
import { useDispatch, useSelector } from 'src/store';
import { certificateCleared, userCertificateSelector } from 'src/store/slices/profile/userCertificates-slice';

function DeleteConfirmDialog() {
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const router = useNavigate();
  const userCertificate = useSelector(userCertificateSelector);
  const [deleteCertificate, { isLoading }] = useDeleteCertificateMutation();

  // functions !
  const handleDeleteCertificate = async () => {
    const resDeleteData: any = await deleteCertificate({
      filter: {
        dto: {
          id: userCertificate?.id,
        },
      },
    });
    if (resDeleteData?.data?.deleteCertificate?.isSuccess) {
      enqueueSnackbar(formatMessage(UserCertificates.successDeleted), { variant: 'success' });
      dispatch(certificateCleared());
      router(PATH_APP.profile.user.certificate.root);
    } else {
      enqueueSnackbar(formatMessage(UserCertificates.notSuccess), { variant: 'error' });
    }
  };

  function handleDiscardCertificate() {
    dispatch(certificateCleared());
    router(PATH_APP.profile.user.certificate.root);
  }

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => router(-1)}>
      <Stack spacing={2} sx={{ minWidth: 600, minHeight: 194, py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => router(-1)}>
              <Icon name="left-arrow" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              <FormattedMessage {...UserCertificates.areYouSureToDelete} />
            </Typography>
          </Box>
          <Link to={PATH_APP.profile.user.certificate.root}>
            <IconButton>
              <Icon name="Close" />
            </IconButton>
          </Link>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2, justifyContent: 'left' }}>
          <LoadingButton
            loading={isLoading}
            startIcon={<Icon name="trash" size={24} color="error.main" />}
            variant="text"
            color="error"
            onClick={handleDeleteCertificate}
            sx={{ maxWidth: 205 }}
          >
            <Typography variant="body2" color="error">
              <FormattedMessage {...UserCertificates.deleteCurrent} />
            </Typography>
          </LoadingButton>
          <Button
            color="inherit"
            sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }}
            onClick={handleDiscardCertificate}
          >
            <Icon name="Save" size={24} />
            <Typography variant="body2" color="text.primary">
              <FormattedMessage {...UserCertificates.discard} />
            </Typography>
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default DeleteConfirmDialog;
