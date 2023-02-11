import { FC, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Avatar,
  Checkbox,
  Chip,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

import { useLazyGetPlaceForFilterQuery } from 'src/_graphql/search/filters/queries/getPlaceForFilter.generated';
import { Icon } from 'src/components/Icon';
import useDebounce from 'src/hooks/useDebounce';
import { IPlace } from 'src/types/location';

import SearchMessages from '../Search.messages';

interface ILocationFilterProps {
  selectedLocations: IPlace[];
  locationSelected: (place: IPlace) => void;
  locationRemoved: (place: IPlace) => void;
}

const LocationFilter: FC<ILocationFilterProps> = ({ selectedLocations, locationRemoved, locationSelected }) => {
  const [searchedValue, setSearchedValue] = useState<string>('');
  const searchedPlaceDebouncedValue = useDebounce<string>(searchedValue, 500);

  const [getPlaces, { isFetching: gettingPlaceLoading, data: places }] = useLazyGetPlaceForFilterQuery();

  useEffect(() => {
    if (!searchedPlaceDebouncedValue) return;
    getPlaces({ filter: { dto: { searchText: searchedPlaceDebouncedValue } } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchedPlaceDebouncedValue]);

  const checkChecked = (place: IPlace) => selectedLocations.some((i) => i.id === place.id);

  return (
    <Stack spacing={2}>
      <TextField
        size="small"
        id="location"
        placeholder="Location"
        variant="outlined"
        value={searchedValue}
        onChange={(e) => setSearchedValue(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Icon size={24} name="Research" />
            </InputAdornment>
          ),
        }}
      />

      <Stack spacing={1} gap={1} direction="row" flexWrap="wrap">
        {selectedLocations.map((place) => (
          <Chip
            key={`selected-place-${place.id}`}
            label={place.title}
            onDelete={() => locationRemoved(place)}
            deleteIcon={<Icon size={16} name="Close" />}
            sx={{ maxWidth: '100%' }}
          />
        ))}
      </Stack>

      {gettingPlaceLoading && (
        <Stack justifyContent="center" alignItems="center">
          <CircularProgress />
        </Stack>
      )}
      {!gettingPlaceLoading && places?.placeSearchQueryHandler?.listDto?.items && (
        <>
          {places?.placeSearchQueryHandler?.listDto?.items.map((place) => (
            <Stack key={place?.id ?? ''} alignItems="center" direction="row" spacing={1}>
              <Checkbox
                checked={checkChecked(place!)}
                onChange={() => (checkChecked(place!) ? locationRemoved(place!) : locationSelected(place!))}
              />
              <Avatar sx={{ width: 32, height: 32 }}>{place?.title?.[0] ?? ''}</Avatar>
              <Tooltip title={place?.title ?? ''}>
                <Typography noWrap data-text={place?.title ?? ''} variant="subtitle2" color="text.primary">
                  {place?.title ?? ''}
                </Typography>
              </Tooltip>
            </Stack>
          ))}
        </>
      )}

      {!searchedPlaceDebouncedValue && (
        <Stack sx={{ marginTop: '48px!important' }} alignItems="center" justifyContent="center ">
          <Typography variant="body2" color="grey.500">
            <FormattedMessage {...SearchMessages.startTyping} />
          </Typography>
        </Stack>
      )}

      {searchedPlaceDebouncedValue &&
        !gettingPlaceLoading &&
        places?.placeSearchQueryHandler?.listDto?.items?.length === 0 && (
          <Stack sx={{ marginTop: '48px!important' }} alignItems="center" justifyContent="center ">
            <Typography variant="body2" color="grey.500">
              <FormattedMessage {...SearchMessages.noResult} />
            </Typography>
          </Stack>
        )}
    </Stack>
  );
};

export default LocationFilter;
