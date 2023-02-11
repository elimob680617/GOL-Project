import { Stack, Typography } from '@mui/material';

import CustomLink from 'src/components/CustomLink';
import { PATH_APP } from 'src/routes/paths';
import SocialPost from 'src/sections/post/socialPost/socialPostCard/SocialPost';
import { useSelector } from 'src/store';
import { getSearchLoading, getSearchedSocialPosts } from 'src/store/slices/search';

import { PostWrapperStyle } from '../SharedStyled';
import PostNotFound from '../notFound/PostNotFound';
import PostSkelton from '../skelton/PostSkelton';

function AllPostSearch() {
  const posts = useSelector(getSearchedSocialPosts);

  const loading = useSelector(getSearchLoading);

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle2" color="text.secondary">
          Posts
        </Typography>
        <CustomLink path={PATH_APP.search.post}>
          <Typography variant="button" color="info.main">
            See more
          </Typography>
        </CustomLink>
      </Stack>

      <PostWrapperStyle>
        <Stack spacing={2}>
          {posts.map((post, index) => (
            <SocialPost page="search" key={post.id} post={post} />
          ))}

          {posts.length === 0 && loading && (
            <>
              {[...Array(2)].map((i, index) => (
                <PostSkelton key={`post-skelton-${index}`} />
              ))}
            </>
          )}

          {posts.length === 0 && !loading && (
            <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
              <PostNotFound />
            </Stack>
          )}
        </Stack>
      </PostWrapperStyle>
    </Stack>
  );
}

export default AllPostSearch;
