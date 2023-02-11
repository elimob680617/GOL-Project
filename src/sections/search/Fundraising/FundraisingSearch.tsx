import { FC } from 'react';

import { Box, Stack } from '@mui/material';

import CampignPost from 'src/sections/post/campaignPost/campignPostCard/CampignPost';
import { useSelector } from 'src/store';
import { getSearchCount, getSearchLoading, getSearchedCampaginPost } from 'src/store/slices/search';

import SearchSeeMore from '../SeeMore';
import PostNotFound from '../notFound/PostNotFound';
import FundrasingPostSkelton from '../skelton/FundrasingPostSkelton';

const FundraisingSearch: FC<{ nextPage: () => void }> = ({ nextPage }) => {
  const posts = useSelector(getSearchedCampaginPost);
  const loading = useSelector(getSearchLoading);
  const count = useSelector(getSearchCount);

  return (
    <Stack sx={{ maxWidth: 800, margin: '0 auto!important', borderRadius: 1 }} spacing={2} alignItems="center">
      {posts.map((post, index) => (
        <Box key={index} sx={{ maxWidth: '30rem' }}>
          <CampignPost post={post?.campaign} />
        </Box>
      ))}

      {posts.length === 0 && loading && (
        <Stack flexWrap="wrap">
          {[...Array(5)].map((i, index) => (
            <Box key={index} sx={{ width: '30rem' }}>
              <FundrasingPostSkelton key={`campagin-post-${index}`} />
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

export default FundraisingSearch;
