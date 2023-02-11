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
import { emptyCollege, userCollegesSelector } from 'src/store/slices/profile/userColloges-slice';
import { InstituteTypeEnum } from 'src/types/serverTypes';
import sleep from 'src/utils/sleep';

import NormalPublicDetailsMessages from '../../NormalPublicDetails.messages';

export default function CollegeDiscardDialog() {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const userColleges = useSelector(userCollegesSelector);
  const isEdit = !!userColleges?.id;
  const [createPersonCollege, { isLoading: addIsLoading }] = useAddPersonCollegeMutation();
  const [updateCurrentCollege, { isLoading: updateIsLoading }] = useUpdatePersonCollegeMutation();

  const handleSaveCollegeChangeOrContinue = async () => {
    if (!userColleges?.isValid) {
      navigate(-1);
    } else {
      const startDate = new Date(userColleges?.startDate).toISOString();
      let endDate;
      if (userColleges?.endDate) {
        endDate = new Date(userColleges?.endDate).toISOString();
      }
      if (isEdit) {
        const response: any = await updateCurrentCollege({
          filter: {
            dto: {
              id: userColleges?.id,
              audience: userColleges?.audience,
              collegeId: userColleges?.collegeDto?.id,
              concentrationId: userColleges?.concentrationDto?.id,
              graduated: userColleges?.graduated,
              instituteType: InstituteTypeEnum.College,
              startDate: startDate,
              endDate: endDate,
            },
          },
        });
        if (response?.data?.updatePersonCollege?.isSuccess) {
          enqueueSnackbar('College edited successfully', { variant: 'success' });
          navigate(PATH_APP.profile.user.publicDetails.root);
          await sleep(1500);
          dispatch(emptyCollege());
        }
      } else {
        const response: any = await createPersonCollege({
          filter: {
            dto: {
              audience: userColleges?.audience,
              graduated: userColleges?.graduated,
              startDate: startDate,
              endDate: endDate,
              collegeId: userColleges?.collegeDto?.id,
              concentrationId: userColleges?.concentrationDto?.id,
              instituteType: InstituteTypeEnum.College,
            },
          },
        });
        if (response?.data?.addPersonCollege?.isSuccess) {
          enqueueSnackbar('College created successfully', { variant: 'success' });
          navigate(PATH_APP.profile.user.publicDetails.root);
          await sleep(1500);
          dispatch(emptyCollege());
        }
      }
    }
  };

  const handleDiscard = async () => {
    navigate(PATH_APP.profile.user.publicDetails.root);
    await sleep(1500);
    dispatch(emptyCollege());
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted>
      <Stack spacing={2} sx={{ minWidth: 600, minHeight: 194, py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => navigate(-1)}>
              <Icon name="left-arrow-1" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              {userColleges?.isValid
                ? formatMessage(NormalPublicDetailsMessages.saveChangeMessage)
                : formatMessage(NormalPublicDetailsMessages.continueMessage)}
            </Typography>
          </Box>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <LoadingButton
            loading={addIsLoading || updateIsLoading}
            startIcon={<Icon name="Save" color="text.primary" />}
            variant="text"
            color="inherit"
            onClick={handleSaveCollegeChangeOrContinue}
            sx={{ maxWidth: 180, justifyContent: 'flex-start' }}
          >
            <Typography variant="body2" color="text.primary">
              {userColleges?.isValid
                ? formatMessage(NormalPublicDetailsMessages.saveChange)
                : formatMessage(NormalPublicDetailsMessages.continue)}
            </Typography>
          </LoadingButton>
          <Button
            variant="text"
            color="error"
            startIcon={<Icon name="Close-1" color="error.main" />}
            onClick={handleDiscard}
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
