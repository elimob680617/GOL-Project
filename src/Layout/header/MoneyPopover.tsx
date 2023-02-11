import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Divider, IconButton, MenuItem, Stack } from '@mui/material';

import { Icon } from 'src/components/Icon';
import MenuPopover from 'src/components/MenuPopover';
import { PATH_APP } from 'src/routes/paths';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    linkTo: '/',
  },
  {
    label: 'Profile',
    linkTo: PATH_APP.root,
  },
  {
    label: 'Settings',
    linkTo: PATH_APP.root,
  },
];

// ----------------------------------------------------------------------

export default function MoneyPopover() {
  const [open, setOpen] = useState<HTMLElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Icon name="dollar-coin" type="linear" color="grey.500" />
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
        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <Link key={option.label} to={option.linkTo}>
              <MenuItem key={option.label} onClick={handleClose}>
                {option.label}
              </MenuItem>
            </Link>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />
      </MenuPopover>
    </>
  );
}
