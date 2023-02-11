import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Divider, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useDeleteExperienceMutation } from 'src/_graphql/profile/experiences/mutations/updateExperience.generated';
import { Icon } from 'src/components/Icon';
import GeneralMessagess from 'src/language/general.messages';
import { useDispatch, useSelector } from 'src/store';
import { emptyExperience, userExperienceSelector } from 'src/store/slices/profile/userExperiences-slice';

import ExprienceMessages from './ExpriencePwa.messages';

function ExperienceDeleteConfirm() {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userExperience = useSelector(userExperienceSelector);
  const [deleteExperience, { isLoading }] = useDeleteExperienceMutation();
  const { formatMessage } = useIntl();

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
      navigate('/profile/user/experience/list');
    } else {
      enqueueSnackbar(formatMessage(ExprienceMessages.notSuccessfull), { variant: 'error' });
    }
  };

  function discardHandler() {
    navigate('/profile/user/experience/list');
  }

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            <FormattedMessage {...ExprienceMessages.deleteQuestion} />
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
          <Icon name="trash" color="error.main" />
          <LoadingButton variant="text" color="error" loading={isLoading} sx={{ p: 0 }}>
            <Typography variant="body2" color="error" onClick={deleteHandler}>
              <FormattedMessage {...ExprienceMessages.deleteCurrentExprience} />
            </Typography>
          </LoadingButton>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }} onClick={discardHandler}>
          <Icon name="Close-1" color="grey.500" />
          <Typography variant="body2" color="text.primary">
            <FormattedMessage {...GeneralMessagess.discardWord} />
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}

export default ExperienceDeleteConfirm;
