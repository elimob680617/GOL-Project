import { FC } from 'react';
import { useIntl } from 'react-intl';

import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';

import SearchMessages from '../Search.messages';

interface ICompanySizeProps {
  companySize: string;
  companySizeChanged: (sort: string) => void;
}

const CompanySize: FC<ICompanySizeProps> = ({ companySize, companySizeChanged }) => {
  const { formatMessage } = useIntl();

  return (
    <FormControl>
      <RadioGroup
        defaultValue={companySize}
        value={companySize}
        onChange={(e) => companySizeChanged(e.target.value)}
        name="company-size"
      >
        <FormControlLabel
          sx={{ marginBottom: 1 }}
          value="Less than 100"
          control={<Radio />}
          label={formatMessage(SearchMessages.lessThan100)}
        />
        <FormControlLabel
          sx={{ marginBottom: 1 }}
          value="100 - 1 K"
          control={<Radio />}
          label={formatMessage(SearchMessages.oneHundredTo1k)}
        />
        <FormControlLabel value="More than 1K" control={<Radio />} label={formatMessage(SearchMessages.moreThan1k)} />
      </RadioGroup>
    </FormControl>
  );
};

export default CompanySize;
