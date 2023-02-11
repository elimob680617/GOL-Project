import { Link, useNavigate } from 'react-router-dom';

import { Card, Link as MuiLink, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { Icon } from 'src/components/Icon';
import { PATH_AUTH } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { signUpBy, signUpBySelector, signUpUserTypeDefined } from 'src/store/slices/auth';
import { UserTypeEnum } from 'src/types/serverTypes';

import FormStyleComponent from '../FormStyleComponent';

const TypeCardStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.paper,
  transition: theme.transitions.create('background-color', { duration: theme.transitions.duration.short }),
  padding: theme.spacing(1),
  borderRadius: theme.spacing(1),
  cursor: 'pointer',
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.palette.grey[100],
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
    '&>div:first-child': {
      '&>div:first-child': {
        backgroundColor: theme.palette.background.paper,
      },
    },
  },
}));
const ImageStyle = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  width: 44,
  height: 44,
  backgroundColor: theme.palette.grey[100],
  borderRadius: 8,
}));

const UserTypes = [
  { kind: UserTypeEnum.Normal, icon: <Icon name="profile" />, title: 'Normal User', body: 'Some Description ' },
  { kind: UserTypeEnum.Ngo, icon: <Icon name="Building" />, title: 'NGO', body: 'Some Description' },
  { kind: UserTypeEnum.Company, icon: <Icon name="Occupation" />, title: 'Company', body: 'Some Description' },
];
const ContentStyle = styled(Card)(({ theme }) => ({
  maxWidth: 416,
  backgroundColor: theme.palette.background.paper,
  margin: 'auto',
  padding: theme.spacing(3, 4),
}));
const JoinSectionStyle = styled(Stack)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1, 0),
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: theme.spacing(1),
}));
const SignPhoneNumberStyle = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: theme.spacing(1),
}));

export default function UserTypeSelection() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectType = (type: UserTypeEnum) => () => {
    dispatch(signUpUserTypeDefined({ userType: type }));
    navigate(PATH_AUTH.signUp.basicInfo);
  };
  const userSignUpBy = useSelector(signUpBySelector);

  const handleSignUpBy = () => {
    dispatch(signUpBy({ signUpBy: userSignUpBy === 'email' ? 'phoneNumber' : 'email' }));
  };

  return (
    <FormStyleComponent title="User Type Selection">
      <ContentStyle>
        <Stack sx={{ mt: 3 }} spacing={3}>
          {UserTypes.map((type) => (
            <TypeCardStyle key={type.title} onClick={selectType(type.kind)}>
              <Stack direction="row" alignItems="center">
                <ImageStyle>{type.icon}</ImageStyle>
                <Stack pl={2} spacing={0.5}>
                  <Typography variant="subtitle2" color="primary.dark">
                    {type.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {type.body}
                  </Typography>
                </Stack>
              </Stack>
              <Stack>
                <Icon name="right-arrow" />
              </Stack>
            </TypeCardStyle>
          ))}
        </Stack>
      </ContentStyle>
      <JoinSectionStyle direction="row" spacing={1}>
        <Typography variant="body2" color="text.secondary">
          Already have an account?
        </Typography>
        <Link to={PATH_AUTH.signIn}>
          <MuiLink variant="body2" color="primary.main" sx={{ textDecoration: 'none' }}>
            Sing In
          </MuiLink>
        </Link>
      </JoinSectionStyle>
      <SignPhoneNumberStyle direction="row" spacing={1}>
        <Typography variant="body1" color="text.secondary">
          Using {userSignUpBy === 'email' ? 'Phone number' : 'Email'}?
        </Typography>
        <Typography onClick={handleSignUpBy} variant="body2" color="primary.main" sx={{ textDecoration: 'none' }}>
          Sign up by {userSignUpBy === 'email' ? 'Phone number' : 'Email'}
        </Typography>
      </SignPhoneNumberStyle>
    </FormStyleComponent>
  );
}
