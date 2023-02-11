import { FormattedMessage } from 'react-intl';

import { CircularProgress, Stack, Typography } from '@mui/material';

import CustomLink from 'src/components/CustomLink';
import { PATH_APP } from 'src/routes/paths';
import { useSelector } from 'src/store';
import { getSearchLoading, getSearchedHashtags } from 'src/store/slices/search';

import SearchMessages from '../Search.messages';
import { HorizontalScrollerWithScroll, InlineBlockStyle } from '../SharedStyled';
import HashtagItem from '../hashtag/HashtagItem';
import HashtagNotFound from '../notFound/HashtagNotFound';

function AllHashtagSearch() {
  const hashtags = useSelector(getSearchedHashtags);
  const loading = useSelector(getSearchLoading);

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle2" color="text.secondary">
          <FormattedMessage {...SearchMessages.hashtags} />
        </Typography>
        <CustomLink path={PATH_APP.search.hashtag}>
          <Typography variant="button" color="info.main">
            <FormattedMessage {...SearchMessages.seeMore} />
          </Typography>
        </CustomLink>
      </Stack>
      <HorizontalScrollerWithScroll pb={3}>
        {hashtags.map((hashtag, index) => (
          <InlineBlockStyle key={`all-search-hashtag-${index}`} sx={{ marginRight: 2 }}>
            <HashtagItem title={hashtag.title} />
          </InlineBlockStyle>
        ))}

        {hashtags.length === 0 && loading && (
          <Stack alignItems="center" justifyContent="center">
            <CircularProgress />
          </Stack>
        )}

        {hashtags.length === 0 && !loading && (
          <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
            <HashtagNotFound />
          </Stack>
        )}
      </HorizontalScrollerWithScroll>
    </Stack>
  );
}

export default AllHashtagSearch;
