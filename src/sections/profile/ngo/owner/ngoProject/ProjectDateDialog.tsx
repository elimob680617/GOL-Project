import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import DatePicker from 'src/components/DatePicker';
import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { ngoProjectSelector, projectAdded } from 'src/store/slices/profile/ngoProject-slice';

const ProjectDateDialog = () => {
  const location = useLocation();
  const isEndDate = location.pathname.includes('end-date');
  const router = useNavigate();
  const dispatch = useDispatch();
  const projectData = useSelector(ngoProjectSelector);

  useEffect(() => {
    if (!projectData) router(PATH_APP.profile.ngo.project.list);
  }, [projectData, router]);

  const handleChange = (date: Date) => {
    if (!isEndDate)
      dispatch(
        projectAdded({
          startDate: date,
          isChange: true,
        }),
      );
    else
      dispatch(
        projectAdded({
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
        <Typography variant="subtitle1">{!isEndDate ? 'Start Date' : 'End Date'}</Typography>
      </Stack>
      <Divider />

      <Box sx={{ p: 3 }}>
        <DatePicker
          value={
            isEndDate
              ? projectData?.endDate
                ? new Date(projectData?.endDate)
                : new Date()
              : projectData?.startDate
              ? new Date(projectData?.startDate)
              : undefined
          }
          minDate={isEndDate && projectData?.startDate ? new Date(projectData?.startDate) : undefined}
          maxDate={!isEndDate && projectData?.endDate ? new Date(projectData?.endDate) : undefined}
          views={['month', 'year']}
          onChange={handleChange}
        />
      </Box>
    </Dialog>
  );
};

export default ProjectDateDialog;
