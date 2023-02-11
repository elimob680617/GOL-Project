import { FormattedMessage } from 'react-intl';

import { Box, CircularProgress, Stack, Typography } from '@mui/material';

import CustomLink from 'src/components/CustomLink';
import { PATH_APP } from 'src/routes/paths';
import { useSelector } from 'src/store';
import { getSearchLoading, getSearchedNgo } from 'src/store/slices/search';

import SearchMessages from '../Search.messages';
import { HorizontalScrollerWithScroll } from '../SharedStyled';
import NgoNotFound from '../notFound/NgoNotFound';
import PeopleItem from './people/PeopleItem';

function AllNgoSearch() {
  const ngos = useSelector(getSearchedNgo);
  const loading = useSelector(getSearchLoading);

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle2" color="text.secondary">
          <FormattedMessage {...SearchMessages.ngos} />
        </Typography>
        <CustomLink path={PATH_APP.search.ngo}>
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
        {ngos.map((ngo, index) => (
          <Box key={ngo.id} sx={{ width: 152, display: 'inline-block' }}>
            <PeopleItem index={index} people={ngo} varient="ngo" />
          </Box>
        ))}

        {ngos.length === 0 && loading && (
          <Stack alignItems="center" justifyContent="center">
            <CircularProgress />
          </Stack>
        )}

        {ngos.length === 0 && !loading && (
          <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
            <NgoNotFound />
          </Stack>
        )}
      </HorizontalScrollerWithScroll>
    </Stack>
  );
}

export default AllNgoSearch;
