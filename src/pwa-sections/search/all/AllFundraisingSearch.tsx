import { FormattedMessage } from 'react-intl';

import { CircularProgress, Stack, Typography } from '@mui/material';

import CustomLink from 'src/components/CustomLink';
import CampignPost from 'src/pwa-sections/post/campaignPost/campaignPostCard/CampignPost';
import { PATH_APP } from 'src/routes/paths';
import { useSelector } from 'src/store';
import { getSearchLoading, getSearchedCampaginPost } from 'src/store/slices/search';

import SearchMessages from '../Search.messages';
import FundrasingNotFound from '../notFound/FundraisingNotFound';

function AllFundrasingSearch() {
  const posts = useSelector(getSearchedCampaginPost);
  const loading = useSelector(getSearchLoading);

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" paddingX={2}>
        <Typography variant="subtitle2" color="text.secondary">
          <FormattedMessage {...SearchMessages.fundraising} />
        </Typography>
        <CustomLink path={PATH_APP.search.fundraising}>
          <Typography variant="button" color="info.main">
            <FormattedMessage {...SearchMessages.seeMore} />
          </Typography>
        </CustomLink>
      </Stack>
      <Stack spacing={2}>
        {posts.slice(0, 2).map((post, index) => (
          <CampignPost key={post.id} post={post} />
        ))}

        {posts.length === 0 && loading && (
          <Stack alignItems="center" justifyContent="center">
            <CircularProgress />
          </Stack>
        )}

        {posts.length === 0 && !loading && (
          <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
            <FundrasingNotFound />
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}

export default AllFundrasingSearch;
