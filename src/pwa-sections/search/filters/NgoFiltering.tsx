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

import { useLazyGetNgoSearchQuery } from 'src/_graphql/search/queries/getNgoSearch.generated';
import { Icon } from 'src/components/Icon';
import useDebounce from 'src/hooks/useDebounce';
import { ISearchNgoReponse } from 'src/types/user';

import SearchMessages from '../Search.messages';

interface INgoFilteringProps {
  selectedNgos: ISearchNgoReponse[];
  ngoSelected: (place: ISearchNgoReponse) => void;
  ngoRemoved: (place: ISearchNgoReponse) => void;
}

const NgoFiltering: FC<INgoFilteringProps> = ({ ngoRemoved, ngoSelected, selectedNgos }) => {
  const [searchedValue, setSearchedValue] = useState<string>('');
  const searcheDebouncedValue = useDebounce<string>(searchedValue, 500);
  const [getNgo, { isFetching: fetchingLoading, data: ngos }] = useLazyGetNgoSearchQuery();

  useEffect(() => {
    if (!searcheDebouncedValue) return;
    getNgo({
      filter: {
        dto: { searchText: searcheDebouncedValue },
        pageIndex: 1,
        pageSize: 5,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searcheDebouncedValue]);

  const checkChecked = (ngo: ISearchNgoReponse) => selectedNgos.some((i) => i.id === ngo.id);

  return (
    <Stack spacing={2}>
      <TextField
        value={searchedValue}
        onChange={(e) => setSearchedValue(e.target.value)}
        size="small"
        id="ngo"
        placeholder="Ngo Names"
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Icon size={24} name="Research" />
            </InputAdornment>
          ),
        }}
      />
      <Stack spacing={1} gap={1} direction="row" flexWrap="wrap">
        {selectedNgos.map((ngo) => (
          <Chip
            key={`selected-ngo-${ngo.id}`}
            label={ngo.fullName}
            onDelete={() => ngoRemoved(ngo)}
            deleteIcon={<Icon size={16} name="Close" />}
            sx={{ maxWidth: '100%' }}
          />
        ))}
      </Stack>

      {fetchingLoading && (
        <Stack justifyContent="center" alignItems="center">
          <CircularProgress />
        </Stack>
      )}

      {!fetchingLoading && searcheDebouncedValue && ngos?.ngoSearchQueryHandler?.listDto?.items && (
        <>
          {ngos?.ngoSearchQueryHandler?.listDto?.items.map((ngo) => (
            <Stack key={ngo?.id ?? ''} alignItems="center" direction="row" spacing={1}>
              <Checkbox
                checked={checkChecked(ngo!)}
                onChange={() => (checkChecked(ngo!) ? ngoRemoved(ngo!) : ngoSelected(ngo!))}
              />
              <Avatar sx={{ width: 32, height: 32 }}>{ngo?.fullName?.[0] ?? ''}</Avatar>
              <Tooltip title={ngo?.fullName ?? ''}>
                <Typography noWrap data-text={ngo?.fullName ?? ''} variant="subtitle2" color="text.primary">
                  {ngo?.fullName ?? ''}
                </Typography>
              </Tooltip>
            </Stack>
          ))}
        </>
      )}

      {!searcheDebouncedValue && (
        <Stack sx={{ marginTop: '48px!important' }} alignItems="center" justifyContent="center ">
          <Typography variant="body2" color="grey.500">
            <FormattedMessage {...SearchMessages.startTyping} />
          </Typography>
        </Stack>
      )}

      {searcheDebouncedValue && !fetchingLoading && ngos?.ngoSearchQueryHandler?.listDto?.items?.length === 0 && (
        <Stack sx={{ marginTop: '48px!important' }} alignItems="center" justifyContent="center ">
          <Typography variant="body2" color="grey.500">
            <FormattedMessage {...SearchMessages.noResult} />
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};

export default NgoFiltering;
