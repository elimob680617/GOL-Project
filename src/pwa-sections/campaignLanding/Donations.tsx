import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { BottomSheet } from 'react-spring-bottom-sheet';

import { Badge, Box, Divider, FormControl, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useLazyGetDonatedReportQueryQuery } from 'src/_graphql/history/queries/getDonatedReport.generated';
import NoFounraising from 'src/assets/icons/campaignLanding/Fundraising.svg';
import { Icon } from 'src/components/Icon';
import { HeaderCampaignLanding, MenuItemCampaignLanding } from 'src/components/campaignLanding';
import DonationCards from 'src/components/campaignLanding/DonationCards';

import campaignLandingMessages from './campaignLandingMessages';

export const SearchBadgeStyle = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    minWidth: 'unset!important',
    width: '6px!important',
    height: '6px!important',
    right: '-4px!important',
  },
}));
const SortBox = styled('div')(({ theme }) => ({
  margin: 16,
  marginTop: 27,
  marginBottom: 27,
}));

function Donations() {
  const [openSort, setOpenSort] = useState<boolean>(false);
  const [sortValue, setSortValue] = useState<string>('High paid');
  const [donations, setDonations] = useState([]);
  const [getDoners] = useLazyGetDonatedReportQueryQuery();
  const { formatMessage } = useIntl();
  useEffect(() => {
    getDoners({
      filter: {
        pageSize: 5,
        pageIndex: 1,
        orderByFields:
          sortValue === 'High Rated' ? ['rate'] : sortValue === 'Recent' ? ['raisedFundDateTime'] : ['raisedFund'],
        orderByDescendings: [true],
      },
    })
      .unwrap()
      .then((res: any) => {
        console.log(res.getDonatedReportQuery.listDto.items);
        setDonations(res.getDonatedReportQuery.listDto.items);
      });
  }, [getDoners, sortValue]);

  return (
    <Box>
      <HeaderCampaignLanding title={formatMessage(campaignLandingMessages.campaignLanding)} />
      <Box display={'flex'} sx={{ overflow: 'auto' }}>
        <MenuItemCampaignLanding active="donation" />
      </Box>
      <SortBox onClick={() => setOpenSort(true)}>
        <Typography variant="button">
          <SearchBadgeStyle color="error" variant="dot" invisible={sortValue === 'High paid'}>
            <FormattedMessage {...campaignLandingMessages.SortBy} /> <Icon name="Sort2" />
          </SearchBadgeStyle>
        </Typography>
      </SortBox>
      <Box sx={{ maxWidth: '100%' }}>
        {donations.length !== 0 ? (
          donations.map((item: any) => <DonationCards key={item.id} data={item} />)
        ) : (
          <Box display={'flex'} justifyContent="center" flexWrap={'wrap'}>
            <img src={NoFounraising} alt="NoFounraising" loading="lazy" />
            <Typography variant="caption" color="grey.500" sx={{ width: '100%', textAlign: 'center' }}>
              <FormattedMessage {...campaignLandingMessages.YouNotDonated} />
            </Typography>
          </Box>
        )}
      </Box>
      <BottomSheet
        open={openSort}
        onDismiss={() => setOpenSort(!openSort)}
        header={
          <Typography variant="subtitle1" sx={{ p: 2 }}>
            <FormattedMessage {...campaignLandingMessages.SortBy} />
          </Typography>
        }
      >
        <Divider />
        <Typography variant="body2" sx={{ p: 2, pt: 0 }}>
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue={sortValue}
              name="radio-buttons-group"
              onChange={(e) => {
                setSortValue(e.target.value);
                setOpenSort(false);
              }}
            >
              <FormControlLabel
                value="High paid"
                control={<Radio />}
                label={formatMessage(campaignLandingMessages.sortHighPaid)}
              />
              <FormControlLabel
                value="Recent"
                control={<Radio />}
                label={formatMessage(campaignLandingMessages.sortRecent)}
              />
              <FormControlLabel
                value="High Rated"
                control={<Radio />}
                label={formatMessage(campaignLandingMessages.sortHighRated)}
              />
            </RadioGroup>
          </FormControl>
        </Typography>
      </BottomSheet>
    </Box>
  );
}

export default Donations;
