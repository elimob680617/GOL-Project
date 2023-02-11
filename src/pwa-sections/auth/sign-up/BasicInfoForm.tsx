import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { Link, useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  Card,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  Stack,
  Typography,
  styled,
} from '@mui/material';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Eye, EyeSlash } from 'iconsax-react';
import { useExistUserMutation } from 'src/_graphql/cognito/mutations/existUser.generated';
import PasswordStrength from 'src/components/PasswordStrength';
import PhoneNumber from 'src/components/PhoneNumber';
import { useDispatch, useSelector } from 'src/store';
import {
  basicInfoSelector,
  signUpBy,
  signUpBySelector,
  signUpUserTypeSelector,
  updateSignUpBasicInfo,
} from 'src/store/slices/auth';
import { EmailOrPhoneNumberEnum, UserTypeEnum } from 'src/types/serverTypes';

import { FormProvider, RHFTextField } from '../../../components/hook-form';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import { PATH_AUTH } from '../../../routes/paths';
import PwaFormStyleComponent from '../PwaFormStyleComponent';

type BasicInfoFormProps = {
  username: string;
  password: string;
  afterSubmit?: string;
};
const ContentStyle = styled(Card)(({ theme }) => ({
  margin: 'auto',
  padding: theme.spacing(3.4),
}));
const JoinSectionStyle = styled(Stack)(({ theme }) => ({
  marginTop: theme.spacing(3),
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.spacing(1),
}));
const LoginSectionStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(1, 0),
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.spacing(1),
}));

export default function BaseInfoForm() {
  const isMountedRef = useIsMountedRef();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userSignUpBy = useSelector(signUpBySelector);
  const userType = useSelector(signUpUserTypeSelector) as UserTypeEnum;
  const { username: _username, password: _password } = useSelector(basicInfoSelector);
  const [checkUserExists] = useExistUserMutation();
  // const signUpType = useSelector(signUpTypeSelector);

  const handleSignUpBy = () => {
    dispatch(signUpBy({ signUpBy: userSignUpBy === 'email' ? 'phoneNumber' : 'email' }));
  };

  const SignUpSchema = Yup.object().shape({
    username: Yup.string().test(
      'validateUsername',
      userSignUpBy === 'email' ? 'Please use a valid email address.' : 'Please use a valid phone number address.',
      function (value) {
        let emailRegex;
        // let phoneRegex
        if (userSignUpBy === 'email') {
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
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    username: _username,
    password: _password,
  };

  const methods = useForm<BasicInfoFormProps>({
    resolver: yupResolver(SignUpSchema),
    defaultValues,
    mode: 'onBlur',
  });

  const {
    setValue,
    setError,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting, isValid },
  } = methods;

  const onSubmit = async ({ username, password }: BasicInfoFormProps) => {
    try {
      dispatch(updateSignUpBasicInfo({ username, password }));
      const result = await checkUserExists({
        data: {
          dto: { userName: username, password, emailOrPhone: EmailOrPhoneNumberEnum.Email, userType },
        },
      });

      console.log(result);

      // if ((res as any)?.error) {
      //   throw new Error((res as any)?.error)
      // }
      // if(result.existUser.listDto.items[0].isExist)

      // check if user exists from a true boolean on response and show error alert.

      navigate(PATH_AUTH.signUp.advancedInfo);
    } catch (error: any) {
      console.error(error);
      if (isMountedRef.current) {
        setError('afterSubmit', error.message.split(':')[1]);
      }
    }
  };
  useEffect(() => {
    if (userSignUpBy) {
      setValue('username', '');
    }
  }, [userSignUpBy, setValue]);

  return (
    <PwaFormStyleComponent title="Basic Info">
      <ContentStyle>
        <Stack alignItems="center" spacing={2}>
          <Typography variant="h4" color="text.primary">
            Sign Up
          </Typography>
          <Typography variant="caption" color="text.secondary" textAlign="center">
            Love is the fragrance of god. If you can smell the fragrance, come in to the Garden Of Love
          </Typography>
        </Stack>
        <Box mt={3} />
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack mt={3} spacing={3}>
            {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
            <Stack spacing={1}>
              {userSignUpBy === 'email' ? (
                <RHFTextField
                  size="small"
                  autoComplete="new-password"
                  inputProps={{
                    autoComplete: 'new-password',
                  }}
                  name="username"
                  label="Email"
                />
              ) : (
                <Controller
                  name="username"
                  control={control}
                  render={({ field }) => (
                    <PhoneNumber
                      value={field.value}
                      isError={!!errors?.username}
                      placeHolder="Enter phone number"
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  )}
                />
              )}
            </Stack>

            <Stack spacing={1}>
              <RHFTextField
                size="small"
                name="password"
                label="Password"
                autoComplete="current-password"
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <Eye /> : <EyeSlash />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ pb: 2 }}>
                {!!watch('password').length ? <PasswordStrength password={watch('password')} /> : <Box height={18} />}
              </Box>
            </Stack>
          </Stack>
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={!isValid}
          >
            Continue
          </LoadingButton>
        </FormProvider>
      </ContentStyle>
      <JoinSectionStyle direction="row" spacing={1}>
        <Typography variant="body2" color="text.secondary">
          Already have an account?
        </Typography>
        <Link to={PATH_AUTH.signIn}>
          <MuiLink variant="body2" color="primary.main" sx={{ textDecoration: 'none !important' }}>
            Sign in
          </MuiLink>
        </Link>
      </JoinSectionStyle>
      <LoginSectionStyle direction="row" spacing={1}>
        <Typography variant="body2" color="text.secondary">
          Using {userSignUpBy === 'email' ? 'phone number' : 'email address'}?
        </Typography>
        <Typography onClick={handleSignUpBy} variant="body2" color="primary.main" sx={{ cursor: 'pointer' }}>
          Sign up by {userSignUpBy === 'email' ? 'Phone Number' : 'Email Address'}
        </Typography>
      </LoginSectionStyle>
    </PwaFormStyleComponent>
  );
}
