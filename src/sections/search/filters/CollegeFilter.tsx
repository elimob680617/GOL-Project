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

import { useLazyGetCollegeForFilterQuery } from 'src/_graphql/search/filters/queries/getCollegeForFilter.generated';
import useDebounce from 'src/hooks/useDebounce';
import { ICollege } from 'src/types/education';
import { InstituteType } from 'src/types/serverTypes';

interface ICollegeFilterProps {
  selectedColleges: ICollege[];
  collegeSelected: (place: ICollege) => void;
  collegeRemoved: (place: ICollege) => void;
}

const CollegeFilter: FC<ICollegeFilterProps> = ({ selectedColleges, collegeRemoved, collegeSelected }) => {
  const [searchedValue, setSearchedValue] = useState<string>('');
  const searcheDebouncedValue = useDebounce<string>(searchedValue, 500);
  const [getColleges, { isFetching: gettingCollegeLoading, data: colleges }] = useLazyGetCollegeForFilterQuery();

  useEffect(() => {
    getColleges({
      filter: {
        dto: { searchText: searcheDebouncedValue, instituteType: InstituteType.College },
        pageIndex: 1,
        pageSize: 5,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searcheDebouncedValue]);

  const checkChecked = (college: ICollege) => selectedColleges.some((i) => i.id === college.id);

  return (
    <Stack spacing={2}>
      <TextField
        value={searchedValue}
        onChange={(e) => setSearchedValue(e.target.value)}
        size="small"
        id="college"
        placeholder="College Names"
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
        {selectedColleges.map((college) => (
          <Chip
            key={`selected-college-${college.id}`}
            label={college.title}
            onDelete={() => collegeRemoved(college)}
            deleteIcon={<img src="/icons/close.svg" width={16} height={16} alt="remove" />}
            sx={{ maxWidth: '100%' }}
          />
        ))}
      </Stack>

      {gettingCollegeLoading && (
        <Stack justifyContent="center" alignItems="center">
          <CircularProgress />
        </Stack>
      )}

      {!gettingCollegeLoading && (
        <>
          {colleges &&
            colleges.collegeSearchQueryHandler &&
            colleges.collegeSearchQueryHandler.listDto &&
            colleges.collegeSearchQueryHandler.listDto.items &&
            colleges.collegeSearchQueryHandler.listDto.items.map((college) => (
              <Stack key={college!.id} alignItems="center" direction="row" spacing={1}>
                <Checkbox
                  checked={checkChecked(college!)}
                  onChange={() => (checkChecked(college!) ? collegeRemoved(college!) : collegeSelected(college!))}
                />
                <Avatar sx={{ width: 32, height: 32 }}>{college!.title![0] || ''}</Avatar>
                <Tooltip title={college!.title! || ''}>
                  <Typography noWrap data-text={college!.title! || ''} variant="subtitle2" color="text.primary">
                    {college!.title! || ''}
                  </Typography>
                </Tooltip>
              </Stack>
            ))}
        </>
      )}
    </Stack>
  );
};

export default CollegeFilter;
