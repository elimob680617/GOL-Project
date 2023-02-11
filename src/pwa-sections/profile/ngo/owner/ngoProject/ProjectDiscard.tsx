import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';

import { Icon } from 'src/components/Icon';

import NgoProjectMessages from './NgoProjectPwa.messages';

interface DiscardProps {
  isValid: boolean;
  onSubmit: () => void;
}

function ProjectDiscard(props: DiscardProps) {
  const { isValid, onSubmit } = props;
  const { formatMessage } = useIntl();

  const navigate = useNavigate();

  // function !
  // click on Diskard
  function discardHandler() {
    navigate(-1);
  }

  // click on Save to mutaiation data and from Redux
  const saveHandler = async () => {
    onSubmit();
  };

  return (
    <>
      <Stack spacing={2} sx={{ minWidth: 600, minHeight: 194, py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              {isValid
                ? formatMessage(NgoProjectMessages.saveChangeMessage)
                : formatMessage(NgoProjectMessages.continueMessage)}
            </Typography>
          </Box>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <LoadingButton
            // loading={addLoading || updateLoading}
            startIcon={<Icon name="Save" color="grey.700" />}
            variant="text"
            color="inherit"
            onClick={saveHandler}
            sx={{ maxWidth: 130, justifyContent: 'flex-start' }}
          >
            <Typography variant="body2" color="text.primary">
              {isValid ? formatMessage(NgoProjectMessages.saveChange) : formatMessage(NgoProjectMessages.continue)}
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
              <FormattedMessage {...NgoProjectMessages.discard} />
            </Typography>
          </Button>
        </Stack>
      </Stack>
    </>
  );
}

export default ProjectDiscard;
