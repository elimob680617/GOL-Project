import { FormattedMessage } from 'react-intl';

import { Button, Stack, Typography } from '@mui/material';

import { useDispatch, useSelector } from 'src/store';
import {
  addSearchPeople,
  getConfirmSearch,
  getSearchedExpandedFilter,
  getSearchedValues,
  removeSearchPeople,
  setSearchSor,
  setSearchedExpandedFilter,
} from 'src/store/slices/search';

import { PwaSearchSubjectsFuncs } from '../PwaSearchSubjects';
import SearchMessages from '../Search.messages';
import { Expanded } from '../SearchFilter';
import { ImageStyle, SearchBadgeStyle, StackStyle } from '../SharedStyled';
import PeopleFilter from '../filters/PeopleFilter';
import CreattionTimeSort from '../sorts/CreattionTimeSort';

export default function PostFilter() {
  const expandedFilter = useSelector(getSearchedExpandedFilter);
  const dispatch = useDispatch();
  const confirmedSearch = useSelector(getConfirmSearch);
  const handleExpandedChange = (panel: Expanded | null) => {
    dispatch(setSearchedExpandedFilter(panel));
  };
  const searchedValue = useSelector(getSearchedValues);
  const applyFilter = () => {
    PwaSearchSubjectsFuncs.filterChanged();
  };
  const renderFilterOption = () => {
    switch (expandedFilter) {
      case 'Creation Time':
        return (
          <CreattionTimeSort
            creationTimeChanged={(sort) => dispatch(setSearchSor(sort))}
            creattionTime={searchedValue.sortBy}
          />
        );
      case 'Posted by':
        return (
          <PeopleFilter
            selectedPeople={searchedValue.peoples}
            peopleRemoved={(people) => dispatch(removeSearchPeople(people))}
            peopleSelected={(people) => dispatch(addSearchPeople(people))}
          />
        );
      default:
        return (
          <>
            <StackStyle onClick={() => handleExpandedChange('Creation Time')}>
              <SearchBadgeStyle color="error" variant="dot" invisible={!confirmedSearch.sortBy}>
                <Typography variant="body2" color="text.primary">
                  <FormattedMessage {...SearchMessages.creationTime} />
                </Typography>
              </SearchBadgeStyle>
              <ImageStyle src="/icons/right arrow/grey-arrow.svg" />
            </StackStyle>
            <StackStyle onClick={() => handleExpandedChange('Posted by')}>
              <SearchBadgeStyle color="error" variant="dot" invisible={!confirmedSearch.peoples.length}>
                <Typography variant="body2" color="text.primary">
                  <FormattedMessage {...SearchMessages.postedBy} />
                </Typography>
              </SearchBadgeStyle>
              <ImageStyle src="/icons/right arrow/grey-arrow.svg" />
            </StackStyle>
            <Stack spacing={2} justifyContent="space-between" direction="row">
              <Button onClick={() => applyFilter()} sx={{ flex: 1 }} variant="primary">
                <FormattedMessage {...SearchMessages.apply} />
              </Button>
            </Stack>
          </>
        );
    }
  };
  return <>{renderFilterOption()}</>;
}
