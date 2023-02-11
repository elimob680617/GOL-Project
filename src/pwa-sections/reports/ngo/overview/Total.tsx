import { useEffect, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
//bottom sheet
import 'react-spring-bottom-sheet/dist/style.css';

//mui
import { Box, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

//rechart
import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts';
//service
import { useLazyGetCampaignsRecentInfoQuery } from 'src/_graphql/history/queries/getCampaignsRecentInfo.generated';
//icon
import { Icon } from 'src/components/Icon';

import TotalMessages from './Total.messages';

//.....................................................................

const FundAndDonors = styled(Stack)(({ theme }) => ({
  minWidth: 200,
  height: 106,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  alignItems: 'start',
  justifyContent: 'center',
  padding: 16,
}));
const TotalItemStyle = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.palette.grey[100],
  borderRadius: theme.spacing(1),
  // marginRight: theme.spacing(3),
  alignItems: 'center',
  justifyContent: 'space-between',
  flexDirection: 'row',
  // width: '100%',
}));
const LegendStyle = styled('ul')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
  height: 50,
  gap: theme.spacing(1),
}));
//...................................................................
function Total() {
  const [getCampaignsRecentInfo, { data: getCampaignRecent }] = useLazyGetCampaignsRecentInfoQuery();
  const campaignsRecentInfo = getCampaignRecent?.getCampaignsRecentInfo?.listDto?.items?.[0];

  //.............................................state

  //...........................................

  //..................useEffect
  useEffect(() => {
    getCampaignsRecentInfo({ filter: {} });
  }, [campaignsRecentInfo?.campaignId, getCampaignsRecentInfo]);
  //.

  //....................................................................data Chart
  const data = useMemo(() => {
    const res: { name: string; value: number; color: string }[] = [];
    if (campaignsRecentInfo?.numberOfSuccessFul)
      res.push({ name: 'Successful', value: campaignsRecentInfo?.numberOfSuccessFul, color: '#28BF64' });
    if (campaignsRecentInfo?.numberOfFinished)
      res.push({ name: 'Finished', value: campaignsRecentInfo?.numberOfFinished, color: '#2092E4' });
    if (campaignsRecentInfo?.numberOfActive)
      res.push({ name: 'Active', value: campaignsRecentInfo?.numberOfActive, color: '#13968E' });
    if (campaignsRecentInfo?.numberOfIntrupted)
      res.push({ name: 'Interrupted', value: campaignsRecentInfo?.numberOfIntrupted, color: '#D27722' });
    return res;
  }, [campaignsRecentInfo]);

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: {
    cx: any;
    cy: any;
    midAngle: any;
    innerRadius: any;
    outerRadius: any;
    percent: any;
    index: number;
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  //...Legend
  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <LegendStyle>
        {payload.map((entry: any, index: any) => (
          <li style={{ color: entry.color }} key={`item-${index}`}>
            <Typography variant="caption" color="text.primary">
              {entry.value}({entry.payload.value})
            </Typography>
          </li>
        ))}
      </LegendStyle>
    );
  };
  return (
    <Stack sx={{ bgcolor: 'background.neutral' }} spacing={2}>
      <Stack p={2} spacing={2}>
        <Typography variant="subtitle1" color={'text.primary'}>
          <FormattedMessage {...TotalMessages.total} />
        </Typography>
        <Stack direction="row" spacing={2} sx={{ overflow: 'scroll' }}>
          {/*....................FundAndDonors */}
          {/*...Fund */}
          <FundAndDonors spacing={3}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{ p: 1, bgcolor: 'background.neutral', borderRadius: '50%' }}>
                <Icon name="dollar-coin" color="text.secondary" />
              </Box>
              <Typography variant="subtitle2" color="text.secondary">
                <FormattedMessage {...TotalMessages.raisedFund} />
              </Typography>
            </Stack>
            <Typography variant="subtitle1" color="text.primary">
              ${campaignsRecentInfo?.raisedFund}
            </Typography>
          </FundAndDonors>
          {/*...Donors */}
          <FundAndDonors spacing={3}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{ p: 1, bgcolor: 'background.neutral', borderRadius: '50%' }}>
                <Icon name="Poverty-Alleviation" color="text.secondary" />
              </Box>
              <Typography variant="subtitle2" color="text.secondary">
                <FormattedMessage {...TotalMessages.donors} />
              </Typography>
            </Stack>
            <Typography variant="subtitle1" color="text.primary">
              {campaignsRecentInfo?.donors}
            </Typography>
          </FundAndDonors>
        </Stack>
      </Stack>
      {/*.....................chart */}
      <Stack sx={{ bgcolor: 'background.paper' }} p={2}>
        <Typography variant="subtitle1" color="text.primary">
          <FormattedMessage {...TotalMessages.status} />:
        </Typography>
        <Stack width="100%" height="100%" justifyContent="center" alignItems="center">
          <PieChart width={280} height={250}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend iconType="circle" iconSize={8} align="right" content={renderLegend} />
          </PieChart>
        </Stack>
      </Stack>
      {/*.....................itemsTotal */}
      <Stack sx={{ bgcolor: 'background.paper' }} p={2} spacing={2}>
        {/*...Engagement */}
        <TotalItemStyle>
          <Stack direction="row" spacing={1}>
            <Icon name="engagement-percent" color="grey.500" />
            <Typography variant="body2" color="text.primary">
              <FormattedMessage {...TotalMessages.engagementPercentage} />
            </Typography>
          </Stack>
          <Typography variant="subtitle2" color="text.primary">
            {campaignsRecentInfo?.engagementPercent}
          </Typography>
        </TotalItemStyle>
        {/*...Impression */}
        <TotalItemStyle>
          <Stack direction="row" spacing={1}>
            <Icon name="impression" color="grey.500" />
            <Typography variant="body2" color="text.primary">
              <FormattedMessage {...TotalMessages.impression} />
            </Typography>
          </Stack>
          <Typography variant="subtitle2" color="text.primary">
            {campaignsRecentInfo?.impression}
          </Typography>
        </TotalItemStyle>
        {/*...Likes */}
        <TotalItemStyle>
          <Stack direction="row" spacing={1}>
            <Icon name="heart" color="grey.500" />
            <Typography variant="body2" color="text.primary">
              <FormattedMessage {...TotalMessages.likes} />
            </Typography>
          </Stack>
          <Typography variant="subtitle2" color="text.primary">
            {campaignsRecentInfo?.numberOfLikes}
          </Typography>
        </TotalItemStyle>
        {/*...Comments */}
        <TotalItemStyle>
          <Stack direction="row" spacing={1}>
            <Icon name="comment" color="grey.500" />
            <Typography variant="body2" color="text.primary">
              <FormattedMessage {...TotalMessages.comments} />
            </Typography>
          </Stack>
          <Typography variant="subtitle2" color="text.primary">
            {campaignsRecentInfo?.numberOfComments}
          </Typography>
        </TotalItemStyle>
        {/*...Saved */}
        <TotalItemStyle>
          <Stack direction="row" spacing={1}>
            <Icon name="Save" color="grey.500" />
            <Typography variant="body2" color="text.primary">
              <FormattedMessage {...TotalMessages.saved} />
            </Typography>
          </Stack>
          <Typography variant="subtitle2" color="text.primary">
            {campaignsRecentInfo?.numberOfSaved}
          </Typography>
        </TotalItemStyle>
        {/*...Shared */}
        <TotalItemStyle>
          <Stack direction="row" spacing={1}>
            <Icon name="Reshare" color="grey.500" />
            <Typography variant="body2" color="text.primary">
              <FormattedMessage {...TotalMessages.shared} />
            </Typography>
          </Stack>
          <Typography variant="subtitle2" color="text.primary">
            {campaignsRecentInfo?.numberOfReshared}
          </Typography>
        </TotalItemStyle>
      </Stack>
    </Stack>
  );
}
export default Total;
