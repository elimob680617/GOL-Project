import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Box, CircularProgress, Grid, Skeleton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useLazyGetCommentsQuery } from 'src/_graphql/postbehavior/queries/getCommentsPaginated.generated';
import { useLazyGetCommentReplayQuery } from 'src/_graphql/postbehavior/queries/getReplaiesPaginated.generated';

import PostCommentBlob from './PostCommentBlob';
import PostCommentInput from './PostCommentInput';
import PostComponentsMessage from './PostComponentsMessage';

const SeeMoreLine = styled(Box)(({ theme }) => ({
  width: 32,
  border: `1px solid ${theme.palette.grey[300]}`,
  height: 1,
  marginRight: 8,
  backgroundColor: theme.palette.grey[300],
}));
interface IPostComments {
  PostId: string;
  PostDetails?: boolean;
  countOfComments?: string;
  isSearch?: boolean;
  postType: string;
  commentsCount?: string | null | undefined;
  setCommentsCount?: any;
}
const PostCommets = ({
  PostId,
  PostDetails,
  countOfComments,
  isSearch,
  postType,
  commentsCount,
  setCommentsCount,
}: IPostComments) => {
  const [seeMoreReplies, setSeeMoreReplies] = useState<boolean>(false);
  const [seeShowMoreReplies, setSeeShowMoreReplies] = useState<boolean>(false);
  const [getCommentById, { isLoading: getCommentsLoading }] = useLazyGetCommentsQuery();
  const [getReplies] = useLazyGetCommentReplayQuery();
  const [commentId, setCommentId] = useState('');
  const [getNewComments, setGetNewComments] = useState<number>(0);
  const [allComments, setAllComments] = useState<boolean>(false);
  const [comments, setComments] = useState<any>([]);
  const [commentPage, setCommentPage] = useState<number>(1);
  const [replyPage, setReplyPage] = useState<number>(0);
  const [seeMoreLoading, setSeeMoreLoading] = useState<boolean>(false);
  const [replies, setReplies] = useState<any>([]);
  const { formatMessage } = useIntl();
  useEffect(() => {
    getCommentById({
      filter: { pageSize: 10, pageIndex: 0, dto: { id: PostId } },
    })
      .unwrap()
      .then((res) => {
        setComments(res?.getCommentsPaginated?.listDto?.items || []);
      });
  }, [PostId, getCommentById, getNewComments]);

  const handleSeeMoreReply = (e: any) => {
    setCommentId(e.target.id);
    getReplies({
      filter: { pageSize: 5, pageIndex: replyPage, dto: { id: e.target.id } },
    })
      .unwrap()
      .then((res) => {
        setReplies(replies.concat(res.getRepliesPaginated?.listDto?.items));
        if (commentId === e.target.value) {
          setReplyPage(replyPage + 1);
        } else {
          setReplyPage(0);
        }
        setSeeMoreReplies(false);
        setSeeShowMoreReplies(true);
        const replyLength = res.getRepliesPaginated?.listDto?.items?.length;
        if (replyLength ? replyLength < 5 : null) {
          setSeeMoreReplies(true);
        }
      });
  };

  const handleHideReply = (e: any) => {
    setSeeMoreReplies(false);
    setSeeShowMoreReplies(false);
    setCommentId(e.target.id);
    setReplyPage(0);
    setReplies([]);
  };
  const handleLoadMoreComment = () => {
    setSeeMoreLoading(true);
    getCommentById({
      filter: {
        pageSize: 10,
        pageIndex: commentPage,
        dto: { id: PostId },
      },
    })
      .unwrap()
      .then((res) => {
        setComments(comments.concat(res.getCommentsPaginated?.listDto?.items));
        setCommentPage(commentPage + 1);
        setSeeMoreLoading(false);
        const commentLength = res.getCommentsPaginated?.listDto?.items?.length;
        if (commentLength ? commentLength < 10 : null) {
          setAllComments(true);
        }
      });
  };

  const handleHideMoreComment = () => {
    setComments(comments.splice(10, 99999999));
    setAllComments(false);
    setCommentPage(1);
  };
  return (
    <Box sx={{ maxWidth: '100%' }}>
      {comments?.length < 1 ? (
        <Box sx={{ maxWidth: '100%' }}>
          {getCommentsLoading ? (
            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexWrap={'wrap'}>
              {/* <Box display={'flex'} justifyContent={'center'} alignItems={'center'} sx={{ width: '100%' }}>
                <Skeleton variant="circular" width={220} height={220} />
              </Box> */}
              <Box display={'flex'} justifyContent={'center'} alignItems={'center'} sx={{ width: '100%' }}>
                <Skeleton variant="text" width={200} />
              </Box>
            </Box>
          ) : (
            <Box>
              {/* <Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexWrap={'wrap'}>
                <Image src={noComment} alt="noComment" />
              </Box> */}
              <Typography sx={{ width: '100%', textAlign: 'center' }} variant="body2">
                Be the first to comment
              </Typography>
            </Box>
          )}
          <PostCommentInput
            postType={postType}
            postId={PostId}
            isSearch={isSearch}
            setGetNewComments={setGetNewComments}
            commentsCount={commentsCount}
            setCommentsCount={setCommentsCount}
            setComments={setComments}
            comments={comments}
          />
        </Box>
      ) : (
        <Box>
          <PostCommentInput
            postType={postType}
            PostDetails={PostDetails ? true : false}
            postId={PostId}
            setGetNewComments={setGetNewComments}
            isSearch={isSearch}
            commentsCount={commentsCount}
            setCommentsCount={setCommentsCount}
            setComments={setComments}
            comments={comments}
          />
          {comments?.map((item: any) => (
            <Grid key={item.id} container xs={12} sx={{ padding: 2, maxWidth: '100%' }}>
              <PostCommentBlob
                PostId={PostId}
                setGetNewComments={setGetNewComments}
                data={item}
                hasMedia={item?.mediaUrl ? true : false}
                postType={postType}
                commentsCount={commentsCount}
                setCommentsCount={setCommentsCount}
              />
              {seeShowMoreReplies &&
                replies?.map(
                  (rep: any) =>
                    rep?.replyId === item.id && (
                      <Grid key={rep?.id} container xs={12} sx={{ paddingTop: 1 }}>
                        <Grid item xs={2} />
                        <PostCommentBlob
                          parentId={item.id}
                          PostId={PostId}
                          setGetNewComments={setGetNewComments}
                          isReplay
                          data={rep}
                          hasMedia={rep?.mediaUrl ? true : false}
                          postType={postType}
                          commentsCount={commentsCount}
                          setCommentsCount={setCommentsCount}
                        />
                      </Grid>
                    ),
                )}
              {item?.numberOfReplies > 1 && (!seeMoreReplies || item.id !== commentId) ? (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <SeeMoreLine onClick={handleSeeMoreReply} id={item?.id} />
                  <Typography variant="caption" color="text.secondary" onClick={handleSeeMoreReply} id={item?.id}>
                    {!seeMoreReplies && seeShowMoreReplies ? (
                      <FormattedMessage {...PostComponentsMessage.SeeMoreReplies} />
                    ) : (
                      `${formatMessage(PostComponentsMessage.See)} ${item.numberOfReplies - 1} ${formatMessage(
                        PostComponentsMessage.replies,
                      )}`
                    )}
                  </Typography>
                </Box>
              ) : null}
              {!seeShowMoreReplies || item.id !== commentId
                ? item.commentReplies.map((replay: any) => (
                    <Grid key={replay.id} container xs={12} sx={{ paddingTop: 1 }}>
                      <Grid item xs={2} />
                      <PostCommentBlob
                        parentId={replay.id}
                        PostId={PostId}
                        setGetNewComments={setGetNewComments}
                        isReplay
                        data={replay}
                        hasMedia={replay?.mediaUrl ? true : false}
                        postType={postType}
                        commentsCount={commentsCount}
                        setCommentsCount={setCommentsCount}
                      />
                    </Grid>
                  ))
                : null}
              {seeMoreReplies && item.id === commentId ? (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <SeeMoreLine onClick={handleHideReply} id={item?.id} />
                  <Typography variant="caption" color="text.secondary" onClick={handleHideReply} id={item?.id}>
                    <FormattedMessage {...PostComponentsMessage.HideReplies} />
                  </Typography>
                </Box>
              ) : null}
              {!allComments && item.id === commentId && Number(countOfComments) > 10 ? (
                <Box sx={{ m: 2, mt: 0, cursor: 'pointer' }} onClick={handleLoadMoreComment}>
                  <Typography variant="caption" color="text.secondary">
                    <FormattedMessage {...PostComponentsMessage.SeeMoreComments} />
                  </Typography>
                  {seeMoreLoading && <CircularProgress sx={{ ml: 1 }} size={10} />}
                </Box>
              ) : allComments ? (
                <Box sx={{ m: 2, mt: 0, cursor: 'pointer' }} onClick={handleHideMoreComment}>
                  <Typography variant="caption" color="text.secondary">
                    <FormattedMessage {...PostComponentsMessage.HideMoreComments} />
                  </Typography>
                </Box>
              ) : null}
            </Grid>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default PostCommets;
