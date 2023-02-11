import React, { FC, useEffect, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useParams } from 'react-router-dom';

import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, CircularProgress, Stack, Tab, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useLazyGetHomePagePostsQuery } from 'src/_graphql/post/queries/getHomePagePosts.generated';
// import NoPostIcon from 'src/assets/icons/noPost.svg';
import { PATH_APP } from 'src/routes/paths';
import CampaignPost from 'src/sections/post/campaignPost/campignPostCard/CampignPost';
import SocialPost from 'src/sections/post/socialPost/socialPostCard/SocialPost';

import NormalAndNgoProfileViewMessages from '../UserProfileView.messages';

interface UserPost {
  // ID?: string;
  Name?: string;
}

const LoadMoreStyle = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  display: 'flex',
  justifyContent: 'center',
  cursor: 'pointer',
}));
const PostStyle = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(2),
}));
const PostStyleNoPost = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: 1,
  padding: theme.spacing(2),
}));

const ProfilePostTabs: FC<UserPost> = (props) => {
  const { Name } = props;
  const { id } = useParams();
  const userId = id;
  const { formatMessage } = useIntl();
  // const userId = router?.query?.id?.[0];
  const [value, setValue] = React.useState('Post');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const [getPosts, { isLoading: getPostsLoading, data: postsData }] = useLazyGetHomePagePostsQuery();
  useEffect(() => {
    getPosts({ filter: { pageIndex: 0, pageSize: 1, dto: { ownerUserId: userId } } });
  }, [getPosts, userId]);

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
  //................
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
                  <Link to={PATH_APP.profile.post.root + '/' + userId} style={{ textDecoration: 'none' }}>
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
                <img src="src/assets/icons/noPost.svg" alt="" loading="lazy" />
                <Box sx={{ display: 'flex' }} mt={2}>
                  <Typography variant="body2" color="text.secondary">
                    <FormattedMessage {...NormalAndNgoProfileViewMessages.noMorePost} values={{ name: Name }} />
                  </Typography>
                </Box>
              </Box>
            </PostStyleNoPost>
          </>
        )}
      </>
    ),

    [count, renderPosts, userId, Name],
  );

  return (
    <>
      <PostStyle justifyContent="space-between" direction="row">
        <Box sx={{ width: '100%' }}>
          <TabContext value={value}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label={formatMessage(NormalAndNgoProfileViewMessages.postsLable)} value="Post" />
                <Tab label={formatMessage(NormalAndNgoProfileViewMessages.articlesLable)} value="Article" />
                <Tab label={formatMessage(NormalAndNgoProfileViewMessages.mentionedLable)} value="Mention" />
              </TabList>
            </Box>
            {posts && posts?.length > 0 && (
              <Box sx={{ width: 'calc(100% + 32px)', bgcolor: 'background.neutral', height: 24, ml: -2 }} />
            )}
            <TabPanel value="Post">{renderPost}</TabPanel>
            <TabPanel value="Article">{renderPost}</TabPanel>
            <TabPanel value="Mention">{renderPost}</TabPanel>
          </TabContext>
        </Box>
      </PostStyle>
    </>
  );
};

export default ProfilePostTabs;
