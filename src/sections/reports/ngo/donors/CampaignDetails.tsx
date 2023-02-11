import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import { Box, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useLazyGetCampaignDetailsInfoQuery } from 'src/_graphql/history/queries/getCampaignDetailsInfo.generated';
//icon
import { Icon } from 'src/components/Icon';

import CampaignDetailsMessages from './CampaignDetails.messages';

const CardStyle = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  width: 238,
  height: 88,
  borderRadius: theme.spacing(1),
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'start',
  gap: theme.spacing(1),
}));
const AvatarStyle = styled(Box)(({ theme }) => ({
  width: 56,
  height: 56,
  borderRadius: theme.spacing(8),
  backgroundColor: theme.palette.background.neutral,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));
//...type
interface CampaignDetailsTypes {
  campaignId?: string;
}

function CampaignDetails(props: CampaignDetailsTypes) {
  const { campaignId } = props;
  const [getCampaignDetailsInfo, { data: campaignDetailsInfoData }] = useLazyGetCampaignDetailsInfoQuery();
  const campaignDetailsInfo = campaignDetailsInfoData?.getCampaignDetailsInfo?.listDto?.items?.[0];
  useEffect(() => {
    if (campaignId) {
      getCampaignDetailsInfo({ filter: { dto: { campaignId } } });
    }
  }, [campaignId, getCampaignDetailsInfo]);
  console.log('campaignDetailsInfoData', campaignDetailsInfoData);
  return (
    <>
      <Stack p={2} sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="subtitle2" color="primary.main">
          {campaignDetailsInfo?.campaignName || '-'}
        </Typography>
      </Stack>
      <Box sx={{ width: 'calc(100% + 32px)', bgcolor: 'background.neutral', height: 16, ml: -2 }} />
      <Stack sx={{ bgcolor: 'background.neutral' }} gap={2} direction="row" flexWrap="wrap">
        <CardStyle spacing={1} py={2} px={2}>
          <AvatarStyle>
            <Icon name="Advertise" color="grey.500" />
          </AvatarStyle>
          <Stack>
            <Typography variant="subtitle2" color="text.secondary">
              <FormattedMessage {...CampaignDetailsMessages.campaignView} />
            </Typography>
            <Typography variant="subtitle2" color="text.primary">
              {campaignDetailsInfo?.campaignView}
            </Typography>
          </Stack>
        </CardStyle>
        <CardStyle spacing={1} py={2} px={2}>
          <AvatarStyle>
            <Icon name="impression" color="grey.500" />
          </AvatarStyle>
          <Stack>
            <Typography variant="subtitle2" color="text.secondary">
              <FormattedMessage {...CampaignDetailsMessages.impression} />
            </Typography>
            <Typography variant="subtitle2" color="text.primary">
              {campaignDetailsInfo?.impression}
            </Typography>
          </Stack>
        </CardStyle>
        <CardStyle spacing={1} py={2} px={2}>
          <AvatarStyle>
            <Icon name="engagement-percent" color="grey.500" />
          </AvatarStyle>
          <Stack>
            <Typography variant="subtitle2" color="text.secondary">
              <FormattedMessage {...CampaignDetailsMessages.engagementPercentage} />
            </Typography>
            <Typography variant="subtitle2" color="text.primary">
              {campaignDetailsInfo?.impression}
            </Typography>
          </Stack>
        </CardStyle>
        <CardStyle spacing={1} py={2} px={2}>
          <AvatarStyle>
            <Icon name="public" color="grey.500" type="solid" />
          </AvatarStyle>
          <Stack>
            <Typography variant="subtitle2" color="text.secondary">
              <FormattedMessage {...CampaignDetailsMessages.earnedFollower} />
            </Typography>
            <Typography variant="subtitle2" color="text.primary">
              {campaignDetailsInfo?.earnedFollower}
            </Typography>
          </Stack>
        </CardStyle>
        <CardStyle spacing={1} py={2} px={2}>
          <AvatarStyle>
            <Icon name="heart" color="grey.500" />
          </AvatarStyle>
          <Stack>
            <Typography variant="subtitle2" color="text.secondary">
              <FormattedMessage {...CampaignDetailsMessages.likes} />
            </Typography>
            <Typography variant="subtitle2" color="text.primary">
              {campaignDetailsInfo?.numberOfLikes}
            </Typography>
          </Stack>
        </CardStyle>
        <CardStyle spacing={1} py={2} px={2}>
          <AvatarStyle>
            <Icon name="comment" color="grey.500" />
          </AvatarStyle>
          <Stack>
            <Typography variant="subtitle2" color="text.secondary">
              <FormattedMessage {...CampaignDetailsMessages.comments} />
            </Typography>
            <Typography variant="subtitle2" color="text.primary">
              {campaignDetailsInfo?.numberOfComments}
            </Typography>
          </Stack>
        </CardStyle>
        <CardStyle spacing={1} py={2} px={2}>
          <AvatarStyle>
            <Icon name="Save" color="grey.500" />
          </AvatarStyle>
          <Stack>
            <Typography variant="subtitle2" color="text.secondary">
              <FormattedMessage {...CampaignDetailsMessages.saved} />
            </Typography>
            <Typography variant="subtitle2" color="text.primary">
              {campaignDetailsInfo?.numberOfSaved}
            </Typography>
          </Stack>
        </CardStyle>
        <CardStyle spacing={1} py={2} px={2}>
          <AvatarStyle>
            <Icon name="Reshare" color="grey.500" />
          </AvatarStyle>
          <Stack>
            <Typography variant="subtitle2" color="text.secondary">
              <FormattedMessage {...CampaignDetailsMessages.reshared} />
            </Typography>
            <Typography variant="subtitle2" color="text.primary">
              {campaignDetailsInfo?.numberOfReshared}
            </Typography>
          </Stack>
        </CardStyle>
      </Stack>
    </>
  );
}

export default CampaignDetails;
