import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Divider, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useDeleteProjectMutation } from 'src/_graphql/profile/mainProfileNOG/mutations/deleteProject.generated';
import { Icon } from 'src/components/Icon';

import NgoProjectMessages from './NgoProjectPwa.messages';

interface ProjectDeleteProps {
  id: string;
}

function ProjectDeleteConfirm(props: ProjectDeleteProps) {
  const { formatMessage } = useIntl();
  const { id } = props;

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [deleteProject, { isLoading }] = useDeleteProjectMutation();

  // functions !
  const deleteHandler = async () => {
    const resDeleteData: any = await deleteProject({
      filter: {
        dto: {
          id,
        },
      },
    });
    console.log();
    if (resDeleteData?.data?.deleteProject?.isSuccess) {
      enqueueSnackbar(formatMessage(NgoProjectMessages.projectDelete), { variant: 'success' });
      navigate(-1);
    } else {
      enqueueSnackbar(formatMessage(NgoProjectMessages.ItWasNotSuccessful), { variant: 'error' });
    }
  };

  function discardHandler() {
    navigate(-1);
  }

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            <FormattedMessage {...NgoProjectMessages.deleteProjectMassage} />
          </Typography>
        </Box>
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
          <Icon name="Close-1" color="grey.500" />
          <Typography variant="body2" color="text.primary">
            <FormattedMessage {...NgoProjectMessages.discard} />
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}

export default ProjectDeleteConfirm;
