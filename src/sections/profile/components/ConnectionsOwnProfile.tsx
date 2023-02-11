//mui
import React, { FC, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Avatar, Box, Button, Stack, Tab, Typography, useTheme } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';

import { useLazyGetFollowersQuery } from 'src/_graphql/connection/queries/getFollowers.generated';
import { useLazyGetFollowingsQuery } from 'src/_graphql/connection/queries/getFollowings.generated';
import { useLazyGetRequestedsQuery } from 'src/_graphql/connection/queries/getRequesteds.generated';
import { useLazyGetRequestsQuery } from 'src/_graphql/connection/queries/getRequests.generated';
import { FilterByEnum, UserTypeEnum } from 'src/types/serverTypes';

import NormalAndNgoProfileViewMessages from '../UserProfileView.messages';

const FollowersStyle = styled(Stack)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));
const NameStyle = styled(Typography)(({ theme }) => ({
  width: 80,
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textAlign: 'center',
}));
const NoFollowerStyle = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: 40,
  backgroundColor: theme.palette.background.neutral,
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
  textAlign: 'center',
  marginBottom: theme.spacing(2),
}));
interface IsOwnType {
  isOwn?: UserTypeEnum;
}
const ConnectionsOwnProfile: FC<IsOwnType> = (props) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isOwn } = props;
  const { formatMessage } = useIntl();
  const [value, setValue] = React.useState('followers');
  const [getFollowers, { data: followersData, isLoading: followersLoading }] = useLazyGetFollowersQuery();
  const [getFollowings, { data: followingsData, isLoading: followingsLoading }] = useLazyGetFollowingsQuery();
  const [getRequests, { data: requestsData, isLoading: requestsLoading }] = useLazyGetRequestsQuery();
  const [getRequesteds, { data: requestedsData, isLoading: requestedsLoading }] = useLazyGetRequestedsQuery();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  useEffect(() => {
    if (value === 'followers') {
      getFollowers({
        filter: { all: true, pageIndex: 0, pageSize: 7, dto: { filterBy: FilterByEnum.All, searchText: '' } },
      });
    } else if (value === 'followings') {
      getFollowings({
        filter: { all: true, pageIndex: 0, pageSize: 7, dto: { filterBy: FilterByEnum.All, searchText: '' } },
      });
    } else if (value === 'requests' && isOwn === UserTypeEnum.Normal) {
      getRequests({
        filter: { all: true, pageIndex: 0, pageSize: 7, dto: { filterBy: FilterByEnum.All, searchText: '' } },
      });
    } else if (value === 'requested') {
      getRequesteds({
        filter: { all: true, pageIndex: 0, pageSize: 7, dto: { filterBy: FilterByEnum.All, searchText: '' } },
      });
    }
  }, [getFollowers, getFollowings, getRequesteds, getRequests, isOwn, value]);

  const handelRouterConnections = (route: string) => {
    navigate(`/connections/${route}`);
  };

  const followers = followersData?.getFollowers?.listDto?.items;
  const followings = followingsData?.getFollowings?.listDto?.items;
  const requests = requestsData?.getRequests?.listDto?.items;
  const requesteds = requestedsData?.getRequesteds?.listDto?.items;

  return (
    <>
      <Stack justifyContent="space-between" direction="row">
        <Box sx={{ width: '100%' }}>
          <TabContext value={value}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label={formatMessage(NormalAndNgoProfileViewMessages.followersLable)} value="followers" />
                <Tab label={formatMessage(NormalAndNgoProfileViewMessages.followingsLable)} value="followings" />
                {isOwn === UserTypeEnum.Normal && <Tab label="Requests" value="requests" />}
                <Tab label="Requested" value="requested" />
              </TabList>
              <Button
                size="small"
                variant="outlined"
                sx={{ color: 'text.primary', width: 163 }}
                onClick={() => handelRouterConnections(value)}
              >
                <Typography variant="button" color="text.primary">
                  <FormattedMessage {...NormalAndNgoProfileViewMessages.seeConnections} />
                </Typography>
              </Button>
            </Box>
            <TabPanel value="followers">
              <Stack direction="row" gap={theme.spacing(3)} mt={4} sx={{ overflowX: 'auto' }}>
                {followersLoading ? (
                  <CircularProgress />
                ) : (
                  followers?.map((follower) => (
                    <FollowersStyle key={follower?.itemId}>
                      <Box
                        onClick={() => {
                          if (follower?.itemType === FilterByEnum.Normal)
                            navigate(`/profile/user/view/${follower?.itemId}`);
                          else if (follower?.itemType === FilterByEnum.Ngo)
                            navigate(`/profile/ngo/view/${follower?.itemId}`);
                        }}
                      >
                        <Avatar
                          src={follower?.avatarUrl || undefined}
                          variant={follower?.itemType === FilterByEnum.Normal ? 'circular' : 'rounded'}
                          sx={{ width: 80, height: 80, backgroundColor: 'background.neutral', cursor: 'pointer' }}
                        />
                      </Box>

                      <NameStyle variant="caption">{follower?.fullName || follower?.firstName}</NameStyle>
                    </FollowersStyle>
                  ))
                )}
              </Stack>
              {followersData?.getFollowers?.listDto?.count === 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 0,
                  }}
                >
                  <NoFollowerStyle>
                    <Typography
                      variant="overline"
                      color={theme.palette.surface.onSurfaceVariantD}
                      sx={{ textTransform: 'none' }}
                    >
                      <FormattedMessage {...NormalAndNgoProfileViewMessages.noFollowerTitle} />
                    </Typography>
                  </NoFollowerStyle>
                  <Box sx={{ display: 'flex' }}>
                    <Typography variant="body2" color="text.secondary">
                      <FormattedMessage {...NormalAndNgoProfileViewMessages.noFollowerMessage} />
                    </Typography>
                  </Box>
                </Box>
              )}
            </TabPanel>
            <TabPanel value="followings">
              <Stack direction="row" gap={theme.spacing(3)} mt={4} sx={{ overflowX: 'auto' }}>
                {followingsLoading ? (
                  <CircularProgress />
                ) : (
                  followings?.map((following) => (
                    <FollowersStyle key={following?.itemId}>
                      <Box
                        onClick={() => {
                          if (following?.itemType === FilterByEnum.Normal)
                            navigate(`/profile/user/view/${following?.itemId}`);
                          else if (following?.itemType === FilterByEnum.Ngo)
                            navigate(`/profile/ngo/view/${following?.itemId}`);
                        }}
                      >
                        <Avatar
                          src={following?.avatarUrl || undefined}
                          variant={following?.itemType === FilterByEnum.Normal ? 'circular' : 'rounded'}
                          sx={{ width: 80, height: 80, backgroundColor: 'background.neutral', cursor: 'pointer' }}
                        />
                      </Box>
                      <NameStyle variant="caption">{following?.fullName || following?.firstName}</NameStyle>
                    </FollowersStyle>
                  ))
                )}
              </Stack>
              {followingsData?.getFollowings?.listDto?.count === 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 0,
                  }}
                >
                  <NoFollowerStyle>
                    <Typography
                      variant="overline"
                      color={theme.palette.surface.onSurfaceVariantD}
                      sx={{ textTransform: 'none' }}
                    >
                      <FormattedMessage {...NormalAndNgoProfileViewMessages.noFollowingTitle} />
                    </Typography>
                  </NoFollowerStyle>
                  <Box sx={{ display: 'flex' }}>
                    <Typography variant="body2" color="text.secondary">
                      <FormattedMessage {...NormalAndNgoProfileViewMessages.noFollowingMessage} />
                    </Typography>
                  </Box>
                </Box>
              )}
            </TabPanel>
            {isOwn === UserTypeEnum.Normal && (
              <TabPanel value="requests">
                <Stack direction="row" gap={theme.spacing(3)} mt={4} sx={{ overflowX: 'auto' }}>
                  {requestsLoading ? (
                    <CircularProgress />
                  ) : (
                    requests?.map((request) => (
                      <FollowersStyle key={request?.itemId}>
                        <Box
                          onClick={() => {
                            if (request?.itemType === FilterByEnum.Normal)
                              navigate(`/profile/user/view/${request?.itemId}`);
                            else if (request?.itemType === FilterByEnum.Ngo)
                              navigate(`/profile/ngo/view/${request?.itemId}`);
                          }}
                        >
                          <Avatar
                            src={request?.avatarUrl || undefined}
                            variant={request?.itemType === FilterByEnum.Normal ? 'circular' : 'rounded'}
                            sx={{ width: 80, height: 80, backgroundColor: 'background.neutral', cursor: 'pointer' }}
                          />
                        </Box>
                        <NameStyle variant="caption">{request?.fullName || request?.firstName}</NameStyle>
                      </FollowersStyle>
                    ))
                  )}
                </Stack>
                {requestsData?.getRequests?.listDto?.count === 0 && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      alignItems: 'center',
                      mt: 0,
                    }}
                  >
                    <NoFollowerStyle>
                      <Typography
                        variant="overline"
                        color={theme.palette.surface.onSurfaceVariantD}
                        sx={{ textTransform: 'none' }}
                      >
                        <FormattedMessage {...NormalAndNgoProfileViewMessages.noRequestTitle} />
                      </Typography>
                    </NoFollowerStyle>
                    <Box sx={{ display: 'flex' }}>
                      <Typography variant="body2" color="text.secondary">
                        <FormattedMessage {...NormalAndNgoProfileViewMessages.noRequestMessage} />
                      </Typography>
                    </Box>
                  </Box>
                )}
              </TabPanel>
            )}
            <TabPanel value="requested">
              <Stack direction="row" gap={theme.spacing(3)} mt={4} sx={{ overflowX: 'auto' }}>
                {requestedsLoading ? (
                  <CircularProgress />
                ) : (
                  requesteds?.map((requested) => (
                    <FollowersStyle key={requested?.itemId}>
                      <Box
                        onClick={() => {
                          if (requested?.itemType === FilterByEnum.Normal)
                            navigate(`/profile/user/view/${requested?.itemId}`);
                          else if (requested?.itemType === FilterByEnum.Ngo)
                            navigate(`/profile/ngo/view/${requested?.itemId}`);
                        }}
                      >
                        <Avatar
                          src={requested?.avatarUrl || undefined}
                          variant={requested?.itemType === FilterByEnum.Normal ? 'circular' : 'rounded'}
                          sx={{ width: 80, height: 80, backgroundColor: 'background.neutral', cursor: 'pointer' }}
                        />
                      </Box>
                      <NameStyle variant="caption">{requested?.fullName || requested?.firstName}</NameStyle>
                    </FollowersStyle>
                  ))
                )}
              </Stack>
              {requestedsData?.getRequesteds?.listDto?.count === 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 0,
                  }}
                >
                  <NoFollowerStyle>
                    <Typography
                      variant="overline"
                      color={theme.palette.surface.onSurfaceVariantD}
                      sx={{ textTransform: 'none' }}
                    >
                      <FormattedMessage {...NormalAndNgoProfileViewMessages.noRequestedTitle} />
                    </Typography>
                  </NoFollowerStyle>
                  <Box sx={{ display: 'flex' }}>
                    <Typography variant="body2" color="text.secondary">
                      <FormattedMessage {...NormalAndNgoProfileViewMessages.noRequestedMessage} />
                    </Typography>
                  </Box>
                </Box>
              )}
            </TabPanel>
          </TabContext>
        </Box>
      </Stack>
    </>
  );
};

export default ConnectionsOwnProfile;
