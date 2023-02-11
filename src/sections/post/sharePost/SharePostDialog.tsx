// @mui
import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
  styled,
  useTheme,
} from '@mui/material';

import { Descendant } from 'slate';
import { useUpdateSocialPostMutation } from 'src/_graphql/post/create-post/mutations/updateSocialPost.generated';
import { useLazyGetSocialPostQuery } from 'src/_graphql/post/getSocialPost.generated';
import { useLazyGetFundRaisingPostQuery } from 'src/_graphql/post/post-details/queries/getFundRaisingPost.generated';
import { useSharePostMutation } from 'src/_graphql/post/share-post/mutations/sharePost.generated';
import Dot from 'src/components/Dot';
//icon
import { Icon } from 'src/components/Icon';
import { MentionAndHashtag } from 'src/components/textEditor';
import useAuth from 'src/hooks/useAuth';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch } from 'src/store';
import { setNewPost, setUpdatePost } from 'src/store/slices/homePage';
import {
  basicSharePostSelector,
  resetSharedPost,
  setSharedPostAudience,
  setSharedPostText,
} from 'src/store/slices/post/sharePost';
import { ERROR } from 'src/theme/palette';
import { Audience, PostStatus, UserTypeEnum } from 'src/types/serverTypes';

import ShareCampaignPostCard from './ShareCampaignPostCard';
import SharePostMessages from './SharePost.messages';
import ShareSocialPostCard from './ShareSocialPostCard';

const HeaderWrapperStyle = styled(Stack)(({ theme }) => ({
  // height: 56,
  padding: theme.spacing(2, 1.5, 2, 2),
  boxShadow: '0px 0px 1px rgba(40, 41, 61, 0.04), 0px 2px 4px rgba(96, 97, 112, 0.16)',
}));
const UserFullNameStyle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  lineHeight: '22.5px',
  fontSize: '18px',
  color: theme.palette.grey[900],
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
const ViewerButtonStyle = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(1),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: 32,
  width: 'fit-content',
}));
const ViewrTextStyle = styled(Typography)(({ theme }) => ({
  fontWeight: 300,
  fontSize: 14,
  lineHeight: '17.5px',
  color: theme.palette.grey[900],
}));

