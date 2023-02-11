import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Divider, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useRemovePhoneNumberMutation } from 'src/_graphql/profile/contactInfo/mutations/removePhoneNumber.generated';
import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import { userPhoneNumberSelector } from 'src/store/slices/profile/userPhoneNumber-slice';

function ConfirmPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [deleteUserPhoneNumber, { isLoading }] = useRemovePhoneNumberMutation();
  const userPhoneNumber = useSelector(userPhoneNumberSelector);

  const handleDeletePhoneNumber = async () => {
    const resDataDelete: any = await deleteUserPhoneNumber({
      filter: {
        dto: {
          id: userPhoneNumber?.id,
          password: password,
        },
      },
    });
    if (resDataDelete.data.deletePhoneNumber?.isSuccess) {
      navigate(PATH_APP.profile.user.contactInfo.root);
      enqueueSnackbar('Phone Number Deleted', { variant: 'error' });
    } else {
      enqueueSnackbar(resDataDelete.data.deletePhoneNumber?.messagingKey, { variant: 'error' });
    }
  };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton sx={{ p: 0 }} onClick={() => navigate(-1)}>
            <Icon name="left-arrow" color="text.primary" />
          </IconButton>
          <Typography variant="subtitle1" color="text.primary">
            Delete Phone Number
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Typography variant="body2" color="text.primary" sx={{ mt: 4 }}>
            Are you sure you want to remove this phone number address? To save this setting, please enter your Garden of
            Love password.
          </Typography>
        </Box>
        <TextField
          placeholder="Password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <Icon name="Eye" /> : <Icon name="Eye-Hidden" />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <LoadingButton
          loading={isLoading}
          color="primary"
          variant="contained"
          onClick={() => handleDeletePhoneNumber()}
        >
          Confirm
        </LoadingButton>
      </Stack>
    </Stack>
  );
}

export default ConfirmPassword;
