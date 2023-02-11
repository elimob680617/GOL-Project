import React, { useEffect, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Button, CircularProgress, Stack, Tab, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useLazyGetHomePagePostsQuery } from 'src/_graphql/post/queries/getHomePagePosts.generated';
import { Icon } from 'src/components/Icon';
import useAuth from 'src/hooks/useAuth';
import { PATH_APP } from 'src/routes/paths';
import CampaignPost from 'src/sections/post/campaignPost/campignPostCard/CampignPost';
import SocialPost from 'src/sections/post/socialPost/socialPostCard/SocialPost';

import NormalAndNgoProfileViewMessages from '../UserProfileView.messages';

const LoadMoreStyle = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  display: 'flex',
  justifyContent: 'center',
  cursor: 'pointer',
}));

const NoPostStyle = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: 40,
  backgroundColor: theme.palette.background.neutral,
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
}));
const PostStyle = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: 1,
  padding: theme.spacing(2),
}));
const PostStyleNoPost = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: 1,
  padding: theme.spacing(2),
}));

function ProfileOwnerPostTabs() {
  const { user } = useAuth();
  const [value, setValue] = React.useState('1');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const [getPosts, { isLoading: getPostsLoading, data: postsData }] = useLazyGetHomePagePostsQuery();
  useEffect(() => {
    getPosts({ filter: { pageIndex: 0, pageSize: 1, dto: { ownerUserId: user?.id } } });
  }, [getPosts, user?.id]);

  const posts = postsData?.getHomePagePosts?.listDto?.items;
  const count = postsData?.getHomePagePosts?.listDto?.count;
  //................................................
  const renderPosts = useMemo(
    () => (
      <Stack spacing={2} sx={{ flex: 1 }}>
        {getPostsLoading ? (
          <Stack alignItems="center">
            <CircularProgress />
          </Stack>
        ) : (
          posts?.map((post) =>
            post?.social ? (
              <SocialPost key={post?.social?.id} post={post?.social} page="search" />
            ) : (
              <CampaignPost key={post?.campaign?.id} post={post?.campaign} />
            ),
          )
        )}
      </Stack>
    ),

    [getPostsLoading, posts],
  );

  const renderPost = useMemo(
    () => (
      <>
        {count > 0 ? (
          <>
            <PostStyle>{renderPosts}</PostStyle>
            {count > 1 && (
              <>
                <Box sx={{ width: 'calc(100% + 32px)', bgcolor: 'background.neutral', height: 24, ml: -2 }} />
                <PostStyle>
                  <Link to={PATH_APP.profile.post.root + '/' + user?.id}>
                    <LoadMoreStyle>
                      <Typography variant="body2" color={'primary.main'} sx={{ cursor: 'pointer' }}>
                        <FormattedMessage {...NormalAndNgoProfileViewMessages.seeMorePost} />
                      </Typography>
                    </LoadMoreStyle>
                  </Link>
                </PostStyle>
              </>
            )}
          </>
        ) : (
          <>
            <PostStyleNoPost direction="column" spacing={3}>
              {/* <Box sx={{ typography: 'body1', display: 'flex', justifyContent: 'space-between' }}></Box> */}
              <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                <NoPostStyle>
                  <Typography variant="overline" color={'surface.onSurfaceVariantD'} sx={{ textTransform: 'none' }}>
                    <FormattedMessage {...NormalAndNgoProfileViewMessages.noPost} />
                  </Typography>
                </NoPostStyle>
                <Box sx={{ display: 'flex' }}>
                  <Typography variant="body2" color="text.secondary">
                    <FormattedMessage {...NormalAndNgoProfileViewMessages.haveNoPost} />
                  </Typography>
                </Box>
              </Box>
            </PostStyleNoPost>
          </>
        )}
      </>
    ),

    [count, renderPosts, user?.id],
  );

  return (
    <>
      <PostStyle justifyContent="space-between" direction="row">
        <Box sx={{ width: '100%' }}>
          <TabContext value={value}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="Posts  " value="1" />
                <Tab label="Fundraisings" value="2" />
                <Tab label="Articles" value="3" />
                <Tab label="Mentioned" value="4" />
              </TabList>
              <Link to={PATH_APP.post.createPost.socialPost.index}>
                <Button
                  size="small"
                  variant="outlined"
                  sx={{ color: 'text.primary', width: 163 }}
                  startIcon={<Icon name="Plus" color="text.primary" />}
                >
                  <Typography variant="button" color="text.primary">
                    <FormattedMessage {...NormalAndNgoProfileViewMessages.addPost} />
                  </Typography>
                </Button>
              </Link>
            </Box>
            {count > 0 && (
              <Box sx={{ width: 'calc(100% + 32px)', bgcolor: 'background.neutral', height: 24, ml: -2 }} />
            )}
            <TabPanel value="1">{renderPost}</TabPanel>
            <TabPanel value="2">Item Two</TabPanel>
            <TabPanel value="3">Item Three</TabPanel>
            <TabPanel value="4">Item 4</TabPanel>
          </TabContext>
        </Box>
      </PostStyle>
    </>
  );
}

export default ProfileOwnerPostTabs;
