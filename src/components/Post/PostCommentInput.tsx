import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';

import LoadingButton from '@mui/lab/LoadingButton';
import { Avatar, Box, Stack, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

import { Descendant } from 'slate';
import { useCreateCommentMutation } from 'src/_graphql/postbehavior/mutations/createComment.generated';
import CommentGif from 'src/components/Post/commentFeature/CommentGif';
import CommentImage from 'src/components/Post/commentFeature/CommentImage';
import useAuth from 'src/hooks/useAuth';
import { dispatch } from 'src/store';
import { updateCampaignPostComment, updateSocialPostComment } from 'src/store/slices/homePage';
import { basicCreateSocialPostSelector, setText } from 'src/store/slices/post/createSocialPost';
import { UserTypeEnum } from 'src/types/serverTypes';

import { Icon } from '../Icon';
import CommentTextEditor from '../textEditor/Comment';
import PostComponentsMessage from './PostComponentsMessage';

const textValue = [
  {
    type: 'paragraph',
    children: [
      {
        text: '',
      },
    ],
  } as Descendant,
];
interface ICommentInput {
  replay?: boolean;
  isComment?: boolean;
  postId: string;
  setGetNewComments: any;
  commentReplayId?: string;
  PostDetails?: boolean;
  parentId?: string | null;
  isSearch?: boolean;
  setReplayOpen?: any;
  postType?: string;
  commentsCount?: string | null | undefined;
  setCommentsCount?: any;
  setComments?: any;
  comments?: any;
}
const RemoveImageStyle = styled(Stack)(({ theme }) => ({
  width: 24,
  height: 24,
  backgroundColor: 'rgba(244, 247, 251, 0.64)',
  borderRadius: theme.shape.borderRadius,
  position: 'absolute',
  right: 8,
  top: 8,
  zIndex: 3,
  cursor: 'pointer',
}));

const InputBox = styled(Stack)(({ theme }) => ({
  border: `1px solid ${theme.palette.surface.onSurfaceVariantL}`,
  minHeight: 40,
  maxHeight: 124,
  borderRadius: '8px',
  paddingLeft: 8,
  // overflowX:'auto',
  '&::-webkit-scrollbar': {
    width: 12,
  },

  '&::-webkit-scrollbar-track': {
    background: theme.palette.grey[0],
    borderRadius: 8,
  },

  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.grey[300],
    borderRadius: 10,
    border: `4px solid ${theme.palette.grey[0]}`,
  },
}));
function PostCommentInput(props: ICommentInput) {
  const {
    replay,
    isComment,
    postId,
    commentReplayId,
    parentId,
    isSearch,
    setReplayOpen,
    postType,
    commentsCount,
    setCommentsCount,
    setComments,
    comments,
    setGetNewComments,
  } = props;
  const { user } = useAuth();
  const abcdefg = useSelector(basicCreateSocialPostSelector);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [removeFileFlag, setRemoveFileFlag] = useState<number>(0);
  const [uploFileFlag] = useState<number>(0);
  // const [gifSelect, setGifSelect] = useState<string>('');
  const [getCommentValueFlag, setGetCommentValueFlag] = useState<number>(0);
  const [postBTN, setPostBTN] = useState<boolean>(false);
  const [inputId] = useState(Math.random());
  const [createCommets] = useCreateCommentMutation();
  const theme = useTheme();

  const listOfTag: string[] = [];
  const listOfMention: { fullName: string; mentionedUserId: string }[] = [];

  const convertSlateValueToText = (el: any) => {
    let text = '';
    el.map((item: any) => {
      item.children &&
        item?.children.map &&
        item.children.map((obj: any) => {
          obj.text
            ? (text += obj.text)
            : obj.type === 'tag'
            ? (text += `#${obj.title}`)
            : obj.type === 'mention'
            ? (text += `╣${obj.fullname}╠`)
            : (text += '');
          return text;
        });
      text += ' ';
      return text;
    });
    return text;
  };

  const commentsBody = convertSlateValueToText(abcdefg.text);
  const handleSendComment = (e: any) => {
    e.preventDefault();
    setPostBTN(true);
    createCommets({
      comment: {
        dto: {
          body: convertSlateValueToText(abcdefg.text),
          postId: postId,
          mediaUrl: imagePreview || null,
          commentTagIds: listOfTag,
          mentionedUsers: listOfMention,
          parentId: commentReplayId ? commentReplayId : null,
          replyId: parentId ? parentId : null,
        },
      },
    })
      .unwrap()
      .then((res) => {
        if (replay || parentId || commentReplayId) {
          setGetNewComments(Math.random());
        } else {
          setComments([res.createComment?.listDto?.items?.[0], ...comments]);
        }
        if (setCommentsCount) {
          setCommentsCount(Number(commentsCount) + 1);
        }
        if (postType === 'campaign') {
          dispatch(updateCampaignPostComment({ id: postId, type: 'positive' }));
        } else if (postType === 'social') {
          dispatch(updateSocialPostComment({ id: postId, type: 'positive' }));
        }

        dispatch(setText(textValue));
        setGetCommentValueFlag(Math.random());
        setImagePreview('');
        setPostBTN(false);
        if (setReplayOpen) {
          setReplayOpen(false);
        }
      });
  };
  return (
    <Box>
      <Stack
        sx={{
          padding: replay || isComment ? 0 : 2,
          paddingBottom: 2,
          maxWidth: '100%',
        }}
        spacing={1}
      >
        <Box sx={{ width: '100%' }} display={'flex'} justifyContent={'space-between'} alignItems="flex-start">
          <Avatar
            src={user?.avatarUrl as string}
            variant={
              user?.userType === UserTypeEnum.Ngo
                ? 'rounded'
                : user?.userType === UserTypeEnum.Company
                ? 'rounded'
                : 'circular'
            }
            sx={{ mr: 1, mt: 1 }}
            alt={user?.firstName as string}
          />
          <Stack spacing={0} sx={{ width: '100%' }}>
            <InputBox
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                mb: 1,
                width: '100%',
              }}
            >
              <CommentTextEditor
                inputId={inputId}
                isSearch={isSearch}
                getValueFlag={getCommentValueFlag}
                reply={replay}
                isComment={isComment}
              />
              <Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexWrap={'wrap'} sx={{ ml: 1 }}>
                <CommentGif
                  gifSelected={(url) => {
                    // setGifSelect(url);
                    setImagePreview(url);
                  }}
                />
                <CommentImage
                  uploadFileFlag={uploFileFlag}
                  uploadedFile={console.log}
                  removeFileFlag={removeFileFlag}
                  imagePreviewSelected={setImagePreview}
                />
              </Box>
            </InputBox>
            {imagePreview ? (
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                  height: 72,
                  position: 'relative',
                  backgroundImage: `url(${imagePreview})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  width: 120,
                  borderRadius: 1,
                  overflow: 'hidden',
                }}
              >
                <Stack>
                  <RemoveImageStyle
                    onClick={() => {
                      setImagePreview('');
                      setRemoveFileFlag(removeFileFlag + 1);
                    }}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon name="Close" />
                  </RemoveImageStyle>
                </Stack>
              </Stack>
            ) : null}
          </Stack>
        </Box>
      </Stack>{' '}
      {imagePreview || (commentsBody.length > 1 && inputId === Number(abcdefg.id)) ? (
        <Box sx={{ width: '100%' }}>
          <LoadingButton
            sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.surface.main,
              mb: 1,
              ml: 8,
              '&:hover': {
                bgcolor: theme.palette.primary.main,
                opacity: 0.5,
              },
            }}
            onClick={handleSendComment}
            loading={postBTN}
          >
            <FormattedMessage {...PostComponentsMessage.Post} />
          </LoadingButton>
        </Box>
      ) : null}
    </Box>
  );
}

export default PostCommentInput;
