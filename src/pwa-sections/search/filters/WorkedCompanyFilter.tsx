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

import { useLazySearchCompaniesQuery } from 'src/_graphql/profile/experiences/queries/searchCompanies.generated';
import { Icon } from 'src/components/Icon';
import useDebounce from 'src/hooks/useDebounce';
import { IExperirnce } from 'src/types/experience';

import SearchMessages from '../Search.messages';

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
  const [getCompanies, { isFetching: gettingCollegeLoading, data: companies }] = useLazySearchCompaniesQuery();

  useEffect(() => {
    if (!searcheDebouncedValue) return;
    getCompanies({
      filter: {
        dto: { title: searcheDebouncedValue },
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

      {!gettingCollegeLoading && searcheDebouncedValue && (
        <>
          {companies?.searchCompanies?.listDto?.items?.map((company) => (
            <Stack key={company?.id} alignItems="center" direction="row" spacing={1}>
              <Checkbox
                checked={checkChecked(company!)}
                onChange={() => (checkChecked(company!) ? companyRemoved(company!) : companySelected(company!))}
              />
              <Avatar src={company?.logoUrl || ''} sx={{ width: 32, height: 32 }}>
                {company?.logoUrl ? '' : company?.title?.[0] ?? ''}
              </Avatar>
              <Tooltip title={company?.title ?? ''}>
                <Typography noWrap data-text={company?.title ?? ''} variant="subtitle2" color="text.primary">
                  {company?.title ?? ''}
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

      {searcheDebouncedValue && !gettingCollegeLoading && companies?.searchCompanies?.listDto?.items?.length === 0 && (
        <Stack sx={{ marginTop: '48px!important' }} alignItems="center" justifyContent="center ">
          <Typography variant="body2" color="grey.500">
            <FormattedMessage {...SearchMessages.noResult} />
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};

export default WorkedCompanyFilter;
