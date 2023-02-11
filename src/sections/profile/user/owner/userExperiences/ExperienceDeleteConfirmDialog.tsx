import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useDeleteExperienceMutation } from 'src/_graphql/profile/experiences/mutations/updateExperience.generated';
import { Icon } from 'src/components/Icon';
import GeneralMessagess from 'src/language/general.messages';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { emptyExperience, userExperienceSelector } from 'src/store/slices/profile/userExperiences-slice';

import ExprienceMessages from './Exprience.messages';

function ExperienceDeleteConfirmDialog() {
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const router = useNavigate();
  const userExperience = useSelector(userExperienceSelector);
  const [deleteExperience, { isLoading }] = useDeleteExperienceMutation();

  // functions !
  const deleteHandler = async () => {
    const resDeleteData: any = await deleteExperience({
      filter: {
        dto: {
          id: userExperience?.id,
        },
      },
    });
    if (resDeleteData?.data?.deleteExperience?.isSuccess) {
      enqueueSnackbar(formatMessage(ExprienceMessages.deleteExprienceSuccessfull), { variant: 'success' });
      dispatch(emptyExperience());
      router(PATH_APP.profile.user.experience.root);
    } else {
      enqueueSnackbar(formatMessage(ExprienceMessages.notSuccessfull), { variant: 'error' });
    }
  };

  function discardHandler() {
    router(PATH_APP.profile.user.experience.root);
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
              <FormattedMessage {...ExprienceMessages.deleteQuestion} />
            </Typography>
          </Box>
          <IconButton onClick={() => router(-1)}>
            <Icon name="Close-1" />
          </IconButton>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
            <Icon name="trash" size={24} color="error.main" />
            <LoadingButton variant="text" color="error" loading={isLoading} sx={{ p: 0 }}>
              <Typography variant="body2" color="error" onClick={deleteHandler}>
                <FormattedMessage {...ExprienceMessages.deleteCurrentExprience} />
              </Typography>
            </LoadingButton>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }} onClick={discardHandler}>
            <Icon name="Save" size={24} />
            <Typography variant="body2" color="text.primary">
              <FormattedMessage {...GeneralMessagess.discardWord} />
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default ExperienceDeleteConfirmDialog;
