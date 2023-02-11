// @mui
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { BottomSheet } from 'react-spring-bottom-sheet';

import { Button, IconButton, Stack, Typography, useTheme } from '@mui/material';

import { Icon } from 'src/components/Icon';

import PostDetailsMessages from './PostDetails.messages';

interface PostDetailsHeaderTypes {
  title: string;
  isMine: boolean;
}
function PostDetailsHeader(props: PostDetailsHeaderTypes) {
  const theme = useTheme();
  const { title, isMine } = props;
  const [anchorEl, setAnchorEl] = useState<boolean>(false);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(!anchorEl);
  };
  const handleClose = () => {
    setAnchorEl(false);
  };

  const edit = () => {
    handleClose();
    // if (editCallback) {
    //   handleClose();
    //   editCallback();
    // }
  };
  const handelReport = () => {
    handleClose();
    // const reportData = { username, userId, postId };
    // localStorage.setItem('reportData', JSON.stringify(reportData));
    // router.push('post/report/post-report');
  };
  return (
    <>
      <Stack direction={'row'} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1" color={theme.palette.text.primary} fontWeight={'bold'}>
          {title}
        </Typography>

        <IconButton
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <Icon name="Menu" type="linear" color="grey.500" />
        </IconButton>
      </Stack>
      {isMine ? (
        <BottomSheet open={anchorEl} onDismiss={() => setAnchorEl(!anchorEl)}>
          <IconButton sx={{ justifyContent: 'start' }} disableRipple onClick={() => edit()}>
            <Typography variant="body2" color="text.primary" sx={{ ml: 2 }}>
              edit
            </Typography>
          </IconButton>
        </BottomSheet>
      ) : (
        <BottomSheet open={anchorEl} onDismiss={() => setAnchorEl(!anchorEl)}>
          <Stack py={2} px={2}>
            <Button sx={{ justifyContent: 'start' }}>
              <Icon name="Save" type="linear" color="grey.500" />
              <Typography variant="body2" color="text.primary" sx={{ ml: 2 }}>
                <FormattedMessage {...PostDetailsMessages.save} />
              </Typography>
            </Button>
            <Button sx={{ justifyContent: 'start' }}>
              <Icon name="remove-unfollow" type="linear" color="grey.500" />
              <Typography variant="body2" color="text.primary" sx={{ ml: 2 }}>
                <FormattedMessage {...PostDetailsMessages.unfollow} />
              </Typography>
            </Button>
            <Button sx={{ justifyContent: 'start' }}>
              ‌<Icon name="Eye" type="linear" color="grey.500" />
              <Typography variant="body2" color="text.primary" sx={{ ml: 2 }}>
                <FormattedMessage {...PostDetailsMessages.dontWantSee} />
              </Typography>
            </Button>
            <Button sx={{ justifyContent: 'start' }} onClick={handelReport}>
              <Icon name="Report" type="linear" color="grey.500" />
              <Typography variant="body2" color="text.primary" sx={{ ml: 2 }}>
                <FormattedMessage {...PostDetailsMessages.report} />
              </Typography>
            </Button>
          </Stack>
        </BottomSheet>
      )}
    </>
  );
}

export default PostDetailsHeader;
