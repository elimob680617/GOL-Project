import { FC } from 'react';

import { Stack } from '@mui/material';

import { useSelector } from 'src/store';
import { getSearchCount, getSearchLoading, getSearchedHashtags } from 'src/store/slices/search';

import SearchSeeMore from '../SeeMore';
import HashtagNotFound from '../notFound/HashtagNotFound';
import HashtagSkelton from '../skelton/HashtagSkelton';
import HashtagItem from './HashtagItem';

const HashtagSearch: FC<{ nextPage: () => void }> = ({ nextPage }) => {
  const hashtags = useSelector(getSearchedHashtags);
  const loading = useSelector(getSearchLoading);
  const count = useSelector(getSearchCount);

  return (
    <>
      {hashtags.map((hashtag, index) => (
        <HashtagItem name={hashtag.title! || ''} key={hashtag.id} />
      ))}

      {hashtags.length === 0 && loading && (
        <>
          {[...Array(15)].map((i) => (
            <HashtagSkelton key={`ngo-skelton-${i}`} />
          ))}
        </>
      )}

      {hashtags.length === 0 && !loading && (
        <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
          <HashtagNotFound />
        </Stack>
      )}

      {!loading && count > hashtags.length && <SearchSeeMore seeMore={() => nextPage()} loading={loading} />}
    </>
  );
};

export default HashtagSearch;
