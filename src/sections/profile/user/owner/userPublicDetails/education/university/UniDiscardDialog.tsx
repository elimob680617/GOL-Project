import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useAddPersonCollegeMutation } from 'src/_graphql/profile/publicDetails/mutations/createPersonCollege.generated';
import { useUpdatePersonCollegeMutation } from 'src/_graphql/profile/publicDetails/mutations/updatePersonCollege.generated';
import { Icon } from 'src/components/Icon';
import GeneralMessagess from 'src/language/general.messages';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { emptyUniversity, userUniversitySelector } from 'src/store/slices/profile/userUniversity-slice';
import { InstituteTypeEnum } from 'src/types/serverTypes';
import sleep from 'src/utils/sleep';

import NormalPublicDetailsMessages from '../../NormalPublicDetails.messages';

export default function UniDiscardDialog() {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [createPersonUniversity, { isLoading: createIsLoading }] = useAddPersonCollegeMutation();
  const [updateCurrentUniversity, { isLoading: updateIsLoading }] = useUpdatePersonCollegeMutation();
  const dispatch = useDispatch();
  const userUniversity = useSelector(userUniversitySelector);
  const isEdit = !!userUniversity?.id;

  const handleSaveCollegeChangeOrContinue = async () => {
    if (!userUniversity?.isValid) {
      navigate(-1);
    } else {
      const startDate = new Date(userUniversity?.startDate).toISOString();
      let endDate;
      if (userUniversity?.endDate) {
        endDate = new Date(userUniversity?.endDate).toISOString();
      }

      if (isEdit) {
        const response: any = await updateCurrentUniversity({
          filter: {
            dto: {
              id: userUniversity?.id,
              audience: userUniversity?.audience,
              collegeId: userUniversity?.collegeDto?.id,
              concentrationId: userUniversity?.concentrationDto?.id,
              graduated: userUniversity?.graduated,
              startDate: startDate,
              endDate: endDate,
              instituteType: InstituteTypeEnum.University,
            },
          },
        });
        if (response?.data?.updatePersonCollege?.isSuccess) {
          enqueueSnackbar('University updated successfully', { variant: 'success' });
          navigate(PATH_APP.profile.user.publicDetails.root);
          await sleep(1500);
          dispatch(emptyUniversity());
        }
      } else {
        const response: any = await createPersonUniversity({
          filter: {
            dto: {
              audience: userUniversity?.audience,
              graduated: userUniversity?.graduated,
              startDate: startDate,
              endDate: endDate,
              collegeId: userUniversity?.collegeDto?.id,
              concentrationId: userUniversity?.concentrationDto?.id,
              instituteType: InstituteTypeEnum.University,
            },
          },
        });
        if (response?.data?.addPersonCollege?.isSuccess) {
          enqueueSnackbar('University created successfully', { variant: 'success' });
          navigate(PATH_APP.profile.user.publicDetails.root);
          await sleep(1500);
          dispatch(emptyUniversity());
        }
      }
    }
  };

  const handleDiscard = async () => {
    navigate(PATH_APP.profile.user.publicDetails.root);
    await sleep(1500);
    dispatch(emptyUniversity());
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => navigate(-1)}>
      <Stack spacing={2} sx={{ minWidth: 600, minHeight: 194, py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => navigate(-1)}>
              <Icon name="left-arrow-1" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              {userUniversity?.isValid
                ? formatMessage(NormalPublicDetailsMessages.saveChangeMessage)
                : formatMessage(NormalPublicDetailsMessages.continueMessage)}
            </Typography>
          </Box>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <LoadingButton
            loading={createIsLoading || updateIsLoading}
            startIcon={<Icon name="Save" color="text.primary" />}
            variant="text"
            color="inherit"
            onClick={handleSaveCollegeChangeOrContinue}
            sx={{ maxWidth: 180, justifyContent: 'flex-start' }}
          >
            <Typography variant="body2" color="text.primary">
              {userUniversity?.isValid
                ? formatMessage(NormalPublicDetailsMessages.saveChange)
                : formatMessage(NormalPublicDetailsMessages.continue)}
            </Typography>
          </LoadingButton>
          <Button
            variant="text"
            color="error"
            startIcon={<Icon name="Close-1" color="error.main" />}
            onClick={handleDiscard}
            sx={{ maxWidth: 99 }}
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
