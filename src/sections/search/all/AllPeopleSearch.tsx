import { Box, Stack, Typography } from '@mui/material';

import CustomLink from 'src/components/CustomLink';
import { PATH_APP } from 'src/routes/paths';
import { useSelector } from 'src/store';
import { getSearchLoading, getSearchedPeople } from 'src/store/slices/search';

import { HorizontalScrollerWithNoScroll } from '../SharedStyled';
import PeopleNotFound from '../notFound/PeopleNotFound';
import PeopleItem from '../people/PeopleItem';
import PeopleSkelton from '../skelton/PeopleSkelton';

function AllPeopleSearch() {
  const peoples = useSelector(getSearchedPeople);
  const loading = useSelector(getSearchLoading);

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle2" color="text.secondary">
          People
        </Typography>
        <CustomLink path={PATH_APP.search.people}>
          <Typography variant="button" color="info.main">
            See more
          </Typography>
        </CustomLink>
      </Stack>
      <HorizontalScrollerWithNoScroll sx={{ display: 'flex' }} spacing={3}>
        {peoples.map((people, index) => (
          <Box className="item" key={people.id} sx={{ display: 'inline-block' }}>
            <PeopleItem index={index} people={people} />
          </Box>
        ))}

        {peoples.length === 0 && loading && (
          <>
            {[...Array(10)].map((i, index) => (
              <Box className="item" key={`people-skelton-${index}`} sx={{ display: 'inline-block' }}>
                <PeopleSkelton />
              </Box>
            ))}
          </>
        )}

        {peoples.length === 0 && !loading && (
          <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
            <PeopleNotFound />
          </Stack>
        )}
      </HorizontalScrollerWithNoScroll>
    </Stack>
  );
}

export default AllPeopleSearch;
