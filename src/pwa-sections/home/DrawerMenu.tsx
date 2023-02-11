import { FormattedMessage } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';

import { Avatar, Box, Divider, Stack, Typography, styled, useTheme } from '@mui/material';

import useAuth from 'src/hooks/useAuth';
import { PATH_APP } from 'src/routes/paths';
import HomeMessages from 'src/sections/home/home.messages';
import { UserTypeEnum } from 'src/types/serverTypes';

const RootStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.neutral,
}));

interface DrawerMenuProps {
  onClose: () => void;
}

function DrawerMenu(props: DrawerMenuProps) {
  const { onClose } = props;
  const { user } = useAuth();
  const theme = useTheme();

  const navigate = useNavigate();
  return (
    <>
      <Box sx={{ backgroundColor: theme.palette.background.neutral }}>
        <RootStyle
          onClick={() => {
            onClose();
            navigate(user?.userType === UserTypeEnum.Normal ? PATH_APP.profile.user.root : PATH_APP.profile.ngo.root);
          }}
          spacing={1}
          direction={'row'}
          alignItems="center"
        >
          <Avatar
            sx={{ width: 48, height: 48 }}
            src={user?.avatarUrl || ''}
            variant={user?.userType === UserTypeEnum.Normal ? 'circular' : 'rounded'}
          />
          <Typography variant="subtitle1">
            {user?.userType === UserTypeEnum.Normal ? `${user?.firstName} ${user?.lastName}` : user?.fullName}
          </Typography>
          <Stack
            alignItems={'center'}
            justifyContent="center"
            sx={{ backgroundColor: theme.palette.secondary.main, px: 0.76, py: 0.5, borderRadius: 1 }}
          >
            <Typography variant="caption" color={theme.palette.background.paper}>
              <FormattedMessage {...HomeMessages.bgd} />
            </Typography>
          </Stack>
        </RootStyle>
        <Stack
          spacing={2}
          sx={{ p: 2, backgroundColor: theme.palette.background.paper, borderRadius: '16px 16px 0 0' }}
        >
          <Link to="/campaigns">
            <Stack direction={'row'} spacing={1} sx={{ py: 1 }} alignItems="center">
              <img src="/icons/Campaign/24/Outline.svg" width={24} height={24} alt="campaign" />
              <Typography variant="subtitle2" color={theme.palette.text.primary}>
                <FormattedMessage {...HomeMessages.campagins} />
              </Typography>
            </Stack>
          </Link>
          <Link to="/connections/follower">
            <Stack direction={'row'} spacing={1} sx={{ py: 1 }} alignItems="center">
              <img src="/icons/Groups/24/Outline.svg" width={24} height={24} alt="campaign" />
              <Typography variant="subtitle2" color={theme.palette.text.primary}>
                <FormattedMessage {...HomeMessages.connections} />
              </Typography>
            </Stack>
          </Link>
          <Stack direction={'row'} spacing={1} sx={{ py: 1 }} alignItems="center">
            <img src="/icons/Page Collection/24/Outline.svg" width={24} height={24} alt="campaign" />
            <Typography variant="subtitle2" color={theme.palette.text.primary}>
              <FormattedMessage {...HomeMessages.pages} />
            </Typography>
          </Stack>
          <Stack direction={'row'} spacing={1} sx={{ py: 1 }} alignItems="center">
            <img src="/icons/NFT/24/Outline.svg" width={24} height={24} alt="campaign" />
            <Typography variant="subtitle2" color={theme.palette.text.primary}>
              <FormattedMessage {...HomeMessages.nft} />
            </Typography>
          </Stack>
          <Stack direction={'row'} spacing={1} sx={{ py: 1 }} alignItems="center">
            <img src="/icons/Save1/24/Outline.svg" width={24} height={24} alt="campaign" />
            <Typography variant="subtitle2" color={theme.palette.text.primary}>
              <FormattedMessage {...HomeMessages.saved} />
            </Typography>
          </Stack>
          <Stack direction={'row'} spacing={1} sx={{ py: 1 }} alignItems="center">
            <img src="/icons/Premium/24/Outline.svg" width={24} height={24} alt="campaign" />
            <Typography variant="subtitle2" color={theme.palette.text.primary}>
              <FormattedMessage {...HomeMessages.premium} />
            </Typography>
          </Stack>
          <Divider />
          <Stack direction={'row'} spacing={1} sx={{ py: 1 }} alignItems="center">
            <img src="/icons/Help/24/Outline.svg" width={24} height={24} alt="campaign" />
            <Typography
              variant="subtitle2"
              color={theme.palette.text.primary}
              onClick={() => navigate('/help/help-center')}
            >
              <FormattedMessage {...HomeMessages.helpCenter} />
            </Typography>
          </Stack>
          <Stack direction={'row'} spacing={1} sx={{ py: 1 }} alignItems="center">
            <img src="/icons/Setting/24/Outline.svg" width={24} height={24} alt="campaign" />
            <Typography variant="subtitle2" color={theme.palette.text.primary}>
              <FormattedMessage {...HomeMessages.settings} />
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </>
  );
}

export default DrawerMenu;
