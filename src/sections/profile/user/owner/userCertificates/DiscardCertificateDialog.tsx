import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useUpsertCertificateMutation } from 'src/_graphql/profile/certificates/mutations/upsertCertificate.generated';
import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import UserCertificates from 'src/sections/profile/UserCertificates.messages';
import { useDispatch, useSelector } from 'src/store';
import { certificateCleared, userCertificateSelector } from 'src/store/slices/profile/userCertificates-slice';

function DiscardCertificate() {
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();
  const userCertificate = useSelector(userCertificateSelector);
  const [upsertCertificate, { isLoading }] = useUpsertCertificateMutation();
  const dispatch = useDispatch();
  const router = useNavigate();

  // function !
  // click on Diskard
  function handleDiscardCertificate() {
    dispatch(certificateCleared());
    router(PATH_APP.profile.user.certificate.root);
  }

  // click on Save to mutaiation data and from Redux
  const handleSaveOrContinueCertificate = async () => {
    if (!userCertificate?.isValid) {
      router(-1);
    } else {
      const resData: any = await upsertCertificate({
        filter: {
          dto: {
            id: userCertificate?.id,
            certificateNameId: userCertificate?.certificateName?.id,
            issuingOrganizationId: userCertificate?.issuingOrganization?.id,
            credentialDoesExpire: userCertificate?.credentialDoesExpire,
            issueDate: new Date(userCertificate?.issueDate).toISOString(),
            expirationDate: !userCertificate?.credentialDoesExpire ? userCertificate?.expirationDate : undefined,
            credentialID: userCertificate?.credentialID,
            credentialUrl: userCertificate?.credentialUrl,
            audience: userCertificate?.audience,
          },
        },
      });
      if (resData?.data?.upsertCertificate?.isSuccess) {
        enqueueSnackbar(formatMessage(UserCertificates.successAdded), { variant: 'success' });
        dispatch(certificateCleared());
        router(PATH_APP.profile.user.certificate.root);
      } else {
        enqueueSnackbar(formatMessage(UserCertificates.notSuccess), { variant: 'error' });
      }
    }
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => router(-1)}>
      <Stack spacing={2} sx={{ minWidth: 600, minHeight: 194, py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => router(-1)}>
              <Icon name="left-arrow" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              {userCertificate?.isValid
                ? formatMessage(UserCertificates.saveChange)
                : formatMessage(UserCertificates.continue)}
            </Typography>
          </Box>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <LoadingButton
            loading={isLoading}
            startIcon={<Icon name="Save" size={24} />}
            variant="text"
            color="inherit"
            onClick={handleSaveOrContinueCertificate}
            sx={{ maxWidth: 130, justifyContent: 'flex-start' }}
          >
            <Typography variant="body2" color="text.primary">
              {userCertificate?.isValid
                ? formatMessage(UserCertificates.saveChangeBtn)
                : formatMessage(UserCertificates.continueBtn)}
            </Typography>
          </LoadingButton>
          <Button
            variant="text"
            color="error"
            startIcon={<Icon name="trash" size={24} color="error.main" />}
            onClick={handleDiscardCertificate}
            sx={{ maxWidth: 99, justifyContent: 'flex-start' }}
          >
            <Typography variant="body2" color="error">
              <FormattedMessage {...UserCertificates.discard} />
            </Typography>
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default DiscardCertificate;
