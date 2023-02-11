import { FormattedMessage } from 'react-intl';

import { Button, Stack, Typography } from '@mui/material';

import { useDispatch, useSelector } from 'src/store';
import {
  addFundraisingCategory,
  getConfirmSearch,
  getSearchedExpandedFilter,
  getSearchedValues,
  removeFundraisingCategory,
  setSearchLocation,
  setSearchNgoFilter,
  setSearchSor,
  setSearchedExpandedFilter,
} from 'src/store/slices/search';

import { PwaSearchSubjectsFuncs } from '../PwaSearchSubjects';
import SearchMessages from '../Search.messages';
import { Expanded } from '../SearchFilter';
import { ImageStyle, SearchBadgeStyle, StackStyle } from '../SharedStyled';
import FundraisingCategoryFilter from '../filters/FundraisingCategory';
import LocationFilter from '../filters/LocationFilter';
import NgoFiltering from '../filters/NgoFiltering';
import CreattionTimeSort from '../sorts/CreattionTimeSort';

export default function FundraisingFilter() {
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
      case 'Creation Date':
        return (
          <CreattionTimeSort
            creattionTime={searchedValue.sortBy}
            creationTimeChanged={(sort) => dispatch(setSearchSor(sort))}
          />
        );
      case 'Category':
        return (
          <FundraisingCategoryFilter
            selectedCategories={searchedValue.fundraisingCategory}
            categoryRemoved={(category) => dispatch(removeFundraisingCategory(category))}
            categorySelected={(category) => dispatch(addFundraisingCategory(category))}
          />
        );

      case 'Location':
        return (
          <LocationFilter
            selectedLocations={searchedValue.locations}
            locationSelected={(place) => dispatch(setSearchLocation([...searchedValue.locations, place]))}
            locationRemoved={(place) =>
              dispatch(setSearchLocation([...searchedValue.locations.filter((i) => i !== place)]))
            }
          />
        );
      case 'NGO':
        return (
          <NgoFiltering
            selectedNgos={searchedValue.ngos}
            ngoSelected={(ngo) => dispatch(setSearchNgoFilter([...searchedValue.ngos, ngo]))}
            ngoRemoved={(ngo) => dispatch(setSearchNgoFilter([...searchedValue.ngos.filter((i) => i.id !== ngo.id)]))}
          />
        );
      default:
        return (
          <>
            <StackStyle onClick={() => handleExpandedChange('Creation Date')}>
              <SearchBadgeStyle color="error" variant="dot" invisible={!confirmedSearch.sortBy}>
                <Typography variant="body2" color="text.primary">
                  <FormattedMessage {...SearchMessages.creationTime} />
                </Typography>
              </SearchBadgeStyle>

              <ImageStyle src="/icons/right arrow/grey-arrow.svg" />
            </StackStyle>

            <StackStyle onClick={() => handleExpandedChange('Category')}>
              <SearchBadgeStyle
                color="error"
                variant="dot"
                invisible={confirmedSearch.fundraisingCategory.length === 0}
              >
                <Typography variant="body2" color="text.primary">
                  <FormattedMessage {...SearchMessages.category} />
                </Typography>
              </SearchBadgeStyle>
              <ImageStyle src="/icons/right arrow/grey-arrow.svg" />
            </StackStyle>

            <StackStyle onClick={() => handleExpandedChange('Location')}>
              <SearchBadgeStyle color="error" variant="dot" invisible={confirmedSearch.locations.length === 0}>
                <Typography variant="body2" color="text.primary">
                  <FormattedMessage {...SearchMessages.location} />
                </Typography>
              </SearchBadgeStyle>
              <ImageStyle src="/icons/right arrow/grey-arrow.svg" />
            </StackStyle>

            <StackStyle onClick={() => handleExpandedChange('NGO')}>
              <SearchBadgeStyle color="error" variant="dot" invisible={confirmedSearch.ngos.length === 0}>
                <Typography variant="body2" color="text.primary">
                  <FormattedMessage {...SearchMessages.ngos} />
                </Typography>
              </SearchBadgeStyle>
              <ImageStyle src="/icons/right arrow/grey-arrow.svg" />
            </StackStyle>

            <Stack spacing={2} justifyContent="space-between" direction="row">
              {/* <Button sx={{ flex: 1 }} variant="secondary">
                Clear
              </Button> */}
              <Button onClick={() => applyFilter()} sx={{ flex: 1 }} variant="primary">
                <FormattedMessage {...SearchMessages.apply} />
              </Button>
            </Stack>
          </>
        );
    }
  };

  return renderFilterOption();
}
