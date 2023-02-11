import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';

import { Avatar, Box, Divider, IconButton, Skeleton, Stack, Typography, styled } from '@mui/material';

import { useLazyGetEndorsementsQuery } from 'src/_graphql/profile/skills/queries/getEndorsements.generated';
import { Icon } from 'src/components/Icon';

import NormalAndNgoProfileViewMessages from '../../UserProfileView.messages';

const EndorsListBoxStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
}));

export default function EndorsmentsView() {
  const navigate = useNavigate();
  const { skillId } = useParams();

  const [getEndorsments, { data, isFetching }] = useLazyGetEndorsementsQuery();
  useEffect(() => {
    getEndorsments({
      filter: { dto: { personSkillId: skillId } },
    });
  }, [getEndorsments, skillId]);
  const EndorsmentsPeople = data?.getEndorsements?.listDto?.items;

  return (
    <EndorsListBoxStyle>
      <Stack direction="row" justifyContent="flex-start" mb={3} spacing={2}>
        <IconButton sx={{ padding: 0 }} onClick={() => navigate(-1)}>
          <Icon name="left-arrow" color="grey.500" />
        </IconButton>
        <Typography variant="body1">
          <FormattedMessage {...NormalAndNgoProfileViewMessages.endorsedBy} />
        </Typography>
      </Stack>
      {isFetching ? (
        <Stack mt={1} sx={{ pb: 3 }} alignItems="center" justifyContent="flex-start" spacing={3}>
          {[...Array(5)].map((item, i) => (
            <Stack direction="row" spacing={2} key={i + 1} minWidth={784}>
              <Skeleton variant="circular" width={48} height={48} />
              <Stack spacing={0.5} justifyContent="center">
                <Typography variant="subtitle1">
                  <Skeleton variant="text" width={283} />
                </Typography>
                <Typography variant="body1">
                  <Skeleton variant="text" width={328} />
                </Typography>
              </Stack>
            </Stack>
          ))}
        </Stack>
      ) : (
        <Stack mt={1} sx={{ pb: 3 }}>
          {EndorsmentsPeople?.map((endorsBy, index: number) => (
            <Box key={endorsBy?.id}>
              <Stack sx={{ px: 2, py: 2 }} direction="row" justifyContent="space-between">
                <Stack spacing={1} direction="row" alignItems="center">
                  {/* onClick={() => handleRouting(endorsBy?.id)} */}
                  <Avatar alt="Remy Sharp" src={endorsBy?.avatarUrl || undefined} sx={{ width: 48, height: 48 }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {(endorsBy?.firstName || endorsBy?.lastName) && (
                      <Typography variant="body2">
                        {endorsBy?.firstName} {endorsBy?.lastName}
                      </Typography>
                    )}
                    {endorsBy?.headline && <Typography variant="body2">{endorsBy?.headline}</Typography>}
                  </Box>
                </Stack>
              </Stack>
              {index < EndorsmentsPeople?.length - 1 && <Divider />}
            </Box>
          ))}
        </Stack>
      )}
    </EndorsListBoxStyle>
  );
}
