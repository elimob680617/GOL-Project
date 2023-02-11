import { FormattedMessage } from 'react-intl';

import { Button, Stack, Typography } from '@mui/material';

import { useDispatch, useSelector } from 'src/store';
import {
  addSearchCollege,
  addSearchCompany,
  addSearchUniversity,
  getConfirmSearch,
  getSearchedExpandedFilter,
  getSearchedValues,
  removeSearchCollege,
  removeSearchCompany,
  removeSearchUniversity,
  setSearchLocation,
  setSearchSkill,
  setSearchedExpandedFilter,
} from 'src/store/slices/search';

import { PwaSearchSubjectsFuncs } from '../PwaSearchSubjects';
import SearchMessages from '../Search.messages';
import { Expanded } from '../SearchFilter';
import { ImageStyle, SearchBadgeStyle, StackStyle } from '../SharedStyled';
import CollegeFilter from '../filters/CollegeFilter';
import LocationFilter from '../filters/LocationFilter';
import SkillFilter from '../filters/SkillFilter';
import UniversityFilter from '../filters/UniversityFilter';
import WorkedCompanyFilter from '../filters/WorkedCompanyFilter';

export default function PeopleSidebar() {
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
      case 'Skill':
        return (
          <SkillFilter
            skillRemoved={(skill) => dispatch(setSearchSkill([...searchedValue.skills.filter((i) => i !== skill)]))}
            skillSelected={(skill) => dispatch(setSearchSkill([...searchedValue.skills, skill]))}
            selectedSkills={searchedValue.skills}
          />
        );

      case 'Worked Company':
        return (
          <WorkedCompanyFilter
            companyRemoved={(company) => dispatch(removeSearchCompany(company))}
            companySelected={(company) => dispatch(addSearchCompany(company))}
            selectedWorkedCompanies={searchedValue.companyWorkeds}
          />
        );
      case 'University':
        return (
          <UniversityFilter
            selecedUniversities={searchedValue.universities}
            universityRemoved={(university) => dispatch(removeSearchUniversity(university))}
            universitySelected={(university) => dispatch(addSearchUniversity(university))}
          />
        );

      case 'College':
        return (
          <CollegeFilter
            selectedColleges={searchedValue.colleges}
            collegeRemoved={(college) => dispatch(removeSearchCollege(college))}
            collegeSelected={(college) => dispatch(addSearchCollege(college))}
          />
        );

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
            <StackStyle onClick={() => handleExpandedChange('Skill')}>
              <SearchBadgeStyle color="error" variant="dot" invisible={!confirmedSearch.skills.length}>
                <Typography variant="body2" color="text.primary">
                  <FormattedMessage {...SearchMessages.skill} />
                </Typography>
              </SearchBadgeStyle>
              <ImageStyle src="/icons/right arrow/grey-arrow.svg" />
            </StackStyle>
            <StackStyle onClick={() => handleExpandedChange('Worked Company')}>
              <SearchBadgeStyle color="error" variant="dot" invisible={!confirmedSearch.companyWorkeds.length}>
                <Typography variant="body2" color="text.primary">
                  <FormattedMessage {...SearchMessages.workedCompany} />
                </Typography>
              </SearchBadgeStyle>
              <ImageStyle src="/icons/right arrow/grey-arrow.svg" />
            </StackStyle>
            <StackStyle onClick={() => handleExpandedChange('University')}>
              <SearchBadgeStyle color="error" variant="dot" invisible={!confirmedSearch.universities.length}>
                <Typography variant="body2" color="text.primary">
                  <FormattedMessage {...SearchMessages.university} />
                </Typography>
              </SearchBadgeStyle>
              <ImageStyle src="/icons/right arrow/grey-arrow.svg" />
            </StackStyle>
            <StackStyle onClick={() => handleExpandedChange('College')}>
              <SearchBadgeStyle color="error" variant="dot" invisible={!confirmedSearch.colleges.length}>
                <Typography variant="body2" color="text.primary">
                  <FormattedMessage {...SearchMessages.college} />
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
