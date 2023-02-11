import { FormattedMessage } from 'react-intl';

import { Box, CircularProgress, Stack, Typography } from '@mui/material';

import CustomLink from 'src/components/CustomLink';
import { PATH_APP } from 'src/routes/paths';
import { useSelector } from 'src/store';
import { getSearchLoading, getSearchedPeople } from 'src/store/slices/search';

import SearchMessages from '../../Search.messages';
import { HorizontalScrollerWithScroll } from '../../SharedStyled';
import PeopleNotFound from '../../notFound/PeopleNotFound';
import PeopleItem from './PeopleItem';

function AllPeopleSearch() {
  const peoples = useSelector(getSearchedPeople);
  const loading = useSelector(getSearchLoading);

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle2" color="text.secondary">
          <FormattedMessage {...SearchMessages.people} />
        </Typography>
        <CustomLink path={PATH_APP.search.people}>
          <Typography variant="button" color="info.main">
            <FormattedMessage {...SearchMessages.seeMore} />
          </Typography>
        </CustomLink>
      </Stack>
      <HorizontalScrollerWithScroll
        sx={{
          '& :not(:last-child)': {
            marginRight: '8px',
          },
        }}
      >
        {peoples.map((people, index) => (
          <Box key={people.id} sx={{ width: 152, display: 'inline-block' }}>
            <PeopleItem index={index} people={people} />
          </Box>
        ))}

        {peoples.length === 0 && loading && (
          <Stack alignItems="center" justifyContent="center">
            <CircularProgress />
          </Stack>
        )}

        {peoples.length === 0 && !loading && (
          <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
            <PeopleNotFound />
          </Stack>
        )}
      </HorizontalScrollerWithScroll>
    </Stack>
  );
}

export default AllPeopleSearch;
