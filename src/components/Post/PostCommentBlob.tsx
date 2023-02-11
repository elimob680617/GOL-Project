import { useEffect, useMemo, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { MoreHoriz } from '@mui/icons-material';
import { Avatar, Box, CircularProgress, Grid, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useCreateLikeMutation } from 'src/_graphql/postbehavior/mutations/createLike.generated';
import useAuth from 'src/hooks/useAuth';
import { PATH_APP } from 'src/routes/paths';
import { EntityType, UserTypeEnum } from 'src/types/serverTypes';

import Dot from '../Dot';
import { Icon } from '../Icon';
import PostCommentDescription from './PostCommentDescription';
import PostCommentInput from './PostCommentInput';
import PostComponentsMessage from './PostComponentsMessage';
import PostConfrimDialog from './PostConfrimDialog';

const PostCommetsBlob = styled(Box)(({ theme }) => ({
  maxWidth: '100%',
  backgroundColor: theme.palette.background.neutral,
  padding: '1rem',
  borderRadius: '8px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
}));

const PostCommetsText = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  overflow: 'auto',
  '& $p': {
    width: '100%',
  },
}));
const PostCommetsTextFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.5rem 0',
}));

const PostCommentsTextFooterDot = styled('span')(({ theme }) => ({
  margin: '0 0.5rem',
}));
const PostCommentsLikeCounterContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
}));
const PostCommentsLikeCounter = styled(Box)(({ theme }) => ({
  borderRadius: '50%',
  color: theme.palette.surface.main,
  width: '18px',
  height: '18px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: '0.3rem',
}));
const IconButtonAction = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));
interface IPostCommentBlob {
  data: any;
  isReplay?: boolean;
  hasMedia?: boolean;
  setGetNewComments: any;
  PostId: string;
  parentId?: string;
  postType?: any;
  commentsCount?: string | null | undefined;
  setCommentsCount?: any;
}

