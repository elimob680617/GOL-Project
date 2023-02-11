import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import DatePicker from 'src/components/DatePicker';
import { Icon } from 'src/components/Icon';
import { useDispatch, useSelector } from 'src/store';
import { userSchoolUpdated, userSchoolsSelector } from 'src/store/slices/profile/userSchool-slice';

import NormalPublicDetailsMessages from '../../NormalPublicDetails.messages';

export default function SchoolYearDialog() {
  const navigate = useNavigate();

  const userHighSchool = useSelector(userSchoolsSelector);
  const dispatch = useDispatch();
  const handleChange = (value: Date) => {
    dispatch(
      userSchoolUpdated({
        year: value.getFullYear(),
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
              <FormattedMessage {...NormalPublicDetailsMessages.classYear} />
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        <Box px={3}>
          <DatePicker
            value={!!userHighSchool?.year ? new Date(userHighSchool.year, 1) : new Date(2022, 1)}
            views={['year']}
            minDate={new Date(1970, 1)}
            onChange={(date: Date) => handleChange(date)}
          />
        </Box>
      </Stack>
    </Dialog>
  );
}
