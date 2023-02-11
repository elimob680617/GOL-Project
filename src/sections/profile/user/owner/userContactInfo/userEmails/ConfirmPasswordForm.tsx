import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Dialog, Divider, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useDeleteUserEmailMutation } from 'src/_graphql/profile/contactInfo/mutations/deleteUserEmail.generated';
import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import NormalAndNgoProfileContactInfoMessages from 'src/sections/profile/UserProfileContactInfo.messages';
import { useDispatch, useSelector } from 'src/store';
import { emptyEmail, userEmailsSelector } from 'src/store/slices/profile/contactInfo-slice-eli';
import { AudienceEnum } from 'src/types/serverTypes';

function ConfirmPassword() {
  const [password, setPassword] = useState('');
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [valid] = useState(true);
  const router = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [deleteUserEmail, { isLoading }] = useDeleteUserEmailMutation();
  const personEmail = useSelector(userEmailsSelector);
  const handleDeleteEmail = async () => {
    const resDataDelete: any = await deleteUserEmail({
      filter: {
        dto: {
          id: personEmail?.id,
          password: password,
        },
      },
    });

    if (resDataDelete.data.deleteUserEmail?.isSuccess) {
      router(PATH_APP.profile.user.contactInfo.root);
      dispatch(emptyEmail({ audience: AudienceEnum.Public }));
      enqueueSnackbar(formatMessage(NormalAndNgoProfileContactInfoMessages.emailDeleted), { variant: 'success' });
    }

    if (!resDataDelete.data.deleteUserEmail?.isSuccess) {
      enqueueSnackbar(resDataDelete.data.deleteUserEmail?.messagingKey, { variant: 'error' });
    }
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => router(-1)}>
      <Stack spacing={2} sx={{ py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => router(-1)}>
              <Icon name="left-arrow" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.deleteEmail} />
            </Typography>
          </Box>
          <IconButton onClick={() => router(-1)}>
            <Icon name="Close" />
          </IconButton>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography variant="body2" color="text.primary" sx={{ mt: 4 }}>
              <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.sureToDelete} />
            </Typography>
          </Box>
          <TextField
            placeholder={formatMessage(NormalAndNgoProfileContactInfoMessages.password)}
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
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
            fullWidth
            size="large"
            type="submit"
            color="primary"
            variant="contained"
            loading={isLoading}
            onClick={() => handleDeleteEmail()}
            disabled={password.length ? !valid : valid}
            sx={{ maxHeight: '40px' }}
          >
            <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.confirm} />
          </LoadingButton>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default ConfirmPassword;
