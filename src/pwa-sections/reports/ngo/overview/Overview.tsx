import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

//icon
//mui
import { Stack } from '@mui/material';

import { useLazyGetCampaignsInfoQuery } from 'src/_graphql/history/queries/getCampaignsInfo.generated';
// import NoDataFound from '../component/NoDataFound';
import NotFound from 'src/components/notFound/NotFound';
//service
import { PATH_APP } from 'src/routes/paths';

import CampaignDetail from '../component/CampaignDetail';
import Total from './Total';

type Params = {
  tab: string;

  id: string;
};

function Overview() {
  const push = useNavigate();
  const { tab, id } = useParams<Params>();
  const [, { data: campaignsInfoData }] = useLazyGetCampaignsInfoQuery();
  // const [{ data: campaignInfoData }] = useLazyGetCampaignsInfoQuery();
  //...
  const campaignData = campaignsInfoData?.getCampaignsInfo?.listDto?.items;
  //.............................................state

  const [campaignId, setCampaignId] = useState('');

  const [tabValue, setTabValue] = useState('');

  //..................useEffect
  useEffect(() => {
    if (tab) {
      setTabValue(tab);
      setCampaignId('');
    }
    if (id) {
      setCampaignId(id);
    }
  }, [tab, id]);

  //.............................................useEffect

  useEffect(() => {
    if (campaignsInfoData?.getCampaignsInfo?.listDto?.items) {
      setCampaignId(campaignsInfoData?.getCampaignsInfo?.listDto?.items[0]?.campaignId as string);
    }
  }, [campaignsInfoData]);

  useEffect(() => {
    if (campaignId && tabValue) {
      push(`${PATH_APP.report.ngo}/${tabValue}/${campaignId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  //....................................................................data Chart

  return (
    <>
      {!campaignData?.length ? (
        <Stack>
          {!campaignId ? (
            <Total />
          ) : (
            <Stack>
              <CampaignDetail campaignId={campaignId} />
            </Stack>
          )}
        </Stack>
      ) : (
        // <NoDataFound />
        <NotFound img={'src/assets/images/ngoNotFound.svg'} text={'No connection found'} />
      )}
    </>
  );
}

export default Overview;
