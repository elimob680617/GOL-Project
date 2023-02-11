import { FC } from 'react';
import { useIntl } from 'react-intl';

import { FormControl, FormControlLabel, Radio, RadioGroup, Stack } from '@mui/material';

import { CreationDateEnum } from 'src/types/serverTypes';

import SearchMessages from '../Search.messages';

interface IPeopleSortProps {
  creattionTime: string;
  creationTimeChanged: (sort: string) => void;
}

const CreattionTimeSort: FC<IPeopleSortProps> = ({ creattionTime, creationTimeChanged }) => {
  const { formatMessage } = useIntl();

  return (
    <FormControl>
      <RadioGroup
        defaultValue={creattionTime}
        value={creattionTime}
        onChange={(e) => creationTimeChanged(e.target.value)}
        name="creation-time-sort"
      >
        <Stack spacing={1.5}>
          <FormControlLabel
            sx={{ marginLeft: 0, marginRight: 0 }}
            value={CreationDateEnum.Last_24Hours}
            control={<Radio />}
            label="Last 24 hours"
          />
          <FormControlLabel
            value={CreationDateEnum.LastWeek}
            control={<Radio />}
            label={formatMessage({ ...SearchMessages.lastWeek })}
          />
          <FormControlLabel
            value={CreationDateEnum.LastMonth}
            control={<Radio />}
            label={formatMessage({ ...SearchMessages.lastMonth })}
          />
          <FormControlLabel
            value={CreationDateEnum.Last_6Months}
            control={<Radio />}
            label={formatMessage({ ...SearchMessages.last6Month })}
          />
          <FormControlLabel
            value={CreationDateEnum.LastYear}
            control={<Radio />}
            label={formatMessage({ ...SearchMessages.lastYear })}
          />
        </Stack>
      </RadioGroup>
    </FormControl>
  );
};

export default CreattionTimeSort;
