import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
//bottom sheet
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';

//mui
import {
  Badge,
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
  styled,
} from '@mui/material';

//icon
import { Icon } from 'src/components/Icon';

import DonatedMoneyMessages from '../DonatedMoney.messages';

const SearchBadgeStyle = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    minWidth: 'unset!important',
    width: '6px!important',
    height: '6px!important',
    right: '-4px!important',
  },
}));

interface ISortChangeProps {
  sortValuesChange: (sort: string[], order: boolean[]) => void;
}

function SortCampaigns(props: ISortChangeProps) {
  const { formatMessage } = useIntl();
  const { sortValuesChange } = props;
  const [sortValue, setSortValue] = useState<string[]>(['raisedFund']);
  const [orderValue, setOrderValue] = useState<boolean[]>([true]);
  const [openSortCampaign, setOpenSortCampaign] = useState(false);

  //..............................
  //.............................................useEffect
  useEffect(() => {
    sortValuesChange(sortValue, orderValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderValue, sortValue]);

  const handelSort = (e: React.FormEvent<HTMLInputElement>) => {
    const sortArray = [];
    sortArray.push(e.currentTarget.value);
    setSortValue(sortArray);
    setOpenSortCampaign(false);
  };
  const handelOrder = (e: React.FormEvent<HTMLInputElement>) => {
    const orderArray = [];
    if (e.currentTarget.value === 'false') {
      orderArray.push(false);
    } else {
      orderArray.push(true);
    }
    setOrderValue(orderArray);
    setOpenSortCampaign(false);
  };

  return (
    <>
      <Stack sx={{ bgcolor: 'background.neutral' }} p={2}>
        <Stack pt={1} direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" gap={1}>
            <Typography variant="h6" color="text.primary">
              <FormattedMessage {...DonatedMoneyMessages.campaigns} />:
            </Typography>

            <SearchBadgeStyle
              color="error"
              variant="dot"
              invisible={sortValue[0] === 'raisedFund' && orderValue[0] === true}
            >
              <Box sx={{ cursor: 'pointer' }} onClick={() => setOpenSortCampaign(true)}>
                <Icon name="Sort2" />
              </Box>
            </SearchBadgeStyle>
          </Stack>
        </Stack>
      </Stack>
      {/* bottomSheet Sort Campaign */}
      <BottomSheet open={openSortCampaign} onDismiss={() => setOpenSortCampaign(!openSortCampaign)}>
        <Stack spacing={2} height={360}>
          <Typography variant="subtitle1" color="text.primary" px={2}>
            <FormattedMessage {...DonatedMoneyMessages.sortBy} />
          </Typography>
          <Divider />
          {/*...RadioGroup Sort by*/}
          <FormControl sx={{ overflow: 'scroll', px: 2 }}>
            <RadioGroup name="radio-buttons-group-sortBy" defaultValue={sortValue} onChange={handelSort}>
              <FormControlLabel
                value="raisedFund"
                control={<Radio />}
                label={formatMessage(DonatedMoneyMessages.raisedFund)}
              />
              <FormControlLabel
                value="updateDate"
                control={<Radio />}
                label={formatMessage(DonatedMoneyMessages.date)}
              />
              <FormControlLabel
                value="campaignName"
                control={<Radio />}
                label={formatMessage(DonatedMoneyMessages.name)}
              />
              <FormControlLabel value="target" control={<Radio />} label={formatMessage(DonatedMoneyMessages.target)} />
            </RadioGroup>
          </FormControl>
          <Typography variant="subtitle1" color="text.primary" px={2}>
            <FormattedMessage {...DonatedMoneyMessages.orderBy} />
          </Typography>
          {/*...RadioGroup Order by*/}
          <FormControl sx={{ overflow: 'scroll', px: 2 }}>
            <RadioGroup name="radio-buttons-group-orderBy" defaultValue={orderValue} onChange={handelOrder}>
              <FormControlLabel
                value={false}
                control={<Radio />}
                label={formatMessage(DonatedMoneyMessages.ascending)}
              />
              <FormControlLabel
                value={true}
                control={<Radio />}
                label={formatMessage(DonatedMoneyMessages.descending)}
              />
            </RadioGroup>
          </FormControl>
        </Stack>
      </BottomSheet>
    </>
  );
}

export default SortCampaigns;
