import { FormattedMessage } from 'react-intl';

import { LoadingButton } from '@mui/lab';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';

import ExprienceMessages from './ExpriencePwa.messages';

interface EditPhotoProps {
  onRemove: (value: undefined) => void;
  onUpload: () => void;
}

function ExperienceEditPhoto(props: EditPhotoProps) {
  const { onUpload, onRemove } = props;

  // function !
  function handleRemove() {
    onRemove(undefined);
  }
  function handleUpload() {
    onUpload();
  }

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            <FormattedMessage {...ExprienceMessages.editPhoto} />
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={1} sx={{ px: 2 }}>
        <LoadingButton
          onClick={handleUpload}
          startIcon={<img width={20} height={20} src={'/icons/upload_photo.svg'} alt="upload" />}
          variant="text"
          color="inherit"
          sx={{ maxWidth: 250 }}
        >
          <Typography variant="body2" color="text.primary">
            <FormattedMessage {...ExprienceMessages.uploadFromSystem} />
          </Typography>
        </LoadingButton>

        <Button
          variant="text"
          color="error"
          startIcon={<img width={20} height={20} src={'/icons/delete_photo.svg'} alt="remove" />}
          onClick={handleRemove}
          sx={{ maxWidth: 140 }}
        >
          <Typography variant="body2" color="error">
            <FormattedMessage {...ExprienceMessages.removePhoto} />
          </Typography>
        </Button>
      </Stack>
    </Stack>
  );
}

export default ExperienceEditPhoto;
