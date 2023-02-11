import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Button, Stack, Typography, styled } from '@mui/material';

import { PATH_APP } from 'src/routes/paths';

import { Icon } from '../Icon';
import { LinearIconType, SolidIconType } from '../Icon/IconNames';

const NoWidthButtonStyle = styled(Button)(({ theme }) => ({
  padding: 0,
  minWidth: 0,
}));

const MainBottomNavigationBar: FC = () => {
  const navigate = useNavigate();

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ height: 62, px: 2, py: 1 }}>
      <NoWidthButtonStyle onClick={() => navigate(PATH_APP.home.index)}>
        <IsActive iconName="Home" title="Home" url="/home" />
      </NoWidthButtonStyle>
      <NoWidthButtonStyle onClick={() => navigate(PATH_APP.search.root)}>
        <IsActive iconName="Research" type="solid" title="Search" url="/search/" />
      </NoWidthButtonStyle>
      <NoWidthButtonStyle onClick={() => navigate(PATH_APP.post.createPost.socialPost.index)}>
        <Stack sx={{ position: 'relative' }} alignItems="center">
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              bgcolor: 'primary.main',
              borderRadius: '100%',
              position: 'absolute',
              width: 52,
              height: 52,
              top: -36,
              border: (theme) => `4px solid ${theme.palette.background.default}`,
            }}
          >
            <Icon name="Plus" color="common.white" />
          </Stack>
          <Typography
            variant="caption"
            sx={{
              fontWeight: '400',
              fontSize: '12px',
              lineHeight: '15px',
              color: 'text.secondary',
              paddingTop: '23px',
              userSelect: 'none',
            }}
          >
            Post
          </Typography>
        </Stack>
      </NoWidthButtonStyle>
      <NoWidthButtonStyle onClick={() => navigate(PATH_APP.notifications.index)}>
        <IsActive iconName="Bell" title="Notification" url={'/notification'} />
      </NoWidthButtonStyle>
      <NoWidthButtonStyle onClick={() => navigate(PATH_APP.chat.root)}>
        <IsActive iconName="chat" title="Chat" url={PATH_APP.chat.root} />
      </NoWidthButtonStyle>
    </Stack>
  );
};

export default MainBottomNavigationBar;

const IsActive: FC<{
  iconName: SolidIconType | LinearIconType;
  title: string;
  url: string;
  type?: 'solid' | 'linear';
}> = ({ iconName, title, url, type }) => {
  const { pathname } = useLocation();

  return (
    <Stack alignItems="center">
      <Icon type={type} name={iconName} color={pathname !== url ? 'grey.500' : 'primary.main'} />
      <Typography
        variant="caption"
        sx={{
          fontWeight: '400',
          fontSize: '12px',
          lineHeight: '15px',
          color: pathname !== url ? 'text.secondary' : 'primary.main',
        }}
      >
        {title}
      </Typography>
    </Stack>
  );
};
