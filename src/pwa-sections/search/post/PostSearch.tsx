import { FC } from 'react';

import { Box, Stack } from '@mui/material';

import SocialPost from 'src/pwa-sections/post/socialPost/socialPostCard/socialPost';
import { useSelector } from 'src/store';
import { getSearchCount, getSearchLoading, getSearchedSocialPosts } from 'src/store/slices/search';

import SearchSeeMore from '../SeeMore';
import { SearchWrapperStyle } from '../SharedStyled';
import PostNotFound from '../notFound/PostNotFound';
import PostSkelton from '../skelton/PostSkelton';

const PostSearch: FC<{ nextPage: () => void }> = ({ nextPage }) => {
  const posts = useSelector(getSearchedSocialPosts);
  const loading = useSelector(getSearchLoading);
  const count = useSelector(getSearchCount);

  return (
    <SearchWrapperStyle spacing={2} sx={{ p: 0 }}>
      {posts.map((post, index) => (
        <SocialPost key={index} post={post} />
      ))}

      {posts.length === 0 && loading && (
        <Stack flexWrap="wrap">
          {[...Array(15)].map((i, index) => (
            <Box key={index} sx={{ width: '30rem' }}>
              <PostSkelton key={`post-skelton${index}`} />
            </Box>
          ))}
        </Stack>
      )}

      {posts.length > 0 && count > posts.length && <SearchSeeMore seeMore={() => nextPage()} loading={loading} />}

      {posts.length === 0 && !loading && (
        <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
          <PostNotFound />
        </Stack>
      )}
    </SearchWrapperStyle>
  );
};

export default PostSearch;
