import { FormattedMessage } from 'react-intl';

import { LoadingButton } from '@mui/lab';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';

import { Icon } from 'src/components/Icon';
import ProfileMainMessage from 'src/pwa-sections/profile/components/profileMain.messages';

interface DiscardProps {
  onSubmit: () => void;
  onDiscard: () => void;
}

function MainProfileDiscard(props: DiscardProps) {
  const { onSubmit, onDiscard } = props;

  // function !
  // click on Diskard
  function discardHandler() {
    onDiscard();
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
              <FormattedMessage {...ProfileMainMessage.wantSaveChanges} />
            </Typography>
          </Box>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <LoadingButton
            startIcon={<Icon name="Save" color="grey.700" />}
            variant="text"
            color="inherit"
            onClick={saveHandler}
            sx={{ maxWidth: 130 }}
          >
            <Typography variant="body2" color="text.primary">
              <FormattedMessage {...ProfileMainMessage.saveChanges} />
            </Typography>
          </LoadingButton>
          <Button
            variant="text"
            color="error"
            startIcon={<Icon name="Close-1" color="error.main" />}
            onClick={discardHandler}
            sx={{ maxWidth: 99 }}
          >
            <Typography variant="body2" color="error">
              <FormattedMessage {...ProfileMainMessage.discard} />
            </Typography>
          </Button>
        </Stack>
      </Stack>
    </>
  );
}

export default MainProfileDiscard;
