import { FC, useState } from 'react';

import { MoreVert } from '@mui/icons-material';
import { Box, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

interface IPostTitle {
  avatar: any;
  username: string;
  Date: string;
  PostNo: string;
  description?: string;
  editCallback?: () => void;
  location?: string;
}

const PostTitleDot = styled('span')(({ theme }) => ({
  color: theme.palette.grey[300],
  margin: 1,
}));

const PostTitleMoreMedia: FC<IPostTitle> = ({
  avatar,
  username,
  Date,
  PostNo,
  description,
  editCallback,
  location,
}: IPostTitle) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const edit = () => {
    if (editCallback) {
      handleClose();
      editCallback();
    }
  };
  const SelectedLocationStyle = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    cursor: 'pointer',
  }));

  return (
    <Stack
      sx={{ paddingRight: 2, paddingLeft: 2 }}
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
    >
      <Stack direction="row" spacing={2}>
        {avatar && <Box>{avatar}</Box>}
        <Stack spacing={1}>
          <Stack spacing={1} direction="row" sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" color="surface.main">
              {username}
            </Typography>
            {location && (
              <Stack justifyContent="center">
                <img src="/icons/dot.svg" width={5} height={5} alt="selected-location" />
              </Stack>
            )}
            {location && (
              <Stack sx={{ flex: 1 }} spacing={0.5} direction="row" alignItems="center" flexWrap="nowrap">
                <Box sx={{ minWidth: 16, minHeight: 16 }}>
                  <img src="/icons/location/location.svg" width={16} height={16} alt="selected-location" />
                </Box>
                <SelectedLocationStyle>
                  <Typography variant="subtitle2" color="surface.main">
                    {location}
                  </Typography>
                </SelectedLocationStyle>
              </Stack>
            )}
          </Stack>
          <Stack alignItems="center" direction="row" spacing={1}>
            <Typography variant="body2" color="surface.main">
              {Date}
            </Typography>
            <PostTitleDot>
              <Stack justifyContent="center">
                <img src="/icons/dotWhite.svg" width={5} height={5} alt="selected-location" />
              </Stack>
            </PostTitleDot>

            {PostNo === 'simple' ? (
              <Stack justifyContent="center">
                <img src="/icons/Earth/24/OutlineWhite.svg" width={19} height={19} alt="selected-location" />
              </Stack>
            ) : (
              'sc'
            )}
          </Stack>
        </Stack>
      </Stack>
      <Stack justifyContent="flex-start">
        <IconButton
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <MoreVert sx={{ color: 'surface.main' }} />
        </IconButton>

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={() => edit()}>Edit</MenuItem>
        </Menu>
      </Stack>
    </Stack>
  );
};

export default PostTitleMoreMedia;
