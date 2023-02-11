import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useDeletePersonSkillMutation } from 'src/_graphql/profile/skills/mutations/deletePersonSkill.generated';
import { Icon } from 'src/components/Icon';
import GeneralMessagess from 'src/language/general.messages';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { skillUpdated, userSkillSelector } from 'src/store/slices/profile/userSkill-slice';

import SkillMessages from './Skill.messages';

export default function DeleteSkillDialog() {
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const personskill = useSelector(userSkillSelector);
  const router = useNavigate();
  const [deletePersonSkill, { isLoading }] = useDeletePersonSkillMutation();
  // mutations !
  const handleDeleteSkill = async () => {
    const resDeleteDate: any = await deletePersonSkill({
      filter: {
        dto: {
          id: personskill?.id,
        },
      },
    });
    if (resDeleteDate?.data?.deletePersonSkill?.isSuccess) {
      enqueueSnackbar(formatMessage(SkillMessages.deleteSkillSuccessfull), { variant: 'success' });
      dispatch(skillUpdated({}));
      router(PATH_APP.profile.user.skill.root);
    } else {
      enqueueSnackbar(formatMessage(SkillMessages.notSuccessfull), { variant: 'error' });
    }
  };

  // click on Discard and go to list
  const handleDiscardSkill = () => {
    dispatch(skillUpdated({}));
    router(PATH_APP.profile.user.skill.root);
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => router(-1)}>
      <Stack spacing={2} sx={{ minWidth: 600, minHeight: 194, py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => router(-1)}>
              <Icon name="left-arrow" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              <FormattedMessage {...SkillMessages.deleteQuestion} />
            </Typography>
          </Box>
          <Link to={PATH_APP.profile.user.root}>
            <IconButton>
              <Icon name="Close" />
            </IconButton>
          </Link>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }} alignItems="start">
          <LoadingButton
            loading={isLoading}
            startIcon={<Icon name="trash" size={24} color="error.main" />}
            variant="text"
            color="inherit"
            onClick={handleDeleteSkill}
          >
            <Typography variant="body2" color="error">
              <FormattedMessage {...SkillMessages.deleteSkill} />
            </Typography>
          </LoadingButton>
          <Button
            variant="text"
            color="inherit"
            startIcon={<Icon name="Close-1" size={24} />}
            onClick={handleDiscardSkill}
          >
            <Typography variant="body2" color="text.primary">
              <FormattedMessage {...GeneralMessagess.discardWord} />
            </Typography>
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}
