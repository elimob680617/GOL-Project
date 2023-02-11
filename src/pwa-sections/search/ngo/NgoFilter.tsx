import { FormattedMessage } from 'react-intl';

import { Button, Stack, Typography } from '@mui/material';

import { useDispatch, useSelector } from 'src/store';
import {
  addIndustry,
  getConfirmSearch,
  getSearchedExpandedFilter,
  getSearchedValues,
  removeIndustry,
  setNgoSize,
  setSearchLocation,
  setSearchedExpandedFilter,
} from 'src/store/slices/search';

import { PwaSearchSubjectsFuncs } from '../PwaSearchSubjects';
import SearchMessages from '../Search.messages';
import { Expanded } from '../SearchFilter';
import { ImageStyle, SearchBadgeStyle, StackStyle } from '../SharedStyled';
import IndustryFilter from '../filters/IndustryFilter';
import LocationFilter from '../filters/LocationFilter';
import NgoSize from '../filters/NgoSize';

export default function NgoFilter() {
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
      case 'Location':
        return (
          <LocationFilter
            locationSelected={(place) => dispatch(setSearchLocation([...searchedValue.locations, place]))}
            locationRemoved={(place) =>
              dispatch(setSearchLocation([...searchedValue.locations.filter((i) => i !== place)]))
            }
            selectedLocations={searchedValue.locations}
          />
        );
      case 'Industry':
        return (
          <IndustryFilter
            selectedIndustries={searchedValue.industries}
            industrySelected={(industry) => dispatch(addIndustry(industry))}
            industryRemoved={(industry) => dispatch(removeIndustry(industry))}
          />
        );
      case 'NGO Size':
        return <NgoSize sizeChanged={(size) => dispatch(setNgoSize(size))} ngoSize={searchedValue.ngoSize} />;

      default:
        return (
          <>
            <StackStyle onClick={() => handleExpandedChange('Location')}>
              <SearchBadgeStyle color="error" variant="dot" invisible={!confirmedSearch.locations.length}>
                <Typography variant="body2" color="text.primary">
                  <FormattedMessage {...SearchMessages.location} />
                </Typography>
              </SearchBadgeStyle>

              <ImageStyle src="/icons/right arrow/grey-arrow.svg" />
            </StackStyle>

            <StackStyle onClick={() => handleExpandedChange('Industry')}>
              <SearchBadgeStyle color="error" variant="dot" invisible={!confirmedSearch.industries.length}>
                <Typography variant="body2" color="text.primary">
                  <FormattedMessage {...SearchMessages.industry} />
                </Typography>
              </SearchBadgeStyle>

              <ImageStyle src="/icons/right arrow/grey-arrow.svg" />
            </StackStyle>

            <StackStyle onClick={() => handleExpandedChange('NGO Size')}>
              <SearchBadgeStyle color="error" variant="dot" invisible={!confirmedSearch.ngoSize.length}>
                <Typography variant="body2" color="text.primary">
                  <FormattedMessage {...SearchMessages.ngoSize} />
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

  return renderFilterOption();
}
