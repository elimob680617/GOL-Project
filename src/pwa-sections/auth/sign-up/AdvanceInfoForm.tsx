import { useNavigate } from 'react-router-dom';

import { Box, Card, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useSelector } from 'src/store';
import { signUpUserTypeSelector } from 'src/store/slices/auth';
import { UserTypeEnum } from 'src/types/serverTypes';

import { PATH_AUTH } from '../../../routes/paths';
import PwaFormStyleComponent from '../PwaFormStyleComponent';
import NGOCompanyInfoForm from './NGOCompanyInfoForm';
import NormalUserInfoForm from './NormalUserInfoForm';

const ContentStyle = styled(Card)(({ theme }) => ({
  margin: 'auto',
  padding: theme.spacing(3.4),
}));
export default function AdvanceInfoForm() {
  // const isMountedRef = useIsMountedRef();
  const navigate = useNavigate();
  const userType = useSelector(signUpUserTypeSelector);
  if (!userType) {
    navigate(PATH_AUTH.signUp.typeSelection);
    return null;
  }

  return (
    <PwaFormStyleComponent title="Advance Info">
      <ContentStyle>
        <Stack alignItems="center">
          <Typography variant="h6" color="text.primary">
            Complete your registration
          </Typography>
        </Stack>
        <Box mt={3} />
        {userType === UserTypeEnum.Normal && <NormalUserInfoForm />}
        {(userType === UserTypeEnum.Ngo || userType === UserTypeEnum.Company) && <NGOCompanyInfoForm />}
      </ContentStyle>
    </PwaFormStyleComponent>
  );
}
