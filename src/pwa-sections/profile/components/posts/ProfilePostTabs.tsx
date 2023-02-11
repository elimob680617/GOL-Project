import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import Tab from '@mui/material/Tab';
import { styled } from '@mui/material/styles';

import { useLazyGetHomePagePostsQuery } from 'src/_graphql/post/queries/getHomePagePosts.generated';
import { Icon } from 'src/components/Icon';
import useAuth from 'src/hooks/useAuth';
//component
import CampaignPost from 'src/pwa-sections/post/campaignPost/campaignPostCard/CampignPost';
import SocialPost from 'src/pwa-sections/post/socialPost/socialPostCard/socialPost';
import { PATH_APP } from 'src/routes/paths';

// -----------------------------------------------
const LoadMoreStyle = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  display: 'flex',
  justifyContent: 'center',
  cursor: 'pointer',
}));
// --------------------------------------------------------
// start project
export default function ProfilePostTabs() {
  // tools !
  const { user } = useAuth();
  const [value, setValue] = React.useState('1');

  // services !

  const [getPosts, { isLoading: getPostsLoading, data: postsData }] = useLazyGetHomePagePostsQuery();
  const posts = postsData?.getHomePagePosts?.listDto?.items;
  const count = postsData?.getHomePagePosts?.listDto?.count;
  // useEffects !
  useEffect(() => {
    getPosts({ filter: { pageIndex: 0, pageSize: 1, dto: { ownerUserId: user?.id } } });
  }, [getPosts, user?.id]);
  // useMemo !
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
              <SocialPost key={post?.social?.id} post={post?.social} />
            ) : (
              <CampaignPost key={post?.campaign?.id} post={post?.campaign} />
            ),
          )
        )}
      </Stack>
    ),

    [getPostsLoading, posts],
  );

  // functions !!
  // change tabs
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  // ----------------------------------------------------

  return (
    <TabContext value={value}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList
          onChange={handleChange}
          aria-label="lab API tabs example"
          sx={{ '&>div>div': { justifyContent: 'space-between' } }}
        >
          <Tab label="Posts" value="1" />
          <Tab label="Fundraisings" value="2" />
          <Tab label="Articles" value="3" />
          <Tab label="Mentioned" value="4" />
        </TabList>
      </Box>
      <TabPanel value="1">
        {getPostsLoading ? (
          <Stack sx={{ py: 6 }} alignItems="center" justifyContent="center">
            <CircularProgress />
          </Stack>
        ) : (
          <>
            {count > 0 ? (
              <>
                {renderPosts}
                {count > 1 && (
                  <Link to={PATH_APP.profile.post.root + '/' + user?.id}>
                    <LoadMoreStyle>
                      <Typography variant="body2" color="primary.main" sx={{ cursor: 'pointer' }}>
                        See More Post
                      </Typography>
                    </LoadMoreStyle>
                  </Link>
                )}
              </>
            ) : (
              <Stack sx={{ pt: 3, pb: 2 }}>
                <Link to={PATH_APP.post.createPost.socialPost.index}>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: (theme) => theme.palette.text.secondary,
                    }}
                    startIcon={<Icon name="Plus" color="text.secondary" />}
                  >
                    <Typography color="text.primary">Add post</Typography>
                  </Button>
                </Link>
              </Stack>
            )}
          </>
        )}
      </TabPanel>
      <TabPanel value="2">Item Two</TabPanel>
      <TabPanel value="3">Item Three</TabPanel>
      <TabPanel value="4">Item four</TabPanel>
    </TabContext>
  );
}
