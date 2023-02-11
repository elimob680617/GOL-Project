import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { BottomSheet } from 'react-spring-bottom-sheet';

import { Box, Button, CircularProgress, Divider, IconButton, Typography } from '@mui/material';

import { useDeleteFundRaisingPostMutation } from 'src/_graphql/post/campaign-post/mutations/deletePost.generated';
import { useUpdateFundRaisingPostMutation } from 'src/_graphql/post/campaign-post/mutations/updateCampaignPost.generated';
import { CreateFundRaisingPostInput } from 'src/types/serverTypes';

import { Icon } from '../Icon';
import campaignLandingComponentsMessages from './campaignLandingComponentsMessages';

interface IHeaderCL {
  title: string;
  postId?: string;
  post?: CreateFundRaisingPostInput;
}

function HeaderCampaignLanding(props: IHeaderCL) {
  const { title, postId, post } = props;
  const navigate = useNavigate();
  const [publishPost] = useUpdateFundRaisingPostMutation();
  const [deletePost, { isLoading: loadingDelete }] = useDeleteFundRaisingPostMutation();
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const handlePublishPost = () => {
    publishPost({
      fundraisingPost: {
        dto: {
          audience: post?.audience,
          body: post?.body,
          category: post?.category,
          coverImageUrl: post?.coverImageUrl,
          deadline: post?.deadline,
          id: post?.id,
          mentionedUserIds: post?.mentionedUserIds,
          pictureUrls: post?.pictureUrls,
          placeId: post?.placeId,
          status: post?.status,
          summary: post?.summary,
          tagIds: post?.tagIds,
          target: post?.target,
          title: post?.title,
          videoUrls: post?.videoUrls,
        },
      },
    })
      .unwrap()
      .then((res: any) => console.log(res));
  };
  const handleDeletePost = () => {
    deletePost({ fundRaisingPost: { dto: { id: postId } } })
      .unwrap()
      .then((res: any) => {
        if (res.deleteFundRaisingPost.isSuccess === true) {
          setOpenDialog(false);
          navigate(-1);
        }
      });
  };
  return (
    <Box
      sx={{ height: 60, bgcolor: (theme) => theme.palette.surface.main, p: 1 }}
      display="flex"
      justifyContent={'space-between'}
      alignItems={'center'}
    >
      <Typography variant="subtitle1">
        <IconButton onClick={() => navigate(-1)}>
          <Icon name="left-arrow-1" color="grey.500" />
        </IconButton>
        {title}
      </Typography>
      {title === 'Details' ? (
        <Box>
          <IconButton onClick={() => setOpenDialog(true)}>
            <Icon name="trash" color="grey.500" />
          </IconButton>
          <Button variant="contained" sx={{ ml: 1 }} onClick={handlePublishPost}>
            <FormattedMessage {...campaignLandingComponentsMessages.publishBtn} />
          </Button>
        </Box>
      ) : null}
      <BottomSheet
        open={openDialog}
        onDismiss={() => setOpenDialog(!openDialog)}
        header={
          <Typography variant="subtitle1" sx={{ p: 2 }}>
            <FormattedMessage {...campaignLandingComponentsMessages.deleteDraftModalQuestion} />
          </Typography>
        }
      >
        <Divider />
        <IconButton sx={{ mt: 1 }} onClick={handleDeletePost}>
          {loadingDelete ? (
            <CircularProgress color="error" size={12} />
          ) : (
            <Typography variant="body2" color="error">
              <Icon name="trash" color="error.main" />
              <FormattedMessage {...campaignLandingComponentsMessages.deleteDraftBTN} />
            </Typography>
          )}
        </IconButton>
        <br />
        <IconButton sx={{ mt: 1, mb: 1 }} onClick={() => setOpenDialog(false)}>
          <Icon name="Close" type="linear" />
          <Typography variant="body2">
            <FormattedMessage {...campaignLandingComponentsMessages.discard} />
          </Typography>
        </IconButton>
      </BottomSheet>
    </Box>
  );
}

export default HeaderCampaignLanding;
