import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Alert, Link as MuiLink, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRegisterMutation } from 'src/_graphql/cognito/mutations/regsiter.generated';
import { useDispatch, useSelector } from 'src/store';
import { NGOCompanyUserInfoUpdated, basicInfoSelector, ngoCompanyUserInfoSelector } from 'src/store/slices/auth';

import { FormProvider, RHFTextField } from '../../../components/hook-form';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import { PATH_AUTH } from '../../../routes/paths';

type NGOCompanyInfoFormProps = {
  fullName: string;
  afterSubmit?: string;
};

const PolicySectionStyle = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: theme.spacing(3),
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1.5, 0),
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.grey[100],
}));

export default function NGOCompanyInfoForm() {
  const isMountedRef = useIsMountedRef();
  const dispatch = useDispatch();
  const { fullName } = useSelector(ngoCompanyUserInfoSelector);
  const [registerUser] = useRegisterMutation();
  const { username } = useSelector(basicInfoSelector);
  const navigate = useNavigate();

  const NGOCompanyInfoSchema = Yup.object().shape({
    fullName: Yup.string().required('Full Name is required'),
  });

  const defaultValues = {
    fullName,
  };

  const methods = useForm<NGOCompanyInfoFormProps>({
    resolver: yupResolver(NGOCompanyInfoSchema),
    defaultValues,
    mode: 'onBlur',
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = methods;

  const onSubmit = async (data: NGOCompanyInfoFormProps) => {
    try {
      dispatch(NGOCompanyUserInfoUpdated(data));
      const result = await registerUser({
        registerReqDto: { dto: { firstName: '', lastName: '', fullName, userName: username } },
      });

      console.log(result);

      // FIXME: error handling

      navigate(PATH_AUTH.signUp.verification);
    } catch (error: any) {
      console.error(error);
      reset();
      if (isMountedRef.current) {
        setError('afterSubmit', error);
      }
    }

    try {
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
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack mt={3} spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <Stack spacing={1}>
          <RHFTextField size="small" name="fullName" label="Full name" />
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
  );
}
