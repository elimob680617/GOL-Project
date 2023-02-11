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
import sleep from 'src/utils/sleep';

function DiscardCertificate() {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const userCertificate = useSelector(userCertificateSelector);
  const [upsertCertificate, { isLoading }] = useUpsertCertificateMutation();

  const handleDiscardCertificate = async () => {
    navigate(PATH_APP.profile.ngo.certificate.root);
    await sleep(1000);
    dispatch(certificateCleared());
  };

  const handleSaveOrContinueCertificate = async () => {
    if (!userCertificate?.isValid) {
      navigate(-1);
    } else {
      const resData: any = await upsertCertificate({
        filter: {
          dto: {
            id: userCertificate?.id,
            certificateNameId: userCertificate?.certificateName?.id,
            issuingOrganizationId: userCertificate?.issuingOrganization?.id,
            credentialDoesExpire: !userCertificate?.credentialDoesExpire,
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
        navigate(PATH_APP.profile.ngo.certificate.root);
        await sleep(1000);
        dispatch(certificateCleared());
      } else {
        enqueueSnackbar(formatMessage(UserCertificates.notSuccess), { variant: 'error' });
      }
    }
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => navigate(-1)}>
      <Stack spacing={2} sx={{ minWidth: 600, minHeight: 194, py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => navigate(-1)}>
              <Icon name="left-arrow-1" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              {userCertificate?.isValid
                ? formatMessage(UserCertificates.saveChange)
                : formatMessage(UserCertificates.continue)}
            </Typography>
          </Box>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2, alignItems: 'flex-start' }}>
          <LoadingButton
            loading={isLoading}
            startIcon={<Icon name="Save" />}
            variant="text"
            color="inherit"
            onClick={handleSaveOrContinueCertificate}
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
            startIcon={<Icon name="Close-1" color="error.main" />}
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