function PostCommentBlob(props: IPostCommentBlob) {
  const { data, isReplay, hasMedia, setGetNewComments, PostId, parentId, postType, commentsCount, setCommentsCount } =
    props;
  const [liked, setLiked] = useState<boolean>(false);
  const [likeLoading, setLikeLoading] = useState<boolean>(false);
  const [commentLikeMutation] = useCreateLikeMutation();
  const [replayOpen, setReplayOpen] = useState<boolean>(false);
  const [commentId, setCommentId] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [body, setBody] = useState<string>('');
  const [openPublishDialog, setOpenPublishDialog] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<string | null | undefined>('');
  const open = Boolean(anchorEl);
  const { user } = useAuth();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const LikeDiv = styled(Box)(({ theme }) => ({
    color: liked || data.isLikedByUser ? theme.palette.primary.main : theme.palette.surface.onSurfaceVariant,
  }));
  const ReplayDiv = styled(Box)(({ theme }) => ({
    color: theme.palette.surface.onSurfaceVariant,
  }));

  const LikeHandler = (e: any) => {
    setLikeLoading(true);
    const commentIdForLike = data.id;
    commentLikeMutation({
      like: { dto: { entityType: EntityType.Comment, entityId: commentIdForLike } },
    })
      .unwrap()
      .then((res: any) => {
        const response = res?.createLike?.listDto?.items?.[0]?.isLike;
        if (response) {
          setLiked(true);
          setLikeLoading(false);
          setLikeCount(res?.createLike?.listDto?.items?.[0]?.count);
          // setGetNewComments(Math.random());
        } else if (!response) {
          setLiked(false);
          setLikeLoading(false);
          setLikeCount(res?.createLike?.listDto?.items?.[0]?.count);
          // setGetNewComments(Math.random());
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  const handleReplayComment = (e: any) => {
    setCommentId(e.target.id);
    setReplayOpen(!replayOpen);
  };
  const BrElementCreator = () => <br />;
  const MentionElementCreator = (fullname: string, username: string, id: string) => (
    <Link to={''}>
      <Typography
        variant="subtitle1"
        color="primary.main"
        className="inserted-mention"
        id={id}
        sx={{
          padding: '0!important',
          verticalAlign: 'baseline',
          display: 'inline-block',
          lineHeight: '0',
        }}
      >
        {fullname}
      </Typography>
    </Link>
  );
  const TagElementCreator = (tag: string) => (
    <Link to={''}>
      <Typography
        variant="subtitle1"
        color="primary.main"
        className="inserted-tag"
        sx={{
          verticalAlign: 'baseline',
          display: 'inline-block',
          padding: '0!important',
          lineHeight: '0',
        }}
      >
        {tag}
      </Typography>
    </Link>
  );

  useEffect(() => {
    if (!data) return;
    let bodyData = data.body;
    const mentions = bodyData?.match(/╣(.*?)╠/g) || [];
    const tags = bodyData?.match(/#(.*?)\s/g) || [];

    bodyData = bodyData?.replace(/\\n/g, ReactDOMServer.renderToStaticMarkup(BrElementCreator()));

    mentions.forEach((mention: any) => {
      const mentionedValue = mention.replace('╣', '').replace('╠', '');
      bodyData = bodyData?.replace(
        mention,
        ReactDOMServer.renderToStaticMarkup(MentionElementCreator(mentionedValue, mentionedValue, mentionedValue)),
      );
    });

    tags.forEach((tag: any) => {
      bodyData = bodyData?.replace(new RegExp(tag, 'g'), ReactDOMServer.renderToStaticMarkup(TagElementCreator(tag)));
    });

    setBody(bodyData);
  }, [data]);

  const profileRoute = useMemo(() => {
    if (data.userType === UserTypeEnum.Ngo) {
      if (data.isMine) return PATH_APP.profile.ngo.root;
      return PATH_APP.profile.ngo.root + '/view/' + data.userId;
    } else {
      if (data.userId === user?.id) return PATH_APP.profile.user.root;
      return PATH_APP.profile.user.root + '/view/' + data.userId;
    }
  }, [data.isMine, data.userId, data.userType, user?.id]);
  console.log(data, liked);
  return (
    <Grid item xs={isReplay ? 10 : 12}>
      <Grid container xs={12}>
        <Grid item xs={2} display="flex" justifyContent="center" sx={{ pt: 1 }}>
          <Link to={profileRoute}>
            <Avatar
              src={data.userAvatarUrl}
              sx={{ cursor: 'pointer' }}
              variant={
                data?.userType === UserTypeEnum.Ngo || data?.userType === UserTypeEnum.Company ? 'rounded' : 'circular'
              }
            />
          </Link>
        </Grid>
        <Grid item xs={10} sx={{ maxWidth: '100%' }}>
          {hasMedia && data.body !== '' ? (
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ maxWidth: 200, mt: 1 }}>
              <Box>
                <Link to={profileRoute}>
                  <Typography variant="subtitle1"> {data.userFullName}</Typography>
                </Link>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <Box sx={{ mr: 1 }}>
                  <Typography variant="caption" sx={{ color: 'grey.500' }}>
                    {data.createDateTime}
                  </Typography>
                </Box>
                <IconButton
                  id="basic-button"
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                  sx={{ padding: 0 }}
                >
                  <MoreHoriz sx={{ color: 'grey.100' }} />
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
                  {data.userId === user?.id ? (
                    <MenuItem onClick={() => setOpenPublishDialog(true)}>
                      {' '}
                      <Icon name="trash" />
                      <FormattedMessage {...PostComponentsMessage.Delete} />
                    </MenuItem>
                  ) : (
                    <MenuItem>
                      {' '}
                      <Icon name="Flag" />
                      <FormattedMessage {...PostComponentsMessage.Report} />
                    </MenuItem>
                  )}
                </Menu>
                <PostConfrimDialog
                  setOpenPublishDialog={setOpenPublishDialog}
                  openPublishDialog={openPublishDialog}
                  CommentId={data.id}
                  setGetNewComments={setGetNewComments}
                  commentsCount={commentsCount}
                  setCommentsCount={setCommentsCount}
                  postType={postType}
                  postId={PostId}
                />
              </Box>
            </Box>
          ) : (
            <PostCommetsBlob>
              <Box>
                <Box>
                  <Link to={profileRoute}>
                    <Typography variant="subtitle1"> {data.userFullName}</Typography>
                  </Link>
                </Box>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <Box sx={{ mr: 1 }}>
                  <Typography variant="caption" sx={{ color: 'grey.100' }}>
                    {data.createDateTime}
                  </Typography>
                </Box>
                <IconButton
                  id="basic-button"
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                  sx={{ padding: 0 }}
                >
                  <MoreHoriz sx={{ color: 'grey.100' }} />
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
                  {data.userId === user?.id ? (
                    <MenuItem onClick={() => setOpenPublishDialog(true)}>
                      {' '}
                      <Icon name="trash" />
                      <FormattedMessage {...PostComponentsMessage.Delete} />
                    </MenuItem>
                  ) : (
                    <MenuItem>
                      {' '}
                      <Icon name="Flag" />
                      <FormattedMessage {...PostComponentsMessage.Report} />
                    </MenuItem>
                  )}
                </Menu>
                <PostConfrimDialog
                  setOpenPublishDialog={setOpenPublishDialog}
                  openPublishDialog={openPublishDialog}
                  CommentId={data.id}
                  setGetNewComments={setGetNewComments}
                  commentsCount={commentsCount}
                  setCommentsCount={setCommentsCount}
                  postType={postType}
                  postId={PostId}
                />
              </Box>
              <PostCommetsText>
                <Typography variant="body2">
                  <PostCommentDescription description={body} />
                </Typography>
              </PostCommetsText>
            </PostCommetsBlob>
          )}
          {hasMedia ? (
            <Box sx={{ mt: 1 }}>
              <img src={data.mediaUrl} style={{ width: 200, borderRadius: '8px' }} alt="" />
              <PostCommetsTextFooter>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'surface.onSurfaceVariant',
                    cursor: 'pointer',
                    display: 'flex',
                  }}
                >
                  <ReplayDiv onClick={handleReplayComment} id={data.id}>
                    <FormattedMessage {...PostComponentsMessage.Reply} />
                  </ReplayDiv>
                  <PostCommentsTextFooterDot>
                    <Dot />
                  </PostCommentsTextFooterDot>
                  {likeLoading ? (
                    <IconButtonAction>
                      <CircularProgress size={7} />
                    </IconButtonAction>
                  ) : (
                    <LikeDiv onClick={LikeHandler} id={data}>
                      {liked || data.isLikedByUser ? (
                        <Box>
                          <FormattedMessage {...PostComponentsMessage.Liked} />
                        </Box>
                      ) : (
                        <Box>
                          <FormattedMessage {...PostComponentsMessage.Like} />
                        </Box>
                      )}
                    </LikeDiv>
                  )}
                </Typography>
                {likeCount && Number.parseInt(likeCount) > 0 && (
                  <Typography variant="caption" sx={{ color: 'surface.onSurfaceVariant' }}>
                    {likeLoading ? (
                      <IconButtonAction>
                        <CircularProgress size={7} />
                      </IconButtonAction>
                    ) : (
                      <PostCommentsLikeCounterContainer>
                        <PostCommentsLikeCounter
                          sx={{
                            backgroundColor: liked || data.isLikedByUser ? 'primary.light' : 'grey.100',
                          }}
                        >
                          <Icon name="Like" color={liked || data.isLikedByUser ? 'primary.dark' : ' grey.500'} />
                        </PostCommentsLikeCounter>{' '}
                        {likeCount}
                      </PostCommentsLikeCounterContainer>
                    )}
                  </Typography>
                )}
              </PostCommetsTextFooter>
              {replayOpen && commentId === data.id && (
                <PostCommentInput
                  parentId={parentId ? parentId : null}
                  commentReplayId={commentId}
                  replay={isReplay ? true : false}
                  isComment={isReplay ? false : true}
                  postId={PostId}
                  setGetNewComments={setGetNewComments}
                  setReplayOpen={setReplayOpen}
                  postType={postType}
                  commentsCount={commentsCount}
                  setCommentsCount={setCommentsCount}
                />
              )}
            </Box>
          ) : (
            <Box>
              <PostCommetsTextFooter>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'surface.onSurfaceVariant',
                    cursor: 'pointer',
                    display: 'flex',
                  }}
                >
                  <ReplayDiv onClick={handleReplayComment} id={data.id}>
                    <FormattedMessage {...PostComponentsMessage.Reply} />
                  </ReplayDiv>
                  <PostCommentsTextFooterDot>
                    <Dot />
                  </PostCommentsTextFooterDot>
                  {likeLoading ? (
                    <IconButtonAction>
                      <CircularProgress size={7} />
                    </IconButtonAction>
                  ) : (
                    <LikeDiv onClick={LikeHandler} id={data}>
                      {liked || data.isLikedByUser ? (
                        <Box>
                          <FormattedMessage {...PostComponentsMessage.Liked} />
                        </Box>
                      ) : (
                        <Box>
                          <FormattedMessage {...PostComponentsMessage.Like} />
                        </Box>
                      )}
                    </LikeDiv>
                  )}
                </Typography>
                {likeCount && Number.parseInt(likeCount) > 0 && (
                  <Typography variant="caption" sx={{ color: 'surface.onSurfaceVariant' }}>
                    {likeLoading ? (
                      <IconButtonAction>
                        <CircularProgress size={7} />
                      </IconButtonAction>
                    ) : (
                      <PostCommentsLikeCounterContainer>
                        <PostCommentsLikeCounter
                          sx={{
                            backgroundColor: liked || data.isLikedByUser ? 'primary.light' : 'grey.100',
                          }}
                        >
                          <Icon name="Like" color={liked || data.isLikedByUser ? 'primary.dark' : ' grey.500'} />
                        </PostCommentsLikeCounter>{' '}
                        {likeCount}
                      </PostCommentsLikeCounterContainer>
                    )}
                  </Typography>
                )}
              </PostCommetsTextFooter>
              {replayOpen && commentId === data.id && (
                <PostCommentInput
                  replay={isReplay ? true : false}
                  isComment={isReplay ? false : true}
                  commentReplayId={commentId}
                  postId={PostId}
                  setGetNewComments={setGetNewComments}
                  setReplayOpen={setReplayOpen}
                  postType={postType}
                  commentsCount={commentsCount}
                  setCommentsCount={setCommentsCount}
                />
              )}
            </Box>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default PostCommentBlob;
