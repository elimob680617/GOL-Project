//mui
import React, { FC, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Avatar, Box, Button, CircularProgress, Stack, Tab, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useLazyGetFollowersQuery } from 'src/_graphql/connection/queries/getFollowers.generated';
import { useLazyGetFollowingsQuery } from 'src/_graphql/connection/queries/getFollowings.generated';
import { FilterByEnum } from 'src/types/serverTypes';

import NormalAndNgoProfileViewMessages from '../UserProfileView.messages';

interface UserConnection {
  // ID?: string;
  Name: string;
}
const NameStyle = styled(Typography)(({ theme }) => ({
  width: 80,
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textAlign: 'center',
}));
const ConnectionUsersStyle = styled(Stack)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));
const NoConnectionTabStyle = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  mt: 1,
}));

const ConnectionView: FC<UserConnection> = (props) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const ID = id;
  const { formatMessage } = useIntl();
  // const ID = navigate?.query?.id?.[0];
  const { Name } = props;
  const [value, setValue] = React.useState('followers');
  const [getFollowers, { data: followersData, isFetching: isFetchingFollower }] = useLazyGetFollowersQuery();
  const [getFollowings, { data: followingsData, isFetching: isFetchingfollowing }] = useLazyGetFollowingsQuery();
  useEffect(() => {
    if (ID) {
      if (value === 'followers') {
        getFollowers({
          filter: { pageSize: 7, pageIndex: 0, dto: { filterBy: FilterByEnum.All, searchText: '', userId: ID } },
        });
      } else {
        getFollowings({
          filter: { pageSize: 7, pageIndex: 0, dto: { searchText: '', filterBy: FilterByEnum.All, userId: ID } },
        });
      }
    }
  }, [value, ID, getFollowers, getFollowings]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const followers = followersData?.getFollowers?.listDto?.items;
  const followings = followingsData?.getFollowings?.listDto?.items;

  return (
    <>
      <Stack justifyContent="space-between" direction="row" sx={{ minHeight: 210 }}>
        <Box sx={{ width: '100%' }}>
          <TabContext value={value}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label={formatMessage(NormalAndNgoProfileViewMessages.followersLable)} value="followers" />
                <Tab label={formatMessage(NormalAndNgoProfileViewMessages.followingsLable)} value="followings" />
              </TabList>
              {/* {((followersData?.getFollowers?.listDto?.count > 7 && value === 'follower')||
                (followingsData?.getFollowings?.listDto?.count > 7 && value === 'following')) && (
                )} */}
              {(followersData?.getFollowers?.listDto?.count > 0 ||
                followingsData?.getFollowings?.listDto?.count > 0) && (
                <Link to={`/connections/${value}/?userId=${ID}`}>
                  <Button size="small" variant="outlined" sx={{ color: 'text.primary', width: 163 }}>
                    <Typography variant="button" color="text.primary">
                      <FormattedMessage {...NormalAndNgoProfileViewMessages.seeConnections} />
                    </Typography>
                  </Button>
                </Link>
              )}
            </Box>
            <TabPanel value="followers">
              {followersData?.getFollowers?.listDto?.count > 0 ? (
                <Stack direction="row" gap={theme.spacing(3)} mt={4}>
                  {isFetchingFollower ? (
                    <Stack sx={{ py: 4, margin: '0 auto' }} alignItems="center" justifyContent="center">
                      <CircularProgress />
                    </Stack>
                  ) : (
                    <>
                      {followers?.slice(0, 7).map((follower) => (
                        <ConnectionUsersStyle
                          key={follower?.itemId}
                          sx={{ cursor: 'pointer' }}
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
                          <NameStyle variant="caption">{follower?.fullName || follower?.firstName}</NameStyle>
                        </ConnectionUsersStyle>
                      ))}
                    </>
                  )}
                </Stack>
              ) : (
                <NoConnectionTabStyle>
                  <img loading="lazy" src="src/assets/icons/noConnection.svg" alt="" />
                  <Box sx={{ display: 'flex' }} mt={2}>
                    <Typography variant="body2" color="text.secondary">
                      <FormattedMessage
                        {...NormalAndNgoProfileViewMessages.hasNoFollowerMessage}
                        values={{ name: Name }}
                      />
                      {/* {Name} have no follower */}
                    </Typography>
                  </Box>
                </NoConnectionTabStyle>
              )}
            </TabPanel>
            <TabPanel value="followings">
              {followingsData?.getFollowings?.listDto?.count > 0 ? (
                <Stack direction="row" gap={theme.spacing(3)} mt={4}>
                  {isFetchingfollowing ? (
                    <Stack sx={{ py: 4, margin: '0 auto' }} alignItems="center" justifyContent="center">
                      <CircularProgress />
                    </Stack>
                  ) : (
                    <>
                      {followings?.slice(0, 7).map((following) => (
                        <ConnectionUsersStyle
                          key={following?.itemId}
                          sx={{ cursor: 'pointer' }}
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
                          <NameStyle variant="caption">{following?.fullName || following?.firstName}</NameStyle>
                        </ConnectionUsersStyle>
                      ))}
                    </>
                  )}
                </Stack>
              ) : (
                <NoConnectionTabStyle>
                  <img loading="lazy" src="src/assets/icons/noConnection.svg" alt="" />
                  <Box sx={{ display: 'flex' }} mt={2}>
                    <Typography variant="body2" color="text.secondary">
                      <FormattedMessage
                        {...NormalAndNgoProfileViewMessages.hasNoFollowingMessage}
                        values={{ name: Name }}
                      />
                      {/* {Name} have no following */}
                    </Typography>
                  </Box>
                </NoConnectionTabStyle>
              )}
            </TabPanel>
          </TabContext>
        </Box>
      </Stack>
    </>
  );
};

export default ConnectionView;
