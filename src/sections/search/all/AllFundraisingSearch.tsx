import { Stack, Typography } from '@mui/material';

import CustomLink from 'src/components/CustomLink';
import { PATH_APP } from 'src/routes/paths';
import CampignPost from 'src/sections/post/campaignPost/campignPostCard/CampignPost';
import { useSelector } from 'src/store';
import { getSearchLoading, getSearchedCampaginPost } from 'src/store/slices/search';

import { PostWrapperStyle } from '../SharedStyled';
import FundrasingNotFound from '../notFound/FundraisingNotFound';
import FundrasingPostSkelton from '../skelton/FundrasingPostSkelton';

function AllFundrasingSearch() {
  const posts = useSelector(getSearchedCampaginPost);
  const loading = useSelector(getSearchLoading);

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle2" color="text.secondary">
          Fundraising
        </Typography>

        <CustomLink path={PATH_APP.search.fundraising}>
          <Typography variant="button" color="info.main">
            See more
          </Typography>
        </CustomLink>
      </Stack>
      <PostWrapperStyle spacing={2}>
        {posts.map((post) => (
          <CampignPost key={post.id} post={post} />
        ))}

        {posts.length === 0 && loading && (
          <>
            {[...Array(2)].map((i, index) => (
              <FundrasingPostSkelton key={`fundrasing-post-skelton-${index}`} />
            ))}
          </>
        )}

        {posts.length === 0 && !loading && (
          <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
            <FundrasingNotFound />
          </Stack>
        )}
      </PostWrapperStyle>
    </Stack>
  );
}

export default AllFundrasingSearch;
