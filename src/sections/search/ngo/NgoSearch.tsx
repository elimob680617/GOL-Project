import { FC } from 'react';

import { Stack } from '@mui/material';

import { useSelector } from 'src/store';
import { getSearchCount, getSearchLoading, getSearchedNgo } from 'src/store/slices/search';

import SearchSeeMore from '../SeeMore';
import NgoNotFound from '../notFound/NgoNotFound';
import NgoSkelton from '../skelton/NgoSkelton';
import NgoItem from './NgoItem';

const NgoSearch: FC<{ nextPage: () => void }> = ({ nextPage }) => {
  const ngos = useSelector(getSearchedNgo);
  const loading = useSelector(getSearchLoading);
  const count = useSelector(getSearchCount);

  return (
    <>
      {ngos.map((ngo, index) => (
        <NgoItem index={index} key={ngo.id} ngo={ngo} />
      ))}

      {ngos.length === 0 && loading && (
        <>
          {[...Array(15)].map((i) => (
            <NgoSkelton key={`ngo-skelton-${i}`} />
          ))}
        </>
      )}

      {ngos.length === 0 && !loading && (
        <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
          <NgoNotFound />
        </Stack>
      )}

      {ngos.length > 0 && count > ngos.length && <SearchSeeMore seeMore={() => nextPage()} loading={loading} />}
    </>
  );
};

export default NgoSearch;
