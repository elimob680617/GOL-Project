import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { Box, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import dayjs from 'dayjs';
import { useLazyGetCampaignDonorsInfoQuery } from 'src/_graphql/history/queries/getCampaignDonorsInfo.generated';

import GOLPagination from '../../components/GOLPagination';
import CampaignDetailsMessages from './CampaignDetails.messages';

//....................................................................
interface IDonorsReport {
  id?: number;
  campaignName?: string;
  raisedFund?: number;
  rate?: string;
  avatarImageUrl?: string;
  firstName?: string;
  lastName?: string;
  raisedFundDateTime?: string;
}
interface DonationInfoTypes {
  campaignId?: string;
}
function DonorsInfo(props: DonationInfoTypes) {
  const { campaignId } = props;
  const { formatMessage } = useIntl();
  const [page, setPage] = useState<number>(0);
  const [rows, setRows] = useState<IDonorsReport[]>([]);
  const [getCampaignDonorsInfo, { data: campaignDonorsInfoData }] = useLazyGetCampaignDonorsInfoQuery();
  const campaignDonorsInfosData = campaignDonorsInfoData?.getCampaignDonorsInfo.listDto?.items;

  useEffect(() => {
    if (campaignId) {
      getCampaignDonorsInfo({
        filter: { dto: { campaignId: campaignId }, pageSize: 5, pageIndex: 0 },
      });
    }
  }, [campaignId, getCampaignDonorsInfo]);

  useEffect(() => {
    if (campaignDonorsInfosData) {
      let campaignDonorsInfo: IDonorsReport[] = [];
      campaignDonorsInfo = campaignDonorsInfosData.map((campaignDonor: any, index: number) => {
        const returned: IDonorsReport = {
          id: index + 1,
          raisedFund: campaignDonor?.raisedFund || undefined,
          raisedFundDateTime: dayjs(campaignDonor?.raisedFundDateTime).format('YYYY-MM-DD'),
          rate: campaignDonor?.rate,
        };

        return returned;
      });

      setRows(campaignDonorsInfo);
    }
  }, [campaignId, campaignDonorsInfoData, campaignDonorsInfosData]);

  const pageChange = (newPage: number) => {
    setPage(newPage);
    getCampaignDonorsInfo({
      filter: {
        pageSize: 5,
        pageIndex: newPage,
        dto: {
          campaignId: campaignId,
        },
      },
    });
  };

  //............................................................DataGrid
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: formatMessage(CampaignDetailsMessages.numberIndex),
      width: 80,
      align: 'center',
      headerAlign: 'center',
      renderCell: (cellValues) => <Typography variant="body2">{cellValues.value}</Typography>,
    },
    {
      field: 'raisedFund',
      headerName: formatMessage(CampaignDetailsMessages.donatedMoney),
      width: 162,
      align: 'center',
      headerAlign: 'center',
      renderCell: (cellValues) => <Typography variant="body2">${cellValues.value.toLocaleString()}</Typography>,
    },
    {
      field: 'raisedFundDateTime',
      headerName: formatMessage(CampaignDetailsMessages.dateAndTime),
      width: 170,
      align: 'center',
      headerAlign: 'center',
      renderCell: (cellValues) => <Typography variant="body2">{cellValues.value}</Typography>,
    },
    {
      field: 'rate',
      headerName: formatMessage(CampaignDetailsMessages.rate),
      type: 'number',
      width: 95,
      align: 'center',
      headerAlign: 'center',
      renderCell: (cellValues) => <Typography variant="body2">{cellValues.value}</Typography>,
    },
  ];

  return (
    <>
      <Box style={{ height: '100%', width: '100%', position: 'relative' }}>
        <DataGrid rows={rows} columns={columns} disableSelectionOnClick disableColumnMenu hideFooter />
        <Stack sx={{ position: 'absolute', p: 1.5, bottom: 0, right: 0 }}>
          <GOLPagination
            totalText={`Total: ${campaignDonorsInfoData?.getCampaignDonorsInfo?.listDto?.count} User, ${campaignDonorsInfoData?.getCampaignDonorsInfo?.listDto?.items?.[0]?.raisedFund}`}
            currentPage={page}
            pageChange={pageChange}
            count={Math.round(campaignDonorsInfoData?.getCampaignDonorsInfo?.listDto?.count / 5)}
          />
        </Stack>
      </Box>
    </>
  );
}

export default DonorsInfo;