function SharePostDialog() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const theme = useTheme();
  const back = useNavigate();
  const push = useNavigate();
  const location = useLocation();
  const isPostDetails = location.pathname.includes('post-details');
  const { formatMessage } = useIntl();
  const [listOfRichs, setListOfRichs] = useState<any[]>([]);
  const [textLimitation, setTextLimitation] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [firstInitializeForUpdate, setFirstInitializeForUpdate] = useState<boolean>(false);
  const open = Boolean(anchorEl);
  const [sharePostRequest] = useSharePostMutation();
  const [updatePostRequest] = useUpdateSocialPostMutation();
  const postShared = useSelector(basicSharePostSelector);
  const [getSocialPost, { data: socialPostData, isFetching: getSocialPostFetching }] = useLazyGetSocialPostQuery();
  const socialPost = socialPostData?.getSocialPost?.listDto?.items?.[0];
  const [getFundRaisingPost, { data: campaignPostData, isFetching: getFundRaisingPostFetching }] =
    useLazyGetFundRaisingPostQuery();
  const campaignPost = campaignPostData?.getFundRaisingPost?.listDto?.items?.[0];
  const listOfTag: any[] = [];
  const listOfMention: any[] = [];
  let postSharedText = '';

  listOfRichs.forEach((item) => {
    item?.children?.forEach((obj: any) => {
      if (obj.type) {
        // obj.type === 'tag' ? listOfTag.push(obj.id) : obj.type === 'mention' ? listOfMention.push(obj.id) : null;
        switch (obj.type) {
          case 'tag':
            listOfTag.push(obj.id);
            break;
          case 'mention':
            listOfMention.push(obj.id);
            break;
          default:
            break;
        }
      }
      obj.text
        ? (postSharedText += obj.text)
        : obj.type === 'tag'
        ? (postSharedText += `#${obj.title}`)
        : obj.type === 'mention'
        ? (postSharedText += `╣${obj.fullname}╠`)
        : (postSharedText += ' ');
    });
    if (listOfRichs.length > 1) {
      postSharedText += '\\n';
    }
  });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const audienceChanged = (audience: Audience) => {
    dispatch(setSharedPostAudience(audience));
    handleClose();
  };

  const audienctTypeToString = (audience: Audience) => {
    switch (audience) {
      // case Audience.Followers:
      //   return 'Followers';
      // case Audience.FollowersExcept:
      //   return 'Followers except';
      // case Audience.OnlyMe:
      //   return 'Only me';
      case Audience.Public:
        return 'Public';
      case Audience.Private:
        return 'Private';
      // case Audience.SpecificFollowers:
      //   return 'Specific Followers';
      default:
        return '';
    }
  };
  const onCloseShareDialog = () => {
    // push(PATH_APP.home.index);
    back(-1);
    // router.back();
    dispatch(resetSharedPost());
  };
  useEffect(() => {
    if (!postShared?.id) {
      // back(-1);
      push(PATH_APP.home.index, { replace: true });
    }
  }, [postShared?.id, push]);

  useEffect(() => {
    if (postShared?.id) {
      if (postShared?.sharedPostType === 'campaign') {
        getFundRaisingPost({
          filter: {
            dto: { id: postShared?.id },
          },
        });
      } else {
        getSocialPost({ filter: { dto: { id: postShared?.id } } });
      }
    }
  }, [getFundRaisingPost, getSocialPost, postShared?.id, postShared?.sharedPostType]);

  const convertSlateValueToText = () => {
    let text = '';
    // eslint-disable-next-line array-callback-return
    postShared.text.map((item: any, index: number) => {
      item.children &&
        item?.children.map &&
        // eslint-disable-next-line array-callback-return
        item.children.map((obj: any) => {
          if (obj.type) {
            // obj.type === 'tag' ? listOfTag.push(obj.id) : obj.type === 'mention' ? listOfMention.push(obj.id) : null;
            switch (obj.type) {
              case 'tag':
                listOfTag.push(obj.id);
                break;
              case 'mention':
                listOfMention.push(obj.id);
                break;
              default:
                break;
            }
          }
          obj.text
            ? (text += obj.text)
            : obj.type === 'tag'
            ? (text += `#${obj.title} `)
            : obj.type === 'mention'
            ? (text += `╣${obj.fullname}╠`)
            : (text += '');
        });
      if (index + 1 !== postShared.text.length) text += ' \\n';
    });
    return text;
  };

  const sharePost = () => {
    sharePostRequest({
      socialPost: {
        dto: {
          audience: postShared.audience,
          id: postShared.id,
          body: convertSlateValueToText(),
          mentionedUserIds: listOfMention,
          tagIds: listOfTag,
          placeId: postShared.location && postShared.location.id ? postShared.location.id : '',
          status: PostStatus.Show,
          sharePostId: postShared.id,
        },
      },
    })
      .unwrap()
      .then((res: any) => {
        dispatch(setNewPost({ id: res?.sharePost?.listDto?.items?.[0]?.id as string, type: 'share' }));

        // replace(PATH_APP.home.index, undefined);
        push(PATH_APP.home.index, { replace: true });
        dispatch(resetSharedPost());
      })
      .catch((err: any) => {
        toast.error(err.message);
        push(PATH_APP.home.index, { replace: true });

        dispatch(resetSharedPost());
      });
  };

  const updateSharePost = () => {
    updatePostRequest({
      socialPost: {
        dto: {
          audience: postShared.audience,
          id: postShared.id,
          body: convertSlateValueToText(),
          placeId: postShared.location && postShared.location.id ? postShared.location.id : '',
          mentionedUserIds: [],
          tagIds: [],
          status: PostStatus.Show,
          sharePostId: postShared.sharePostId,
        },
      },
    })
      .unwrap()
      .then((res: any) => {
        dispatch(setUpdatePost({ id: res.updateSocialPost?.listDto?.items?.[0]?.id as string, type: 'share' }));

        // replace(PATH_APP.home.index);
        push(PATH_APP.home.index, { replace: true });
        dispatch(resetSharedPost());
      })
      .catch((err: any) => {
        toast.error(err.message);
        // replace(PATH_APP.home.index);
        push(PATH_APP.home.index, { replace: true });

        dispatch(resetSharedPost());
      });
  };

  useEffect(() => {
    if (postShared.editMode && !firstInitializeForUpdate) {
      setFirstInitializeForUpdate(true);
    }
  }, [firstInitializeForUpdate, postShared]);

  const sharePostOrupdateSharePost = () => {
    if (postShared?.editMode) {
      updateSharePost();
    } else {
      sharePost();
    }
  };

  return (
    <>
      <Dialog maxWidth="sm" fullWidth keepMounted open={true} onClose={onCloseShareDialog}>
        <DialogTitle sx={{ padding: 0 }} id="responsive-dialog-title">
          <HeaderWrapperStyle direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle1" color={theme.palette.text.primary}>
              <FormattedMessage {...SharePostMessages.share} />
            </Typography>
            <IconButton onClick={onCloseShareDialog} sx={{ padding: 0 }}>
              <Icon name="Close-1" color="grey.500" type="linear" />
            </IconButton>
          </HeaderWrapperStyle>
        </DialogTitle>
        <DialogContent sx={{ maxHeight: 656 }}>
          <Stack spacing={2} direction="row" sx={{ mt: 2, mb: 2 }}>
            <Stack>
              <Avatar
                src={user?.avatarUrl || ''}
                sx={{ width: 48, height: 48 }}
                variant={user?.userType === UserTypeEnum.Ngo ? 'rounded' : 'circular'}
              />
            </Stack>
            <Stack spacing={1}>
              <Stack spacing={1} direction="row">
                <UserFullNameStyle variant="h6">
                  {user?.firstName && user?.lastName ? user?.firstName + ' ' + user?.lastName : user?.fullName}
                </UserFullNameStyle>
                {postShared?.location && postShared?.location?.id && (
                  <Stack justifyContent="center">
                    <Dot />
                  </Stack>
                )}
                {postShared?.location && postShared?.location?.id && (
                  <Stack sx={{ flex: 1 }} spacing={0.5} direction="row" alignItems="center" flexWrap="nowrap">
                    <Box sx={{ minWidth: 16, minHeight: 16 }}>
                      <Icon name="location" color="grey.700" type="linear" />
                    </Box>
                    {!isPostDetails ? (
                      <SelectedLocationStyle
                        onClick={() => push(PATH_APP.post.sharePost.addLocation)}
                        variant="subtitle2"
                      >
                        {postShared?.location?.address}
                      </SelectedLocationStyle>
                    ) : (
                      <SelectedLocationStyle
                        onClick={() =>
                          push(
                            `${PATH_APP.post.postDetails.index}/${postShared?.id}/location/${postShared?.sharedPostType}`,
                          )
                        }
                        variant="subtitle2"
                      >
                        {postShared?.location?.address}
                      </SelectedLocationStyle>
                    )}
                  </Stack>
                )}
              </Stack>
              <ViewerButtonStyle
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Stack justifyContent="center">
                    <Icon name="Earth" color="grey.700" type="linear" />
                  </Stack>
                  <ViewrTextStyle variant="body2">
                    {audienctTypeToString(postShared?.audience as Audience)}
                  </ViewrTextStyle>
                  <Stack justifyContent="center">
                    <Icon name="down-arrow" color="grey.700" type="linear" />
                  </Stack>
                </Stack>
              </ViewerButtonStyle>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem onClick={() => audienceChanged(Audience.Public)}>Public</MenuItem>
                <MenuItem onClick={() => audienceChanged(Audience.Private)}>Private</MenuItem>
                {/* <MenuItem onClick={() => audienceChanged(Audience.OnlyMe)}> Only me</MenuItem>
                <MenuItem onClick={() => audienceChanged(Audience.Followers)}>Followers</MenuItem>
                <MenuItem onClick={() => audienceChanged(Audience.SpecificFollowers)}>Specific Followers</MenuItem>
                <MenuItem onClick={() => audienceChanged(Audience.FollowersExcept)}>Followers except</MenuItem> */}
              </Menu>
            </Stack>
          </Stack>
          <Stack>
            <MentionAndHashtag
              setListOfRichs={setListOfRichs}
              eventType={'sharePost'}
              setTextLimitation={setTextLimitation}
              value={postShared.text}
              onChange={(value: Descendant[]) => dispatch(setSharedPostText(value))}
            />
          </Stack>

          {postShared?.sharedPostType === 'campaign' || (postShared.editMode && socialPost?.isSharedCampaignPost) ? (
            getFundRaisingPostFetching || (postShared.editMode && getSocialPostFetching) ? (
              <Stack alignItems="center" justifyContent="center">
                <CircularProgress size={16} />
              </Stack>
            ) : (
              <ShareCampaignPostCard post={postShared.editMode ? socialPost : campaignPost} isShared />
            )
          ) : getSocialPostFetching ? (
            <Stack alignItems="center" justifyContent="center">
              <CircularProgress size={16} />
            </Stack>
          ) : (
            <ShareSocialPostCard post={socialPost} isShared />
          )}
        </DialogContent>
        <Divider />
        <DialogActions sx={{ justifyContent: 'space-between' }}>
          {Number(textLimitation) >= 3001 ? (
            <Stack spacing={2} sx={{ width: '100%' }}>
              <Stack alignItems={'center'} direction="row">
                <Icon name="Exclamation-Mark" color="error.main" type="solid" />
                <Typography variant="button" color={ERROR.main}>
                  <FormattedMessage {...SharePostMessages.shareTextLimitation} />
                </Typography>
              </Stack>
            </Stack>
          ) : (
            <>
              {!isPostDetails ? (
                <Link to={PATH_APP.post.sharePost.addLocation}>
                  <IconButton sx={{ p: 0 }}>
                    <Icon name="location" color="grey.900" type="linear" />
                  </IconButton>
                </Link>
              ) : (
                <Link
                  // to={PATH_APP.post.sharePost.addLocation}
                  to={`${PATH_APP.post.postDetails.index}/${postShared?.id}/location/${postShared?.sharedPostType}`}
                >
                  <IconButton sx={{ p: 0 }}>
                    <Icon name="location" color="grey.900" type="linear" />
                  </IconButton>
                </Link>
              )}

              <Button
                onClick={sharePostOrupdateSharePost}
                variant="contained"
                sx={{ width: 120 }}
                disabled={Number(textLimitation) >= 3001}
              >
                {postShared.editMode ? formatMessage(SharePostMessages.edit) : formatMessage(SharePostMessages.share)}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

export default SharePostDialog;
