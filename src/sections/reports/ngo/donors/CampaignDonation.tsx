import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

// @mui
import { Avatar, AvatarGroup, Box, Stack, Typography, useTheme } from '@mui/material';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';

//service
import { useLazyGetCampaignDetailsInfoQuery } from 'src/_graphql/history/queries/getCampaignDetailsInfo.generated';
import { useLazyGetCampaignDonorsInfoQuery } from 'src/_graphql/history/queries/getCampaignDonorsInfo.generated';
//icon
import { Icon } from 'src/components/Icon';
import PostDetailsMessages from 'src/sections/post/campaignPost/postDetails/PostDetails.messages';

import DonorsListDialog from './DonorsListDialog';

//...
//...........................................................................
//..style
const DonorCardStyled = styled(Box)(({ theme }) => ({
  padding: 8,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: 8,
  border: `1px solid ${theme.palette.grey[100]}`,
  cursor: 'pointer',
}));
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
}));
//......................................
//...type
interface donationDetailsTypes {
  campaignId?: string;
}
//.....................
function CampaignDonation(props: donationDetailsTypes) {
  const { campaignId } = props;
  const [getCampaignDetailsInfo, { data: campaignDetailsInfoData }] = useLazyGetCampaignDetailsInfoQuery();
  const campaignDetailsInfo = campaignDetailsInfoData?.getCampaignDetailsInfo?.listDto?.items?.[0];
  const [getCampaignDonorsInfo, { data: campaignDonorsInfoData }] = useLazyGetCampaignDonorsInfoQuery();
  const campaignDonorsInfo = campaignDonorsInfoData?.getCampaignDonorsInfo?.listDto?.items;
  const theme = useTheme();
  const raisedMoneyNum = Number(campaignDetailsInfo?.raisedFund);
  const targetNum = Number(campaignDetailsInfo?.target);
  const [openDonorsDialog, setOpenDonorsDialog] = useState(false);

  useEffect(() => {
    if (campaignId) {
      getCampaignDetailsInfo({ filter: { dto: { campaignId } } });
    }
  }, [campaignId, getCampaignDetailsInfo]);

  useEffect(() => {
    if (campaignId) {
      getCampaignDonorsInfo({ filter: { dto: { campaignId } } });
    }
  }, [campaignId, getCampaignDonorsInfo]);

  console.log('first,sfdgdgrth343254', campaignDetailsInfo?.campaignName);

  return (
    <>
      <Typography variant="subtitle2" color="primary.main" sx={{ mb: 3 }}>
        {campaignDetailsInfo?.campaignName || '-'}
      </Typography>
      {!!campaignDetailsInfo?.raisedFund ? (
        <Stack spacing={2}>
          <Typography variant="subtitle2" color="primary.main">
            ${campaignDetailsInfo?.raisedFund?.toLocaleString()}
            <FormattedMessage {...PostDetailsMessages.raisedOf} /> ${campaignDetailsInfo?.target?.toLocaleString()}
          </Typography>

          {!(campaignDetailsInfo?.raisedFund === campaignDetailsInfo?.target) ? (
            <BorderLinearProgress
              variant="determinate"
              value={(raisedMoneyNum / targetNum) * 100}
              sx={{
                [`& .${linearProgressClasses.bar}`]: {
                  borderRadius: 5,
                  backgroundColor: theme.palette.mode === 'light' ? 'primary' : 'secondary',
                },
              }}
            />
          ) : (
            <BorderLinearProgress
              variant="determinate"
              value={(raisedMoneyNum / targetNum) * 100}
              sx={{
                [`& .${linearProgressClasses.bar}`]: {
                  borderRadius: 5,
                  bgcolor: 'warning.dark',
                },
              }}
            />
          )}
        </Stack>
      ) : (
        <Stack spacing={2}>
          <Typography variant="subtitle2" color="primary.main">
            $0 <FormattedMessage {...PostDetailsMessages.raisedOf} /> ${campaignDetailsInfo?.target?.toLocaleString()}
          </Typography>
          <BorderLinearProgress
            variant="determinate"
            value={0}
            sx={{
              [`& .${linearProgressClasses.bar}`]: {
                borderRadius: 5,
                backgroundColor: theme.palette.mode === 'light' ? 'primary' : 'secondary',
              },
            }}
          />
        </Stack>
      )}

      <Stack direction={'row'} mt={4} mb={2} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.primary">
          {!!campaignDetailsInfo?.donors ? `${campaignDetailsInfo?.donors} people donated.` : ' No donation.'}
        </Typography>
        <Box sx={{ bgcolor: 'background.neutral', p: 1, borderRadius: 0.5 }}>
          <Typography variant="subtitle2" color="primary.dark">
            {campaignDetailsInfo?.daysLeft}
          </Typography>
        </Box>
      </Stack>
      <Stack direction={'row'} sx={{ alignItems: 'center' }} mb={3}>
        {Number(campaignDetailsInfo?.numberOfRates) && Number(campaignDetailsInfo?.averageRate) > 0 ? (
          <>
            <Icon name="star" color="warning.dark" type="solid" />
            <Typography variant="subtitle2" color="warning.dark" sx={{ mr: 0.5, ml: 0.5 }}>
              {campaignDetailsInfo?.averageRate}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5, ml: 0.5 }}>
              ({campaignDetailsInfo?.numberOfRates} <FormattedMessage {...PostDetailsMessages.rated} />)
            </Typography>
          </>
        ) : (
          <>
            <Icon name="star" color="grey.500" type="solid" />

            <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5, ml: 0.5 }}>
              (<FormattedMessage {...PostDetailsMessages.noRate} />)
            </Typography>
          </>
        )}
      </Stack>
      <Stack>
        <DonorCardStyled onClick={() => setOpenDonorsDialog(true)}>
          <Stack direction={'row'}>
            <Box sx={{ p: 2, borderRadius: '50%', bgcolor: 'background.neutral' }}>
              <Icon name="Poverty-Alleviation" color="primary.main" type="linear" />
            </Box>

            <Box sx={{ ml: 1 }}>
              <Typography variant="body1" color="text.primary">
                <FormattedMessage {...PostDetailsMessages.donors} />
              </Typography>
              <Stack direction={'row'} sx={{ mt: 0.5 }}>
                {campaignDonorsInfo?.length ? (
                  <>
                    <Stack spacing={0.5} direction="row" alignItems="center">
                      <AvatarGroup max={4} total={0}>
                        {campaignDonorsInfo?.map((item: any, index: number) => (
                          <Avatar
                            sx={{ width: 16, height: 16 }}
                            key={index}
                            alt={'avatar'}
                            src={item?.avatarImageUrl || undefined}
                          />
                        ))}
                      </AvatarGroup>
                    </Stack>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                      <FormattedMessage {...PostDetailsMessages.seeAllDonors} />
                    </Typography>
                  </>
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    <FormattedMessage {...PostDetailsMessages.noDonorHere} />
                  </Typography>
                )}
              </Stack>
            </Box>
          </Stack>
          <Icon name="right-arrow" type="linear" color="grey.500" />
        </DonorCardStyled>
      </Stack>

      <DonorsListDialog campaignId={campaignId} open={openDonorsDialog} onClose={() => setOpenDonorsDialog(false)} />
    </>
  );
}

export default CampaignDonation;
