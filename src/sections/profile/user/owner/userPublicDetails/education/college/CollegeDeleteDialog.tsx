import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useDeletePersonCollegeMutation } from 'src/_graphql/profile/publicDetails/mutations/deletePersonCollege.generated';
import { Icon } from 'src/components/Icon';
import GeneralMessagess from 'src/language/general.messages';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { emptyCollege, userCollegesSelector } from 'src/store/slices/profile/userColloges-slice';
import { InstituteTypeEnum } from 'src/types/serverTypes';
import sleep from 'src/utils/sleep';

import NormalPublicDetailsMessages from '../../NormalPublicDetails.messages';

export default function CollegeDeleteDialog() {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const userColleges = useSelector(userCollegesSelector);
  const [deleteCurrentCollege, { isLoading }] = useDeletePersonCollegeMutation();

  const handleDeleteButton = async (currentCollegeId: string) => {
    const resp: any = await deleteCurrentCollege({
      filter: {
        dto: {
          id: currentCollegeId,
          instituteType: InstituteTypeEnum.College,
        },
      },
    });
    if (resp?.data?.deletePersonCollege?.isSuccess) {
      enqueueSnackbar(formatMessage(NormalPublicDetailsMessages.collegeDeletedAlertMessage), { variant: 'success' });
      navigate(PATH_APP.profile.user.publicDetails.root);
      await sleep(1500);
      dispatch(emptyCollege());
    } else {
      enqueueSnackbar(formatMessage(NormalPublicDetailsMessages.unSuccessfullDelete), { variant: 'error' });
    }
  };

  const handleDiscard = async () => {
    navigate(PATH_APP.profile.user.publicDetails.root);
    await sleep(1500);
    dispatch(emptyCollege());
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
              <FormattedMessage {...NormalPublicDetailsMessages.collegeDeleteMessage} />
            </Typography>
          </Box>
          <IconButton onClick={handleDiscard}>
            <Icon name="Close-1" color="text.primary" />
          </IconButton>
        </Stack>
        <Divider />
        <Stack spacing={1} sx={{ px: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
            <Icon name="trash" color="error.main" />
            <LoadingButton
              variant="text"
              loading={isLoading}
              sx={{ p: 0 }}
              onClick={() => handleDeleteButton(userColleges?.id as string)}
            >
              <Typography variant="body2" color="error">
                <FormattedMessage {...NormalPublicDetailsMessages.collegeDeleteButton} />
              </Typography>
            </LoadingButton>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }}>
            <Icon name="Close-1" />
            <Typography variant="body2" color="text.primary" onClick={handleDiscard}>
              <FormattedMessage {...GeneralMessagess.discardWord} />
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Dialog>
  );
}
