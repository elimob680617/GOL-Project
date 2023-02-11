import { FormattedMessage } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch } from 'src/store';
import { experienceAdded } from 'src/store/slices/profile/userExperiences-slice';

import ExprienceMessages from './Exprience.messages';

function ExperienceEditPhotoDialog() {
  const dispatch = useDispatch();
  const router = useNavigate();

  // function !
  function handleRemove() {
    dispatch(
      experienceAdded({
        mediaUrl: undefined,
        isChange: true,
      }),
    );
    router(PATH_APP.profile.user.experience.add);
  }
  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => router(-1)}>
      <Stack spacing={2} sx={{ minWidth: 600, minHeight: 194, py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => router(-1)}>
              <Icon name="left-arrow-1" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              <FormattedMessage {...ExprienceMessages.editPhoto} />
            </Typography>
          </Box>
        </Stack>
        <Divider />
        <Stack spacing={1} sx={{ px: 2 }}>
          <Link to={PATH_APP.profile.user.experience.photo}>
            <LoadingButton
              startIcon={<Icon name="upload-image" size={24} color="text.primary" />}
              variant="text"
              color="inherit"
              sx={{ maxWidth: 270 }}
            >
              <Typography variant="body2" color="text.primary">
                <FormattedMessage {...ExprienceMessages.uploadFromSystem} />
              </Typography>
            </LoadingButton>
          </Link>
          <Button
            variant="text"
            color="error"
            startIcon={<Icon name="remove-image" size={24} color="error.main" />}
            onClick={handleRemove}
            sx={{ maxWidth: 142 }}
          >
            <Typography variant="body2" color="error">
              <FormattedMessage {...ExprienceMessages.removePhoto} />
            </Typography>
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default ExperienceEditPhotoDialog;
