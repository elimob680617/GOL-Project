import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';

import { Icon } from 'src/components/Icon';
import UserCertificates from 'src/pwa-sections/profile/UserCertificatesPwa.messages';

interface DisCardCertificateProps {
  onSubmit: () => void;
  isValid: boolean;
}

function DiscardCertificate(props: DisCardCertificateProps) {
  const { onSubmit, isValid } = props;
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  // function !
  // click on Discard
  function handleDiscardCertificate() {
    navigate(-1);
  }

  // click on Save to mutation data and from Redux
  const handleSaveOrContinueCertificate = async () => {
    onSubmit();
  };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            {isValid ? formatMessage(UserCertificates.saveChange) : formatMessage(UserCertificates.continue)}?
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        <LoadingButton
          // loading={isLoading}
          startIcon={<Icon name="Save" color="grey.700" />}
          variant="text"
          color="inherit"
          onClick={handleSaveOrContinueCertificate}
          sx={{ justifyContent: 'flex-start' }}
        >
          <Typography variant="body2" color="text.primary">
            {isValid ? formatMessage(UserCertificates.saveChangeBtn) : formatMessage(UserCertificates.continueBtn)}
          </Typography>
        </LoadingButton>
        <Button
          variant="text"
          color="error"
          startIcon={<Icon name="Close-1" color="grey.500" />}
          onClick={handleDiscardCertificate}
          sx={{ maxWidth: 99, justifyContent: 'flex-start' }}
        >
          <Typography variant="body2" color="error">
            <FormattedMessage {...UserCertificates.discard} />
          </Typography>
        </Button>
      </Stack>
    </Stack>
  );
}

export default DiscardCertificate;
