import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, OutlinedInput, Stack, Typography, useTheme } from '@mui/material';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useConfirmForgotPasswordMutation } from 'src/_graphql/cognito/mutations/confirmForgetPassword.generated';
import { useForgetPasswordTokenMutation } from 'src/_graphql/cognito/mutations/forgetPasswordToken.generated';
import { Icon } from 'src/components/Icon';
import useAuth from 'src/hooks/useAuth';
import useSecondCountdown from 'src/hooks/useSecondCountdown';
import GeneralMessagess from 'src/language/general.messages';
import { PATH_AUTH } from 'src/routes/paths';
import { dispatch, useSelector } from 'src/store';
import { forgetPasswordUsernameSelector, forgetPasswordVerificationUpdated } from 'src/store/slices/auth';

import ForgetPasswordPwaMessages from './ForgetPasswordPwa.messages';

// ----------------------------------------------------------------------

type FormValuesProps = {
  code1: string;
  code2: string;
  code3: string;
  code4: string;
  code5: string;
};

type ValueNames = 'code1' | 'code2' | 'code3' | 'code4' | 'code5';

const handleDelete = (index: number) => (event: any) => {
  // TODO: add if the key code in number or is Enter do the handleSubmit.
  if (event.keyCode === 46 || event.keyCode === 8) {
    event.currentTarget.parentNode.previousElementSibling?.children[0].focus();
  }
};

const VerifyCodeSchema = Yup.object().shape({
  code1: Yup.string().required('Code is required'),
  code2: Yup.string().required('Code is required'),
  code3: Yup.string().required('Code is required'),
  code4: Yup.string().required('Code is required'),
  code5: Yup.string().required('Code is required'),
});

