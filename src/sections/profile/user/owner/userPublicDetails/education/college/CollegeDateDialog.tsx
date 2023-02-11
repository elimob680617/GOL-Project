import { useIntl } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import DatePicker from 'src/components/DatePicker';
import { Icon } from 'src/components/Icon';
import { useDispatch, useSelector } from 'src/store';
import { userCollegeUpdated, userCollegesSelector } from 'src/store/slices/profile/userColloges-slice';

import NormalPublicDetailsMessages from '../../NormalPublicDetails.messages';

const CollegeDateDialog = () => {
  const location = useLocation();
  const isEndDate = location.pathname.includes('end-date');
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const userColleges = useSelector(userCollegesSelector);
  const dispatch = useDispatch();

  const handleChange = (value: Date) => {
    console.log(value);
    if (!isEndDate)
      dispatch(
        userCollegeUpdated({
          startDate: value,
          isChange: true,
        }),
      );
    else
      dispatch(
        userCollegeUpdated({
          endDate: value.toISOString(),
          isChange: true,
        }),
      );
    navigate(-1);
  };

  return (
    <Dialog maxWidth="sm" open keepMounted onClose={() => navigate(-1)}>
      <Stack spacing={2} sx={{ py: 3, minHeight: 320 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2, justifyContent: 'space-between' }} alignItems="center">
          <Stack direction="row" spacing={2}>
            <IconButton sx={{ p: 0 }} onClick={() => navigate(-1)}>
              <Icon name="left-arrow-1" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              {!isEndDate
                ? formatMessage(NormalPublicDetailsMessages.startDate)
                : formatMessage(NormalPublicDetailsMessages.endDate)}
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        <Box px={3}>
          <DatePicker
            value={
              isEndDate
                ? userColleges?.endDate
                  ? new Date(userColleges?.endDate)
                  : new Date()
                : userColleges?.startDate
                ? new Date(userColleges?.startDate)
                : undefined
            }
            minDate={isEndDate && userColleges?.startDate ? new Date(userColleges?.startDate) : undefined}
            maxDate={!isEndDate && userColleges?.endDate ? new Date(userColleges?.endDate) : undefined}
            views={['month', 'year']}
            onChange={handleChange}
          />
        </Box>
      </Stack>
    </Dialog>
  );
};
export default CollegeDateDialog;
