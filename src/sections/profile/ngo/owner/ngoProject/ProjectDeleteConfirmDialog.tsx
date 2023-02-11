import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useDeleteProjectMutation } from 'src/_graphql/profile/mainProfileNOG/mutations/deleteProject.generated';
import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { emptyProject, ngoProjectSelector } from 'src/store/slices/profile/ngoProject-slice';

import NgoProjectMessages from './NgoProject.messages';

function ProjectDeleteConfirmDialog() {
  const { formatMessage } = useIntl();
  const router = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const projectData = useSelector(ngoProjectSelector);
  const [deleteProject, { isLoading }] = useDeleteProjectMutation();

  const deleteHandler = async () => {
    const resDeleteData: any = await deleteProject({
      filter: {
        dto: {
          id: projectData?.id,
        },
      },
    });
    if (resDeleteData?.data?.deleteProject?.isSuccess) {
      enqueueSnackbar(formatMessage(NgoProjectMessages.projectDelete), { variant: 'success' });
      dispatch(emptyProject());
      router(PATH_APP.profile.ngo.project.list);
    } else {
      enqueueSnackbar(formatMessage(NgoProjectMessages.ItWasNotSuccessful), { variant: 'error' });
    }
  };

  function discardHandler() {
    router(PATH_APP.profile.ngo.project.list);
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
              <FormattedMessage {...NgoProjectMessages.deleteProjectMassage} />
            </Typography>
          </Box>
          <IconButton onClick={() => router(-1)}>
            <Icon name="Close-1" />
          </IconButton>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
            <Icon name="trash" color="error.main" />
            <LoadingButton variant="text" color="error" loading={isLoading} sx={{ p: 0 }}>
              <Typography variant="body2" color="error" onClick={deleteHandler}>
                <FormattedMessage {...NgoProjectMessages.deleteCurrentProject} />
              </Typography>
            </LoadingButton>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }} onClick={discardHandler}>
            <Icon name="Close-1" />
            <Typography variant="body2" color="text.primary">
              <FormattedMessage {...NgoProjectMessages.discard} />
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default ProjectDeleteConfirmDialog;
