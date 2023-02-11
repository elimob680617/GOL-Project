import { Dispatch, FC, SetStateAction } from 'react';
import { useParams } from 'react-router-dom';

import { FormControl, FormControlLabel, Radio, RadioGroup, Stack, Typography, styled } from '@mui/material';

import { FilterByEnum } from 'src/types/serverTypes';

const FilterRadioStyled = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: 8,
  maxWidth: 264,
}));
const FilterRadio: FC<{
  setPageIndex: React.Dispatch<React.SetStateAction<number>>;
  filterBy: FilterByEnum;
  setFilterBy: Dispatch<SetStateAction<FilterByEnum>>;
}> = ({ setPageIndex, filterBy, setFilterBy }) => {
  const { type } = useParams();

  return (
    <>
      <FilterRadioStyled p={2} spacing={3}>
        <Stack direction="row">
          <Typography variant="subtitle1" color="text.primary" pr={1}>
            Filter by
          </Typography>
        </Stack>
        <Stack spacing={2}>
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              defaultValue="All"
              // value={values}
              onChange={(e) => {
                setFilterBy(e.target.value as FilterByEnum);
                setPageIndex(1);
              }}
            >
              <FormControlLabel
                value={'ALL' as FilterByEnum}
                checked={filterBy === 'ALL'}
                control={<Radio />}
                label={<Typography variant="body2">All</Typography>}
              />
              {type === 'following' && (
                <FormControlLabel
                  value={'HASHTAG' as FilterByEnum}
                  checked={filterBy === 'HASHTAG'}
                  control={<Radio />}
                  label={<Typography variant="body2">Hashtags</Typography>}
                />
              )}
              {type !== 'requested' && (
                <FormControlLabel
                  value={'NGO' as FilterByEnum}
                  control={<Radio />}
                  checked={filterBy === 'NGO'}
                  label={<Typography variant="body2">NGO</Typography>}
                />
              )}
              <FormControlLabel
                value={'NORMAL' as FilterByEnum}
                control={<Radio />}
                checked={filterBy === 'NORMAL'}
                label={<Typography variant="body2">Normal User</Typography>}
              />
            </RadioGroup>
          </FormControl>
        </Stack>
      </FilterRadioStyled>
    </>
  );
};

export default FilterRadio;
