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
import { Scalars } from 'src/types/serverTypes';

function ExpirationDateDialog() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userCertificate = useSelector(userCertificateSelector);

  useEffect(() => {
    if (!userCertificate) navigate(PATH_APP.profile.ngo.certificate.root);
  }, [userCertificate, navigate]);

  const handleChangeDatePicker = (value: Scalars['DateTime']) => {
    dispatch(
      certificateUpdated({
        expirationDate: value,
        isChange: true,
      }),
    );
    navigate(-1);
  };

  return (
    <Dialog maxWidth="xs" open onClose={() => navigate(-1)}>
      <Stack sx={{ marginBottom: 2, pt: 3, px: 2 }} direction="row" alignItems="center" spacing={2}>
        <IconButton sx={{ p: 0 }} onClick={() => navigate(-1)}>
          <Icon name="left-arrow-1" />
        </IconButton>
        <Typography variant="subtitle1">
          <FormattedMessage {...UserCertificates.expirationDate} />
        </Typography>
        {/* FIXME add primary variant to button variants */}
      </Stack>
      <Divider />

      <Box sx={{ p: 3 }}>
        <DatePicker
          value={!userCertificate?.expirationDate ? new Date(2020, 1) : new Date(userCertificate?.expirationDate)}
          minDate={userCertificate?.issueDate ? new Date(userCertificate?.issueDate) : undefined}
          views={['month', 'year']}
          onChange={(date) => handleChangeDatePicker(date)}
        />
      </Box>
    </Dialog>
  );
}

export default ExpirationDateDialog;
