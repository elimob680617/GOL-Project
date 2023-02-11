//mui
import { IconButton, Stack } from '@mui/material';

//icon
import { Icon } from 'src/components/Icon';

function CampaignsSlider(props: any) {
  const { setCampaignCounter, campaignCounter, campaignsData } = props;
  return (
    <>
      <Stack direction="row" gap={5}>
        {campaignCounter === 0 ? (
          <IconButton disabled onClick={() => setCampaignCounter(campaignCounter - 1)}>
            <Icon name="left-arrow" color="grey.300" />
          </IconButton>
        ) : (
          <IconButton onClick={() => setCampaignCounter(campaignCounter - 1)}>
            <Icon name="left-arrow" />
          </IconButton>
        )}
        {campaignCounter === campaignsData?.length - 1 ? (
          <IconButton disabled onClick={() => setCampaignCounter(campaignCounter + 1)}>
            <Icon name="right-arrow-1" color="grey.300" />
          </IconButton>
        ) : (
          <IconButton onClick={() => setCampaignCounter(campaignCounter + 1)}>
            <Icon name="right-arrow-1" />
          </IconButton>
        )}
      </Stack>
    </>
  );
}

export default CampaignsSlider;
