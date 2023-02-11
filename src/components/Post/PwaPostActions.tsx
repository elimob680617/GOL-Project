import { FC, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { BottomSheet } from 'react-spring-bottom-sheet';

import { Box, IconButton, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { MessageText1 } from 'iconsax-react';
import { useSnackbar } from 'notistack';
import { useCreateLikeMutation } from 'src/_graphql/postbehavior/mutations/createLike.generated';
//icon
import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch } from 'src/store';
import { setSendPostId, setSendPostType } from 'src/store/slices/post/sendPost';
import { setSharedPostId, setSharedPostType } from 'src/store/slices/post/sharePost';
import { EntityType } from 'src/types/serverTypes/index';

import PostComponentsMessage from './PostComponentsMessage';

interface IPostAction {
  postType?: 'campaign' | 'social';
  like?: string;
  comment: string;
  share: string;
  view: string;
  setCommentOpen?: any;
  commentOpen?: any;
  id: string;
  isLikedByUser?: boolean;
  likeChanged?: (status: boolean) => void;
  countLikeChanged?: (status: any) => void;
  inDetails?: boolean;
  commentsCount?: string | null | undefined;
  sharedSocialPost?: any;
  sharedCampaignPost?: any;
}

const ActiontextStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));
const IconButtonAction = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

const PostActions: FC<IPostAction> = ({
  inDetails = false,
  like,
  comment,
  share,
  view,
  setCommentOpen,
  commentOpen,
  likeChanged,
  id,
  isLikedByUser,
  countLikeChanged,
  postType,
  commentsCount,
  sharedSocialPost,
  sharedCampaignPost,
}) => {
  const push = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<boolean | null>(false);
  const [copied, setCopied] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(!anchorEl);
  };

  const [createLikeMutation] = useCreateLikeMutation();
  const [countLike, setCountLike] = useState(Number(like));
  const [isLike, setIsLike] = useState(isLikedByUser);

  const createLike = () => {
    createLikeMutation({
      like: {
        dto: {
          entityType: EntityType.Post,
          entityId: id,
        },
      },
    });
  };

  function likeHandler() {
    if (isLike) {
      setIsLike(false);
      setCountLike(countLike - 1);
    } else {
      setIsLike(true);
      setCountLike(countLike + 1);
    }
  }
  const shareHandleClose = () => {
    setAnchorEl(false);
  };
  const onCopy = () => {
    setCopied(!copied);
    enqueueSnackbar('Link copied to clipboard.');
    shareHandleClose();
  };
  const handleSharedCampaignPost = () => {
    dispatch(setSharedPostId(sharedCampaignPost?.id));
    dispatch(setSharedPostType('campaign'));
    localStorage.setItem('idSharedPost', sharedCampaignPost?.id);
    localStorage.setItem('typeSharedPostType', 'campaign');
    push(`${PATH_APP.post.sharePost.index}/`);
  };

  const handleSharedSocialPost = () => {
    dispatch(setSharedPostId(sharedSocialPost?.id));
    dispatch(setSharedPostType('social'));
    localStorage.setItem('idSharedPost', sharedSocialPost?.id);
    localStorage.setItem('typeSharedPostType', 'social');
    push(`${PATH_APP.post.sharePost.index}/`);
  };
  const handleSharePost = () => {
    dispatch(setSharedPostId(id));
    dispatch(setSharedPostType(postType || 'social'));
    localStorage.setItem('idSharedPost', id);
    localStorage.setItem('typeSharedPostType', postType || 'social');
    push(`${PATH_APP.post.sharePost.index}/`);
  };
  const handleSentCampaignPost = () => {
    dispatch(setSendPostId(id));
    dispatch(setSendPostType('social'));
    localStorage.setItem('idSendPost', id);
    localStorage.setItem('typeSendPostType', 'social');
    push(`${PATH_APP.post.sendPost.index}/`);
  };
  const handleSentPost = () => {
    dispatch(setSendPostId(id));
    dispatch(setSendPostType(postType || ''));
    localStorage.setItem('idSendPost', id);
    localStorage.setItem('typeSendPostType', postType || '');
    push(`${PATH_APP.post.sendPost.index}/`);
  };
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Stack direction="row" alignItems="center">
        <IconButtonAction
          sx={{ p: 0.5 }}
          onClick={() => {
            createLike();
            likeChanged!(!isLikedByUser);
            likeHandler();
            countLikeChanged!(like || 0);
          }}
        >
          {!!isLikedByUser ? (
            <Icon name="heart" type="solid" color="error.main" />
          ) : (
            <Icon name="heart" type="linear" color="grey.500" />
          )}
        </IconButtonAction>

        {inDetails ? (
          <ActiontextStyle variant="body2">{countLike ? countLike : like}</ActiontextStyle>
        ) : (
          <ActiontextStyle variant="body2">{countLike}</ActiontextStyle>
        )}
      </Stack>

      <Box onClick={() => setCommentOpen(!commentOpen)}>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <IconButtonAction sx={{ p: 0.5 }}>
            <MessageText1 size={20} />
          </IconButtonAction>
          <ActiontextStyle variant="body2">{commentsCount ? commentsCount : comment}</ActiontextStyle>
        </Stack>
      </Box>

      <Stack direction="row" alignItems="center">
        <IconButtonAction sx={{ p: 0.5 }} onClick={handleClick}>
          <Icon name="Reshare" type="linear" color="grey.500" />
          <ActiontextStyle variant="body2">{share}</ActiontextStyle>
        </IconButtonAction>
      </Stack>

      <BottomSheet open={anchorEl as boolean} onDismiss={() => setAnchorEl(!anchorEl)}>
        <Stack py={2} px={2}>
          <IconButton
            sx={{ justifyContent: 'start' }}
            onClick={
              sharedSocialPost
                ? handleSharedSocialPost
                : sharedCampaignPost
                ? handleSharedCampaignPost
                : handleSharePost
            }
          >
            <Icon name="Reshare" type="linear" color="grey.500" />
            <Typography variant="body2" color="text.primary" sx={{ m: 1 }}>
              <FormattedMessage {...PostComponentsMessage.share} />
            </Typography>
          </IconButton>
          <IconButton
            sx={{ justifyContent: 'start' }}
            onClick={sharedCampaignPost ? handleSentCampaignPost : handleSentPost}
          >
            <Icon name="Send" type="linear" color="grey.500" />
            <Typography variant="body2" color="text.primary" sx={{ m: 1 }}>
              <FormattedMessage {...PostComponentsMessage.SendInChat} />
            </Typography>
          </IconButton>
          <CopyToClipboard
            text={`https://devpwa.aws.gardenoflove.co/post/campaign-post/post-details/${id}`}
            onCopy={onCopy}
          >
            <IconButton sx={{ justifyContent: 'start' }}>
              <Icon name="Link" type="solid" color="grey.500" />
              <Typography variant="body2" color="text.primary" sx={{ m: 1 }}>
                <FormattedMessage {...PostComponentsMessage.CopyLink} />
              </Typography>
            </IconButton>
          </CopyToClipboard>
        </Stack>
      </BottomSheet>

      <Stack direction="row" alignItems="center">
        <IconButtonAction sx={{ p: 0.5 }}>
          <Icon name="Eye" type="linear" color="grey.500" />
        </IconButtonAction>
        <ActiontextStyle variant="body2">{view}</ActiontextStyle>
      </Stack>
    </Stack>
  );
};

export default PostActions;
