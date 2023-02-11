import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import DatePicker from 'src/components/DatePicker';
import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import UserCertificates from 'src/sections/profile/UserCertificates.messages';
import { useDispatch, useSelector } from 'src/store';
import { certificateUpdated, userCertificateSelector } from 'src/store/slices/profile/userCertificates-slice';

// functions !
function IssueDateDialog() {
  const userCertificate = useSelector(userCertificateSelector);
  const router = useNavigate();
  const dispatch = useDispatch();

  // useEffect for Refreshing
  useEffect(() => {
    if (!userCertificate) router(PATH_APP.profile.user.certificate.root);
  }, [userCertificate, router]);

  const handleChangeDatePicker = (value: Date) => {
    dispatch(
      certificateUpdated({
        issueDate: value,
        isChange: true,
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
          <FormattedMessage {...UserCertificates.issueDate} />
        </Typography>
        {/* FIXME add primary variant to button variants */}
      </Stack>
      <Divider />
      <Box sx={{ p: 3 }}>
        <DatePicker
          maxDate={userCertificate?.expirationDate ? new Date(userCertificate?.expirationDate) : undefined}
          value={!userCertificate?.issueDate ? new Date(2020, 1) : new Date(userCertificate?.issueDate)}
          views={['month', 'year']}
          onChange={(date) => handleChangeDatePicker(date)}
        />
      </Box>
    </Dialog>
  );
}

export default IssueDateDialog;
