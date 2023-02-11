import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
// bottom sheet
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';

import { Box, Button, CircularProgress, Divider, IconButton, Stack, Typography, styled } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';

import { useLazyGetPersonSkillsQuery } from 'src/_graphql/profile/skills/queries/getPersonSkills.generated';
import { Icon } from 'src/components/Icon';
import GeneralMessagess from 'src/language/general.messages';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch } from 'src/store';
import { skillUpdated } from 'src/store/slices/profile/userSkill-slice';

import DeleteSkill from './DeleteSkill';
import SearchSkill from './SearchSkill';
import SkillMessages from './SkillPwa.messages';

const NoResultStyle = styled(Stack)(({ theme }) => ({
  maxWidth: 164,
  maxHeight: 164,
  width: 164,
  height: 164,
  background: theme.palette.grey[100],
  borderRadius: '100%',
}));

export default function SkillList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // bottom sheet
  const [searchSkillBottomSheet, setSearchSkillBottomSheet] = useState(false);
  const [deleteSkillBottomSheet, setDeleteSkillBottomSheet] = useState(false);
  // query
  const [getSkills, { data, isFetching }] = useLazyGetPersonSkillsQuery();

  useEffect(() => {
    if (!searchSkillBottomSheet && !deleteSkillBottomSheet)
      getSkills({
        filter: {
          dto: {},
        },
      });
  }, [searchSkillBottomSheet, deleteSkillBottomSheet, getSkills]);

  const personSkillData = data?.getPersonSkills?.listDto?.items;

  // navigate and send data to Redux
  const handleDeleteBottomSheet = (personSkill: any) => {
    dispatch(skillUpdated(personSkill));
    setDeleteSkillBottomSheet(true);
  };

  const handleNavigationEndorsement = (url: string, personSkill: any) => {
    dispatch(skillUpdated(personSkill));
    navigate(url);
  };
  return (
    <>
      <Stack sx={{ mb: 2, px: 2, pt: 3 }} direction="row" alignItems="center" justifyContent="space-between">
        <Stack spacing={2} direction="row" alignItems="center">
          <IconButton sx={{ p: 0 }} onClick={() => navigate(PATH_APP.profile.user.root)}>
            <Icon name="left-arrow-1" color="text.primary" />
          </IconButton>
          <Typography variant="subtitle1">
            <FormattedMessage {...SkillMessages.skillAndEndorsements} />
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          {/* FIXME add primary variant to button variants */}
          {!!personSkillData?.length && (
            <Button variant="contained" onClick={() => setSearchSkillBottomSheet(true)}>
              <Typography variant="button">
                <FormattedMessage {...GeneralMessagess.add} />
              </Typography>
            </Button>
          )}
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

          <Button
            onClick={() => setSearchSkillBottomSheet(true)}
            variant="text"
            startIcon={<Icon name="Plus" color="info.main" />}
          >
            <Typography color="info.main">
              <FormattedMessage {...SkillMessages.addSkillAndEndorsment} />
            </Typography>
          </Button>
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
                      onClick={() => handleNavigationEndorsement('endorsement-list', item)}
                    >
                      {item?.skill?.title}
                    </Typography>
                    {!!item?.endorsementsCount && <Typography color="green">{item?.endorsementsCount}</Typography>}
                  </Stack>
                  <AvatarGroup spacing="small" max={5} sx={{ flexDirection: 'row', pl: 2 }}>
                    {item?.people?.map((person, index) => (
                      <Avatar alt="Remy Sharp" src={person?.avatarUrl as string} key={item.id + index} />
                    ))}
                  </AvatarGroup>
                </Stack>
                <Box onClick={() => handleDeleteBottomSheet(item)}>
                  <Icon name="trash" color="text.primary" />
                </Box>
              </Stack>
              <Divider />
            </Box>
          ))}
        </Stack>
      )}
      <BottomSheet
        open={searchSkillBottomSheet}
        onDismiss={() => setSearchSkillBottomSheet(false)}
        snapPoints={({ maxHeight }) => maxHeight / 2.5}
      >
        <SearchSkill
          onChange={() => {
            setSearchSkillBottomSheet(false);
          }}
        />
      </BottomSheet>
      <BottomSheet open={deleteSkillBottomSheet} onDismiss={() => setDeleteSkillBottomSheet(false)}>
        <DeleteSkill
          onChange={() => {
            setDeleteSkillBottomSheet(false);
          }}
        />
      </BottomSheet>
    </>
  );
}
