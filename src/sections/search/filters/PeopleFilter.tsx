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

import { useLazyGetPeopleSearchQuery } from 'src/_graphql/search/queries/getPeopleSearch.generated';
import useDebounce from 'src/hooks/useDebounce';
import { ISearchedUser } from 'src/types/user';

interface ICollegeFilterProps {
  selectedPeople: ISearchedUser[];
  peopleSelected: (place: ISearchedUser) => void;
  peopleRemoved: (place: ISearchedUser) => void;
}

const PeopleFilter: FC<ICollegeFilterProps> = ({ selectedPeople, peopleSelected, peopleRemoved }) => {
  const [searchedValue, setSearchedValue] = useState<string>('');
  const searcheDebouncedValue = useDebounce<string>(searchedValue, 500);
  const [getUser, { isFetching: fetchingUser, data: users }] = useLazyGetPeopleSearchQuery();

  useEffect(() => {
    getUser({
      filter: {
        dto: { searchText: searcheDebouncedValue },
        pageIndex: 1,
        pageSize: 5,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searcheDebouncedValue]);

  const checkChecked = (people: ISearchedUser) => selectedPeople.some((i) => i.id === people.id);

  const valuingPeople = (people: any) => {
    const newPeople: ISearchedUser = {
      id: people.id,
      avatarUrl: people.avatarUrl,
      fullName: people.fullName,
      headLine: people.headline,
      userName: people.userName,
    };
    return newPeople;
  };

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
              <img src="/icons/Research/research.svg" width={24} height={24} alt="search" />
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

      {!fetchingUser && (
        <>
          {users?.peopleSearchQueryHandler?.listDto?.items &&
            users!.peopleSearchQueryHandler!.listDto!.items.map((people) => (
              <Stack key={people!.id} alignItems="center" direction="row" spacing={1}>
                <Checkbox
                  checked={checkChecked(valuingPeople(people))}
                  onChange={() =>
                    checkChecked(valuingPeople(people))
                      ? peopleRemoved(valuingPeople(people))
                      : peopleSelected(valuingPeople(people))
                  }
                />
                <Avatar src={people!.avatarUrl! || ''} sx={{ width: 32, height: 32 }}>
                  {!people!.avatarUrl ? people!.fullName![0] : ''}
                </Avatar>
                <Tooltip title={people!.fullName! || ''}>
                  <Typography noWrap data-text={people!.fullName! || ''} variant="subtitle2" color="text.primary">
                    {people!.fullName! || ''}
                  </Typography>
                </Tooltip>
              </Stack>
            ))}
        </>
      )}
    </Stack>
  );
};

export default PeopleFilter;
