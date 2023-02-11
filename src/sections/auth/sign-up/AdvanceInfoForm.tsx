import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// import { Box, Card, Stack, Typography } from '@mui/material';
// import { styled } from '@mui/material/styles';
import { useSelector } from 'src/store';
import { signUpUserTypeSelector } from 'src/store/slices/auth';
import { UserTypeEnum } from 'src/types/serverTypes';

// import useIsMountedRef from '../../../hooks/useIsMountedRef';
import { PATH_AUTH } from '../../../routes/paths';
// import FormStyleComponent from '../FormStyleComponent';
import NGOCompanyInfoForm from './NGOCompanyInfoForm';
import NormalUserInfoForm from './NormalUserInfoForm';

// type NGOCompanyInfoFormProps = {
//   fullName: string;
//   afterSubmit?: string;
// };
// const ContentStyle = styled(Card)(({ theme }) => ({
//   maxWidth: 416,
//   margin: 'auto',
//   padding: theme.spacing(3.4),
// }));

// const PolicySectionStyle = styled(Stack)(({ theme }) => ({
//   alignItems: 'center',
//   justifyContent: 'center',
//   marginTop: theme.spacing(3),
//   borderRadius: theme.spacing(1),
//   padding: theme.spacing(1.5, 0),
//   marginBottom: theme.spacing(3),
//   backgroundColor: theme.palette.grey[100],
// }));

export default function AdvanceInfoForm() {
  // const isMountedRef = useIsMountedRef();
  const navigate = useNavigate();

  const userType = useSelector(signUpUserTypeSelector);
  useEffect(() => {
    if (!userType) {
      navigate(PATH_AUTH.signUp.typeSelection);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType]);
  // const dispatch = useDispatch();
  // const { fullName } = useSelector(ngoCompanyUserInfoSelector);
  // const [registerUser] = useRegisterMutation();

  // const { username } = useSelector(basicInfoSelector);

  // const NGOCompanyInfoSchema = Yup.object().shape({
  //   fullName: Yup.string().required('Full Name is required'),
  // });

  // const defaultValues = {
  //   fullName,
  // };

  // const methods = useForm<NGOCompanyInfoFormProps>({
  //   resolver: yupResolver(NGOCompanyInfoSchema),
  //   defaultValues,
  //   mode: 'onBlur',
  // });

  // const {
  //   reset,
  //   setError,
  //   handleSubmit,
  //   // formState: { errors, isSubmitting, isValid },
  // } = methods;

  // const onSubmit = async (data: NGOCompanyInfoFormProps) => {
  //   const { fullName } = data;
  //   try {
  //     dispatch(NGOCompanyUserInfoUpdated(data));
  //     await registerUser({ registerReqDto: { dto: { firstName: '', lastName: '', fullName, userName: username } } });

  //     // FIXME: error handling

  //     navigate(PATH_AUTH.signUp.verification);
  //   } catch (error: any) {
  //     console.error(error);
  //     reset();
  //     if (isMountedRef.current) {
  //       setError('afterSubmit', error);
  //     }
  //   }

  //   try {
  //     navigate(PATH_AUTH.signUp.verification);
  //   } catch (error: any) {
  //     console.error(error);
  //     reset();
  //     if (isMountedRef.current) {
  //       setError('afterSubmit', error);
  //     }
  //   }
  // };

  return (
    <>
      {userType === UserTypeEnum.Normal && <NormalUserInfoForm />}
      {(userType === UserTypeEnum.Ngo || userType === UserTypeEnum.Company) && <NGOCompanyInfoForm />}
    </>
  );
}
