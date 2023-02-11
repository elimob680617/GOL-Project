import { useIntl } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import DatePicker from 'src/components/DatePicker';
import { Icon } from 'src/components/Icon';
import { useDispatch, useSelector } from 'src/store';
import { userUniversitySelector, userUniversityUpdated } from 'src/store/slices/profile/userUniversity-slice';

import NormalPublicDetailsMessages from '../../NormalPublicDetails.messages';

const UniDateDialog = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isEndDate = location.pathname.includes('end-date');
  const userUniversity = useSelector(userUniversitySelector);
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const handleChange = (value: Date) => {
    if (!isEndDate)
      dispatch(
        userUniversityUpdated({
          // startDate:new Date(value).toISOString()
          startDate: value,
          isChange: true,
        }),
      );
    else
      dispatch(
        userUniversityUpdated({
          // endDate: value.toISOString(),
          endDate: value,
          isChange: true,
        }),
      );
    navigate(-1);
  };

  return (
    <Dialog maxWidth="sm" open={true} keepMounted onClose={() => navigate(-1)}>
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
                ? userUniversity?.endDate
                  ? new Date(userUniversity?.endDate)
                  : new Date()
                : userUniversity?.startDate
                ? new Date(userUniversity?.startDate)
                : undefined
            }
            minDate={isEndDate && userUniversity?.startDate ? new Date(userUniversity?.startDate) : undefined}
            maxDate={!isEndDate && userUniversity?.endDate ? new Date(userUniversity?.endDate) : undefined}
            views={['month', 'year']}
            onChange={handleChange}
          />
        </Box>
      </Stack>
    </Dialog>
  );
};
export default UniDateDialog;
