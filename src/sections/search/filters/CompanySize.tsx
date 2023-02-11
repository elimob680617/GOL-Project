import { FC } from 'react';

import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';

interface ICompanySizeProps {
  companySize: string;
  companySizeChanged: (sort: string) => void;
}

const CompanySize: FC<ICompanySizeProps> = ({ companySize, companySizeChanged }) => {
  return (
    <FormControl>
      <RadioGroup
        defaultValue={companySize}
        value={companySize}
        onChange={(e) => companySizeChanged(e.target.value)}
        name="company-size"
      >
        <FormControlLabel sx={{ marginBottom: 1 }} value="Less than 100" control={<Radio />} label="Less than 100" />
        <FormControlLabel sx={{ marginBottom: 1 }} value="100 - 1 K" control={<Radio />} label="100 - 1 K" />
        <FormControlLabel value="More than 1K" control={<Radio />} label="More than 1K" />
      </RadioGroup>
    </FormControl>
  );
};

export default CompanySize;
