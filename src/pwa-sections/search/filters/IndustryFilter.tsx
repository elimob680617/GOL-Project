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

import { useLazySearchGroupCategoriesQuery } from 'src/_graphql/profile/ngoPublicDetails/queries/searchGroupCategories.generated';
import { Icon } from 'src/components/Icon';
import useDebounce from 'src/hooks/useDebounce';
import { IIndustry } from 'src/types/categories';
import { GroupCategoryTypeEnum } from 'src/types/serverTypes';

import SearchMessages from '../Search.messages';

interface IIndustryFilterProps {
  selectedIndustries: IIndustry[];
  industrySelected: (industry: IIndustry) => void;
  industryRemoved: (industry: IIndustry) => void;
}

const IndustryFilter: FC<IIndustryFilterProps> = ({ selectedIndustries, industryRemoved, industrySelected }) => {
  const [searchedValue, setSearchedValue] = useState<string>('');
  const searchedValueDebouncedValue = useDebounce<string>(searchedValue, 500);

  const [getIndustries, { isFetching: gettingIndustryLoading, data: industries }] = useLazySearchGroupCategoriesQuery();

  useEffect(() => {
    if (!searchedValueDebouncedValue) return;
    getIndustries({
      filter: {
        dto: { title: searchedValueDebouncedValue, groupCategoryType: GroupCategoryTypeEnum.Industry },
        pageIndex: 1,
        pageSize: 5,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchedValueDebouncedValue]);

  const checkChecked = (industry: IIndustry) => selectedIndustries.some((i) => i.id === industry.id);

  return (
    <Stack spacing={2}>
      <TextField
        size="small"
        id="industry"
        placeholder="Industry"
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
        {selectedIndustries.map((industry) => (
          <Chip
            key={`selected-industry-${industry.id}`}
            label={industry.title}
            onDelete={() => industryRemoved(industry)}
            deleteIcon={<Icon size={16} name="Close" />}
            sx={{ maxWidth: '100%' }}
          />
        ))}
      </Stack>

      {gettingIndustryLoading && (
        <Stack justifyContent="center" alignItems="center">
          <CircularProgress />
        </Stack>
      )}
      {!gettingIndustryLoading && searchedValueDebouncedValue && (
        <>
          {industries?.searchGroupCategories?.listDto?.items?.map((industry) => (
            <Stack key={industry?.id ?? ''} alignItems="center" direction="row" spacing={1}>
              <Checkbox
                checked={checkChecked(industry!)}
                onChange={() => (checkChecked(industry!) ? industryRemoved(industry!) : industrySelected(industry!))}
              />
              <Avatar sx={{ width: 32, height: 32 }}>{industry?.title?.[0] ?? ''}</Avatar>
              <Tooltip title={industry?.title ?? ''}>
                <Typography noWrap data-text={industry?.title ?? ''} variant="subtitle2" color="text.primary">
                  {industry?.title ?? ''}
                </Typography>
              </Tooltip>
            </Stack>
          ))}
        </>
      )}

      {!searchedValueDebouncedValue && (
        <Stack sx={{ marginTop: '48px!important' }} alignItems="center" justifyContent="center ">
          <Typography variant="body2" color="grey.500">
            <FormattedMessage {...SearchMessages.startTyping} />
          </Typography>
        </Stack>
      )}

      {searchedValueDebouncedValue &&
        !gettingIndustryLoading &&
        industries?.searchGroupCategories?.listDto?.items &&
        industries?.searchGroupCategories?.listDto?.items.length === 0 && (
          <Stack sx={{ marginTop: '48px!important' }} alignItems="center" justifyContent="center ">
            <Typography variant="body2" color="grey.500">
              <FormattedMessage {...SearchMessages.noResult} />
            </Typography>
          </Stack>
        )}
    </Stack>
  );
};

export default IndustryFilter;
