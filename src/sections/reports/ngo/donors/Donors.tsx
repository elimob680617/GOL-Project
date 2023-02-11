import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

//mui
import {
  Box,
  Collapse,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

//service
import { useLazyGetCampaignsInfoQuery } from 'src/_graphql/history/queries/getCampaignsInfo.generated';
//icon
import { Icon } from 'src/components/Icon';
import useDebounce from 'src/hooks/useDebounce';

import ExportFile from '../../components/ExportFile';
//component
import CampaignDetails from './CampaignDetails';
import CampaignDetailsMessages from './CampaignDetails.messages';
import CampaignDonation from './CampaignDonation';
import DonorsInfo from './DonorsInfo';

//.............................................................................
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

//...............................................................................................................
interface ICampaignsProp {
  id?: string;
}
function Campaigns(props: ICampaignsProp) {
  const { id } = props;
  //...
  const [getCampaignInfo, { data: campaignInfoData }] = useLazyGetCampaignsInfoQuery();
  //...
  const campaignData = campaignInfoData?.getCampaignsInfo?.listDto?.items;
  //.............................................state
  const [openCollapse, setOpenCollapse] = useState(false);
  const [answer, setAnswer] = React.useState('');

  const [campaignId, setCampaignId] = useState('');
  const [searchedText, setSearchedText] = useState<string>('');
  const debouncedValue = useDebounce<string>(searchedText, 500);
  //.............................................useEffect

  useEffect(() => {
    if (id?.length) {
      getCampaignInfo({
        filter: {
          pageIndex: 0,
          pageSize: 10,

          filterExpression: debouncedValue.length
            ? `CampaignName.Contains(\"${debouncedValue}\") && ownerUserId == (\"${id}\")`
            : `ownerUserId == (\"${id}\")`,
        },
      });
    }
  }, [debouncedValue, getCampaignInfo, id]);

  useEffect(() => {
    if (campaignData) {
      setCampaignId(campaignData?.[0]?.campaignId as string);
    }
  }, [campaignData]);
  console.log('campaignInfoData', campaignInfoData);
  //.........................
  const handleClickCollapse = () => {
    setOpenCollapse(!openCollapse);
  };

  //.............................................................................
  return (
    <Stack>
      <Stack direction="row" justifyContent="space-between" alignItems="center" px={2} py={2}>
        <Stack direction="row">
          <Typography variant="subtitle1" color="primary.dark">
            Donors Data
          </Typography>
          <ImageArrowDown onClick={handleClickCollapse}>
            {openCollapse ? <Icon name="upper-arrow" /> : <Icon name="down-arrow" />}
          </ImageArrowDown>
        </Stack>
        <Stack direction="row" gap={2} display={!openCollapse ? 'none' : 'flex'}>
          <Box>
            <Select
              size="small"
              value={answer}
              displayEmpty
              onChange={(event) => setAnswer(event.target.value)}
              renderValue={
                answer !== ''
                  ? undefined
                  : () => (
                      <Typography variant="button" color="grey.900">
                        Overview
                      </Typography>
                    )
              }
            >
              <MenuItem value={'ThisWeek'}>This Week</MenuItem>
              <MenuItem value={'ThisMonth'}>This Month</MenuItem>
              <MenuItem value={'ThisYear'}>This Year</MenuItem>
              <MenuItem value={'Overview'}>Overview</MenuItem>
            </Select>
          </Box>
          <Box>
            <ExportFile />
          </Box>
        </Stack>
      </Stack>
      {/*............................................................................*/}
      <Collapse in={openCollapse} timeout="auto" unmountOnExit>
        {/*************************(Donors Data)***********************************/}
        <Stack pt={2} sx={{ bgcolor: 'background.neutral' }}>
          <Grid container spacing={1}>
            <Grid item lg={2.5}>
              <Stack spacing={2} sx={{ bgcolor: 'background.paper', borderRadius: 1, p: 2, height: 370 }}>
                <Typography variant="subtitle2" color="text.primary">
                  <FormattedMessage {...CampaignDetailsMessages.campaigns} />
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  name="search"
                  type="search"
                  placeholder="search"
                  onChange={(e) => setSearchedText(e.target.value)}
                  // onChange={(e) => searchCampaign(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Icon name="Research" color="grey.500" />
                      </InputAdornment>
                    ),
                  }}
                />
                {/*...RadioGroup */}
                <FormControl sx={{ overflow: 'scroll', pl: 1 }}>
                  <RadioGroup
                    name="radio-buttons-group"
                    value={campaignId}
                    onChange={(e) => setCampaignId(e.target.value)}
                  >
                    {campaignData?.map((campaign) => (
                      <FormControlLabel
                        checked={campaign?.campaignId === campaignId}
                        key={campaign?.campaignId}
                        value={campaign?.campaignId}
                        control={<Radio />}
                        label={campaign?.campaignName as string}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Stack>
            </Grid>

            {/*...Donors */}
            <Grid item lg={4}>
              <Stack sx={{ bgcolor: 'background.paper', borderRadius: 1, p: 2, height: 370 }}>
                <CampaignDonation campaignId={campaignId} />
              </Stack>
            </Grid>

            {/*...DataGrid */}
            <Grid item lg={5.5}>
              <Stack sx={{ bgcolor: 'background.paper', borderRadius: 1, height: '100%' }}>
                <DonorsInfo campaignId={campaignId} />
              </Stack>
            </Grid>
          </Grid>
          {/*...Campaign X */}
          <Box sx={{ width: 'calc(100% + 32px)', bgcolor: 'background.neutral', height: 16, ml: -2 }} />

          {/*...cards */}
          <CampaignDetails campaignId={campaignId} />

          <Box sx={{ width: 'calc(100% + 32px)', bgcolor: 'background.neutral', height: 16, ml: -2 }} />
        </Stack>
      </Collapse>
    </Stack>
  );
}

export default Campaigns;
