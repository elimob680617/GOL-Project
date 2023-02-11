import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import DatePicker from 'src/components/DatePicker';
import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { experienceAdded, userExperienceSelector } from 'src/store/slices/profile/userExperiences-slice';

import ExprienceMessages from './Exprience.messages';

const ExperienceDateDialog = () => {
  const location = useLocation();
  const router = useNavigate();
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const experienceData = useSelector(userExperienceSelector);
  const isEndDate = location.pathname.includes('end-date');

  useEffect(() => {
    if (!experienceData) router(PATH_APP.profile.user.experience.root);
  }, [experienceData, router]);

  const handleChange = (date: Date) => {
    if (!isEndDate)
      dispatch(
        experienceAdded({
          startDate: date,
          isChange: true,
        }),
      );
    else
      dispatch(
        experienceAdded({
          endDate: date,
          isChange: true,
        }),
      );
    router(-1);
  };

  return (
    <Dialog maxWidth="xs" open onClose={() => router(-1)}>
      <Stack sx={{ marginBottom: 2, pt: 3, px: 2 }} direction="row" alignItems="center" spacing={2}>
        <IconButton sx={{ p: 0 }} onClick={() => router(-1)}>
          <Icon name="left-arrow-1" />
        </IconButton>
        <Typography variant="subtitle1">
          {!isEndDate ? formatMessage(ExprienceMessages.startDate) : formatMessage(ExprienceMessages.endDate)}
        </Typography>
      </Stack>
      <Divider />

      <Box sx={{ p: 3 }}>
        <DatePicker
          value={
            isEndDate
              ? experienceData?.endDate
                ? new Date(experienceData?.endDate)
                : new Date()
              : experienceData?.startDate
              ? new Date(experienceData?.startDate)
              : undefined
          }
          minDate={isEndDate && experienceData?.startDate ? new Date(experienceData?.startDate) : undefined}
          maxDate={!isEndDate && experienceData?.endDate ? new Date(experienceData?.endDate) : undefined}
          views={['month', 'year']}
          onChange={handleChange}
        />
      </Box>
    </Dialog>
  );
};

export default ExperienceDateDialog;
