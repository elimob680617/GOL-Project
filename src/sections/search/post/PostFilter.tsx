import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { Accordion, AccordionDetails, AccordionSummary, Divider, Stack, Typography, styled } from '@mui/material';

import { useDispatch, useSelector } from 'src/store';
import {
  addSearchPeople,
  getSearchedValues,
  removeSearchPeople,
  resetSearch,
  setSearchSor,
} from 'src/store/slices/search';

import SearchMessages from '../Search.messages';
import { SearchBadgeStyle, SearchSidebarStyled } from '../SharedStyled';
import PeopleFilter from '../filters/PeopleFilter';
import CreattionTimeSort from '../sorts/CreattionTimeSort';

const AccordionStyle = styled(Accordion)(({ theme }) => ({
  boxShadow: 'none!important',
  '& .MuiButtonBase-root': {
    padding: 0,
    minHeight: 'unset!important',
  },
  '& .MuiAccordionSummary-content': {
    margin: `${theme.spacing(0)}!important`,
    minHeight: 'unset',
  },
  '&::before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: `${theme.spacing(3, 0, 0, 0)}!important`,
  },
}));

const AccordionDetailsStyle = styled(AccordionDetails)(({ theme }) => ({
  padding: 0,
}));

const DividerStyle = styled(Divider)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

type Expanded = 'Creation Time' | 'Posted by' | 'Company' | 'Post Type';

const ClearAllStyle = styled(Typography)(({ theme }) => ({}));
export default function PostFilter() {
  const dispatch = useDispatch();
  const [expandedFilter, setExpandedFilter] = useState<Expanded | null>(null);
  const handleExpandedChange = (panel: Expanded) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedFilter(isExpanded ? panel : null);
  };
  const searchedValue = useSelector(getSearchedValues);

  return (
    <>
      <SearchSidebarStyled p={3} spacing={3}>
        <Stack alignItems="center" justifyContent="space-between" direction="row">
          <Typography variant="subtitle1" color="text.primary">
            <FormattedMessage {...SearchMessages.filters} />
          </Typography>
          <ClearAllStyle
            onClick={() => dispatch(resetSearch())}
            variant="button"
            sx={{ color: 'info.main', cursor: 'pointer' }}
          >
            <FormattedMessage {...SearchMessages.clearAll} />
          </ClearAllStyle>
        </Stack>

        <AccordionStyle expanded={expandedFilter === 'Creation Time'} onChange={handleExpandedChange('Creation Time')}>
          <AccordionSummary
            expandIcon={<img src="/icons/arrow/arrow-down.svg" width={24} height={24} alt="expand icon" />}
          >
            <SearchBadgeStyle color="error" variant="dot" invisible={!searchedValue.sortBy}>
              <Typography variant="body2" color="text.primary">
                <FormattedMessage {...SearchMessages.creationTime} />
              </Typography>
            </SearchBadgeStyle>
          </AccordionSummary>
          <AccordionDetailsStyle>
            {expandedFilter === 'Creation Time' && <DividerStyle />}
            <CreattionTimeSort
              creationTimeChanged={(sort) => dispatch(setSearchSor(sort))}
              creattionTime={searchedValue.sortBy}
            />
            {expandedFilter === 'Creation Time' && <DividerStyle />}
          </AccordionDetailsStyle>
        </AccordionStyle>
        <AccordionStyle expanded={expandedFilter === 'Posted by'} onChange={handleExpandedChange('Posted by')}>
          <AccordionSummary
            expandIcon={<img src="/icons/arrow/arrow-down.svg" width={24} height={24} alt="expand icon" />}
          >
            <SearchBadgeStyle color="error" variant="dot" invisible={searchedValue.peoples.length === 0}>
              <Typography variant="body2" color="text.primary">
                <FormattedMessage {...SearchMessages.postedBy} />
              </Typography>
            </SearchBadgeStyle>
          </AccordionSummary>
          <AccordionDetailsStyle>
            {expandedFilter === 'Posted by' && <DividerStyle />}
            <PeopleFilter
              selectedPeople={searchedValue.peoples}
              peopleRemoved={(people) => dispatch(removeSearchPeople(people))}
              peopleSelected={(people) => dispatch(addSearchPeople(people))}
            />
            {expandedFilter === 'Posted by' && <DividerStyle />}
          </AccordionDetailsStyle>
        </AccordionStyle>
      </SearchSidebarStyled>
    </>
  );
}
