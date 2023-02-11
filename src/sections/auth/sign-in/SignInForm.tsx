import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { Link, useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  Card,
  Divider,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  Stack,
  Typography,
  styled,
} from '@mui/material';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Icon } from 'src/components/Icon';
import PhoneNumber from 'src/components/PhoneNumber';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import useAuth from 'src/hooks/useAuth';
import { PATH_AUTH } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { signUpBy, signUpBySelector } from 'src/store/slices/auth';

import FormStyleComponent from '../FormStyleComponent';
import SocialSignInButtons from './SocialSignInButtons';

type SignInValuesProps = {
  username: string;
  password: string;
  afterSubmit?: string;
};
const ContentStyle = styled(Card)(({ theme }) => ({
  maxWidth: 416,
  margin: 'auto',
  padding: theme.spacing(3.4),
}));
const JoinSectionStyle = styled(Stack)(({ theme }) => ({
  marginTop: theme.spacing(2),
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: theme.spacing(1),
}));
const LoginSectionStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(1, 0),
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: theme.spacing(1),
}));

export default function SignInForm() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const userSignUpBy = useSelector(signUpBySelector);
  const dispatch = useDispatch();
  const handleSignUpBy = () => {
    dispatch(signUpBy({ signUpBy: userSignUpBy === 'email' ? 'phoneNumber' : 'email' }));
  };
  const LoginSchema = Yup.object().shape({
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
    username: '',
    password: '',
  };

  const methods = useForm<SignInValuesProps>({
    resolver: yupResolver(LoginSchema),
    defaultValues,
    mode: 'onChange',
  });
  const {
    setValue,
    setError,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid },
  } = methods;

  const onSubmit = async (data: SignInValuesProps) => {
    try {
      const { username, password } = data;
      await login(username, password);

      setTimeout(() => navigate('/'), 1000);
    } catch (error: any) {
      setError('afterSubmit', {
        message: 'Incorrect username or password',
      });
    }
  };

  useEffect(() => {
    if (userSignUpBy) {
      setValue('username', '');
    }
  }, [userSignUpBy, setValue]);

  return (
    <FormStyleComponent title="Sign In">
      <ContentStyle>
        <Stack alignItems="center" spacing={2}>
          <Typography variant="h4" color="text.primary">
            Sign In
          </Typography>
          <Typography variant="caption" color="text.secondary" textAlign="center">
            Love is the fragrance of god. If you can smell the fragrance, come in to the Garden Of Love
          </Typography>
        </Stack>
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
                        {showPassword ? <Icon name="Eye" /> : <Icon name="Eye-Hidden" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
            {/* {/ <RHFCheckbox name="remember" label="Remember me" /> /} */}
            <Box />
            <Link to={PATH_AUTH.forgetPassword}>
              <MuiLink
                variant="caption"
                color="info.main"
                sx={{ mb: userSignUpBy === 'email' ? '' : 2, '&:hover': { textDecoration: 'none' } }}
              >
                Forgot password?
              </MuiLink>
            </Link>
          </Stack>

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={!isValid}
            sx={{ mb: 3 }}
          >
            {userSignUpBy === 'email' ? 'Sign in' : 'Continue'}
          </LoadingButton>
          <Divider sx={{ mb: 3 }}> Or </Divider>
          <SocialSignInButtons />
        </FormProvider>
      </ContentStyle>
      <JoinSectionStyle direction="row" spacing={1}>
        <Typography variant="body2" color="text.secondary">
          New to Gardenoflove?
        </Typography>
        <Link to={PATH_AUTH.signUp.basicInfo}>
          <MuiLink variant="body1" color="primary.main" sx={{ textDecoration: 'none !important' }}>
            Join Now
          </MuiLink>
        </Link>
      </JoinSectionStyle>
      <LoginSectionStyle direction="row" spacing={1}>
        <Typography variant="body2" color="text.secondary">
          Using {userSignUpBy === 'email' ? 'phone number' : 'email address'}?
        </Typography>
        <Typography onClick={handleSignUpBy} variant="body1" color="primary.main" sx={{ cursor: 'pointer' }}>
          Sign in by {userSignUpBy === 'email' ? 'Phone Number' : 'Email Address'}
        </Typography>
      </LoginSectionStyle>
    </FormStyleComponent>
  );
}
