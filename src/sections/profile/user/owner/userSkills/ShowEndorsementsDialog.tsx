import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Dialog, IconButton, Stack, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';

import { useSnackbar } from 'notistack';
import { useEndorsementSkillMutation } from 'src/_graphql/profile/skills/mutations/endorsementSkill.generated';
import { Icon } from 'src/components/Icon';
import useAuth from 'src/hooks/useAuth';
import GeneralMessagess from 'src/language/general.messages';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { skillUpdated, userSkillSelector } from 'src/store/slices/profile/userSkill-slice';

import SkillMessages from './Skill.messages';

export default function ShowEndorsementsDialog() {
  const { user } = useAuth();
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const router = useNavigate();
  const dispatch = useDispatch();
  const personSkill = useSelector(userSkillSelector);
  const [endorsementSkill, { isLoading }] = useEndorsementSkillMutation();

  // functions !
  const handleAddEndorsement = async (id: any) => {
    const resData: any = await endorsementSkill({
      filter: {
        dto: {
          id: id,
        },
      },
    });
    if (resData?.data?.endorsementSkill?.isSuccess) {
      enqueueSnackbar(formatMessage(SkillMessages.addEndorsmentSuccessfull), { variant: 'success' });
      dispatch(skillUpdated({}));
      router(PATH_APP.profile.user.skill.root);
    }
  };

  return (
    <Dialog fullWidth maxWidth="sm" open onClose={() => router(-1)}>
      <Stack sx={{ mb: 2, px: 2, pt: 3 }} direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={1}>
          <Typography color="text.primary" variant="subtitle1">
            {personSkill?.skill?.title}
          </Typography>
          <Typography color="text.primary" variant="subtitle1">
            ({personSkill?.endorsementsCount})
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          {/* FIXME add primary variant to button variants */}
          {!user?.id === personSkill?.personId && (
            <LoadingButton loading={isLoading} variant="contained">
              <Typography variant="button" onClick={() => handleAddEndorsement(personSkill?.id)}>
                <FormattedMessage {...GeneralMessagess.add} />
              </Typography>
            </LoadingButton>
          )}
          <IconButton sx={{ padding: 0 }} onClick={() => router(-1)}>
            <Icon name="Close" color="text.primary" />
          </IconButton>
        </Stack>
      </Stack>
      <Stack spacing={2} sx={{ pb: 3 }}>
        {personSkill?.people?.map((item) => (
          <Stack direction="row" alignItems="center" spacing={2} sx={{ px: 2 }} key={item?.id}>
            <Avatar sx={{ width: '48px', height: '48px' }} alt="avatar" src={item?.avatarUrl || undefined} />
            <Stack>
              <Typography variant="subtitle1">{`${item?.firstName} ${item?.lastName}`}</Typography>
              <Typography color="text.secondary" variant="body2">
                {item?.headline}
              </Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Dialog>
  );
}
