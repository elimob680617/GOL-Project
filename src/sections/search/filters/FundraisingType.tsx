import { FC } from 'react';

import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';

interface INgoSortProps {
  fundraisingType: string;
  fundraisingTypeChanged: (type: string) => void;
}

const FundraisingType: FC<INgoSortProps> = ({ fundraisingType, fundraisingTypeChanged }) => (
  <FormControl>
    <RadioGroup
      defaultValue={fundraisingType}
      value={fundraisingType}
      onChange={(e) => fundraisingTypeChanged(e.target.value)}
      name="fundraising-type"
    >
      <FormControlLabel sx={{ marginBottom: 1 }} value="Campaign Post" control={<Radio />} label="Campaign Post" />
      <FormControlLabel value="Update Post" control={<Radio />} label="Update Post" />
    </RadioGroup>
  </FormControl>
);

export default FundraisingType;
