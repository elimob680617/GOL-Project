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
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const userCertificate = useSelector(userCertificateSelector);
  const [deleteCertificate, { isLoading }] = useDeleteCertificateMutation();

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
      navigate(PATH_APP.profile.ngo.certificate.root);
      dispatch(certificateCleared());
    } else {
      enqueueSnackbar(formatMessage(UserCertificates.notSuccess), { variant: 'error' });
    }
  };

  function handleDiscardCertificate() {
    navigate(PATH_APP.profile.ngo.certificate.root);
    dispatch(certificateCleared());
  }

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => navigate(-1)}>
      <Stack spacing={2} sx={{ minWidth: 600, minHeight: 194, py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => navigate(-1)}>
              <Icon name="left-arrow-1" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              <FormattedMessage {...UserCertificates.areYouSureToDelete} />
            </Typography>
          </Box>
          <Link to={PATH_APP.profile.ngo.certificate.root}>
            <IconButton>
              <Icon name="Close-1" />
            </IconButton>
          </Link>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2, justifyContent: 'left', alignItems: 'flex-start' }}>
          <LoadingButton
            loading={isLoading}
            startIcon={<Icon name="trash" color="error.main" />}
            variant="text"
            color="error"
            onClick={handleDeleteCertificate}
          >
            <Typography variant="body2" color="error">
              <FormattedMessage {...UserCertificates.deleteCurrent} />
            </Typography>
          </LoadingButton>
          <Button color="inherit" onClick={handleDiscardCertificate} startIcon={<Icon name="Close-1" />}>
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
