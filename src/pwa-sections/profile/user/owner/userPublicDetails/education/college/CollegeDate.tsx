import { VFC } from 'react';
import { useIntl } from 'react-intl';

import { Box, Divider, Stack, Typography } from '@mui/material';

import DatePicker from 'src/components/DatePicker';

import NormalPublicDetailsMessages from '../../NormalPublicDetailsPwa.messages';

interface CollegeUniversityDateDialogProps {
  isEndDate?: boolean;
  startDate?: Date;
  endDate?: Date;
  onChange: (value: Date) => void;
}

const CollegeDate: VFC<CollegeUniversityDateDialogProps> = (props) => {
  const { isEndDate = false, startDate, onChange, endDate } = props;
  const { formatMessage } = useIntl();

  const handleChange = (value: Date) => {
    onChange(value);
  };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2, justifyContent: 'space-between' }} alignItems="center">
        <Stack direction="row" spacing={2}>
          <Typography variant="subtitle1" color="text.primary">
            {/* Start Date */}
            {!isEndDate
              ? formatMessage(NormalPublicDetailsMessages.startDate)
              : formatMessage(NormalPublicDetailsMessages.endDate)}
          </Typography>
        </Stack>
      </Stack>
      <Divider />
      <Box>
        <DatePicker
          value={isEndDate ? (endDate ? new Date(endDate) : new Date()) : startDate ? new Date(startDate) : undefined}
          minDate={isEndDate && startDate ? new Date(startDate) : undefined}
          maxDate={!isEndDate && endDate ? new Date(endDate) : undefined}
          views={['month', 'year']}
          onChange={handleChange}
        />
      </Box>
    </Stack>
  );
};
export default CollegeDate;
