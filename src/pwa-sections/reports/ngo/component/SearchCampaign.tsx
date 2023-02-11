import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
//bottom sheet
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';

//mui
import {
  Divider,
  FormControl,
  FormControlLabel,
  InputAdornment,
  Radio,
  RadioGroup,
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
import PostDetailsMessages from 'src/pwa-sections/post/campaignPost/postDetails/PostDetails.messages';
import { PATH_APP } from 'src/routes/paths';

const SelectCampaignStyle = styled(Stack)(({ theme }) => ({
  height: 40,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.palette.grey[300],
  alignItems: 'center',
  justifyContent: 'space-between',
  borderRadius: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2.5),
  margin: theme.spacing(2, 2.5),
  cursor: 'pointer',
}));

interface ISearchCampaign {
  id?: string;
}
type Params = {
  tab: string;
  idParam: string;
};

function SearchCampaign(props: ISearchCampaign) {
  const { id } = props;
  const push = useNavigate();
  // const query = useParams();
  const { tab, idParam } = useParams<Params>();
  const { formatMessage } = useIntl();
  const [getCampaignInfo, { data: campaignInfoData }] = useLazyGetCampaignsInfoQuery();
  //...
  const campaignData = campaignInfoData?.getCampaignsInfo?.listDto?.items;
  //.............................................state

  const [campaignId, setCampaignId] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [openCampaign, setOpenCampaign] = useState(false);
  const [searchedText, setSearchedText] = useState<string>('');
  const [tabValue, setTabValue] = useState('overview');
  const debouncedValue = useDebounce<string>(searchedText, 500);
  console.log('tab', tab);
  //..................useEffect
  // useEffect(() => {
  //   if (query.reports && query.reports[0]) {
  //     setTabValue(query.reports[0]);
  //     setCampaignId('');
  //     setOpenCampaign(false);
  //   }
  //   if (query.reports && query.reports[1]) {
  //     setCampaignId(query.reports[1]);
  //   }
  // }, [query.reports, setOpenCampaign]);
  useEffect(() => {
    if (tab) {
      setTabValue(tab);
      setCampaignId('');
      setOpenCampaign(false);
    }
    if (idParam) {
      setCampaignId(idParam);
    }
  }, [tab, idParam]);

  //.............................................useEffect
  useEffect(() => {
    if (id)
      getCampaignInfo({
        filter: {
          pageIndex: 0,
          pageSize: 10,
          filterExpression: debouncedValue.length
            ? `CampaignName.Contains(\"${debouncedValue}\") && ownerUserId == (\"${id}\") `
            : `ownerUserId == (\"${id}\") `,
        },
      });
  }, [campaignInfoData?.getCampaignsInfo?.isSuccess, debouncedValue, getCampaignInfo, id]);

  // useEffect(() => {
  //   if (campaignInfoData?.getCampaignsInfo?.listDto?.items) {
  //     setCampaignId(campaignInfoData?.getCampaignsInfo?.listDto?.items[0]?.campaignId as string);
  //   }
  // }, [campaignInfoData]);

  useEffect(() => {
    if (campaignId && tabValue) {
      push(`${PATH_APP.report.ngo}/${tabValue}/${campaignId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  console.log('campaignId232334', campaignId);

  return (
    <>
      <Stack sx={{ bgcolor: 'background.paper' }}>
        <SelectCampaignStyle
          direction="row"
          spacing={2}
          onClick={() => {
            setOpenCampaign(true);
            setCampaignName('');
            setCampaignId('');
          }}
        >
          <Typography variant="body2" color={campaignName !== '' ? 'text.primary' : 'text.secondary'}>
            {campaignName !== '' ? campaignName : 'Select Campaign'}
          </Typography>
          <Icon name="down-arrow" color="grey.500" />
        </SelectCampaignStyle>
      </Stack>
      <BottomSheet open={openCampaign} onDismiss={() => setOpenCampaign(!openCampaign)}>
        <Stack spacing={2} height={360}>
          <Typography variant="subtitle1" color="text.primary" px={2}>
            <FormattedMessage {...PostDetailsMessages.selectCampaign} />
          </Typography>
          <Divider />
          <Stack px={2}>
            <TextField
              fullWidth
              size="small"
              name="search"
              type="search"
              placeholder={formatMessage(PostDetailsMessages.search)}
              onChange={(e) => setSearchedText(e.target.value)}
              InputProps={{
                startAdornment: (
                  <>
                    <InputAdornment position="start">
                      <Icon name="Research" color="grey.500" type="solid" />
                    </InputAdornment>
                  </>
                ),
              }}
            />
          </Stack>
          {/*...RadioGroup */}
          <FormControl sx={{ overflow: 'scroll', px: 2 }}>
            <RadioGroup
              name="radio-buttons-group"
              value={campaignId}
              onChange={(e) => {
                setCampaignId(e.target.value);
                setCampaignName(e.target.id);
              }}
            >
              {campaignData?.map((campaign: any) => (
                <FormControlLabel
                  key={campaign?.campaignId}
                  value={campaign?.campaignId}
                  control={<Radio id={campaign?.campaignName as string} />}
                  label={campaign?.campaignName ? campaign?.campaignName : ('No name campaign.' as string)}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Stack>
      </BottomSheet>
    </>
  );
}

export default SearchCampaign;
