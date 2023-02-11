import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Card, IconButton, InputAdornment, Stack, Typography, styled } from '@mui/material';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useResetPasswordMutation } from 'src/_graphql/cognito/mutations/resetPassword.generated';
import { Icon } from 'src/components/Icon';
import PasswordStrength from 'src/components/PasswordStrength';
import { PATH_AUTH } from 'src/routes/paths';
import { useSelector } from 'src/store';
import { resetUserPasswordSelector } from 'src/store/slices/auth';

import { FormProvider, RHFTextField } from '../../../components/hook-form';
// import useIsMountedRef from '../../../hooks/useIsMountedRef';
import ForgetPasswordPwaMessages from '../forget-password/ForgetPasswordPwa.messages';
import PwaResetPassFormStyleCompenent from '../forget-password/PwaResetPassFormStyleCompenent';

type FormValuesProps = {
  password: string;
};

const ContentStyle = styled(Card)(({ theme }) => ({
  maxWidth: 360,
  margin: 'auto',
  padding: theme.spacing(3),
}));
// type Props = {
//   onSent: VoidFunction;
//   onGetEmail: (value: string) => void;
// };

// export default function ResetPasswordForm({ onSent, onGetEmail }: Props) {
export default function ResetPasswordForm() {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  // const isMountedRef = useIsMountedRef();
  const [showPassword, setShowPassword] = useState(false);
  const updateUserPassword = useSelector(resetUserPasswordSelector);
  const [restUserPassword] = useResetPasswordMutation();
  const ResetPasswordSchema = Yup.object().shape({
    password: Yup.string().required('Password is required').min(8).max(50),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: { password: '' },
    mode: 'onChange',
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  useEffect(() => {
    if (!updateUserPassword.username) {
      navigate(PATH_AUTH.forgetPassword);
    }
  }, [updateUserPassword.username, navigate]);

  const onSubmit = async (data: FormValuesProps) => {
    try {
      const result = await restUserPassword({
        resetPasswordDto: {
          dto: {
            password: data.password,
            userName: updateUserPassword.username,
            confirmationCode: updateUserPassword.verificationCode,
          },
        },
      });
      if ((result as any)?.data?.resetPassword?.isSuccess) {
        navigate(PATH_AUTH.successResetPassword);
      }
      // await new Promise((resolve) => setTimeout(resolve, 500));
      // if (isMountedRef.current) {
      //   // onSent();
      //   // onGetEmail(data.password);
      // }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <PwaResetPassFormStyleCompenent title="Reset Password">
      <ContentStyle>
        <Stack alignItems="center">
          {/* {!sent ? (
                <> */}
          <Stack spacing={1} alignItems="center" mb={3}>
            <Typography variant="h4" paragraph color="text.primary" sx={{ margin: 0 }}>
              Reset password
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Choose new password.
            </Typography>
          </Stack>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack>
              <RHFTextField
                size="small"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                label={formatMessage(ForgetPasswordPwaMessages.resetPasswordLabel)}
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
              <Box>
                {!!watch('password').length ? <PasswordStrength password={watch('password')} /> : <Box height={18} />}
              </Box>
              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
                disabled={!isValid}
              >
                <FormattedMessage {...ForgetPasswordPwaMessages.continue} />
              </LoadingButton>
            </Stack>
          </FormProvider>
        </Stack>
      </ContentStyle>
    </PwaResetPassFormStyleCompenent>
  );
}
