import React, { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, CircularProgress, IconButton, Stack, Typography } from '@mui/material';
import Tab from '@mui/material/Tab';

//service
import { useLazyGetHomePagePostsQuery } from 'src/_graphql/post/queries/getHomePagePosts.generated';
//icon
import { Icon } from 'src/components/Icon';
//component
import CampaignPost from 'src/pwa-sections/post/campaignPost/campaignPostCard/CampignPost';
import SocialPost from 'src/pwa-sections/post/socialPost/socialPostCard/socialPost';

// --------------------------------------------------------
// start project
export default function Posts() {
  // tools !
  const router = useNavigate();
  const { userId } = useParams();
  const id = userId;
  const [value, setValue] = React.useState('1');

  // services !

  const [getHomePagePosts, { isLoading: getPostsLoading, data: postsData }] = useLazyGetHomePagePostsQuery();

  // useEffects !
  useEffect(() => {
    getHomePagePosts({ filter: { pageIndex: 0, pageSize: 10, dto: { ownerUserId: id as string } } });
  }, [getHomePagePosts, id]);

  const posts = postsData?.getHomePagePosts?.listDto?.items;

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
    <Stack>
      <Stack sx={{ mb: 2, px: 2, pt: 3 }} spacing={2} direction="row" alignItems="center">
        <IconButton sx={{ p: 0 }} onClick={() => router(-1)}>
          <Icon name="left-arrow" color="text.primary" />
        </IconButton>
        <Typography variant="subtitle1">Posts</Typography>
      </Stack>

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
        <TabPanel value="1">{renderPosts}</TabPanel>
        <TabPanel value="2">Item Two</TabPanel>
        <TabPanel value="3">Item Three</TabPanel>
        <TabPanel value="4">Item four</TabPanel>
      </TabContext>
    </Stack>
  );
}
