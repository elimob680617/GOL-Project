import { Stack, Typography } from '@mui/material';

import CustomLink from 'src/components/CustomLink';
import { PATH_APP } from 'src/routes/paths';
import { useSelector } from 'src/store';
import { getSearchLoading, getSearchedHashtags } from 'src/store/slices/search';

import { HorizontalScrollerWithNoScroll, InlineBlockStyle } from '../SharedStyled';
import HashtagItem from '../hashtag/HashtagItem';
import HashtagNotFound from '../notFound/HashtagNotFound';
import HashtagSkelton from '../skelton/HashtagSkelton';

function AllHashtagSearch() {
  const hashtags = useSelector(getSearchedHashtags);
  const loading = useSelector(getSearchLoading);

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle2" color="text.secondary">
          Hashtags
        </Typography>
        <CustomLink path={PATH_APP.search.hashtag}>
          <Typography variant="button" color="info.main">
            See more
          </Typography>
        </CustomLink>
      </Stack>
      <HorizontalScrollerWithNoScroll pb={3}>
        {hashtags.map((hashtag, index) => (
          <InlineBlockStyle key={`all-search-hashtag-${index}`} sx={{ marginRight: 2 }}>
            <HashtagItem name={hashtag?.title || ''} />
          </InlineBlockStyle>
        ))}

        {hashtags.length === 0 && loading && (
          <>
            {[...Array(4)].map((i, index) => (
              <InlineBlockStyle sx={{ marginRight: 2 }} key={`all-search-hashtag-skelton-${index}`}>
                <HashtagSkelton />
              </InlineBlockStyle>
            ))}
          </>
        )}

        {hashtags.length === 0 && !loading && (
          <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
            <HashtagNotFound />
          </Stack>
        )}
      </HorizontalScrollerWithNoScroll>
    </Stack>
  );
}

export default AllHashtagSearch;
