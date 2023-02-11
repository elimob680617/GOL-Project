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
import { Icon } from 'src/components/Icon';
import useDebounce from 'src/hooks/useDebounce';
import { ICollege } from 'src/types/education';
import { InstituteType } from 'src/types/serverTypes';

interface IUniversityFilterProps {
  selecedUniversities: ICollege[];
  universitySelected: (place: ICollege) => void;
  universityRemoved: (place: ICollege) => void;
}

const UniversityFilter: FC<IUniversityFilterProps> = ({
  selecedUniversities,
  universityRemoved,
  universitySelected,
}) => {
  const [searchedValue, setSearchedValue] = useState<string>('');
  const searcheDebouncedValue = useDebounce<string>(searchedValue, 500);
  const [getColleges, { isFetching: gettingUniversityLoading, data: universities }] = useLazyGetCollegeForFilterQuery();

  useEffect(() => {
    getColleges({
      filter: {
        dto: { searchText: searcheDebouncedValue, instituteType: InstituteType.University },
        pageIndex: 1,
        pageSize: 5,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searcheDebouncedValue]);

  const checkChecked = (college: ICollege) => selecedUniversities.some((i) => i.id === college.id);
  return (
    <Stack spacing={2}>
      <TextField
        value={searchedValue}
        onChange={(e) => setSearchedValue(e.target.value)}
        size="small"
        id="university"
        placeholder="University Names"
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
        {selecedUniversities.map((university) => (
          <Chip
            key={`selected-university-${university.id}`}
            label={university.title}
            onDelete={() => universityRemoved(university)}
            deleteIcon={<Icon size={16} name="Close" />}
            sx={{ maxWidth: '100%' }}
          />
        ))}
      </Stack>
      {gettingUniversityLoading && (
        <Stack justifyContent="center" alignItems="center">
          <CircularProgress />
        </Stack>
      )}

      {!gettingUniversityLoading && (
        <>
          {universities &&
            universities?.collegeSearchQueryHandler &&
            universities?.collegeSearchQueryHandler?.listDto &&
            universities?.collegeSearchQueryHandler?.listDto?.items &&
            universities?.collegeSearchQueryHandler?.listDto?.items.map((university) => (
              <Stack key={university!.id} alignItems="center" direction="row" spacing={1}>
                <Checkbox
                  checked={checkChecked(university!)}
                  onChange={() =>
                    checkChecked(university!) ? universityRemoved(university!) : universitySelected(university!)
                  }
                />
                <Avatar sx={{ width: 32, height: 32 }}>{university!.title![0] || ''}</Avatar>
                <Tooltip title={university!.title! || ''}>
                  <Typography noWrap data-text={university!.title! || ''} variant="subtitle2" color="text.primary">
                    {university!.title! || ''}
                  </Typography>
                </Tooltip>
              </Stack>
            ))}
        </>
      )}
    </Stack>
  );
};

export default UniversityFilter;
