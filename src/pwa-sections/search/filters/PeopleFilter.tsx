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

import { useLazyGetUserQuery } from 'src/_graphql/post/create-post/queries/getUserQuery.generated';
import { Icon } from 'src/components/Icon';
import useDebounce from 'src/hooks/useDebounce';
import { ISearchedUser } from 'src/types/user';

import SearchMessages from '../Search.messages';

interface ICollegeFilterProps {
  selectedPeople: ISearchedUser[];
  peopleSelected: (place: ISearchedUser) => void;
  peopleRemoved: (place: ISearchedUser) => void;
}

const PeopleFilter: FC<ICollegeFilterProps> = ({ selectedPeople, peopleSelected, peopleRemoved }) => {
  const [searchedValue, setSearchedValue] = useState<string>('');
  const searcheDebouncedValue = useDebounce<string>(searchedValue, 500);
  const [getUser, { isFetching: fetchingUser, data: users }] = useLazyGetUserQuery();

  useEffect(() => {
    if (!searcheDebouncedValue) return;
    getUser({
      filter: {
        dto: { searchText: searcheDebouncedValue },
        pageIndex: 0,
        pageSize: 5,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searcheDebouncedValue]);

  const checkChecked = (people: ISearchedUser) => selectedPeople.some((i) => i.id === people.id);

  return (
    <Stack spacing={2}>
      <TextField
        value={searchedValue}
        onChange={(e) => setSearchedValue(e.target.value)}
        size="small"
        id="people"
        placeholder="User Names"
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
        {selectedPeople.map((people) => (
          <Chip
            key={`selected-people-${people.id}`}
            label={people.fullName}
            onDelete={() => peopleRemoved(people)}
            deleteIcon={<img src="/icons/close.svg" width={16} height={16} alt="remove" />}
            sx={{ maxWidth: '100%' }}
          />
        ))}
      </Stack>

      {fetchingUser && (
        <Stack justifyContent="center" alignItems="center">
          <CircularProgress />
        </Stack>
      )}

      {!fetchingUser && searcheDebouncedValue && (
        <>
          {users?.getUserQuery?.listDto?.items?.map((people) => (
            <Stack key={people?.id ?? ''} alignItems="center" direction="row" spacing={1}>
              <Checkbox
                checked={checkChecked(people!)}
                onChange={() => (checkChecked(people!) ? peopleRemoved(people!) : peopleSelected(people!))}
              />
              <Avatar src={people?.avatarUrl || ''} sx={{ width: 32, height: 32 }}>
                {!people?.avatarUrl ? people?.fullName?.[0] : ''}
              </Avatar>
              <Tooltip title={people?.fullName ?? ''}>
                <Typography noWrap data-text={people?.fullName ?? ''} variant="subtitle2" color="text.primary">
                  {people?.fullName ?? ''}
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

      {searcheDebouncedValue && !fetchingUser && users?.getUserQuery?.listDto?.items?.length === 0 && (
        <Stack sx={{ marginTop: '48px!important' }} alignItems="center" justifyContent="center ">
          <Typography variant="body2" color="grey.500">
            <FormattedMessage {...SearchMessages.noResult} />
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};

export default PeopleFilter;
