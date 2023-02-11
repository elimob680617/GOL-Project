// @mui
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material';

//icon
import { Icon } from 'src/components/Icon';

import PostDetailsMessages from './PostDetails.messages';

interface PostDetailsHeaderTypes {
  title: string;
  isMine: boolean;
}

function PostDetailsHeader(props: PostDetailsHeaderTypes) {
  const { title, isMine } = props;
  const [openReportPost, setOpenReportPost] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Stack direction={'row'} sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h5">{title}</Typography>
        <IconButton
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <Icon name="Menu-1" type="solid" color="grey.500" />
        </IconButton>

        {isMine ? (
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem>Edit</MenuItem>
          </Menu>
        ) : (
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            sx={{ p: 2 }}
          >
            <MenuItem sx={{ mb: 3 }}>
              <Icon name="Save" type="linear" color="grey.500" />
              <Typography variant="body2" color="text.primary" sx={{ ml: 2 }}>
                <FormattedMessage {...PostDetailsMessages.save} />
              </Typography>
            </MenuItem>
            <MenuItem sx={{ mb: 3 }}>
              <Icon name="remove-unfollow" type="linear" color="grey.500" />
              <Typography variant="body2" color="text.primary" sx={{ ml: 2 }}>
                <FormattedMessage {...PostDetailsMessages.unfollow} />
              </Typography>
            </MenuItem>
            <MenuItem sx={{ mb: 3 }}>
              <Icon name="Eye" type="linear" color="grey.500" />
              <Typography variant="body2" color="text.primary" sx={{ ml: 2 }}>
                <FormattedMessage {...PostDetailsMessages.dontWantSee} />
              </Typography>
            </MenuItem>
            <MenuItem
              sx={{ mb: 2 }}
              onClick={() => {
                setOpenReportPost(!openReportPost);
                setAnchorEl(null);
              }}
            >
              <Icon name="Report" type="linear" color="grey.500" />
              <Typography variant="body2" color="text.primary" sx={{ ml: 2 }}>
                <FormattedMessage {...PostDetailsMessages.report} />
              </Typography>
            </MenuItem>
          </Menu>
        )}
      </Stack>
    </>
  );
}

export default PostDetailsHeader;
