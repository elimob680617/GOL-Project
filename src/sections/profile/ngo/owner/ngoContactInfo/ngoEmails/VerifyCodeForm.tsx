import { useEffect } from 'react';
// form
import { Controller, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
// next
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
// @mui
import { Box, Dialog, Divider, IconButton, OutlinedInput, Stack, Typography } from '@mui/material';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
// routes
import { useSnackbar } from 'notistack';
import { useConfirmUserEmailMutation } from 'src/_graphql/profile/contactInfo/mutations/confirmUserEmail.generated';
import { useResendUserEmailCodeMutation } from 'src/_graphql/profile/contactInfo/mutations/resendUserEmailCode.generated';
import { Icon } from 'src/components/Icon';
import useSecondCountdown from 'src/hooks/useSecondCountdown';
import { PATH_APP } from 'src/routes/paths';
import NormalAndNgoProfileContactInfoMessages from 'src/sections/profile/UserProfileContactInfo.messages';
import { useDispatch, useSelector } from 'src/store';
import { emptyEmail, userEmailsSelector } from 'src/store/slices/profile/contactInfo-slice-eli';
import { AudienceEnum } from 'src/types/serverTypes';

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

export default function VerifyCodeForm() {
  const router = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [sendCode, { isLoading: isResendLoading }] = useResendUserEmailCodeMutation();
  const [confirmUserEmail] = useConfirmUserEmailMutation();

  const {
    isFinished,
    countdown: { minutes, seconds },
    restart,
  } = useSecondCountdown({ init: 120 });

  const personEmail = useSelector(userEmailsSelector);

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
    const resDataAdd: any = await confirmUserEmail({
      filter: {
        dto: {
          email: personEmail?.email,
          verificationCode: `${code1}${code2}${code3}${code4}${code5}`,
        },
      },
    });

    if (resDataAdd.data?.confirmUserEmail?.isSuccess) {
      router(PATH_APP.profile.ngo.contactInfo.root);
      dispatch(emptyEmail({ audience: AudienceEnum.Public }));
      enqueueSnackbar('The Email has been successfully added', { variant: 'success' });
    }
    if (!resDataAdd.data?.confirmUserEmail?.isSuccess) {
      enqueueSnackbar(resDataAdd.data?.confirmUserEmail?.messagingKey, { variant: 'error' });
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
      const result = await sendCode({ filter: { dto: { email: personEmail?.email } } });
      console.log('result', result);

      if ((result as any)?.data?.resendUserEmailCode?.isSuccess) {
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
    dispatch(emptyEmail({ audience: AudienceEnum.Public }));
    router(PATH_APP.profile.ngo.contactInfo.root);
  };

  return (
    <>
      <Dialog fullWidth={true} open={true} keepMounted sx={{ minWidth: 600 }} onClose={handleBackRoute}>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ justifyContent: 'space-between', px: 2, pt: 3, pb: 2 }}
        >
          <IconButton sx={{ p: 0, mr: 2 }} onClick={handleBackRoute}>
            <Icon name="left-arrow-1" />
          </IconButton>
          <IconButton onClick={handleBackRoute}>
            <Icon name="Close-1" />
          </IconButton>
        </Stack>
        <Divider />
        <Stack justifyContent="center" alignItems="center" sx={{ maxWidth: '300px', m: '0 auto' }}>
          <Stack>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Typography variant="h4" color="text.primary" sx={{ pt: 3 }}>
                <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.isItReallyYou} />
              </Typography>
            </Box>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', textAlign: 'center', px: 2 }}>
              <FormattedMessage
                {...NormalAndNgoProfileContactInfoMessages.enter5Digit}
                values={{ email: personEmail?.email }}
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
              <Box sx={{ textAlign: 'center', mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="timer" color="text.secondary" />
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
      </Dialog>
    </>
  );
}
