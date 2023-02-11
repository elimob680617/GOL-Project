import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';

import { Icon } from 'src/components/Icon';
import GeneralMessagess from 'src/language/general.messages';

import NgoPublicDetailsMessages from '../NgoPublicDetailsPwa.messages';

interface DiscardProps {
  isValid: boolean;
  onSubmit: () => void;
}

function EstablishmentDiscard(props: DiscardProps) {
  const { isValid, onSubmit } = props;
  const navigate = useNavigate();
  function discardHandler() {
    navigate(-1);
  }
  const { formatMessage } = useIntl();

  const saveHandler = async () => {
    onSubmit();
  };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            <FormattedMessage {...NgoPublicDetailsMessages.saveChangeMessage} />
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        <LoadingButton
          // loading={addLoading || updateLoading}
          startIcon={<Icon name="Save" />}
          variant="text"
          color="inherit"
          onClick={saveHandler}
          sx={{ justifyContent: 'flex-start' }}
        >
          <Typography variant="body2" color="text.primary">
            {isValid
              ? formatMessage(NgoPublicDetailsMessages.saveChange)
              : formatMessage(NgoPublicDetailsMessages.continue)}
          </Typography>
        </LoadingButton>
        <Button
          variant="text"
          color="error"
          startIcon={<Icon name="Close-1" color="error.main" />}
          onClick={discardHandler}
          sx={{ maxWidth: 99, justifyContent: 'flex-start' }}
        >
          <Typography variant="body2" color="error">
            <FormattedMessage {...GeneralMessagess.discardWord} />
          </Typography>
        </Button>
      </Stack>
    </Stack>
  );
}

export default EstablishmentDiscard;
