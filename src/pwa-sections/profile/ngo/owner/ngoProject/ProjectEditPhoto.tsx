import { FormattedMessage } from 'react-intl';

import { LoadingButton } from '@mui/lab';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';

import Image from 'src/components/Image';

import NgoProjectMessages from './NgoProjectPwa.messages';

interface EditPhotoProps {
  onRemove: (value: undefined) => void;
  onUpload: () => void;
}

function ProjectEditPhoto(props: EditPhotoProps) {
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
            <FormattedMessage {...NgoProjectMessages.editPhoto} />
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={1} sx={{ px: 2 }}>
        <LoadingButton
          onClick={handleUpload}
          startIcon={<Image width={20} height={20} src={'/icons/upload_photo.svg'} alt="upload" />}
          variant="text"
          color="inherit"
          sx={{ maxWidth: 250 }}
        >
          <Typography variant="body2" color="text.primary">
            <FormattedMessage {...NgoProjectMessages.uploadNewPhoto} />
          </Typography>
        </LoadingButton>

        <Button
          variant="text"
          color="error"
          startIcon={<Image width={20} height={20} src={'/icons/delete_photo.svg'} alt="remove" />}
          onClick={handleRemove}
          sx={{ maxWidth: 140 }}
        >
          <Typography variant="body2" color="error">
            <FormattedMessage {...NgoProjectMessages.removePhoto} />
          </Typography>
        </Button>
      </Stack>
    </Stack>
  );
}

export default ProjectEditPhoto;
