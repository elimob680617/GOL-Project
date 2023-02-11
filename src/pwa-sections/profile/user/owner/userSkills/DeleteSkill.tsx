import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Button, Divider, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useDeletePersonSkillMutation } from 'src/_graphql/profile/skills/mutations/deletePersonSkill.generated';
import { Icon } from 'src/components/Icon';
import GeneralMessagess from 'src/language/general.messages';
import { useDispatch, useSelector } from 'src/store';
import { skillUpdated, userSkillSelector } from 'src/store/slices/profile/userSkill-slice';

import SkillMessages from './SkillPwa.messages';

interface DeleteSkillProps {
  onChange: () => void;
}

export default function DeleteSkill(props: DeleteSkillProps) {
  const { onChange } = props;
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const personskill = useSelector(userSkillSelector);
  const { formatMessage } = useIntl();

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
      onChange();
      navigate('/profile/user/skill/skill-list');
    } else {
      enqueueSnackbar(formatMessage(SkillMessages.notSuccessfull), { variant: 'error' });
    }
  };

  // click on Diskard and go to list
  const handleDiscardSkill = () => {
    dispatch(skillUpdated({}));
    onChange();
  };

  return (
    <>
      <Stack spacing={2} sx={{ py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1" color="text.primary">
            <FormattedMessage {...SkillMessages.deleteQuestion} />
          </Typography>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }} alignItems="start">
          <LoadingButton
            loading={isLoading}
            startIcon={<Icon name="trash" color="error.main" />}
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
            startIcon={<Icon name="Close-1" color="grey.500" />}
            onClick={handleDiscardSkill}
          >
            <Typography variant="body2" color="text.primary">
              <FormattedMessage {...GeneralMessagess.discardWord} />
            </Typography>
          </Button>
        </Stack>
      </Stack>
    </>
  );
}
