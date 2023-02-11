import { FC } from 'react';

import { Stack } from '@mui/material';

import { useSelector } from 'src/store';
import { getSearchCount, getSearchLoading, getSearchedPeople } from 'src/store/slices/search';

import SearchSeeMore from '../SeeMore';
import { SearchWrapperStyle } from '../SharedStyled';
import PeopleNotFound from '../notFound/PeopleNotFound';
import PeopleSkelton from '../skelton/PeopleSkelton';
import PeopleItem from './PeopleItem';

const PeopleSearch: FC<{ nextPage: () => void }> = ({ nextPage }) => {
  const peoples = useSelector(getSearchedPeople);
  const loading = useSelector(getSearchLoading);
  const count = useSelector(getSearchCount);

  return (
    <SearchWrapperStyle spacing={2}>
      <Stack spacing={2}>
        {peoples.map((people, index) => (
          <PeopleItem index={index} key={people.id} people={people} />
        ))}
      </Stack>

      {peoples.length === 0 && loading && (
        <>
          {[...Array(25)].map((i, index) => (
            <PeopleSkelton key={`people-skelton-${index}`} />
          ))}
        </>
      )}

      {peoples.length === 0 && !loading && (
        <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
          <PeopleNotFound />
        </Stack>
      )}

      {peoples.length > 0 && count > peoples.length && <SearchSeeMore seeMore={() => nextPage()} loading={loading} />}
    </SearchWrapperStyle>
  );
};

export default PeopleSearch;
