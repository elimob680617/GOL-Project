import { FC } from 'react';

import { Stack } from '@mui/material';

import CampignPost from 'src/pwa-sections/post/campaignPost/campaignPostCard/CampignPost';
import { useSelector } from 'src/store';
import { getSearchCount, getSearchLoading, getSearchedCampaginPost } from 'src/store/slices/search';

import SearchSeeMore from '../SeeMore';
import { SearchWrapperStyle } from '../SharedStyled';
import FundrasingNotFound from '../notFound/FundraisingNotFound';
import FundrasingPostSkelton from '../skelton/FundrasingPostSkelton';

const FundraisingSearch: FC<{ nextPage: () => void }> = ({ nextPage }) => {
  const posts = useSelector(getSearchedCampaginPost);
  const loading = useSelector(getSearchLoading);
  const count = useSelector(getSearchCount);

  return (
    <SearchWrapperStyle spacing={2} sx={{ padding: '0!important', overflowX: 'hidden' }}>
      {posts.map((post, index) => (
        <CampignPost key={index} post={post} />
      ))}

      {posts.length === 0 &&
        loading &&
        [...Array(1)].map((i, index) => <FundrasingPostSkelton key={`campagin-post-${index}`} />)}

      {posts.length === 0 && !loading && (
        <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
          <FundrasingNotFound />
        </Stack>
      )}

      {posts.length > 0 && count > posts.length && <SearchSeeMore seeMore={() => nextPage()} loading={loading} />}
    </SearchWrapperStyle>
  );
};

export default FundraisingSearch;
