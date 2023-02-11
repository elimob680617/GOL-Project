import { useEffect } from 'react';
// form
import { Controller, useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { formatPhoneNumber } from 'react-phone-number-input';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
// @mui
import { Box, Divider, IconButton, OutlinedInput, Stack, Typography, useTheme } from '@mui/material';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowLeft, Timer1 } from 'iconsax-react';
// next
import { useSnackbar } from 'notistack';
import { useConfirmPhoneNumberMutation } from 'src/_graphql/profile/contactInfo/mutations/confirmPhoneNumber.generated';
import { useResendPhoneCodeMutation } from 'src/_graphql/profile/contactInfo/mutations/resendPhoneCode.generated';
import useSecondCountdown from 'src/hooks/useSecondCountdown';
import NormalAndNgoProfileContactInfoMessages from 'src/pwa-sections/profile/UserProfileContactInfoPwa.messages';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { phoneNumberCleared, userPhoneNumberSelector } from 'src/store/slices/profile/userPhoneNumber-slice';

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

// ----------------------------------------------------------------------

export default function VerifyCodeForm() {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const [sendCode, { isLoading: isResendLoading }] = useResendPhoneCodeMutation();
  const [confirmUserPhoneNumber] = useConfirmPhoneNumberMutation();

  const {
    isFinished,
    countdown: { minutes, seconds },
    restart,
  } = useSecondCountdown({ init: 120 });

  const userPhoneNumber = useSelector(userPhoneNumberSelector);

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
    const resDataAdd: any = await confirmUserPhoneNumber({
      filter: {
        dto: {
          phoneNumber: userPhoneNumber?.phoneNumber,
          verificationCode: `${code1}${code2}${code3}${code4}${code5}`,
        },
      },
    });

    if (resDataAdd.data?.confirmPhoneNumber?.isSuccess) {
      navigate(PATH_APP.profile.ngo.contactInfo.root);
      dispatch(phoneNumberCleared());
      enqueueSnackbar(formatMessage(NormalAndNgoProfileContactInfoMessages.addPhoneSuccessfull), {
        variant: 'success',
      });
    } else {
      enqueueSnackbar(resDataAdd.data?.confirmPhoneNumber?.messagingKey, { variant: 'error' });
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
        const nextfield = document.querySelector(`input[name=code${fieldIntIndex + 1}]`);

        if (nextfield !== null) {
          (nextfield as HTMLElement).focus();
        }
      }
    }

    handleChange(event);
  };

  const handleResend = async () => {
    try {
      const result = await sendCode({ filter: { dto: { phoneNumber: userPhoneNumber?.phoneNumber } } });
      console.log('result', result);

      if ((result as any)?.data?.resendPhoneCode?.isSuccess) {
        restart();
      } else {
        console.log('error happend in resend');
      }
    } catch (error) {
      console.log('err', error);
    }
  };

  const active = values.code1 && values.code2 && values.code3 && values.code4 && values.code5;

  const handleBackRoute = () => {
    dispatch(phoneNumberCleared());
    navigate(PATH_APP.profile.ngo.contactInfo.root);
  };

  return (
    <>
      <Stack>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ py: 3, justifyContent: 'space-between', px: 2, backgroundColor: 'background.paper' }}
        >
          <Typography variant="subtitle1" color="text.primary">
            <IconButton sx={{ p: 0, mr: 2 }} onClick={handleBackRoute}>
              <ArrowLeft />
            </IconButton>
            <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.verifyPhoneNumber} />
          </Typography>
        </Stack>
        <Divider />
        <Box sx={{ p: 4 }}>
          <Stack
            justifyContent="center"
            alignItems="center"
            sx={{ margin: '0 auto', backgroundColor: 'background.paper', maxWidth: '330px', borderRadius: 2 }}
          >
            <Stack>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Typography variant="h4" color="text.primary" sx={{ pt: 3 }}>
                  <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.isItReallyYou} />
                </Typography>
              </Box>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary', textAlign: 'center', px: 2 }}>
                <FormattedMessage
                  {...NormalAndNgoProfileContactInfoMessages.enter5DigitPhone}
                  values={{ phone: formatPhoneNumber(userPhoneNumber?.phoneNumber as string) }}
                />
              </Typography>
            </Stack>

            <Box sx={{ mt: 4, mb: 3 }}>
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
                          id="field-code"
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
                <Box
                  sx={{ textAlign: 'center', mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Timer1 color={theme.palette.text.secondary} />
                  <Typography variant="h5" color="text.secondary" sx={{ ml: 1 }}>
                    {minutes} : {seconds}
                  </Typography>
                </Box>

                <Box>
                  {isFinished ? (
                    <LoadingButton
                      fullWidth
                      size="large"
                      type="button"
                      variant="contained"
                      sx={{ my: 3, px: 2 }}
                      color="primary"
                      onClick={handleResend}
                      loading={isResendLoading}
                    >
                      <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.resend} />
                    </LoadingButton>
                  ) : (
                    <LoadingButton
                      fullWidth
                      disabled={!active}
                      size="large"
                      type="submit"
                      variant="contained"
                      sx={{ my: 3, px: 2 }}
                      color="primary"
                      loading={isSubmitting}
                    >
                      <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.submit} />
                    </LoadingButton>
                  )}
                </Box>
              </form>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </>
  );
}
