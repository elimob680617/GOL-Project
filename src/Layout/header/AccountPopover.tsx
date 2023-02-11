import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// @mui
import { Avatar, Box, Divider, IconButton, MenuItem, Stack, Typography } from '@mui/material';

// next
import { useSnackbar } from 'notistack';
// components
import MenuPopover from 'src/components/MenuPopover';
// hooks
import useAuth from 'src/hooks/useAuth';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
// routes
import { PATH_APP, PATH_AUTH } from 'src/routes/paths';
import { UserTypeEnum } from 'src/types/serverTypes';

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const isMountedRef = useIsMountedRef();

  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState<HTMLElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = async () => {
    localStorage.removeItem('closeWizard');
    localStorage.removeItem('closeWizardNgo');

    try {
      await logout();
      navigate(PATH_AUTH.signIn, { replace: true });

      if (isMountedRef.current) {
        handleClose();
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };
  return (
    <>
      <IconButton onClick={handleOpen} size="large">
        {/* <Stack alignItems="center" direction="row"> */}
        <Avatar
          src={user?.avatarUrl || ''}
          variant={user?.userType === UserTypeEnum.Normal ? 'circular' : 'rounded'}
          sx={{ width: 24, height: 24 }}
        />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.fullName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.userType === UserTypeEnum.Normal ? `${user?.firstName} ${user?.lastName}` : user?.fullName} {}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          <Link to={PATH_APP.root}>
            <MenuItem onClick={handleClose}>{'Home'}</MenuItem>
          </Link>
          <Link to={user?.userType === UserTypeEnum.Normal ? PATH_APP.profile.user.root : PATH_APP.profile.ngo.root}>
            <MenuItem onClick={handleClose}>{'Profile'}</MenuItem>
          </Link>
          <Link to={PATH_APP.root}>
            <MenuItem onClick={handleClose}>{'Setting'}</MenuItem>
          </Link>
          <Link to={'/report/garden/'}>
            <MenuItem onClick={handleClose}>{'Application Report'}</MenuItem>
          </Link>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </MenuPopover>
    </>
  );
}
