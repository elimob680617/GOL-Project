import { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, Button, CircularProgress, Divider, IconButton, Stack, Typography, styled } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';

import { useEndorsementSkillMutation } from 'src/_graphql/profile/skills/mutations/endorsementSkill.generated';
import { useLazyGetPersonSkillsQuery } from 'src/_graphql/profile/skills/queries/getPersonSkills.generated';
import { Icon } from 'src/components/Icon';
import useAuth from 'src/hooks/useAuth';

import ProfileViewPwaMessages from '../../UserProfileViewPwa.messages';

const SkillListBoxStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
}));

export default function SkillListView() {
  const router = useNavigate();
  const { user } = useAuth();
  const { formatMessage } = useIntl();
  const { userId } = useParams();

  const [getSkills, { data: skillData, isFetching }] = useLazyGetPersonSkillsQuery();
  const [updateEmdorsmentSkill] = useEndorsementSkillMutation();

  useEffect(() => {
    getSkills({
      filter: {
        dto: { id: userId },
      },
    });
  }, [userId, getSkills]);

  const personSkillData = skillData?.getPersonSkills?.listDto?.items;
  const handleEndorse = async (id: string) => {
    const endorseRes: any = await updateEmdorsmentSkill({
      filter: {
        dto: {
          id: id,
        },
      },
    });
    if (endorseRes?.data?.endorsementSkill?.isSuccess) {
      getSkills({
        filter: {
          dto: { id: userId },
        },
      });
    }
  };

  return (
    <SkillListBoxStyle>
      <Stack direction="row" justifyContent="flex-start" mb={3} spacing={2}>
        <IconButton sx={{ padding: 0 }} onClick={() => router(-1)}>
          <Icon name="left-arrow" color="grey.500" />
        </IconButton>
        <Typography variant="body1">
          <FormattedMessage {...ProfileViewPwaMessages.skillsAndEndorsements} />
        </Typography>
      </Stack>
      {isFetching ? (
        <Stack sx={{ py: 6 }} alignItems="center" justifyContent="center">
          <CircularProgress sx={{ m: 8 }} />
        </Stack>
      ) : (
        <Stack mt={1} sx={{ pb: 3 }}>
          {personSkillData?.map((skill) => (
            <Box key={skill?.id}>
              <Stack sx={{ px: 2, py: 2 }} direction="row" justifyContent="space-between">
                <Stack>
                  <Stack spacing={1} direction="row">
                    <Typography variant="body2" sx={{ cursor: 'pointer' }}>
                      {skill?.skill?.title}
                    </Typography>
                    {!!skill?.endorsementsCount && (
                      <Typography color="primary.main">{skill?.endorsementsCount}</Typography>
                    )}
                  </Stack>
                  <Stack spacing={1} direction="row" alignItems="center">
                    <Button
                      variant="outlined"
                      sx={{
                        color: 'grey.900',
                        borderColor: 'grey.300',
                        py: 0.5,
                        px: 2.8,
                        mt: 1,
                      }}
                      onClick={() => handleEndorse(skill?.id as string)}
                    >
                      {/* IF IT WAS ENDORSED BEFORE SET TICK ICON INSTEAD OF ADD */}

                      {!!skill?.people || skill?.people?.find((person) => person?.id === user?.id) ? (
                        <Icon name="Approve-Tick-1" />
                      ) : (
                        <Icon name="Plus" />
                      )}

                      <Typography ml={1}>
                        {skill?.people?.find((person) => person?.id === user?.id)
                          ? formatMessage(ProfileViewPwaMessages.endorsed)
                          : formatMessage(ProfileViewPwaMessages.endorse)}
                      </Typography>
                    </Button>
                    <AvatarGroup spacing="small" max={5} sx={{ flexDirection: 'row', pl: 2, ml: 1 }}>
                      {skill?.people?.map((person, index) => (
                        <Avatar
                          alt="Remy Sharp"
                          src={person?.avatarUrl || undefined}
                          key={skill.id + index}
                          sx={{ width: 24, height: 24 }}
                        />
                      ))}
                    </AvatarGroup>
                  </Stack>
                </Stack>
              </Stack>
              <Divider />
            </Box>
          ))}
        </Stack>
      )}
    </SkillListBoxStyle>
  );
}
