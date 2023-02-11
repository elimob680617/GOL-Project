import { Controller, useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Card, FormControl, FormControlLabel, RadioGroup, Stack, Typography, styled } from '@mui/material';
import Radio from '@mui/material/Radio';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForgetPasswordTokenMutation } from 'src/_graphql/cognito/mutations/forgetPasswordToken.generated';
import PhoneNumber from 'src/components/PhoneNumber';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { PATH_AUTH } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { forgetPasswordUpdated, forgetPasswordUsernameSelector } from 'src/store/slices/auth';
import { EmailOrPhoneNumberEnum } from 'src/types/serverTypes';

import ForgetPasswordMessages from './ForgetPassword.messages';
import ResetPassFormStyleCompenent from './ResetPassFormStyleCompenent';

type ForgetPasswordFormProps = {
  username: string;
  usernameType: EmailOrPhoneNumberEnum;
  afterSubmit?: string;
};
const ParentPhoneInputStyle = styled(Stack)(({ theme }) => ({
  justifyContent: 'space-between',
  display: 'flex',
  height: 40,
  position: 'relative',
  borderRadius: 8,
  '&:focus-within': {
    // border: ({ isError }) => (isError ? `2px solid ${error.main}` : `2px solid ${primary[900]}`),
  },
}));
const ContentStyle = styled(Card)(({ theme }) => ({
  maxWidth: 416,
  margin: 'auto',
  padding: theme.spacing(4),
}));

export default function ForgetPasswordForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const forgetPasswordUser = useSelector(forgetPasswordUsernameSelector);
  const [forgottenPasswordUser] = useForgetPasswordTokenMutation();
  // const isMountedRef = useIsMountedRef();
  // const phoneRegExp =
  //   /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const ForgetPasswordSchema = Yup.object().shape({
    username: Yup.string().test(
      'validateUsername',
      forgetPasswordUser.usernameType === EmailOrPhoneNumberEnum.Email
        ? formatMessage(ForgetPasswordMessages.validEmailMessage)
        : formatMessage(ForgetPasswordMessages.validPhoneNoMessage),
      // userNameValidationMsg(emailMsg, phoneMsg, usernameType),
      function (value) {
        let emailRegex;
        if (forgetPasswordUser.usernameType === EmailOrPhoneNumberEnum.Email) {
          emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
          const isValidEmail = emailRegex.test(value as string);
          if (!isValidEmail) {
            return false;
          }
        } else {
          const isValidPhone = isValidPhoneNumber(value || '');
          if (!isValidPhone) {
            return false;
          }
        }
        return true;
      },
    ),
  });

  const defaultValues = {
    ...forgetPasswordUser,
  };

  const methods = useForm<ForgetPasswordFormProps>({
    resolver: yupResolver(ForgetPasswordSchema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = methods;

  const handleEmailorPhoneNumber = (value: string) => {
    setValue('username', '');
    setValue('usernameType', value as EmailOrPhoneNumberEnum);
    dispatch(forgetPasswordUpdated({ username: '', usernameType: value as EmailOrPhoneNumberEnum }));
    // setError('username',{message:''})
  };

  const onSubmit = async (data: ForgetPasswordFormProps) => {
    try {
      dispatch(forgetPasswordUpdated({ ...forgetPasswordUser, username: data.username }));
      const result = await forgottenPasswordUser({
        ForgotPasswordTokenRequestDto: {
          dto: {
            userName: data.username,
            emailOrPhoneNumber: data.usernameType,
          },
        },
      });
      if ((result as any)?.data?.forgotPasswordToken?.isSuccess) {
        navigate(PATH_AUTH.confirmForgetPassword);
      }
    } catch (error) {
      // console.error(error);
      // if (isMountedRef.current) {
      //   setError('afterSubmit', error);
      // }
    }
  };

  return (
    <ResetPassFormStyleCompenent title="Forget Password">
      <ContentStyle>
        <Stack alignItems="center" spacing={2}>
          <Typography variant="h4" color="text.primary">
            Forget Password
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" sx={{ textAlign: 'center' }}>
            Recover your password by entering your email address.
          </Typography>
        </Stack>
        <Box mt={3} />
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack my={3} spacing={3}>
            {/* {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>} */}
            <Stack flexDirection="row">
              <FormControl>
                <RadioGroup
                  onChange={(e) => handleEmailorPhoneNumber((e.target as HTMLInputElement).value)}
                  value={forgetPasswordUser.usernameType}
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  defaultValue={EmailOrPhoneNumberEnum.Email}
                >
                  <Stack direction="row">
                    <FormControlLabel
                      value={EmailOrPhoneNumberEnum.Email}
                      control={<Radio />}
                      label={
                        <Typography variant="caption" color="grey.700">
                          <FormattedMessage {...ForgetPasswordMessages.usingEmailMessage} />
                        </Typography>
                      }
                      sx={{ ml: '8px !important', mt: '8px !important' }}
                    />
                    <FormControlLabel
                      value={EmailOrPhoneNumberEnum.PhoneNumber}
                      control={<Radio />}
                      label={
                        <Typography variant="caption" color="grey.700">
                          <FormattedMessage {...ForgetPasswordMessages.usingPhoneNoMessage} />
                        </Typography>
                      }
                      sx={{ ml: '8px !important', mt: '8px !important' }}
                    />
                  </Stack>
                </RadioGroup>
              </FormControl>
            </Stack>
            {/* {userType === UserTypeEnum.Normal && <NormalUserInfoForm />} */}
            {forgetPasswordUser.usernameType === EmailOrPhoneNumberEnum.Email && (
              <RHFTextField
                size="small"
                autoComplete="username"
                name="username"
                placeholder={formatMessage(ForgetPasswordMessages.EmailPlaceholder)}
              />
            )}
            {forgetPasswordUser.usernameType === EmailOrPhoneNumberEnum.PhoneNumber && (
              <ParentPhoneInputStyle>
                <Controller
                  name="username"
                  control={control}
                  render={({ field }) => (
                    <PhoneNumber
                      value={field.value}
                      isError={!!errors.username}
                      placeHolder={formatMessage(ForgetPasswordMessages.PhoneNoPlaceholder)}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  )}
                />
              </ParentPhoneInputStyle>
            )}
          </Stack>
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={!isValid || !getValues()?.username?.length}
          >
            <FormattedMessage {...ForgetPasswordMessages.continue} />
          </LoadingButton>
        </FormProvider>
      </ContentStyle>
    </ResetPassFormStyleCompenent>
  );
}
