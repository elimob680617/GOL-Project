import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { Box, Button, CircularProgress, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useDeleteCommentMutation } from 'src/_graphql/postbehavior/mutations/deleteCommen.generated';
import { dispatch } from 'src/store';
import { updateCampaignPostComment, updateSocialPostComment } from 'src/store/slices/homePage';
import { ERROR } from 'src/theme/palette';

import { Icon } from '../Icon';
import PostComponentsMessage from './PostComponentsMessage';

const IconButtonAction = styled(IconButton)(({ theme }) => ({
  color: theme.palette.error.main,
}));

function PostConfrimDialog(props: any) {
  const {
    setOpenPublishDialog,
    openPublishDialog,
    CommentId,
    setGetNewComments,
    commentsCount,
    setCommentsCount,
    postType,
    postId,
  } = props;
  const [delLoading, setDelLoading] = useState<boolean>(false);
  const [deleteComment] = useDeleteCommentMutation();
  const handleDeleteComent = () => {
    setDelLoading(true);
    deleteComment({ comment: { dto: { id: CommentId } } })
      .unwrap()
      .then((res) => {
        if (commentsCount) {
          setCommentsCount(commentsCount - 1);
        }
        if (postType === 'campaign') {
          dispatch(updateCampaignPostComment({ id: postId, type: 'negative' }));
        } else if (postType === 'social') {
          dispatch(updateSocialPostComment({ id: postId, type: 'negative' }));
        }
        setOpenPublishDialog(false);
        setGetNewComments(Math.random());
        setDelLoading(false);
      });
  };
  return (
    <Dialog maxWidth="sm" fullWidth onClose={() => setOpenPublishDialog(false)} open={openPublishDialog}>
      <Stack spacing={2} sx={{ py: 2 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              <FormattedMessage {...PostComponentsMessage.AreYouSureToDeleteThisComment} />
            </Typography>
          </Box>

          <IconButton onClick={() => setOpenPublishDialog(false)}>
            <Icon name="Close" />
          </IconButton>
        </Stack>
        <Divider />
        <Stack spacing={1} sx={{ px: 2 }}>
          <Box sx={{ display: 'flex', cursor: 'pointer', alignItems: 'center' }}>
            <Icon name="trash" />
            {delLoading ? (
              <IconButtonAction>
                <CircularProgress size={16} />
              </IconButtonAction>
            ) : (
              <Button onClick={handleDeleteComent}>
                <Typography variant="body2" color={ERROR.main}>
                  <FormattedMessage {...PostComponentsMessage.DeleteComment} />
                </Typography>
              </Button>
            )}
          </Box>
          <Box sx={{ display: 'flex', cursor: 'pointer', alignItems: 'center' }}>
            <Icon name="Close" />
            <Button onClick={() => setOpenPublishDialog(false)}>
              <Typography variant="body2" color="text.primary">
                <FormattedMessage {...PostComponentsMessage.Discard} />
              </Typography>
            </Button>
          </Box>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default PostConfrimDialog;
