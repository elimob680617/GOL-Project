import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';

import { Icon } from 'src/components/Icon';
import GeneralMessagess from 'src/language/general.messages';

import ExprienceMessages from './ExpriencePwa.messages';

interface DiscardProps {
  isValid: boolean;
  onSubmit: () => void;
  loading?: boolean;
}

function ExperienceDiscard(props: DiscardProps) {
  const { isValid, onSubmit, loading } = props;
  const { formatMessage } = useIntl();

  const navigate = useNavigate();

  // function !
  // click on Diskard
  function discardHandler() {
    navigate('/profile/user/experience/list');
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
                ? formatMessage(ExprienceMessages.doYouWantToSaveChange)
                : formatMessage(ExprienceMessages.doYouWantToContinue)}
            </Typography>
          </Box>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <LoadingButton
            loading={loading}
            startIcon={<Icon name="Save" color="grey.700" />}
            variant="text"
            color="inherit"
            onClick={saveHandler}
            sx={{ maxWidth: 130, justifyContent: 'flex-start' }}
          >
            <Typography variant="body2" color="text.primary">
              {isValid ? formatMessage(ExprienceMessages.saveChange) : formatMessage(ExprienceMessages.continue)}
            </Typography>
          </LoadingButton>
          <Button
            variant="text"
            color="error"
            startIcon={<Icon name="Close-1" color="grey.500" />}
            onClick={discardHandler}
            sx={{ maxWidth: 99, justifyContent: 'flex-start' }}
          >
            <Typography variant="body2" color="error">
              <FormattedMessage {...GeneralMessagess.discardWord} />
            </Typography>
          </Button>
        </Stack>
      </Stack>
    </>
  );
}

export default ExperienceDiscard;
