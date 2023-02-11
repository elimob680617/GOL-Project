import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Typography } from '@mui/material';

import { useDeleteFundRaisingPostMutation } from 'src/_graphql/post/campaign-post/mutations/deletePost.generated';

import { Icon } from '../Icon';
import campaignLandingComponentsMessages from './campaignLandingComponentsMessages';

interface IDraftPostCard {
  data: any;
  drafts: any;
  setDrafts: any;
}

function DraftPostCard(props: IDraftPostCard) {
  const { data, drafts, setDrafts } = props;
  const [deletePost] = useDeleteFundRaisingPostMutation();
  const navigate = useNavigate();
  const { formatMessage } = useIntl();

  const handleDeleteDraft = (e: any) => {
    deletePost({ fundRaisingPost: { dto: { id: e.target.value } } })
      .unwrap()
      .then((res: any) => {
        if (res.deleteFundRaisingPost.isSuccess === true) {
          setDrafts(drafts.filter((object: any) => object.id !== e.target.value));
        }
      });
  };

  return (
    <Box sx={{ bgcolor: (theme) => theme.palette.surface.main, m: 2, borderRadius: '8px', minHeight: 330 }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">
          {data?.title !== '' ? data?.title : formatMessage(campaignLandingComponentsMessages.NoTitle)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <FormattedMessage {...campaignLandingComponentsMessages.Edited} /> {data.updatedDateTime}{' '}
          <FormattedMessage {...campaignLandingComponentsMessages.ago} />
        </Typography>
      </Box>
      {data?.coverImageUrl !== '' ? (
        <Box>
          <img src={data?.coverImageUrl} alt="coverImageUrl" width="100%" loading="lazy" />
        </Box>
      ) : (
        <Box
          sx={{ height: 176, width: '100%', bgcolor: (theme) => theme.palette.background.neutral }}
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexWrap="wrap"
        >
          <img src={'src/assets/images/notfound/postNotFound.svg'} alt="coverImageUrl" loading="lazy" />
          <Typography variant="caption" color="text.secondary" sx={{ width: '100%', textAlign: 'center' }}>
            <FormattedMessage {...campaignLandingComponentsMessages.noCoverPhoto} />
          </Typography>
        </Box>
      )}
      <Box sx={{ p: 2, pt: 3 }} display="flex" justifyContent={'flex-end'}>
        <Button color="error" onClick={handleDeleteDraft} value={data.id}>
          {' '}
          <Icon name="trash" color="error.main" />
          <FormattedMessage {...campaignLandingComponentsMessages.DeleteBtn} />
        </Button>
        <Button variant="contained" sx={{ ml: 1 }} onClick={() => navigate(`/campaigns/details/${data.id}`)}>
          {' '}
          <FormattedMessage {...campaignLandingComponentsMessages.publishBtn} />
        </Button>
      </Box>
    </Box>
  );
}

export default DraftPostCard;
