import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Dialog, Divider, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useRemovePhoneNumberMutation } from 'src/_graphql/profile/contactInfo/mutations/removePhoneNumber.generated';
import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import NormalAndNgoProfileContactInfoMessages from 'src/sections/profile/UserProfileContactInfo.messages';
import { useDispatch } from 'src/store';
import { phoneNumberCleared, userPhoneNumberSelector } from 'src/store/slices/profile/userPhoneNumber-slice';
import sleep from 'src/utils/sleep';

function ConfirmPassword() {
  const router = useNavigate();
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const userPhoneNumber = useSelector(userPhoneNumberSelector);
  const { enqueueSnackbar } = useSnackbar();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [deleteUserPhoneNumber, { isLoading }] = useRemovePhoneNumberMutation();

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
      dispatch(phoneNumberCleared());
      router(PATH_APP.profile.ngo.contactInfo.root);
      enqueueSnackbar(formatMessage(NormalAndNgoProfileContactInfoMessages.deletePhoneSuccessfull), {
        variant: 'success',
      });
      await sleep(1500);
      dispatch(phoneNumberCleared());
    }
    // else {
    //   enqueueSnackbar(resDataDelete.data.deletePhoneNumber?.messagingKey, { variant: 'error' });
    // }
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => router(-1)}>
      <Stack spacing={2} sx={{ py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => router(-1)}>
              <Icon name="left-arrow-1" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.deletePhone} />
            </Typography>
          </Box>
          <IconButton onClick={() => router(-1)}>
            <Icon name="Close-1" />
          </IconButton>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography variant="body2" color="text.primary" sx={{ mt: 4 }}>
              <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.sureToDeletePhone} />
            </Typography>
          </Box>
          <TextField
            placeholder={formatMessage(NormalAndNgoProfileContactInfoMessages.password)}
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
            <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.confirm} />
          </LoadingButton>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default ConfirmPassword;
