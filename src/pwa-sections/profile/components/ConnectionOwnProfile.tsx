import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Avatar, Button, CircularProgress, Grid, Stack, Typography, styled } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';

import { useLazyGetFollowersQuery } from 'src/_graphql/connection/queries/getFollowers.generated';
import { useLazyGetFollowingsQuery } from 'src/_graphql/connection/queries/getFollowings.generated';
import { useLazyGetRequestedsQuery } from 'src/_graphql/connection/queries/getRequesteds.generated';
import { useLazyGetRequestsQuery } from 'src/_graphql/connection/queries/getRequests.generated';
import useAuth from 'src/hooks/useAuth';
import { AccountPrivacyEnum, FilterByEnum } from 'src/types/serverTypes';

const NameStyle = styled(Typography)(({ theme }) => ({
  width: 80,
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textAlign: 'center',
  color: theme.palette.text.primary,
}));
export default function ConnectionOwnProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [valueFollower, setValueFollower] = useState('1');

  const [getFollowers, { data: followersData, isLoading: loadingFollower }] = useLazyGetFollowersQuery();
  const [getFollowings, { data: followingData, isLoading: loadingFollowing }] = useLazyGetFollowingsQuery();
  const [getRequesteds, { data: requestedData, isLoading: loadingRequested }] = useLazyGetRequestedsQuery();
  const [getRequests, { data: requestData, isLoading: loadingRequest }] = useLazyGetRequestsQuery();

  const followers = followersData?.getFollowers?.listDto?.items;
  const followerCount = followersData?.getFollowers?.listDto?.count;

  const followings = followingData?.getFollowings?.listDto?.items;
  const followingCount = followingData?.getFollowings?.listDto?.count;
  // ---------------------
  const requesteds = requestedData?.getRequesteds?.listDto?.items;
  const requestedCount = requestedData?.getRequesteds?.listDto?.count;
  // -----------------------------------
  const requests = requestData?.getRequests?.listDto?.items;
  const requestCount = requestData?.getRequests?.listDto?.count;

  useEffect(() => {
    if (valueFollower === '1') {
      getFollowers({
        filter: {
          dto: {},
          pageIndex: 0,
          pageSize: 8,
        },
      });
    } else if (valueFollower === '2') {
      getFollowings({
        filter: {
          dto: {},
          pageIndex: 0,
          pageSize: 8,
        },
      });
    } else if (valueFollower === '3') {
      getRequests({
        filter: {
          dto: {},
          pageIndex: 0,
          pageSize: 8,
        },
      });
    } else if (valueFollower === '4') {
      getRequesteds({
        filter: {
          dto: {},
          pageIndex: 0,
          pageSize: 8,
        },
      });
    }
  }, [getFollowers, getFollowings, getRequesteds, getRequests, valueFollower]);

  //   functions !
  const handleChangeFollower = (event: React.SyntheticEvent, newValue: string) => {
    setValueFollower(newValue);
  };

  return (
    <TabContext value={valueFollower}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <TabList
          onChange={handleChangeFollower}
          aria-label="lab API tabs example"
          sx={{ '&>div>div': { justifyContent: 'space-between' } }}
        >
          <Tab label="Followers" value="1" />
          <Tab label="Following" value="2" />
          {user?.accountPrivacy === AccountPrivacyEnum.Private && <Tab label="Requests" value="3" />}
          <Tab label="Requested" value="4" />
        </TabList>
      </Box>
      {/* ----------------------------------follower------------------------------ */}
      <TabPanel value="1">
        {loadingFollower ? (
          <Stack sx={{ py: 6 }} alignItems="center" justifyContent="center">
            <CircularProgress />
          </Stack>
        ) : (
          <>
            {followerCount > 0 ? (
              <>
                <Grid container direction="row" alignItems="center" spacing={1}>
                  {followers?.map((follower) => (
                    <Grid item xs={3} key={follower?.itemId}>
                      <Stack alignItems="center" justifyContent="center">
                        <Box
                          onClick={() => {
                            if (follower?.itemType === FilterByEnum.Normal)
                              navigate(`/profile/user/view/${follower?.itemId}`);
                            else if (follower?.itemType === FilterByEnum.Ngo)
                              navigate(`/profile/ngo/view/${follower?.itemId}`);
                          }}
                          sx={{ mb: 1 }}
                        >
                          <Avatar
                            alt={follower?.firstName || ''}
                            src={follower?.avatarUrl as string}
                            sx={{ width: 64, height: 64 }}
                            variant={follower?.itemType === FilterByEnum.Normal ? 'circular' : 'rounded'}
                          />
                        </Box>

                        {/* </NextLink> */}
                        <NameStyle variant="caption">{follower?.fullName || follower?.firstName}</NameStyle>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
                <Stack sx={{ pt: 3, pb: 0 }}>
                  <Button
                    onClick={() => navigate('/connections/followers')}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: 'text.secondary',
                    }}
                  >
                    <Typography color="text.primary" variant="button">
                      See all Followers
                    </Typography>
                  </Button>
                </Stack>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary" align="center">
                you have no followers
              </Typography>
            )}
          </>
        )}
      </TabPanel>
      {/* ---------------------------------------following-------------------------------------- */}
      <TabPanel value="2">
        {loadingFollowing ? (
          <Stack sx={{ py: 6 }} alignItems="center" justifyContent="center">
            <CircularProgress />
          </Stack>
        ) : (
          <>
            {followingCount > 0 ? (
              <>
                <Grid container direction="row" alignItems="center" spacing={1}>
                  {followings?.map((following) => (
                    <Grid item xs={3} key={following?.itemId}>
                      <Stack justifyContent="center" alignItems="center" spacing={1}>
                        <Box
                          onClick={() => {
                            if (following?.itemType === FilterByEnum.Normal)
                              navigate(`/profile/user/view/${following?.itemId}`);
                            else if (following?.itemType === FilterByEnum.Ngo)
                              navigate(`/profile/ngo/view/${following?.itemId}`);
                          }}
                        >
                          <Avatar
                            alt={following?.firstName || ''}
                            src={following?.avatarUrl as string}
                            sx={{ width: 64, height: 64 }}
                            variant={following?.itemType === FilterByEnum.Normal ? 'circular' : 'rounded'}
                          />
                        </Box>

                        <NameStyle variant="caption">{following?.fullName || following?.firstName}</NameStyle>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
                <Stack sx={{ pt: 3, pb: 2 }}>
                  <Button
                    onClick={() => navigate('/connections/following')}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: 'text.secondary',
                    }}
                  >
                    <Typography color="text.primary" variant="button">
                      See all Followings
                    </Typography>
                  </Button>
                </Stack>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary" align="center">
                you have no following
              </Typography>
            )}
          </>
        )}
      </TabPanel>
      {/*--------------------------------------- requests------------------- */}
      {user?.accountPrivacy === AccountPrivacyEnum.Private && (
        <TabPanel value="3">
          {loadingRequest ? (
            <Stack sx={{ py: 6 }} alignItems="center" justifyContent="center">
              <CircularProgress />
            </Stack>
          ) : (
            <>
              {requestCount > 0 ? (
                <>
                  <Grid container direction="row" alignItems="center" spacing={1}>
                    {requests?.map((request) => (
                      <Grid item xs={3} key={request?.itemId}>
                        <Stack justifyContent="center" alignItems="center" spacing={1}>
                          <Box
                            onClick={() => {
                              if (request?.itemType === FilterByEnum.Normal)
                                navigate(`/profile/user/view/${request?.itemId}`);
                              else if (request?.itemType === FilterByEnum.Ngo)
                                navigate(`/profile/ngo/view/${request?.itemId}`);
                            }}
                          >
                            <Avatar
                              alt={request?.firstName || ''}
                              src={request?.avatarUrl as string}
                              sx={{ width: 64, height: 64 }}
                              variant={request?.itemType === FilterByEnum.Normal ? 'circular' : 'rounded'}
                            />
                          </Box>

                          <NameStyle variant="caption">{request?.fullName || request?.firstName}</NameStyle>
                        </Stack>
                      </Grid>
                    ))}
                  </Grid>
                  <Stack sx={{ pt: 3, pb: 2 }}>
                    <Button
                      onClick={() => navigate('/connections/request')}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: 'text.secondary',
                      }}
                    >
                      <Typography color="text.primary" variant="button">
                        See all Requests
                      </Typography>
                    </Button>
                  </Stack>
                </>
              ) : (
                <Typography variant="body2" color="text.secondary" align="center">
                  you have no requests
                </Typography>
              )}
            </>
          )}
        </TabPanel>
      )}

      {/* --------------------------------------requested----------------------------------- */}
      <TabPanel value="4">
        {loadingRequested ? (
          <Stack sx={{ py: 6 }} alignItems="center" justifyContent="center">
            <CircularProgress />
          </Stack>
        ) : (
          <>
            {requestedCount > 0 ? (
              <>
                <Grid container direction="row" alignItems="center" spacing={1}>
                  {requesteds?.map((requested) => (
                    <Grid item xs={3} key={requested?.itemId}>
                      <Stack justifyContent="center" alignItems="center" spacing={1}>
                        <Box
                          onClick={() => {
                            if (requested?.itemType === FilterByEnum.Normal)
                              navigate(`/profile/user/view/${requested?.itemId}`);
                            else if (requested?.itemType === FilterByEnum.Ngo)
                              navigate(`/profile/ngo/view/${requested?.itemId}`);
                          }}
                        >
                          <Avatar
                            alt={requested?.firstName || ''}
                            src={requested?.avatarUrl as string}
                            sx={{ width: 64, height: 64 }}
                            variant={requested?.itemType === FilterByEnum.Normal ? 'circular' : 'rounded'}
                          />
                        </Box>

                        <NameStyle variant="caption">{requested?.fullName || requested?.firstName}</NameStyle>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
                <Stack sx={{ pt: 3, pb: 2 }}>
                  <Button
                    onClick={() => navigate('/connections/requested')}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: 'text.secondary',
                    }}
                  >
                    <Typography color="text.primary" variant="button">
                      See all requesteds
                    </Typography>
                  </Button>
                </Stack>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary" align="center">
                you have no requested
              </Typography>
            )}
          </>
        )}
      </TabPanel>
    </TabContext>
  );
}
