import { Link, useNavigate } from 'react-router-dom';

import { Box, Divider, Stack, Typography } from '@mui/material';

import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';

function ConfirmDeletePhoneNumber() {
  const navigate = useNavigate();

  const handleClickDeleteButton = async () => {
    navigate(PATH_APP.profile.user.contactInfo.phoneNumber.confirm);
  };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            Are you sure to delete this Phone Number?
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer' }}>
          <Icon name="trash" color="error.main" />
          <Box>
            <Typography variant="body2" color="error" onClick={() => handleClickDeleteButton()}>
              Delete Phone number
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }}>
          <Icon name="Close-1" color="grey.500" />
          <Link to="/profile/user/phone-number/phone-number-form">
            <Typography variant="body2" color="text.primary">
              Discard
            </Typography>
          </Link>
        </Box>
      </Stack>
    </Stack>
  );
}

export default ConfirmDeletePhoneNumber;
