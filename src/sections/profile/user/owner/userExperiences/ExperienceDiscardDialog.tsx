import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useAddExperienceMutation } from 'src/_graphql/profile/experiences/mutations/addExperience.generated';
import { useUpdateExperienceMutation } from 'src/_graphql/profile/experiences/mutations/updateExperience.generated';
import { Icon } from 'src/components/Icon';
import GeneralMessagess from 'src/language/general.messages';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { emptyExperience, userExperienceSelector } from 'src/store/slices/profile/userExperiences-slice';

import ExprienceMessages from './Exprience.messages';

function DiscardCertificate() {
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();
  const userExperience = useSelector(userExperienceSelector);
  const [addExperienceMutate, { isLoading: addLoading }] = useAddExperienceMutation();
  const [updateExperienceMutate, { isLoading: updateLoading }] = useUpdateExperienceMutation();

  const dispatch = useDispatch();
  const router = useNavigate();

  // function !
  // click on Diskard
  function discardHandler() {
    dispatch(emptyExperience());
    router(PATH_APP.profile.user.experience.root);
  }

  // click on Save to mutaiation data and from Redux
  const saveHandler = async () => {
    if (!userExperience?.isValid) {
      router(-1);
    } else {
      const startDate = new Date(userExperience?.startDate);
      let endDate;
      if (userExperience?.stillWorkingThere) endDate = undefined;
      else if (userExperience?.endDate) {
        const date = new Date(userExperience?.endDate);
        endDate = date.getFullYear() + '-' + date.getMonth() + 1 + '-01';
      }

      if (userExperience?.id) {
        const res: any = await updateExperienceMutate({
          filter: {
            dto: {
              id: userExperience?.id,
              audience: userExperience?.audience,
              employmentType: userExperience?.employmentType,
              description: userExperience?.description,
              mediaUrl: userExperience?.mediaUrl,
              stillWorkingThere: userExperience?.stillWorkingThere,
              title: userExperience?.title,
              cityId: userExperience?.cityDto?.id,
              companyId: userExperience?.companyDto?.id,
              startDate: startDate.getFullYear() + '-' + ('0' + (startDate.getMonth() + 1)).slice(-2) + '-01',
              endDate: endDate,
            },
          },
        });
        if (res?.data?.updateExperience?.isSuccess) {
          enqueueSnackbar(formatMessage(ExprienceMessages.updateSuccessfull), { variant: 'success' });
          dispatch(emptyExperience());
          router(PATH_APP.profile.user.experience.root);
        }
      } else {
        const res: any = await addExperienceMutate({
          filter: {
            dto: {
              audience: userExperience?.audience,
              employmentType: userExperience?.employmentType,
              description: userExperience?.description,
              mediaUrl: userExperience?.mediaUrl,
              stillWorkingThere: userExperience?.stillWorkingThere,
              title: userExperience?.title,
              cityId: userExperience?.cityDto?.id,
              companyId: userExperience?.companyDto?.id,
              startDate: startDate.getFullYear() + '-' + ('0' + (startDate.getMonth() + 1)).slice(-2) + '-01',
              endDate: endDate,
            },
          },
        });

        if (res?.data?.addExperience?.isSuccess) {
          enqueueSnackbar(formatMessage(ExprienceMessages.experienceSuccessfull), { variant: 'success' });
          dispatch(emptyExperience());
          router(PATH_APP.profile.user.experience.root);
        }
      }
    }
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => router(-1)}>
      <Stack spacing={2} sx={{ minWidth: 600, minHeight: 194, py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => router(-1)}>
              <Icon name="left-arrow-1" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              {userExperience?.isValid
                ? formatMessage(ExprienceMessages.doYouWantToSaveChange)
                : formatMessage(ExprienceMessages.doYouWantToContinue)}
            </Typography>
          </Box>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <LoadingButton
            loading={addLoading || updateLoading}
            startIcon={<Icon name="Save" size={24} />}
            variant="text"
            color="inherit"
            onClick={saveHandler}
            sx={{ maxWidth: 180, justifyContent: 'flex-start' }}
          >
            <Typography variant="body2" color="text.primary">
              {userExperience?.isValid
                ? formatMessage(ExprienceMessages.saveChange)
                : formatMessage(ExprienceMessages.continue)}
            </Typography>
          </LoadingButton>
          <Button
            variant="text"
            color="error"
            startIcon={<Icon name="Close-1" size={24} color="error.main" />}
            onClick={discardHandler}
            sx={{ maxWidth: 99, justifyContent: 'flex-start' }}
          >
            <Typography variant="body2" color="error">
              <FormattedMessage {...GeneralMessagess.discardWord} />
            </Typography>
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default DiscardCertificate;
