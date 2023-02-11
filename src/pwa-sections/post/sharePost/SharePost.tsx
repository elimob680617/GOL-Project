import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
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
import MentionExample from 'src/components/textEditor/MentionAndHashtag';
import useAuth from 'src/hooks/useAuth';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
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

function SharePost() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const theme = useTheme();
  const back = useNavigate();
  const push = useNavigate();
  const { formatMessage } = useIntl();
  const [listOfRichs, setListOfRichs] = useState<any[]>([]);
  const [textLimitation, setTextLimitation] = useState<string>('');
  const [firstInitializeForUpdate, setFirstInitializeForUpdate] = useState<boolean>(false);
  const postShared = useSelector(basicSharePostSelector);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [sharePostRequest] = useSharePostMutation();
  const [updatePostRequest] = useUpdateSocialPostMutation();
  const [getSocialPost, { data: socialPostData, isFetching: getSocialPostFetching }] = useLazyGetSocialPostQuery();
  const socialPost = socialPostData?.getSocialPost?.listDto?.items?.[0];
  const [getFundRaisingPost, { data: campaignPostData, isFetching: getFundRaisingPostFetching }] =
    useLazyGetFundRaisingPostQuery();
  const campaignPost = campaignPostData?.getFundRaisingPost?.listDto?.items?.[0];
  const postEditMode = localStorage.getItem('postEditMode');
  const idSharedPost = localStorage.getItem('idSharedPost');
  const typeSharedPostType = localStorage.getItem('typeSharedPostType');

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const audienctTypeToString = (audience: Audience) => {
    switch (audience) {
      case Audience.Public:
        return 'Public';
      case Audience.Private:
        return 'Private';
      default:
        return '';
    }
  };

  const audienceChanged = (audience: Audience) => {
    dispatch(setSharedPostAudience(audience));
    handleClose();
  };

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

  const convertSlateValueToText = () => {
    let text = '';
    postShared.text.forEach((item: any, index: number) => {
      item.children &&
        item?.children.map &&
        item.children.forEach((obj: any) => {
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

        push(PATH_APP.home.index, { replace: true });
        dispatch(resetSharedPost());
      })
      .catch((err: any) => {
        toast.error(err.message);
        push(PATH_APP.home.index, { replace: true });

        dispatch(resetSharedPost());
      });
  };

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
    } else {
      if (typeSharedPostType === 'campaign') {
        getFundRaisingPost({
          filter: {
            dto: { id: idSharedPost },
          },
        });
      } else {
        getSocialPost({ filter: { dto: { id: idSharedPost } } });
      }
    }
  }, [
    getFundRaisingPost,
    getSocialPost,
    idSharedPost,
    postShared?.editMode,
    postShared?.id,
    postShared?.sharePostId,
    postShared?.sharedPostType,
    typeSharedPostType,
  ]);
  useEffect(() => {
    if ((postEditMode || postShared.editMode) && !firstInitializeForUpdate) {
      setFirstInitializeForUpdate(true);
    }
  }, [firstInitializeForUpdate, postEditMode, postShared]);

  const sharePostOrupdateSharePost = () => {
    if (postEditMode || postShared?.editMode) {
      updateSharePost();
    } else {
      sharePost();
    }
  };

  return (
    <>
      <Stack justifyContent={'space-between'}>
        <Stack>
          <Stack
            direction={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
            sx={{ py: 1.5, px: 2, borderBottom: `1px solid ${theme.palette.grey[100]}` }}
          >
            <Stack direction={'row'} spacing={2.5} alignItems={'center'}>
              <IconButton
                onClick={() => {
                  back(-1);
                  dispatch(resetSharedPost());
                }}
                sx={{ padding: 0 }}
              >
                <Icon name="left-arrow-1" color="grey.500" />
              </IconButton>
              <Typography variant="subtitle1">
                <FormattedMessage {...SharePostMessages.share} />
              </Typography>
            </Stack>
            <LoadingButton
              onClick={sharePostOrupdateSharePost}
              variant="contained"
              size="small"
              sx={{ height: 32 }}
              disabled={Number(textLimitation) >= 3000}
            >
              {postEditMode || postShared.editMode
                ? formatMessage(SharePostMessages.edit)
                : formatMessage(SharePostMessages.share)}
            </LoadingButton>
          </Stack>
          <Stack
            spacing={2}
            sx={{ p: 2, minHeight: 'calc(100vh - 130px)', maxHeight: 'calc(100vh - 130px)', overflow: 'auto' }}
          >
            <Stack direction={'row'} spacing={2}>
              <Avatar
                src={user?.avatarUrl || ''}
                sx={{ width: 48, height: 48 }}
                variant={user?.userType === UserTypeEnum.Ngo ? 'rounded' : 'circular'}
              />

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

                      <SelectedLocationStyle
                        onClick={() => push(PATH_APP.post.sharePost.addLocation)}
                        variant="subtitle2"
                      >
                        {postShared?.location?.address}
                      </SelectedLocationStyle>
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
              <MentionExample
                setListOfRichs={setListOfRichs}
                setTextLimitation={setTextLimitation}
                eventType={'sharePost'}
                value={postShared.text}
                onChange={(value: Descendant[]) => dispatch(setSharedPostText(value))}
              />
            </Stack>
            {Number(textLimitation) >= 3000 ? (
              <Box
                sx={{
                  width: '100%',
                  height: 'rem',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  bgcolor: 'background.neutral',
                  p: 1,
                }}
              >
                <Icon name="Exclamation-Mark" color="error.main" type="solid" />
                <Typography variant="subtitle2" color={ERROR.main}>
                  <FormattedMessage {...SharePostMessages.shareTextLimitation} />
                </Typography>
              </Box>
            ) : null}

            {typeSharedPostType === 'campaign' ||
            postShared?.sharedPostType === 'campaign' ||
            ((postEditMode || postShared.editMode) && socialPost?.isSharedCampaignPost) ? (
              getFundRaisingPostFetching || ((postEditMode || postShared.editMode) && getSocialPostFetching) ? (
                <Stack alignItems="center" justifyContent="center">
                  <CircularProgress size={16} />
                </Stack>
              ) : (
                <ShareCampaignPostCard
                  post={postEditMode || postShared.editMode ? socialPost : campaignPost}
                  isShared
                />
              )
            ) : getSocialPostFetching ? (
              <Stack alignItems="center" justifyContent="center">
                <CircularProgress size={16} />
              </Stack>
            ) : (
              <ShareSocialPostCard post={socialPost} isShared />
            )}
          </Stack>
        </Stack>
        <Stack>
          <Divider />
          <Stack sx={{ p: 2 }} alignItems={'flex-start'}>
            <Link to={PATH_APP.post.sharePost.addLocation}>
              <IconButton>
                <Icon name="location" color="grey.900" type="linear" />
              </IconButton>
            </Link>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}

export default SharePost;
