import { Box, Stack, Typography } from '@mui/material';

import CustomLink from 'src/components/CustomLink';
import { PATH_APP } from 'src/routes/paths';
import { useSelector } from 'src/store';
import { getSearchLoading, getSearchedNgo } from 'src/store/slices/search';

import { HorizontalScrollerWithNoScroll } from '../SharedStyled';
import NgoNotFound from '../notFound/NgoNotFound';
import PeopleItem from '../people/PeopleItem';
import PeopleSkelton from '../skelton/PeopleSkelton';

function AllNgoSearch() {
  const ngos = useSelector(getSearchedNgo);
  const loading = useSelector(getSearchLoading);

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle2" color="text.secondary">
          NGOs
        </Typography>
        <CustomLink path={PATH_APP.search.ngo}>
          <Typography variant="button" color="info.main">
            See more
          </Typography>
        </CustomLink>
      </Stack>
      <HorizontalScrollerWithNoScroll spacing={3}>
        {ngos.map((people, index) => (
          <Box className="item" key={people.id} sx={{ display: 'inline-block' }}>
            <PeopleItem varient="ngo" index={index} key={people.id} people={people} />
          </Box>
        ))}

        {ngos.length === 0 && loading && (
          <>
            {[...Array(10)].map((i, index) => (
              <Box className="item" key={`people-skelton-${index}`} sx={{ display: 'inline-block' }}>
                <PeopleSkelton />
              </Box>
            ))}
          </>
        )}

        {ngos.length === 0 && !loading && (
          <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
            <NgoNotFound />
          </Stack>
        )}
      </HorizontalScrollerWithNoScroll>
    </Stack>
  );
}

export default AllNgoSearch;
