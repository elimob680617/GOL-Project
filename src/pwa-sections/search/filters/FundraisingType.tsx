import { FC } from 'react';
import { useIntl } from 'react-intl';

import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';

import SearchMessages from '../Search.messages';

interface INgoSortProps {
  fundraisingType: string;
  fundraisingTypeChanged: (type: string) => void;
}

const FundraisingType: FC<INgoSortProps> = ({ fundraisingType, fundraisingTypeChanged }) => {
  const { formatMessage } = useIntl();
  return (
    <FormControl>
      <RadioGroup
        defaultValue={fundraisingType}
        value={fundraisingType}
        onChange={(e) => fundraisingTypeChanged(e.target.value)}
        name="fundraising-type"
      >
        <FormControlLabel
          sx={{ marginBottom: 1 }}
          value="Campaign Post"
          control={<Radio />}
          label={formatMessage({ ...SearchMessages.campaignPost })}
        />
        <FormControlLabel
          value="Update Post"
          control={<Radio />}
          label={formatMessage({ ...SearchMessages.updatePost })}
        />
      </RadioGroup>
    </FormControl>
  );
};

export default FundraisingType;
