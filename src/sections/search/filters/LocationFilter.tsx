import { FC, useEffect, useState } from 'react';

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

import { useLazySearchPlacesQuery } from 'src/_graphql/locality/queries/searchPlaces.generated';
import useDebounce from 'src/hooks/useDebounce';
import { IPlace } from 'src/types/location';

interface ILocationFilterProps {
  selectedLocations: IPlace[];
  locationSelected: (place: IPlace) => void;
  locationRemoved: (place: IPlace) => void;
}

const LocationFilter: FC<ILocationFilterProps> = ({ selectedLocations, locationRemoved, locationSelected }) => {
  const [searchedValue, setSearchedValue] = useState<string>('');
  const searchedPlaceDebouncedValue = useDebounce<string>(searchedValue, 500);

  const [getPlaces, { isFetching: gettingPlaceLoading, data: places }] = useLazySearchPlacesQuery();

  useEffect(() => {
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
              <img src="/icons/Research/research.svg" width={24} height={24} alt="search" />
            </InputAdornment>
          ),
        }}
      />

      <Stack spacing={1} gap={1} direction="row" flexWrap="wrap">
        {selectedLocations.map((place) => (
          <Tooltip key={`selected-place-${place.id}`} title={place.title || ''}>
            <Chip
              label={place.title}
              onDelete={() => locationRemoved(place)}
              deleteIcon={<img src="/icons/close.svg" width={16} height={16} alt="remove" />}
              sx={{ maxWidth: '100%' }}
            />
          </Tooltip>
        ))}
      </Stack>

      {gettingPlaceLoading && (
        <Stack justifyContent="center" alignItems="center">
          <CircularProgress />
        </Stack>
      )}
      {!gettingPlaceLoading && places?.searchPlaces?.listDto?.items && (
        <>
          {places!.searchPlaces!.listDto!.items![0]!.predictions!.map((place) => (
            <Stack key={place?.placeId} alignItems="center" direction="row" spacing={1}>
              <Checkbox
                checked={checkChecked({ id: place?.placeId, title: place?.description })}
                onChange={() =>
                  checkChecked({ id: place?.placeId, title: place?.description })
                    ? locationRemoved({ id: place?.placeId, title: place?.description })
                    : locationSelected({ id: place?.placeId, title: place?.description })
                }
              />
              <Avatar sx={{ width: 32, height: 32 }}>{place?.structuredFormatting?.mainText?.[0]}</Avatar>
              <Stack sx={{ flex: 1, overflow: 'hidden' }} spacing={0.5}>
                <Tooltip title={place?.structuredFormatting?.mainText || ''}>
                  <Typography
                    noWrap
                    data-text={place?.structuredFormatting?.mainText}
                    variant="subtitle2"
                    color="text.primary"
                  >
                    {place?.structuredFormatting?.mainText}
                  </Typography>
                </Tooltip>
                <Tooltip title={place?.description || ''}>
                  <Typography noWrap data-text={place?.description} variant="subtitle2" color="text.secondary">
                    {place?.description}
                  </Typography>
                </Tooltip>
              </Stack>
            </Stack>
          ))}
        </>
      )}
    </Stack>
  );
};

export default LocationFilter;
