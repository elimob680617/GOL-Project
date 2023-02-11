import { VFC } from 'react';

import { Box, Divider, Stack, Typography } from '@mui/material';

import DatePicker from 'src/components/DatePicker';

interface ProjectDateDialogProps {
  isEndDate?: boolean;
  onChange: (value: Date) => void;
  startDate?: string;
  endDate?: string;
}

const ProjectDate: VFC<ProjectDateDialogProps> = (props) => {
  const { isEndDate = false, onChange, startDate, endDate } = props;

  const handleChange = (date: Date) => {
    onChange(date);
  };

  return (
    <>
      <Stack sx={{ marginBottom: 2, pt: 3, px: 2 }} direction="row" alignItems="center" spacing={2}>
        <Typography variant="subtitle1">{!isEndDate ? 'Start Date' : 'End Date'}</Typography>
      </Stack>
      <Divider />
      <Box sx={{ p: 3 }}>
        <DatePicker
          value={isEndDate ? (endDate ? new Date(endDate) : new Date()) : startDate ? new Date(startDate) : new Date()}
          minDate={isEndDate && startDate ? new Date(startDate) : undefined}
          maxDate={!isEndDate && endDate ? new Date(endDate) : undefined}
          views={['month', 'year']}
          onChange={handleChange}
        />
      </Box>
    </>
  );
};

export default ProjectDate;
