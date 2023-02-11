import React, { useEffect, useLayoutEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
  styled,
} from '@mui/material';

import { useLazyGetPeopleSearchQuery } from 'src/_graphql/search/queries/getPeopleSearch.generated';
import { Icon } from 'src/components/Icon';
import Loading from 'src/components/Loading';
import useAuth from 'src/hooks/useAuth';
import { PATH_APP } from 'src/routes/paths';
import ProfileButtonChecker from 'src/sections/profile/components/ProfileButtonChecker';
import { FollowedItemTypeEnum, UserTypeEnum } from 'src/types/serverTypes';

import AfterRegistrationMessages from '../afterRegistration.messages';
import DialogIconButtons from './DialogIconButtons';
import TitleAndProgress from './TitleAndProgress';

const ConnectionBoxStyle = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'wrap',
  width: '100%',
  gap: theme.spacing(1.5),
  '&::-webkit-scrollbar': {
    width: 12,
  },

  '&::-webkit-scrollbar-track': {
    background: theme.palette.grey[0],
    borderRadius: 8,
  },

  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.grey[300],
    borderRadius: 10,
    border: `4px solid ${theme.palette.grey[0]}`,
  },
}));
const ProfileBoxStyle = styled(Box)(({ theme }) => ({
  border: '1px solid',
  borderColor: theme.palette.grey[100],
  paddingInline: theme.spacing(3),
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  borderRadius: theme.spacing(2),
  width: 168,
  height: 177,
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
}));
const BottonsStyle = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  // paddingInline: theme.spacing(2),
  width: '100%',
}));

export default function SelectConnection() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [step, setStep] = React.useState<number>();
  const [showDialog, setShowDialog] = React.useState<boolean>(true);
  const [showViewMore, setShowViewMoreButton] = React.useState<boolean>(false);
  const [getPeople, { data, isFetching }] = useLazyGetPeopleSearchQuery();

  useLayoutEffect(() => {
    if (pathname === 'suggest-people' && user?.completeQar) {
      setShowDialog(false);
      navigate(PATH_APP.home.index);
    }
  }, [navigate, pathname, user?.completeQar]);

  useEffect(() => {
    getPeople({ filter: { pageIndex: 0, pageSize: 20, dto: { searchText: '' } } });
    if (user?.userType === UserTypeEnum.Normal) {
      setStep(5);
    } else if (user?.userType === UserTypeEnum.Ngo) {
      setStep(4);
    }
  }, [user?.userType, getPeople]);

  const suggestions = data?.peopleSearchQueryHandler?.listDto?.items;

  useEffect(() => {
    if (data?.peopleSearchQueryHandler?.listDto?.count > 6) {
      setShowViewMoreButton(true);
    }
  }, [data?.peopleSearchQueryHandler?.listDto?.count]);

  const handleRouting = () => {
    navigate(PATH_APP.home.afterRegister.done);
  };

  return (
    <Dialog fullWidth={true} open={showDialog}>
      <DialogTitle>
        <DialogIconButtons router={navigate} user={user} hasBackIcon />
        <Stack alignItems="center" mt={-5}>
          <TitleAndProgress step={step as number} userType={user?.userType as UserTypeEnum} />
        </Stack>
        <Stack alignItems="center" mb={3}>
          <Typography variant="h6" color="text.primary">
            <FormattedMessage {...AfterRegistrationMessages.connectionSuggestQuestion} />
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack alignItems="center">
          {isFetching ? (
            <Box m={1}>
              <Loading />
            </Box>
          ) : (
            <ConnectionBoxStyle>
              {showViewMore
                ? suggestions?.slice(0, 6).map((_user) => (
                    <ProfileBoxStyle key={_user?.id}>
                      <Stack spacing={2} alignItems="center">
                        <Avatar
                          src={_user?.avatarUrl || ''}
                          variant={'circular' || 'rounded'}
                          sx={{ width: 48, height: 48 }}
                        />
                        <Stack alignItems="center">
                          <Stack sx={{ height: 18, overflow: 'hidden' }}>
                            <Typography textAlign={'center'} variant="subtitle2" color="text.primary">
                              {_user?.fullName}
                            </Typography>
                          </Stack>
                          <Stack
                            sx={{
                              height: 15,
                              lineHeight: 1,
                              display: '-webkit-box',
                              overflow: 'hidden',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: 1,
                            }}
                          >
                            <Typography textAlign={'center'} variant="caption" color="text.secondary">
                              {_user?.headline}
                            </Typography>
                          </Stack>
                        </Stack>
                        <Box>
                          <ProfileButtonChecker
                            fullName={_user?.fullName as string}
                            meToOther={_user?.meToOtherStatus || undefined}
                            otherToMe={_user?.otherToMeStatus || undefined}
                            itemId={_user?.id}
                            itemType={FollowedItemTypeEnum.Normal}
                          />
                        </Box>
                      </Stack>
                    </ProfileBoxStyle>
                  ))
                : suggestions?.map((_user) => (
                    <ProfileBoxStyle key={_user?.id}>
                      <Stack spacing={2} alignItems="center">
                        <Avatar
                          src={_user?.avatarUrl || ''}
                          variant={'circular' || 'rounded'}
                          sx={{ width: 48, height: 48 }}
                        />
                        <Stack alignItems="center">
                          <Stack sx={{ height: 18, overflow: 'hidden' }}>
                            <Typography textAlign={'center'} variant="subtitle2" color="text.primary">
                              {_user?.fullName}
                            </Typography>
                          </Stack>
                          <Stack
                            sx={{
                              height: 15,
                              lineHeight: 1,
                              display: '-webkit-box',
                              overflow: 'hidden',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: 1,
                            }}
                          >
                            <Typography textAlign={'center'} variant="caption" color="text.secondary">
                              {_user?.headline}
                            </Typography>
                          </Stack>
                        </Stack>
                        <Box>
                          <ProfileButtonChecker
                            fullName={_user?.fullName as string}
                            meToOther={_user?.meToOtherStatus || undefined}
                            otherToMe={_user?.otherToMeStatus || undefined}
                            itemId={_user?.id}
                            itemType={FollowedItemTypeEnum.Normal}
                          />
                        </Box>
                      </Stack>
                    </ProfileBoxStyle>
                  ))}
            </ConnectionBoxStyle>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <BottonsStyle>
          {showViewMore && !isFetching && (
            <Button
              variant="text"
              color="primary"
              onClick={() => {
                setShowViewMoreButton(false);
              }}
              sx={{ height: 24 }}
            >
              <Icon name="down-arrow" color="primary.main" />
              <Typography>
                <FormattedMessage {...AfterRegistrationMessages.viewMoreButton} />
              </Typography>
            </Button>
          )}
          <Stack direction="row" spacing={2} pl={30} pr={2}>
            <Button variant="outlined" sx={{ borderColor: 'grey.300' }} onClick={handleRouting}>
              <Typography color="grey.900">
                <FormattedMessage {...AfterRegistrationMessages.skipButton} />
              </Typography>
            </Button>
            <Button
              variant="contained"
              color="primary"
              endIcon={<Icon name="right-arrow-1" color="common.white" />}
              onClick={handleRouting}
            >
              <Typography>
                <FormattedMessage {...AfterRegistrationMessages.finishButton} />
              </Typography>
            </Button>
          </Stack>
        </BottonsStyle>
      </DialogActions>
    </Dialog>
  );
}
