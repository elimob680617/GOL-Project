import { VFC, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Box, Divider, Stack, Typography } from '@mui/material';

import DatePicker from 'src/components/DatePicker';
import { useSelector } from 'src/store';
import { userExperienceSelector } from 'src/store/slices/profile/userExperiences-slice';

import ExprienceMessages from './ExpriencePwa.messages';

interface ExperienceDateDialogProps {
  isEndDate?: boolean;
  onChange: (value: Date) => void;
  startDate?: string;
  endDate?: string;
}

const ExperienceDate: VFC<ExperienceDateDialogProps> = (props) => {
  const { isEndDate = false, onChange, startDate, endDate } = props;
  const navigate = useNavigate();
  const experienceData = useSelector(userExperienceSelector);
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (!experienceData) navigate('/profile/user/experience/list');
  }, [experienceData, navigate]);

  const handleChange = (date: Date) => {
    onChange(date);
  };

  return (
    <>
      <Stack sx={{ marginBottom: 2, pt: 3, px: 2 }} direction="row" alignItems="center" spacing={2}>
        <Typography variant="subtitle1">
          {!isEndDate ? formatMessage(ExprienceMessages.startDate) : formatMessage(ExprienceMessages.endDate)}
        </Typography>
      </Stack>
      <Divider />
      <Box sx={{ p: 3 }}>
        <DatePicker
          value={isEndDate ? (endDate ? new Date(endDate) : new Date()) : startDate ? new Date(startDate) : undefined}
          minDate={isEndDate && startDate ? new Date(startDate) : undefined}
          maxDate={!isEndDate && endDate ? new Date(endDate) : undefined}
          views={['month', 'year']}
          onChange={handleChange}
        />
      </Box>
    </>
  );
};

export default ExperienceDate;
