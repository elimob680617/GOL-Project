import { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Divider, IconButton, Skeleton, Stack, Typography, styled } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';

import { useEndorsementSkillMutation } from 'src/_graphql/profile/skills/mutations/endorsementSkill.generated';
import { useLazyGetPersonSkillsQuery } from 'src/_graphql/profile/skills/queries/getPersonSkills.generated';
import { Icon } from 'src/components/Icon';
import useAuth from 'src/hooks/useAuth';

import NormalAndNgoProfileViewMessages from '../../UserProfileView.messages';

const SkillListBoxStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
}));

export default function SkillListView() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams();
  const { formatMessage } = useIntl();
  const [getSkills, { data, isFetching }] = useLazyGetPersonSkillsQuery();
  const [updateEmdorsmentSkill, { isLoading }] = useEndorsementSkillMutation();

  useEffect(() => {
    getSkills({
      filter: {
        dto: { id: userId },
      },
    });
  }, [userId, getSkills]);

  const personSkillData = data?.getPersonSkills?.listDto?.items;
  const handleEndorse = async (id: string) => {
    const endorseRes: any = await updateEmdorsmentSkill({
      filter: {
        dto: {
          id,
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
        <IconButton sx={{ padding: 0 }} onClick={() => navigate(-1)}>
          <Icon name="left-arrow" color="grey.500" />
        </IconButton>
        <Typography variant="body1">
          <FormattedMessage {...NormalAndNgoProfileViewMessages.skillsAndEndorsements} />
        </Typography>
      </Stack>
      {isFetching ? (
        <Stack mt={1} sx={{ pb: 3 }} alignItems="center" justifyContent="flex-start" spacing={2}>
          {[...Array(3)].map((item, i) => (
            <Stack spacing={1} key={i + 1} minWidth={784}>
              <Skeleton variant="text" width={283} height={40} />
              <Skeleton variant="rectangular" width={328} height={52} />
            </Stack>
          ))}
        </Stack>
      ) : (
        <Stack mt={1} sx={{ pb: 3 }}>
          {personSkillData?.map((personSkill, index: number) => (
            <Box key={personSkill?.id}>
              <Stack sx={{ px: 2, py: 2 }} direction="row" justifyContent="space-between">
                <Stack>
                  <Stack spacing={1} direction="row">
                    <Typography variant="body2">{personSkill?.skill?.title}</Typography>
                    {!!personSkill?.endorsementsCount && (
                      <Typography color="primary.main">{personSkill?.endorsementsCount}</Typography>
                    )}
                  </Stack>
                  <Stack spacing={1} direction="row" alignItems="center">
                    <LoadingButton
                      variant="outlined"
                      sx={{
                        color: 'grey.900',
                        borderColor: 'grey.300',
                        py: 0.5,
                        px: 2.8,
                        mt: 1,
                      }}
                      onClick={() => handleEndorse(personSkill?.id as string)}
                      loading={isLoading}
                      startIcon={
                        !!personSkill?.people ||
                        personSkill?.people?.find((person) => person?.id === auth?.user?.id) ? (
                          <Icon name="Approve-Tick-1" />
                        ) : (
                          <Icon name="Plus" />
                        )
                      }
                    >
                      <Typography ml={1}>
                        {personSkill?.people?.find((person) => person?.id === auth?.user?.id)
                          ? formatMessage(NormalAndNgoProfileViewMessages.endorsed)
                          : formatMessage(NormalAndNgoProfileViewMessages.endorse)}
                      </Typography>
                    </LoadingButton>
                    <Box ml={1} onClick={() => navigate(`endorsments/${personSkill?.id}`)}>
                      {personSkill?.people && personSkill?.people?.length > 5 && <Icon name="Plus" />}
                      <AvatarGroup spacing="small" max={5} sx={{ flexDirection: 'row', pl: 2 }}>
                        {personSkill?.people?.map((person, idx: number) => (
                          <Avatar
                            key={personSkill.id + idx}
                            src={person?.avatarUrl || undefined}
                            sx={{ width: 24, height: 24 }}
                            // alt="RemySharp"
                          />
                        ))}
                      </AvatarGroup>
                    </Box>
                  </Stack>
                </Stack>
              </Stack>
              {index < personSkillData?.length - 1 && <Divider />}
            </Box>
          ))}
        </Stack>
      )}
    </SkillListBoxStyle>
  );
}
