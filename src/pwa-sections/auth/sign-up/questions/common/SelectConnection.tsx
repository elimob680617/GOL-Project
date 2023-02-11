import React, { useEffect, useLayoutEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

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
import useAuth from 'src/hooks/useAuth';
import LoadingCircular from 'src/sections/connections/listContent/LoadingCircular';
import ProfileButtonChecker from 'src/sections/profile/components/ProfileButtonChecker';
import { FilterByEnum, UserTypeEnum } from 'src/types/serverTypes';

import AfterRegistrationPwaMessages from '../afterRegistrationPwa.messages';
import DialogIconButtons from './DialogIconButtons';
import TitleAndProgress from './TitleAndProgress';

const ConnectionBoxStyle = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
}));
const ProfileBoxStyle = styled(Box)(({ theme }) => ({
  maxWidth: 141,
  height: 177,
  border: '1px solid',
  borderColor: theme.palette.grey[100],
  borderRadius: theme.spacing(2),
  display: 'flex',
  justifyContent: 'center',
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  paddingInline: theme.spacing(1.9),
}));
interface SelectConnectionProps {
  authType?: UserTypeEnum;
  openConnectionDialog?: boolean;
  setOpenConnectionDialog?: React.Dispatch<
    React.SetStateAction<{
      welcome: boolean;
      gender: boolean;
      location: boolean;
      categories: boolean;
      workFields: boolean;
      joinReasons: boolean;
      suggestConnection: boolean;
      endQ: boolean;
    }>
  >;
}

export default function SelectConnection(props: SelectConnectionProps) {
  const { authType, openConnectionDialog, setOpenConnectionDialog } = props;
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = React.useState<number>();

  const [getPeople, { data, isFetching }] = useLazyGetPeopleSearchQuery();

  useLayoutEffect(() => {
    if (localStorage.getItem('stepTitle') === 'suggestConnection') {
      setOpenConnectionDialog!((prev) => ({ ...prev, suggestConnection: true }));
    }
  }, [setOpenConnectionDialog]);

  useEffect(() => {
    getPeople({ filter: { pageIndex: 0, pageSize: 20, dto: { searchText: '' } } });
    if (authType === UserTypeEnum.Normal) {
      setStep(5);
    } else if (authType === UserTypeEnum.Ngo) {
      setStep(4);
    }
  }, [authType, getPeople]);

  const suggestions = data?.peopleSearchQueryHandler?.listDto?.items;

  const handleRouting = () => {
    setOpenConnectionDialog!((prev) => ({ ...prev, endQ: true, suggestConnection: false }));
    localStorage.setItem('stepTitle', 'endQ');
  };

  return (
    <>
      <Dialog fullWidth={true} open={openConnectionDialog as boolean}>
        <DialogTitle>
          <DialogIconButtons router={navigate} user={user} setOpenStatusDialog={setOpenConnectionDialog} hasBackIcon />
          <Stack alignItems="center" mb={4}>
            <TitleAndProgress step={step} userType={authType} />
          </Stack>
          <Stack alignItems="center" mb={2}>
            <Typography variant="h6" color="text.primary" textAlign="center">
              <FormattedMessage {...AfterRegistrationPwaMessages.connectionSuggestQuestion} />
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ p: 2, maxHeight: 180 }}>
          {isFetching ? (
            <Box m={1}>
              <LoadingCircular />
            </Box>
          ) : (
            <Box>
              <ConnectionBoxStyle>
                {suggestions?.map((_user) => (
                  <ProfileBoxStyle key={_user?.id}>
                    <Stack spacing={2} alignItems="center">
                      <Avatar
                        src={_user?.avatarUrl || ''}
                        variant={'circular' || 'rounded'}
                        sx={{ width: 48, height: 48 }}
                      />
                      <Stack alignItems="center">
                        <Stack
                          sx={{
                            height: 18,
                            overflow: 'hidden',
                            lineHeight: 1,
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 1,
                          }}
                        >
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
                          meToOther={_user?.meToOtherStatus as any}
                          otherToMe={_user?.otherToMeStatus as any}
                          itemId={_user?.id}
                          itemType={FilterByEnum.Normal}
                        />
                      </Box>
                    </Stack>
                  </ProfileBoxStyle>
                ))}
              </ConnectionBoxStyle>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Stack direction="row" justifyContent="flex-end" spacing={2} mx={-1}>
            <Button variant="outlined" sx={{ borderColor: 'grey.300' }} onClick={handleRouting}>
              <Typography color="grey.900">
                <FormattedMessage {...AfterRegistrationPwaMessages.skipButton} />
              </Typography>
            </Button>

            <Button
              variant="contained"
              color="primary"
              endIcon={<Icon name="right-arrow-1" color="common.white" />}
              onClick={handleRouting}
            >
              <Typography>
                <FormattedMessage {...AfterRegistrationPwaMessages.finishButton} />
              </Typography>
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
      {/* {openDoneDialog && <WelcomeWellDoneDialog isDone openWell={true} />} */}
    </>
  );
}
