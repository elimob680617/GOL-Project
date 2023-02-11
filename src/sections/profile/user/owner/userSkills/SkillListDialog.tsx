import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';

import { Box, Button, CircularProgress, Dialog, Divider, IconButton, Stack, Typography, styled } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';

import { useLazyGetPersonSkillsQuery } from 'src/_graphql/profile/skills/queries/getPersonSkills.generated';
import { Icon } from 'src/components/Icon';
import GeneralMessagess from 'src/language/general.messages';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch } from 'src/store';
import { skillUpdated } from 'src/store/slices/profile/userSkill-slice';

import SkillMessages from './Skill.messages';

const NoResultStyle = styled(Stack)(({ theme }) => ({
  maxWidth: 164,
  maxHeight: 164,
  width: 164,
  height: 164,
  background: theme.palette.grey[100],
  borderRadius: '100%',
}));

export default function SkillListDialog() {
  const router = useNavigate();
  const dispatch = useDispatch();

  // query
  const [getSkills, { data, isFetching }] = useLazyGetPersonSkillsQuery();

  useEffect(() => {
    getSkills({
      filter: {
        dto: {},
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const personSkillData = data?.getPersonSkills?.listDto?.items;

  // navigate and send data to Redux
  const handleNavigation = (url: string, personSkill: any) => {
    dispatch(skillUpdated(personSkill));
    router(url);
  };

  return (
    <Dialog fullWidth maxWidth="sm" open onClose={() => router(PATH_APP.profile.user.root)}>
      <Stack sx={{ mb: 2, px: 2, pt: 3 }} direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle1">
          <FormattedMessage {...SkillMessages.skillAndEndorsements} />
        </Typography>
        <Stack direction="row" spacing={2}>
          {/* FIXME add primary variant to button variants */}
          {!!personSkillData?.length && (
            <Button variant="contained" onClick={() => router(PATH_APP.profile.user.skill.searchSkill)}>
              <Typography variant="button">
                <FormattedMessage {...GeneralMessagess.add} />
              </Typography>
            </Button>
          )}
          <IconButton sx={{ padding: 0 }} onClick={() => router(PATH_APP.profile.user.root)}>
            <Icon name="Close" color="text.primary" />
          </IconButton>
        </Stack>
      </Stack>
      <Divider />
      {isFetching ? (
        <CircularProgress sx={{ m: 8 }} />
      ) : !personSkillData?.length ? (
        <Stack sx={{ py: 6, minHeight: '390px' }} alignItems="center" justifyContent="center">
          <NoResultStyle alignItems="center" justifyContent="center">
            <Typography variant="subtitle1" sx={{ color: (theme) => 'text.secondary', textAlign: 'center' }}>
              <FormattedMessage {...SkillMessages.noResult} />
            </Typography>
          </NoResultStyle>
          <Box sx={{ mt: 3 }} />
          <Link to={PATH_APP.profile.user.skill.searchSkill} style={{ textDecoration: 'none' }}>
            <Button variant="text" startIcon={<Icon name="Plus" color="info.main" />}>
              <Typography color="info.main">
                <FormattedMessage {...SkillMessages.addSkillAndEndorsment} />
              </Typography>
            </Button>
          </Link>
        </Stack>
      ) : (
        <Stack mt={1} sx={{ pb: 3 }}>
          {personSkillData?.map((item) => (
            <Box key={item?.id}>
              <Stack sx={{ px: 2, py: 2 }} direction="row" justifyContent="space-between">
                <Stack>
                  <Stack spacing={1} direction="row">
                    <Typography
                      variant="body2"
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleNavigation(PATH_APP.profile.user.skill.endorsments, item)}
                    >
                      {item?.skill?.title}
                    </Typography>
                    {!!item?.endorsementsCount && <Typography color="green">{item?.endorsementsCount}</Typography>}
                  </Stack>
                  <AvatarGroup spacing="small" max={5} sx={{ flexDirection: 'row', pl: 2 }}>
                    {item?.people?.map((person, index) => (
                      <Avatar alt="Remy Sharp" src={person?.avatarUrl || undefined} key={item.id + index} />
                    ))}
                  </AvatarGroup>
                </Stack>
                <Box
                  onClick={() => handleNavigation(PATH_APP.profile.user.skill.delete, item)}
                  sx={{ cursor: 'pointer' }}
                >
                  <Icon name="trash" />
                </Box>
              </Stack>
              <Divider />
            </Box>
          ))}
        </Stack>
      )}
    </Dialog>
  );
}
