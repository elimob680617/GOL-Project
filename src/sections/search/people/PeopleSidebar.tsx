import React, { FC, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { Accordion, AccordionDetails, AccordionSummary, Divider, Stack, Typography, styled } from '@mui/material';

import { useDispatch, useSelector } from 'src/store';
import {
  addSearchCollege,
  addSearchCompany,
  addSearchUniversity,
  getSearchedValues,
  removeSearchCollege,
  removeSearchCompany,
  removeSearchUniversity,
  resetSearch,
  setSearchLocation,
  setSearchSkill,
} from 'src/store/slices/search';

import SearchMessages from '../Search.messages';
import { SearchBadgeStyle, SearchSidebarStyled } from '../SharedStyled';
import CollegeFilter from '../filters/CollegeFilter';
import LocationFilter from '../filters/LocationFilter';
import SkillFilter from '../filters/SkillFilter';
import UniversityFilter from '../filters/UniversityFilter';
import WorkedCompanyFilter from '../filters/WorkedCompanyFilter';

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

type Expanded = 'Location' | 'Skill' | 'Worked Company' | 'University' | 'College';

const ClearAllStyle = styled(Typography)(({ theme }) => ({}));

const PeopleSidebar: FC = () => {
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

        <AccordionStyle expanded={expandedFilter === 'Location'} onChange={handleExpandedChange('Location')}>
          <AccordionSummary
            expandIcon={<img src="/icons/arrow/arrow-down.svg" width={24} height={24} alt="expand icon" />}
          >
            <SearchBadgeStyle color="error" variant="dot" invisible={searchedValue.locations.length === 0}>
              <Typography variant="body2" color="text.primary">
                <FormattedMessage {...SearchMessages.location} />
              </Typography>
            </SearchBadgeStyle>
          </AccordionSummary>
          <AccordionDetailsStyle>
            {expandedFilter === 'Location' && <DividerStyle />}
            <LocationFilter
              locationSelected={(place) => dispatch(setSearchLocation([...searchedValue.locations, place]))}
              locationRemoved={(place) =>
                dispatch(setSearchLocation([...searchedValue.locations.filter((i) => i.id !== place.id)]))
              }
              selectedLocations={searchedValue.locations}
            />
            {expandedFilter === 'Location' && <DividerStyle />}
          </AccordionDetailsStyle>
        </AccordionStyle>

        <AccordionStyle expanded={expandedFilter === 'Skill'} onChange={handleExpandedChange('Skill')}>
          <AccordionSummary
            expandIcon={<img src="/icons/arrow/arrow-down.svg" width={24} height={24} alt="expand icon" />}
          >
            <SearchBadgeStyle color="error" variant="dot" invisible={searchedValue.skills.length === 0}>
              <Typography variant="body2" color="text.primary">
                <FormattedMessage {...SearchMessages.skill} />
              </Typography>
            </SearchBadgeStyle>
          </AccordionSummary>
          <AccordionDetailsStyle>
            {expandedFilter === 'Skill' && <DividerStyle />}

            <SkillFilter
              skillRemoved={(skill) => dispatch(setSearchSkill([...searchedValue.skills.filter((i) => i !== skill)]))}
              skillSelected={(skill) => dispatch(setSearchSkill([...searchedValue.skills, skill]))}
              selectedSkills={searchedValue.skills}
            />
            {expandedFilter === 'Skill' && <DividerStyle />}
          </AccordionDetailsStyle>
        </AccordionStyle>

        <AccordionStyle
          expanded={expandedFilter === 'Worked Company'}
          onChange={handleExpandedChange('Worked Company')}
        >
          <AccordionSummary
            expandIcon={<img src="/icons/arrow/arrow-down.svg" width={24} height={24} alt="expand icon" />}
          >
            <SearchBadgeStyle color="error" variant="dot" invisible={searchedValue.companyWorkeds.length === 0}>
              <Typography variant="body2" color="text.primary">
                <FormattedMessage {...SearchMessages.workedCompany} />
              </Typography>
            </SearchBadgeStyle>
          </AccordionSummary>
          <AccordionDetailsStyle>
            {expandedFilter === 'Worked Company' && <DividerStyle />}

            <WorkedCompanyFilter
              companyRemoved={(company) => dispatch(removeSearchCompany(company))}
              companySelected={(company) => dispatch(addSearchCompany(company))}
              selectedWorkedCompanies={searchedValue.companyWorkeds}
            />
            {expandedFilter === 'Worked Company' && <DividerStyle />}
          </AccordionDetailsStyle>
        </AccordionStyle>

        <AccordionStyle expanded={expandedFilter === 'University'} onChange={handleExpandedChange('University')}>
          <AccordionSummary
            expandIcon={<img src="/icons/arrow/arrow-down.svg" width={24} height={24} alt="expand icon" />}
          >
            <SearchBadgeStyle color="error" variant="dot" invisible={searchedValue.universities.length === 0}>
              <Typography variant="body2" color="text.primary">
                <FormattedMessage {...SearchMessages.university} />
              </Typography>
            </SearchBadgeStyle>
          </AccordionSummary>
          <AccordionDetailsStyle>
            {expandedFilter === 'University' && <DividerStyle />}

            <UniversityFilter
              selecedUniversities={searchedValue.universities}
              universityRemoved={(university) => dispatch(removeSearchUniversity(university))}
              universitySelected={(university) => dispatch(addSearchUniversity(university))}
            />
            {expandedFilter === 'University' && <DividerStyle />}
          </AccordionDetailsStyle>
        </AccordionStyle>

        <AccordionStyle expanded={expandedFilter === 'College'} onChange={handleExpandedChange('College')}>
          <AccordionSummary
            expandIcon={<img src="/icons/arrow/arrow-down.svg" width={24} height={24} alt="expand icon" />}
          >
            <SearchBadgeStyle color="error" variant="dot" invisible={searchedValue.colleges.length === 0}>
              <Typography variant="body2" color="text.primary">
                <FormattedMessage {...SearchMessages.college} />
              </Typography>
            </SearchBadgeStyle>
          </AccordionSummary>
          <AccordionDetailsStyle>
            {expandedFilter === 'College' && <DividerStyle />}
            <CollegeFilter
              selectedColleges={searchedValue.colleges}
              collegeRemoved={(college) => dispatch(removeSearchCollege(college))}
              collegeSelected={(college) => dispatch(addSearchCollege(college))}
            />
            {expandedFilter === 'College' && <DividerStyle />}
          </AccordionDetailsStyle>
        </AccordionStyle>
      </SearchSidebarStyled>
    </>
  );
};

export default PeopleSidebar;
