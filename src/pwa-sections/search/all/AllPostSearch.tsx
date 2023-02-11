import { FormattedMessage } from 'react-intl';

import { Box, CircularProgress, Stack, Typography } from '@mui/material';

import CustomLink from 'src/components/CustomLink';
import SocialPost from 'src/pwa-sections/post/socialPost/socialPostCard/socialPost';
import { PATH_APP } from 'src/routes/paths';
import { useSelector } from 'src/store';
import { getSearchLoading, getSearchedSocialPosts } from 'src/store/slices/search';

import SearchMessages from '../Search.messages';
import PostNotFound from '../notFound/PostNotFound';

function AllPostSearch() {
  const posts = useSelector(getSearchedSocialPosts);
  const loading = useSelector(getSearchLoading);

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" paddingX={2}>
        <Typography variant="subtitle2" color="text.secondary">
          <FormattedMessage {...SearchMessages.posts} />
        </Typography>
        <CustomLink path={PATH_APP.search.post}>
          <Typography variant="button" color="info.main">
            <FormattedMessage {...SearchMessages.seeMore} />
          </Typography>
        </CustomLink>
      </Stack>
      <Box>
        {posts.slice(0, 2).map((post) => (
          <SocialPost key={post.id} post={post} />
        ))}

        {posts.length === 0 && loading && (
          <Stack alignItems="center" justifyContent="center">
            <CircularProgress />
          </Stack>
        )}

        {posts.length === 0 && !loading && (
          <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
            <PostNotFound />
          </Stack>
        )}
      </Box>
    </Stack>
  );
}

export default AllPostSearch;
