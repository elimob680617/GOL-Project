import { FC } from 'react';

import { Masonry } from '@mui/lab';
import { Box, Stack } from '@mui/material';

import SocialPost from 'src/sections/post/socialPost/socialPostCard/SocialPost';
import { useSelector } from 'src/store';
import { getSearchCount, getSearchLoading, getSearchedSocialPosts } from 'src/store/slices/search';

import SearchSeeMore from '../SeeMore';
import PostNotFound from '../notFound/PostNotFound';
import PostSkelton from '../skelton/PostSkelton';

const PostSearch: FC<{ nextPage: () => void }> = ({ nextPage }) => {
  const posts = useSelector(getSearchedSocialPosts);

  const loading = useSelector(getSearchLoading);

  const count = useSelector(getSearchCount);

  return (
    <Stack sx={{ maxWidth: 800, margin: '0 auto!important', borderRadius: 1 }} alignItems="center">
      {posts.length !== 0 && (
        <Masonry columns={1} spacing={2} sx={{ maxWidth: '35rem' }}>
          {posts.map((post, index) => (
            <SocialPost page="search" key={post.id} post={post} />
          ))}
        </Masonry>
      )}

      {posts.length === 0 && loading && (
        <Stack flexWrap="wrap">
          {[...Array(15)].map((i, index) => (
            <Box key={index} sx={{ width: '35rem' }}>
              <PostSkelton key={`post-skelton${index}`} />
            </Box>
          ))}
        </Stack>
      )}

      {posts.length === 0 && !loading && (
        <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
          <PostNotFound />
        </Stack>
      )}

      {posts.length > 0 && count > posts.length && <SearchSeeMore seeMore={() => nextPage()} loading={loading} />}
    </Stack>
  );
};

export default PostSearch;
