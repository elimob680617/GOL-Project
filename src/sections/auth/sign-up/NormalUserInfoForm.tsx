import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Alert, Box, Card, Link as MuiLink, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRegisterMutation } from 'src/_graphql/cognito/mutations/regsiter.generated';
import { useDispatch, useSelector } from 'src/store';
import { basicInfoSelector, normalUserInfoSelector, normalUsreInfoUpdated } from 'src/store/slices/auth';

import { FormProvider, RHFTextField } from '../../../components/hook-form';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import { PATH_AUTH } from '../../../routes/paths';
import FormStyleComponent from '../FormStyleComponent';

type NormalUserInfoFormProps = {
  firstName: string;
  lastName: string;
  afterSubmit?: string;
};

const PolicySectionStyle = styled(Stack)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  padding: theme.spacing(1.5, 0),
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.spacing(1),
}));
const ContentStyle = styled(Card)(({ theme }) => ({
  maxWidth: 416,
  margin: 'auto',
  padding: theme.spacing(3.4),
}));

export default function NormalUserInfoForm() {
  const isMountedRef = useIsMountedRef();
  const dispatch = useDispatch();

  const [registerUser] = useRegisterMutation();

  const { firstName, lastName } = useSelector(normalUserInfoSelector);

  const { username } = useSelector(basicInfoSelector);

  const navigate = useNavigate();

  const LoginSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
  });

  const defaultValues = {
    firstName,
    lastName,
  };

  const methods = useForm<NormalUserInfoFormProps>({
    resolver: yupResolver(LoginSchema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = methods;

  const onSubmit = async (data: NormalUserInfoFormProps) => {
    try {
      dispatch(normalUsreInfoUpdated(data));
      await registerUser({
        registerReqDto: {
          dto: {
            firstName: data.firstName,
            lastName: data.lastName,
            fullName: firstName + ' ' + lastName,
            userName: username,
          },
        },
      });

      // FIXME: error handling

      navigate(PATH_AUTH.signUp.verification);
    } catch (error: any) {
      console.error(error);
      reset();
      if (isMountedRef.current) {
        setError('afterSubmit', error);
      }
    }
  };

  return (
    <FormStyleComponent title={'Sign Up'}>
      <ContentStyle>
        <Stack alignItems="center">
          <Typography variant="h6" color="text.primary">
            Complete your registration
          </Typography>
        </Stack>
        <Box mt={3} />
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack mt={3} spacing={3}>
            {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

            <Stack spacing={1}>
              <RHFTextField size="small" name="firstName" label="First Name" />
            </Stack>

            <Stack spacing={1}>
              <RHFTextField size="small" name="lastName" label="Last Name" type="text" />
            </Stack>
          </Stack>

          <PolicySectionStyle>
            <Typography variant="caption" color="text.secondary" textAlign="center">
              By clicking Agree & Join, you agree to the Gardenoflove{' '}
              <Link to={PATH_AUTH.signIn}>
                <MuiLink variant="caption" component="span" color="primary.light" sx={{ textDecoration: 'none' }}>
                  User Agreement
                </MuiLink>
              </Link>
              ,&nbsp;
              <Link to={PATH_AUTH.signIn}>
                <MuiLink variant="caption" component="span" color="primary.light" sx={{ textDecoration: 'none' }}>
                  Privacy Policy
                </MuiLink>
              </Link>
              , and&nbsp;
              <Link to={PATH_AUTH.signIn}>
                <MuiLink variant="caption" component="span" color="primary.light" sx={{ textDecoration: 'none' }}>
                  Cookie Policy.
                </MuiLink>
              </Link>
            </Typography>
          </PolicySectionStyle>

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={!isValid}
          >
            Agree & join
          </LoadingButton>
        </FormProvider>
      </ContentStyle>
    </FormStyleComponent>
  );
}
