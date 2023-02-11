import React, { useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

//mui
import { Box, Collapse, MenuItem, Select, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

//rechart
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
//service
import { useLazyGetCampaignsRecentInfoQuery } from 'src/_graphql/history/queries/getCampaignsRecentInfo.generated';
//icon
import { Icon } from 'src/components/Icon';

import ReportGardenMessages from '../ReportGarden.message';

//...
//.............................................................................styles
const ImageArrowDown = styled(Box)(({ theme }) => ({
  width: 24,
  height: 24,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.palette.grey[300],
  borderRadius: 9,
  marginLeft: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
}));
const TotalItemStyle = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.palette.grey[100],
  width: 296,
  borderRadius: theme.spacing(1),
  marginRight: theme.spacing(3),
}));
const ChartStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.palette.grey[100],
  width: 456,
  borderRadius: theme.spacing(1),
}));
const LegendStyle = styled('ul')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
  height: 50,
}));

//...............................................................................................................

function Total() {
  const [GetCampaignsRecentInfoQuery, { data: getCampaignRecent }] = useLazyGetCampaignsRecentInfoQuery();
  const campaignRecent = getCampaignRecent?.getCampaignsRecentInfo?.listDto?.items?.[0];
  //.............................................state
  const [openCollapse, setOpenCollapse] = useState(false);
  const [answer, setAnswer] = React.useState('status');
  //...........................................
  const handleClickCollapse = () => {
    setOpenCollapse(!openCollapse);
  };
  //..................useEffect
  useEffect(() => {
    GetCampaignsRecentInfoQuery({ filter: { dto: { campaignId: '6f4a6d1c-60a3-49f7-808a-ded5a6d59bc6' } } });
  }, [GetCampaignsRecentInfoQuery]);
  //....................................................................data Chart

  const data = useMemo(() => {
    const res: { name: string; value: number; color: string }[] = [];
    if (campaignRecent?.numberOfSuccessFul)
      res.push({ name: 'Successful', value: campaignRecent?.numberOfSuccessFul, color: '#28BF64' });
    if (campaignRecent?.numberOfFinished)
      res.push({ name: 'Finished', value: campaignRecent?.numberOfFinished, color: '#2092E4' });
    if (campaignRecent?.numberOfActive)
      res.push({ name: 'Active', value: campaignRecent?.numberOfActive, color: '#13968E' });
    if (campaignRecent?.numberOfIntrupted)
      res.push({ name: 'Interrupted', value: campaignRecent?.numberOfIntrupted, color: '#D27722' });
    return res;
  }, [campaignRecent]);

  interface RenderCustomizedLabelType {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
  }

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: RenderCustomizedLabelType) => {
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
  const renderLegend = (props: { payload: any }) => {
    const { payload } = props;
    return (
      <LegendStyle>
        {payload.map((entry: any, index: number) => (
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
    <Stack>
      <Stack direction="row" alignItems="center">
        <Typography variant="subtitle1" color="primary.dark">
          <FormattedMessage {...ReportGardenMessages.total} />
        </Typography>
        <Typography variant="subtitle2" color="primary.dark">
          <FormattedMessage {...ReportGardenMessages.recent30Days} />
        </Typography>
        <ImageArrowDown onClick={handleClickCollapse}>
          {openCollapse ? <Icon name="upper-arrow" color="grey.500" /> : <Icon name="down-arrow" color="grey.500" />}
        </ImageArrowDown>
      </Stack>
      <Collapse in={openCollapse} timeout="auto" unmountOnExit>
        <Stack mt={2} direction="row">
          {/*......................................................................*/}
          <Stack spacing={2}>
            <TotalItemStyle>
              <Typography variant="body1" color="text.secondary">
                <FormattedMessage {...ReportGardenMessages.donors} />
              </Typography>
              <Typography variant="subtitle1" color="text.primary">
                {campaignRecent?.donors}
              </Typography>
            </TotalItemStyle>
            <TotalItemStyle>
              <Typography variant="body1" color="text.secondary">
                <FormattedMessage {...ReportGardenMessages.raisedFund} />
              </Typography>
              <Typography variant="subtitle1" color="text.primary">
                {campaignRecent?.raisedFund}
              </Typography>
            </TotalItemStyle>
            <TotalItemStyle>
              <Typography variant="body1" color="text.secondary">
                <FormattedMessage {...ReportGardenMessages.impression} />
              </Typography>
              <Typography variant="subtitle1" color="text.primary">
                {campaignRecent?.impression}
              </Typography>
            </TotalItemStyle>
            <TotalItemStyle>
              <Typography variant="body1" color="text.secondary">
                <FormattedMessage {...ReportGardenMessages.engagementPercent} />
              </Typography>
              <Typography variant="subtitle1" color="text.primary">
                {campaignRecent?.engagementPercent}
              </Typography>
            </TotalItemStyle>
          </Stack>
          {/*......................................................................*/}
          <Stack spacing={2}>
            <TotalItemStyle>
              <Typography variant="body1" color="text.secondary">
                <FormattedMessage {...ReportGardenMessages.likes} />
              </Typography>
              <Typography variant="subtitle1" color="text.primary">
                {campaignRecent?.numberOfLikes}
              </Typography>
            </TotalItemStyle>
            <TotalItemStyle>
              <Typography variant="body1" color="text.secondary">
                <FormattedMessage {...ReportGardenMessages.comments} />
              </Typography>
              <Typography variant="subtitle1" color="text.primary">
                {campaignRecent?.numberOfComments}
              </Typography>
            </TotalItemStyle>
            <TotalItemStyle>
              <Typography variant="body1" color="text.secondary">
                <FormattedMessage {...ReportGardenMessages.saved} />
              </Typography>
              <Typography variant="subtitle1" color="text.primary">
                {campaignRecent?.numberOfSaved}
              </Typography>
            </TotalItemStyle>
            <TotalItemStyle>
              <Typography variant="body1" color="text.secondary">
                <FormattedMessage {...ReportGardenMessages.reShared} />
              </Typography>
              <Typography variant="subtitle1" color="text.primary">
                {campaignRecent?.numberOfReshared}
              </Typography>
            </TotalItemStyle>
          </Stack>
          {/*......................................................................*/}

          <ChartStyle>
            <Box sx={{ width: 107 }}>
              <Select
                size="small"
                value={answer}
                displayEmpty
                onChange={(event) => setAnswer(event.target.value)}
                // renderValue={answer !== '' ? undefined : () => <Box>status</Box>}
              >
                <MenuItem value={'status'}>
                  <FormattedMessage {...ReportGardenMessages.status} />
                </MenuItem>
                <MenuItem value={'ReceivedMoney'}>
                  <FormattedMessage {...ReportGardenMessages.receivedMoney} />
                </MenuItem>
                <MenuItem value={'RaisedFund'}>
                  <FormattedMessage {...ReportGardenMessages.raisedFund} />
                </MenuItem>
                <MenuItem value={'Donors'}>
                  <FormattedMessage {...ReportGardenMessages.donors} />
                </MenuItem>
              </Select>
            </Box>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart width={400} height={400}>
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
                <Legend iconType="circle" iconSize={8} align="right" content={renderLegend as any} />
              </PieChart>
            </ResponsiveContainer>
          </ChartStyle>
        </Stack>
      </Collapse>
    </Stack>
  );
}

export default Total;
