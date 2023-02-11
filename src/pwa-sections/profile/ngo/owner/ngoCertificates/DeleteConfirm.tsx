import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useDeleteCertificateMutation } from 'src/_graphql/profile/certificates/mutations/deleteCertificate.generated';
import { Icon } from 'src/components/Icon';
import UserCertificates from 'src/pwa-sections/profile/UserCertificatesPwa.messages';
import { useDispatch, useSelector } from 'src/store';
import { certificateCleared, userCertificateSelector } from 'src/store/slices/profile/userCertificates-slice';

function DeleteConfirm() {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
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
      navigate(-1);
    } else {
      enqueueSnackbar(formatMessage(UserCertificates.notSuccess), { variant: 'error' });
    }
  };

  function handleDiscardCertificate() {
    dispatch(certificateCleared());
    navigate(-1);
  }

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            <FormattedMessage {...UserCertificates.areYouSureToDelete} />
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2, justifyContent: 'left' }}>
        <LoadingButton
          loading={isLoading}
          startIcon={<Icon name="trash" color="error.main" />}
          variant="text"
          color="error"
          onClick={handleDeleteCertificate}
          sx={{ maxWidth: 220 }}
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
          <Icon name="Close-1" color="grey.500" />
          <Typography variant="body2" color="text.primary">
            <FormattedMessage {...UserCertificates.discard} />
          </Typography>
        </Button>
      </Stack>
    </Stack>
  );
}

export default DeleteConfirm;
