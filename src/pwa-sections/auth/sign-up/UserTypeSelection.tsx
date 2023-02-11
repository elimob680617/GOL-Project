import { Link, useNavigate } from 'react-router-dom';

import { Card, Link as MuiLink, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import ArrowRight from 'src/assets/icons/account/ArrowRight.svg';
import Image from 'src/components/Image';
import { PATH_AUTH } from 'src/routes/paths';
import { useDispatch } from 'src/store';
import { signUpUserTypeDefined } from 'src/store/slices/auth';
import { UserTypeEnum } from 'src/types/serverTypes';

import PwaFormStyleComponent from '../PwaFormStyleComponent';

const JoinSectionStyle = styled(Stack)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1, 0),
  alignItems: 'center',
  justifyContent: 'center',
  // backgroundColor: theme.palette.grey[200],
  borderRadius: theme.spacing(1),
}));
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
const ContentStyle = styled(Card)(({ theme }) => ({
  maxWidth: 416,
  backgroundColor: theme.palette.background.paper,
  margin: 'auto',
  padding: theme.spacing(3, 4),
}));

const UserTypes = [
  { kind: UserTypeEnum.Normal, icon: '/icons/account/Group 91.svg', title: 'Normal User', body: 'Some Description ' },
  { kind: UserTypeEnum.Ngo, icon: '/icons/account/Path 333.svg', title: 'NGO', body: 'Some Description' },
  { kind: UserTypeEnum.Company, icon: '/icons/account/Vector.svg', title: 'Company', body: 'Some Description' },
];

export default function UserTypeSelection() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectType = (type: UserTypeEnum) => () => {
    dispatch(signUpUserTypeDefined({ userType: type }));
    navigate(PATH_AUTH.signUp.basicInfo);
  };

  return (
    <PwaFormStyleComponent title="User Type Selection">
      <ContentStyle>
        <Stack alignItems="center" spacing={2}>
          <Typography variant="h4" color="text.primary">
            Sign Up
          </Typography>
          <Typography variant="caption" color="text.secondary" textAlign="center">
            Love is the fragrance of god. If you can smell the fragrance, come in to the Garden Of Love
          </Typography>
        </Stack>
        <Stack sx={{ mt: 3 }} spacing={3}>
          {UserTypes.map((type) => (
            <TypeCardStyle key={type.title} onClick={selectType(type.kind)}>
              <Stack direction="row" alignItems="center">
                <ImageStyle>
                  <Image src={type.icon} width={17} height={17} alt={type.title} />
                </ImageStyle>
                <Stack pl={2} spacing={0.5}>
                  <Typography variant="subtitle2" color="primary.darker">
                    {type.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {type.body}
                  </Typography>
                </Stack>
              </Stack>
              <Stack>
                <Image src={ArrowRight} alt="right" />
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
            Sign in
          </MuiLink>
        </Link>
      </JoinSectionStyle>
    </PwaFormStyleComponent>
  );
}
