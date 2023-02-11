import { FC } from 'react';
import { useIntl } from 'react-intl';

import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';

import SearchMessages from '../Search.messages';

interface IPeopleSortProps {
  peopleSort: string;
  sortChanged: (sort: string) => void;
}

const PeopleSort: FC<IPeopleSortProps> = ({ peopleSort, sortChanged }) => {
  const { formatMessage } = useIntl();
  return (
    <FormControl>
      <RadioGroup
        defaultValue={peopleSort}
        value={peopleSort}
        onChange={(e) => sortChanged(e.target.value)}
        name="people-sort"
      >
        <FormControlLabel
          sx={{ marginBottom: 1 }}
          value="by Followings"
          control={<Radio />}
          label={formatMessage({ ...SearchMessages.byFollowings })}
        />
        <FormControlLabel
          value="by Followers"
          control={<Radio />}
          label={formatMessage({ ...SearchMessages.byFollowers })}
        />
      </RadioGroup>
    </FormControl>
  );
};

export default PeopleSort;
