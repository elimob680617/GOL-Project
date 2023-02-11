import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';

//mui
import { Stack, Typography } from '@mui/material';

import { useLazyGetCampaignsInfoQuery } from 'src/_graphql/history/queries/getCampaignsInfo.generated';
// import NoDataFound from '../component/NoDataFound';
// import NoExperienceadded from 'src/assets/images/ngoNotFound.svg';
//icon
import NotFound from 'src/components/notFound/NotFound';
import useAuth from 'src/hooks/useAuth';
//icon
//service
import { PATH_APP } from 'src/routes/paths';

import DonatedMoneyMessages from '../DonatedMoney.messages';
import CampaignDetail from '../component/CampaignDetail';
import CampaignsSlider from '../component/CampaignsSlider';
import SortCampaigns from '../component/SortCampaigns';

//....................................................................style

//........................................................................
interface ICampaignListProps {
  campaignStatus: string;
}

type Params = {
  tab: string;

  id: string;
};

function CampaignListMain(props: ICampaignListProps) {
  const { campaignStatus } = props;
  const { user } = useAuth();
  console.log('user', user);
  const push = useNavigate();
  // const query = useParams();
  const { tab, id } = useParams<Params>();
  const [getCampaignsInfo, { data: campaignsInfoData }] = useLazyGetCampaignsInfoQuery();
  //...
  const campaignsData = campaignsInfoData?.getCampaignsInfo?.listDto?.items;
  //.............................................state

  const [campaignId, setCampaignId] = useState('');
  const [tabValue, setTabValue] = useState('');
  const [campaignCounter, setCampaignCounter] = useState(0);

  //...........................................

  //.............................................useEffect
  useEffect(() => {
    if (user?.id)
      getCampaignsInfo({
        filter: {
          pageIndex: 0,
          pageSize: 10,

          filterExpression: `ownerUserId == (\"${user?.id}\") && CampaignStatus==\"${campaignStatus}\"`,
        },
      });
  }, [campaignStatus, getCampaignsInfo, user?.id]);

  console.log('campaignsData', campaignsData);

  useEffect(() => {
    if (tab) {
      setTabValue(tab);
      setCampaignId('');
    }
    if (id) {
      setCampaignId(id);
    }
  }, [tab, id]);

  useEffect(() => {
    if (campaignsInfoData?.getCampaignsInfo.listDto?.items?.length) {
      setCampaignId(campaignsInfoData?.getCampaignsInfo.listDto?.items[0]?.campaignId as string);
    }
  }, [campaignsInfoData]);

  useEffect(() => {
    if (campaignId && tabValue) {
      push(`${PATH_APP.report.ngo}/${tabValue}/${campaignId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  const sortValuesChange = (sortArray: string[], orderValue: boolean[]) => {
    getCampaignsInfo({
      filter: {
        pageIndex: 0,
        pageSize: 10,
        orderByFields: sortArray,
        orderByDescendings: orderValue,

        filterExpression: `ownerUserId == (\"${user?.id}\") && CampaignStatus==\"${campaignStatus}\"`,
      },
    });
  };

  //....................................................................data Chart

  return (
    <Stack>
      {campaignsData?.length ? (
        <>
          <Stack>
            {!campaignId ? (
              <>
                <Stack
                  sx={{ bgcolor: 'background.neutral' }}
                  direction={'row'}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Stack p={2}>
                    <Stack pt={1} direction="row" alignItems="center" justifyContent="space-between">
                      <Stack direction="row" gap={1}>
                        <Typography variant="h6" color="text.primary">
                          <FormattedMessage {...DonatedMoneyMessages.campaigns} />:
                        </Typography>

                        <SortCampaigns sortValuesChange={sortValuesChange} />
                      </Stack>
                    </Stack>
                  </Stack>
                  <CampaignsSlider
                    campaignCounter={campaignCounter}
                    setCampaignCounter={setCampaignCounter}
                    campaignsData={campaignsData}
                  />
                </Stack>

                <CampaignDetail campaignId={campaignsData?.[campaignCounter]?.campaignId as string} />
              </>
            ) : (
              <CampaignDetail campaignId={campaignId} />
            )}
          </Stack>
        </>
      ) : (
        // <NoDataFound />
        <NotFound img="src/assets/images/ngoNotFound.svg" text={'No connection found'} />
      )}
    </Stack>
  );
}

export default CampaignListMain;
