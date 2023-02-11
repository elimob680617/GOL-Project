import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useAddPersonSchoolMutation } from 'src/_graphql/profile/publicDetails/mutations/createPersonSchool.generated';
import { useUpdatePersonSchoolMutation } from 'src/_graphql/profile/publicDetails/mutations/updatePersonSchool.generated';
import { Icon } from 'src/components/Icon';
import GeneralMessagess from 'src/language/general.messages';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { schoolWasEmpty, userSchoolsSelector } from 'src/store/slices/profile/userSchool-slice';
import sleep from 'src/utils/sleep';

import NormalPublicDetailsMessages from '../../NormalPublicDetails.messages';

export default function SchoolDiscardDialog() {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const userHighSchool = useSelector(userSchoolsSelector);
  const isEdit = !!userHighSchool?.id;
  const [createPersonSchool, { isLoading: createIsLoading }] = useAddPersonSchoolMutation();
  const [updateCurrentSchool, { isLoading: updateIsLoading }] = useUpdatePersonSchoolMutation();

  const handleSaveSchoolChangeOrContinue = async () => {
    if (!userHighSchool?.isValid) {
      navigate(-1);
    } else {
      if (isEdit) {
        const response: any = await updateCurrentSchool({
          filter: {
            dto: {
              id: userHighSchool.id,
              year: userHighSchool?.year ? +userHighSchool.year : undefined,
              schoolId: userHighSchool.school?.id,
              audience: userHighSchool?.audience,
            },
          },
        });
        if (response?.data?.updatePersonSchool?.isSuccess) {
          enqueueSnackbar(formatMessage(NormalPublicDetailsMessages.schoolEditedAlertMessage), { variant: 'success' });
          navigate(PATH_APP.profile.user.publicDetails.root);
          await sleep(1500);
          dispatch(schoolWasEmpty());
        } else {
          enqueueSnackbar(formatMessage(NormalPublicDetailsMessages.schoolNotEditedAlertMessage), { variant: 'error' });
        }
      } else {
        const response: any = await createPersonSchool({
          filter: {
            dto: {
              // id: null,
              year: userHighSchool?.year ? +userHighSchool.year : undefined,
              schoolId: userHighSchool.school?.id,
              audience: userHighSchool?.audience,
            },
          },
        });
        if (response?.data?.addPersonSchool?.isSuccess) {
          enqueueSnackbar(formatMessage(NormalPublicDetailsMessages.schoolAddedAlertMessage), { variant: 'success' });
          navigate(PATH_APP.profile.user.publicDetails.root);
          await sleep(1500);
          dispatch(schoolWasEmpty());
        } else {
          enqueueSnackbar(formatMessage(NormalPublicDetailsMessages.schoolNotAddedAlertMessage), { variant: 'error' });
        }
      }
    }
  };

  const handleDiscard = async () => {
    navigate(PATH_APP.profile.user.publicDetails.root);
    await sleep(1500);
    dispatch(schoolWasEmpty());
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
              {userHighSchool?.isValid
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
            onClick={handleSaveSchoolChangeOrContinue}
            sx={{ maxWidth: 180, justifyContent: 'flex-start' }}
          >
            <Typography variant="body2" color="text.primary">
              {userHighSchool?.isValid
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
