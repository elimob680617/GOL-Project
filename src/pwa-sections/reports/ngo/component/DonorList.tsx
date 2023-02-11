import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

//mui
import { IconButton, Stack, Typography } from '@mui/material';

import { useLazyGetCampaignDonorsInfoQuery } from 'src/_graphql/history/queries/getCampaignDonorsInfo.generated';
//icon
import { Icon } from 'src/components/Icon';
import PostDetailsMessages from 'src/pwa-sections/post/campaignPost/postDetails/PostDetails.messages';

//..............................................................

function DonorList() {
  const back = useNavigate();
  const [getCampaignDonorsInfo, { data: CampaignDonorsInfoData }] = useLazyGetCampaignDonorsInfoQuery();
  const campaignDonors = CampaignDonorsInfoData?.getCampaignDonorsInfo?.listDto?.items;
  //.............................................useEffect
  const idCampaign = localStorage.getItem('idCampaign');
  console.log('i', idCampaign);
  useEffect(() => {
    getCampaignDonorsInfo({
      filter: { pageIndex: 0, pageSize: 900, dto: { campaignId: idCampaign } },
    });
  }, [getCampaignDonorsInfo, idCampaign]);

  return (
    <Stack sx={{ bgcolor: 'background.neutral' }}>
      <Stack direction="row" alignItems="center" sx={{ bgcolor: 'background.paper' }} spacing={2.5} p={2}>
        <IconButton
          onClick={() => {
            back(-1);
            localStorage.removeItem('idCampaign');
          }}
          sx={{ p: 0 }}
        >
          <Icon name="left-arrow-1" />
        </IconButton>
        <Typography variant="subtitle1" color="text.primary">
          <FormattedMessage {...PostDetailsMessages.donorsList} />
        </Typography>
      </Stack>
      <Stack spacing={2} p={2}>
        {campaignDonors?.map((item: any, index: number) => (
          <Stack
            key={index}
            justifyContent="space-between"
            direction="row"
            sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
            p={2}
          >
            <Stack direction="row" gap={2}>
              <Stack
                width={61}
                height={36}
                alignItems="center"
                justifyContent="center"
                sx={{ bgcolor: 'background.neutral', borderRadius: 1 }}
              >
                {index + 1}
              </Stack>
              <Stack>
                <Typography variant="body2" color="text.primary">
                  ${item?.raisedFund}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item?.raisedFundDateTime}
                </Typography>
              </Stack>
            </Stack>
            <Stack spacing={1} direction="row" alignItems="center">
              <Icon name="star" type="solid" color="grey.300" />
              <Typography variant="caption" color="text.secondary">
                <FormattedMessage {...PostDetailsMessages.rated} />: {item?.rate}
              </Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

export default DonorList;
