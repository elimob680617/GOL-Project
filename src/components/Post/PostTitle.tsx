import { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { MoreHoriz } from '@mui/icons-material';
import { Box, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useLazyGetUserDetailQuery } from 'src/_graphql/profile/publicDetails/queries/getUser.generated';
import { PATH_APP } from 'src/routes/paths';
import { ConnectionStatusEnum, UserTypeEnum } from 'src/types/serverTypes';

import Dot from '../Dot';
import { Icon } from '../Icon';
import { ReportParentDialog } from '../reportPostAndProfile';
import PostComponentsMessage from './PostComponentsMessage';

interface IPostTitle {
  avatar: ReactNode;
  username: string;
  Date: string;
  PostNo: string;
  description?: string;
  editCallback?: () => void;
  location?: string;
  userId: string;
  userType: UserTypeEnum;
  isMine: boolean;
  postId: string;
  setIsReport?: any;
}

const PostTitleDot = styled('span')(({ theme }) => ({
  color: theme.palette.grey[300],
  margin: 1,
}));

const SelectedLocationStyle = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  fontSize: '14px',
  lineHeight: '17.5px',
  color: theme.palette.text.secondary,
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 1,
  WebkitBoxOrient: 'vertical',
  cursor: 'pointer',
}));
const PostTitle: FC<IPostTitle> = ({
  setIsReport,
  avatar,
  username,
  Date,
  PostNo,
  description,
  editCallback,
  location,
  isMine,
  userId,
  userType,
  postId,
}: IPostTitle) => {
  const [GetUserDetailQuery, { data: getUserData }] = useLazyGetUserDetailQuery();
  const getUser = getUserData?.getUser?.listDto?.items?.[0]?.connectionDto;
  const [openReportPost, setOpenReportPost] = useState(false);
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

  const profileRoute = useMemo(() => {
    if (userType === UserTypeEnum.Ngo) {
      if (isMine) return PATH_APP.profile.ngo.root;
      return PATH_APP.profile.ngo.root + '/view/' + userId;
    } else {
      if (isMine) return PATH_APP.profile.user.root;
      return PATH_APP.profile.user.root + '/view/' + userId;
    }
  }, [isMine, userId, userType]);

  useEffect(() => {
    GetUserDetailQuery({ filter: { dto: { id: userId } } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Stack
        sx={{ paddingRight: 2, paddingLeft: 2 }}
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Stack direction="row" spacing={2}>
          <Link to={profileRoute}>
            <Box sx={{ cursor: 'pointer' }}>{avatar}</Box>
          </Link>
          <Stack spacing={1}>
            <Stack spacing={1} direction="row" sx={{ display: 'flex', alignItems: 'center' }}>
              <Link to={profileRoute}>
                <Typography variant="h6" sx={{ cursor: 'pointer' }}>
                  {username}
                </Typography>
              </Link>
              {location && (
                <Stack justifyContent="center">
                  <Dot />
                </Stack>
              )}
              {location && (
                <Stack sx={{ flex: 1 }} spacing={0.5} direction="row" alignItems="center" flexWrap="nowrap">
                  <Box>
                    <Icon name="location" size={20} />
                  </Box>
                  <SelectedLocationStyle>
                    <Typography variant="subtitle2" color="text.secondary">
                      {location}
                    </Typography>
                  </SelectedLocationStyle>
                </Stack>
              )}
            </Stack>
            <Stack alignItems="center" direction="row" spacing={1}>
              <Typography variant="body2" color="text.secondary">
                {Date}
              </Typography>
              <PostTitleDot>
                <Stack justifyContent="center">
                  <Dot />
                </Stack>
              </PostTitleDot>

              {PostNo === 'simple' ? (
                <Stack justifyContent="center">
                  <Icon name="Earth" size={20} color="text.secondary" />
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
            <MoreHoriz sx={{ color: '#8798A1' }} />
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
              <MenuItem onClick={() => edit()}>
                <FormattedMessage {...PostComponentsMessage.Edit} />
              </MenuItem>
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
                {/* ‌<img src={saveIcon} alt="saveIcon" loading="lazy" /> */}
                <Icon name="Save" />
                <Typography variant="body2" color="text.primary" sx={{ ml: 2 }}>
                  <FormattedMessage {...PostComponentsMessage.Save} />
                </Typography>
              </MenuItem>
              <MenuItem sx={{ mb: 3 }}>
                <Icon name="remove-unfollow" />
                <Typography variant="body2" color="text.primary" sx={{ ml: 2 }}>
                  <FormattedMessage {...PostComponentsMessage.Unfollow} />
                </Typography>
              </MenuItem>
              <MenuItem sx={{ mb: 3 }}>
                <Icon name="Eye" type="linear" />
                <Typography variant="body2" color="text.primary" sx={{ ml: 2 }}>
                  <FormattedMessage {...PostComponentsMessage.IdonotWanttoSeeThisPost} />
                </Typography>
              </MenuItem>
              <MenuItem
                sx={{ mb: 2 }}
                onClick={() => {
                  setOpenReportPost(true);
                  setAnchorEl(null);
                }}
              >
                <Icon name="Flag" />
                <Typography variant="body2" color="text.primary" sx={{ ml: 2 }}>
                  <FormattedMessage {...PostComponentsMessage.Report} />
                </Typography>
              </MenuItem>
            </Menu>
          )}
        </Stack>
      </Stack>
      {openReportPost && (
        <ReportParentDialog
          setIsReport={setIsReport}
          setOpenDialog={setOpenReportPost}
          reportType="post"
          postId={postId}
          userId={userId}
          fullName={username}
          openDialog={openReportPost}
          isBlocked={getUser?.meBlockedOther as boolean}
          isFollowing={getUser?.meToOtherStatus === ConnectionStatusEnum.Accepted}
        />
      )}
    </>
  );
};

export default PostTitle;
