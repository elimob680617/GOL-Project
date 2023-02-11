import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import DatePicker from 'src/components/DatePicker';
import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import ProfileMainMessage from 'src/sections/profile/components/profileMain.messages';
import { useDispatch, useSelector } from 'src/store';
import { updateMainInfo, userMainInfoSelector } from 'src/store/slices/profile/userMainInfo-slice';

function MainProfileBirthdayDialog() {
  const router = useNavigate();
  const dispatch = useDispatch();
  const userMainInfo = useSelector(userMainInfoSelector);

  useEffect(() => {
    if (!userMainInfo) router(PATH_APP.profile.user.userEdit);
  }, [userMainInfo, router]);

  const handleChange = (date: Date) => {
    dispatch(
      updateMainInfo({
        birthday: date,
      }),
    );
    router(-1);
  };

  return (
    <Dialog maxWidth="xs" open onClose={() => router(-1)}>
      <Stack sx={{ marginBottom: 2, pt: 3, px: 2 }} direction="row" alignItems="center" spacing={2}>
        <IconButton sx={{ p: 0 }} onClick={() => router(-1)}>
          <Icon name="left-arrow" />
        </IconButton>
        <Typography variant="subtitle1">
          <FormattedMessage {...ProfileMainMessage.birthday} />
        </Typography>
      </Stack>
      <Divider />

      <Box sx={{ p: 3 }}>
        <DatePicker
          maxDate={new Date(new Date().getFullYear() - 13, 1, 1)}
          minDate={new Date(new Date().getFullYear() - 89, 1)}
          value={
            userMainInfo?.birthday ? new Date(userMainInfo?.birthday) : new Date(new Date().getFullYear() - 15, 1, 1)
          }
          onChange={handleChange}
        />
      </Box>
    </Dialog>
  );
}

export default MainProfileBirthdayDialog;
