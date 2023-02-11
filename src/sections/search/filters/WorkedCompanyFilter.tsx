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

import { useLazyGetCompanyForFilterQuery } from 'src/_graphql/search/filters/queries/getCompanyForFilter.generated';
import { Icon } from 'src/components/Icon';
import useDebounce from 'src/hooks/useDebounce';
import { IExperirnce } from 'src/types/experience';

interface IWorkedCompanyFilterProps {
  selectedWorkedCompanies: IExperirnce[];
  companySelected: (company: IExperirnce) => void;
  companyRemoved: (company: IExperirnce) => void;
}

const WorkedCompanyFilter: FC<IWorkedCompanyFilterProps> = ({
  selectedWorkedCompanies,
  companyRemoved,
  companySelected,
}) => {
  const [searchedValue, setSearchedValue] = useState<string>('');
  const searcheDebouncedValue = useDebounce<string>(searchedValue, 500);
  const [getCompanies, { isFetching: gettingCollegeLoading, data: companies }] = useLazyGetCompanyForFilterQuery();

  useEffect(() => {
    getCompanies({
      filter: {
        dto: { searchText: searcheDebouncedValue },
        pageIndex: 1,
        pageSize: 5,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searcheDebouncedValue]);

  const checkChecked = (company: IExperirnce) => selectedWorkedCompanies.some((i) => i.id === company.id);
  return (
    <Stack spacing={2}>
      <TextField
        value={searchedValue}
        onChange={(e) => setSearchedValue(e.target.value)}
        size="small"
        id="company"
        placeholder="Company Names"
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
        {selectedWorkedCompanies.map((company) => (
          <Chip
            key={`selected-college-${company.id}`}
            label={company.title}
            onDelete={() => companyRemoved(company)}
            deleteIcon={<Icon size={16} name="Close" />}
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
          {companies &&
            companies.companySearchQueryHandler &&
            companies.companySearchQueryHandler.listDto &&
            companies.companySearchQueryHandler.listDto.items &&
            companies.companySearchQueryHandler.listDto.items.map((company) => (
              <Stack key={company!.id} alignItems="center" direction="row" spacing={1}>
                <Checkbox
                  checked={checkChecked(company!)}
                  onChange={() => (checkChecked(company!) ? companyRemoved(company!) : companySelected(company!))}
                />
                <Avatar sx={{ width: 32, height: 32 }}>{company!.title![0] || ''}</Avatar>
                <Tooltip title={company!.title || ''}>
                  <Typography noWrap data-text={company!.title} variant="subtitle2" color="text.primary">
                    {company!.title}
                  </Typography>
                </Tooltip>
              </Stack>
            ))}
        </>
      )}
    </Stack>
  );
};

export default WorkedCompanyFilter;
