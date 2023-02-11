import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Card, OutlinedInput, Stack, Typography, styled, useTheme } from '@mui/material';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Timer1 } from 'iconsax-react';
import { useResendRegistrationCodeMutation } from 'src/_graphql/cognito/mutations/resendRegistrationCode.generated';
import { useVerifyRegistrationMutation } from 'src/_graphql/cognito/mutations/verifyRegistration.generated';
import useAuth from 'src/hooks/useAuth';
import useSecondCountdown from 'src/hooks/useSecondCountdown';
import { PATH_AUTH } from 'src/routes/paths';
import { useSelector } from 'src/store';
import { basicInfoSelector } from 'src/store/slices/auth';

import FormStyleComponent from '../FormStyleComponent';

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
const ContentStyle = styled(Card)(({ theme }) => ({
  maxWidth: 416,
  margin: 'auto',
  padding: theme.spacing(3.4),
}));
export default function VerifyCodeForm() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [verifyRegistration] = useVerifyRegistrationMutation();
  const [reSendCode, { isLoading: isResendCodeLoading }] = useResendRegistrationCodeMutation();

  const { initialize, setToken } = useAuth();

  const {
    isFinished,
    countdown: { minutes, seconds },
    restart,
  } = useSecondCountdown({ init: 120 });

  const { username } = useSelector(basicInfoSelector);

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

  const onSubmit = async (data: FormValuesProps) => {
    const { code1, code2, code3, code4, code5 } = data;
    const verificationCode = `${code1}${code2}${code3}${code4}${code5}`;
    console.log(verificationCode);

    const result = await verifyRegistration({
      verifyRegistrationReqDto: { dto: { userName: username, verificationCode } },
    });

    console.log(result);
    const token = (result as any)?.data?.verifyRegistration?.listDto?.items[0].token;
    // const refreshToken = (result as any)?.data?.verifyRegistration?.listDto?.items[0].refreshToken;
    setToken(token);
    // setToken(token, refreshToken);
    initialize();
    if ((result as any)?.data?.verifyRegistration?.isSuccess) {
      navigate(PATH_AUTH.signUp.successSignUp);
    }
    // if (resDataAdd.data?.confirmUserEmail?.isSuccess) {
    //   router.push('/profile/contact-info');
    //   dispatch(emptyEmail({ audience: AudienceEnum.Public }));
    //   enqueueSnackbar('The Email has been successfully added', { variant: 'success' });
    // }
    // if (!resDataAdd.data?.confirmUserEmail?.isSuccess) {

    //   enqueueSnackbar(resDataAdd.data?.confirmUserEmail?.messagingKey, { variant: 'error' });
    // }
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
      const result = await reSendCode({ resendRegistrationCodeDto: { dto: { userName: username } } });
      console.log('result', result);
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
    <FormStyleComponent title={'Sign Up'}>
      <ContentStyle>
        <Stack alignItems="center">
          <Typography variant="h4" color="text.primary">
            Is it Really you?
          </Typography>
        </Stack>
        <Box mt={3} />
        <>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary', textAlign: 'center', px: 2 }}>
            Enter the 5-digit verification code sent to {partialEmail}
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
                <Timer1 color={theme.palette.text.secondary} />
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
                    Resend
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
                    Submit
                  </LoadingButton>
                )}
              </Box>
            </form>
          </Box>
        </>
      </ContentStyle>
    </FormStyleComponent>
  );
}