export default function ConfirmationForgetPassword() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [confirmForgottenPassword] = useConfirmForgotPasswordMutation();
  const [forgottenPasswordUser, { isLoading: isResendCodeLoading }] = useForgetPasswordTokenMutation();
  const { initialize, setToken } = useAuth();
  // const [verifyRegistration] = useVerifyRegistrationMutation();
  // const [reSendCode, { isLoading: isResendCodeLoading }] = useResendRegistrationCodeMutation();

  const {
    isFinished,
    countdown: { minutes, seconds },
    restart,
  } = useSecondCountdown({ init: 120 });

  const { username, usernameType } = useSelector(forgetPasswordUsernameSelector);

  const defaultValues = {
    code1: '',
    code2: '',
    code3: '',
    code4: '',
    code5: '',
  };

  const {
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(VerifyCodeSchema),
    defaultValues,
  });
  const values = watch();

  useEffect(() => {
    document.addEventListener('paste', handlePasteClipboard);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!username) {
      navigate(PATH_AUTH.forgetPassword);
    }
  }, [username, navigate]);

  const onSubmit = async (data: FormValuesProps) => {
    const { code1, code2, code3, code4, code5 } = data;
    const verificationCode = `${code1}${code2}${code3}${code4}${code5}`;

    dispatch(forgetPasswordVerificationUpdated({ verificationCode: verificationCode }));

    const result = await confirmForgottenPassword({
      confirmForgotPasswordDto: { dto: { userName: username, confirmationCode: verificationCode } },
    });
    const token = (result as any)?.data?.confirmForgottenPassword?.listDto?.items[0].token;
    // const refreshToken = (result as any)?.data?.confirmForgottenPassword?.listDto?.items[0].refreshToken;
    setToken(token);
    // setToken(token, refreshToken);
    initialize();
    if ((result as any)?.data?.confirmForgotPassword?.isSuccess) {
      const confirmationCode = (result as any)?.data?.confirmForgotPassword?.listDto?.items[0].message;
      navigate(PATH_AUTH.resetPassword);
      dispatch(forgetPasswordVerificationUpdated({ verificationCode: confirmationCode }));
    }
  };

  const handlePasteClipboard = (event: ClipboardEvent) => {
    event.preventDefault();
    let data: string | string[] = event?.clipboardData?.getData('Text') || '';

    data = data.split('');

    Object.keys(values).forEach((_, index) => {
      const fieldIndex = `code${index + 1}`;
      setValue(fieldIndex as ValueNames, data[index]);
    });
  };

  const handleChangeWithNextField = (
    event: React.ChangeEvent<HTMLInputElement>,
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  ) => {
    const { maxLength, value, name } = event.target;
    const fieldIndex = name.replace('code', '');

    const fieldIntIndex = Number(fieldIndex);

    if (value.length >= maxLength) {
      if (fieldIntIndex < 6) {
        const nextField = document.querySelector(`input[name=code${fieldIntIndex + 1}]`);

        if (nextField !== null) {
          (nextField as HTMLElement).focus();
        }
      }
    }

    handleChange(event);
  };

  const handleResend = async () => {
    try {
      await forgottenPasswordUser({
        ForgotPasswordTokenRequestDto: {
          dto: {
            userName: username,
            emailOrPhoneNumber: usernameType,
          },
        },
      });
      restart();
      // if ((result as any)?.data?.resendUserEmailCode?.isSuccess) {
      //   restart()
      // } else {
      //   console.log('error happened in resend');
      // }
    } catch (error) {
      console.log('err', error);
    }
  };

  const active = values.code1 && values.code2 && values.code3 && values.code4 && values.code5;

  const partialEmail = username.replace(/(\w{3})[\w.-]+@([\w.]+\w)/, '$1*****@$2');

  return (
    <>
      <Typography variant="subtitle2" sx={{ color: 'text.secondary', textAlign: 'center', px: 2 }}>
        <FormattedMessage {...ForgetPasswordPwaMessages.verificationEmailAlertMessage} values={{ partialEmail }} />
      </Typography>
      <Box mt={4}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="row" spacing={2} justifyContent="center">
            {Object.keys(values).map((name, index) => (
              <Controller
                key={name}
                name={`code${index + 1}` as ValueNames}
                control={control}
                render={({ field }) => (
                  <OutlinedInput
                    {...field}
                    onFocus={(e) => {
                      e.target.select();
                    }}
                    type="number"
                    onKeyUp={handleDelete(index)}
                    className="field-code"
                    // eslint-disable-next-line jsx-a11y/no-autofocus
                    autoFocus={index === 0}
                    placeholder="-"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      handleChangeWithNextField(event, field.onChange)
                    }
                    sx={{
                      '& fieldset': {
                        borderTop: 'unset',
                        borderRight: 'unset',
                        borderLeft: 'unset',
                        padding: 0,
                        borderRadius: 'unset',
                        borderBottomWidth: 4,
                        borderBottomStyle: 'solid',
                        borderBottomColor: theme.palette.grey[300],
                      },
                    }}
                    inputProps={{
                      maxLength: 1,
                      sx: {
                        p: 0,
                        textAlign: 'center',
                        width: 40,
                      },
                    }}
                  />
                )}
              />
            ))}
          </Stack>
          <Box sx={{ textAlign: 'center', mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="timer" color="text.secondary" />
            <Typography variant="h5" color="text.secondary" sx={{ ml: 1 }}>
              {minutes} : {seconds}
            </Typography>
          </Box>

          <Box sx={{ px: 2 }}>
            {isFinished ? (
              <LoadingButton
                fullWidth
                size="large"
                type="button"
                variant="contained"
                sx={{ mt: 3 }}
                color="primary"
                onClick={handleResend}
                loading={isResendCodeLoading}
              >
                <FormattedMessage {...ForgetPasswordPwaMessages.resend} />
              </LoadingButton>
            ) : (
              <LoadingButton
                fullWidth
                disabled={!active}
                size="large"
                type="submit"
                variant="contained"
                sx={{ mt: 3 }}
                color="primary"
                loading={isSubmitting}
              >
                <FormattedMessage {...GeneralMessagess.submit} />
              </LoadingButton>
            )}
          </Box>
        </form>
      </Box>
    </>
  );
}
