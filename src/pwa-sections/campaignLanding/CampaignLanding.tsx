import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { BottomSheet } from 'react-spring-bottom-sheet';

import {
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { useLazyGetFundRaisingPostsQuery } from 'src/_graphql/post/campaign-post/queries/getCampaignPosts.generated';
import NGOsIcon from 'src/assets/icons/campaignLanding/NGOs.svg';
import noDrafts from 'src/assets/icons/campaignLanding/NoDrafts.svg';
import { Icon } from 'src/components/Icon';
import { HeaderCampaignLanding, MenuItemCampaignLanding } from 'src/components/campaignLanding';
import { PostStatus } from 'src/types/serverTypes';

import CampignPost from '../post/campaignPost/campaignPostCard/CampignPost';
import campaignLandingMessages from './campaignLandingMessages';

const InputFilter = styled('div')(() => ({}));

function CampaignLanding() {
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>('');
  const [filterOptions] = useState([
    { name: 'All' },
    { name: 'Agriculture' },
    { name: 'Arts and culture' },
    { name: 'Economic Development' },
    { name: 'Education' },
    { name: 'Environmental Protection' },
    { name: 'Community Development' },
    { name: 'Children, Family issues' },
    { name: 'Disaster Relief' },
    { name: 'Human Right' },
    { name: 'Human Services' },
    { name: 'Health, Medical problems' },
    { name: 'Handicapped Issues' },
    { name: 'Humanitarian Assitance' },
    { name: 'Mass Media' },
    { name: 'National Heritage' },
    { name: 'Refugee Issues' },
    { name: 'Science & Technology' },
    { name: 'Sport' },
    { name: 'Poverty Alleviation' },
    { name: 'Professional Association' },
    { name: 'Women Issues' },
    { name: 'Youth' },
    { name: 'Religion' },
    { name: 'Animals' },
    { name: 'International' },
    { name: 'Research and Public Policy' },
  ]);
  const [search, setSearch] = useState<string>('');
  const [getFoundRasing] = useLazyGetFundRaisingPostsQuery();
  const [posts, setPosts] = useState([]);
  const { formatMessage } = useIntl();

  useEffect(() => {
    getFoundRasing({
      filter: {
        pageSize: 900,
        pageIndex: 0,
        dto: { status: PostStatus.Show, ownerUserId: 'e4cb5e82-8ebd-41ad-a42d-468a3c2cdc15' },
      },
    })
      .unwrap()
      .then((res: any) => {
        setPosts(res.getHomePageFundRaisingPosts.listDto.items);
      });
  }, [getFoundRasing]);
  const handleSearch = (e: any) => {
    setSearch(e.target.value);
  };
  return (
    <Box sx={{ bgcolor: 'background.neutral', height: '100%' }}>
      <HeaderCampaignLanding title={formatMessage(campaignLandingMessages.campaignLanding)} />
      <Box display={'flex'} sx={{ overflow: 'auto' }}>
        <MenuItemCampaignLanding active="campaign" />
      </Box>
      <Box
        sx={{
          bgcolor: (theme) => theme.palette.surface.main,
          height: 214,
        }}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        flexWrap={'wrap'}
      >
        <img src={NGOsIcon} alt="NGOs" loading="lazy" />
        <Typography variant="overline" color={'text.secondary'} sx={{ width: '100%', textAlign: 'center' }}>
          <FormattedMessage {...campaignLandingMessages.errorCreateCampaign} />
        </Typography>
      </Box>
      <Box
        sx={{
          bgcolor: (theme) => theme.palette.surface.main,
          height: 120,
          borderTop: (theme) => `1px solid ${theme.palette.grey[100]}`,
        }}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        flexWrap={'wrap'}
      >
        <Icon name="Info" color="info.main" />
        <Typography variant="caption" color={'info.main'} sx={{ ml: 1 }}>
          {'Filttering Campaign post based on categories'}
        </Typography>
        <InputFilter onClick={() => setOpenFilter(true)}>
          <Box
            sx={{
              width: 328,
              height: 40,
              border: `1px solid gery.100`,
              m: 2,
              mt: 0,
              borderRadius: '8px',
              p: 1,
            }}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body2" color={'text.secondary'} sx={{ ml: 1 }}>
              {filter === 'All' || filter === '' ? 'Category' : filter}
            </Typography>
            <Icon name="down-arrow" />
          </Box>
        </InputFilter>
        <BottomSheet
          open={openFilter}
          onDismiss={() => setOpenFilter(!openFilter)}
          header={
            <Typography variant="subtitle1" sx={{ p: 2 }}>
              <FormattedMessage {...campaignLandingMessages.categories} />
            </Typography>
          }
        >
          <Divider />
          <Typography variant="body2" sx={{ p: 2, pt: 0 }}>
            <TextField
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon name="Research" />
                  </InputAdornment>
                ),
              }}
              placeholder="Search"
              sx={{ width: '100%', height: '2.5rem', marginTop: 3, marginBottom: 3 }}
              value={search}
              onChange={handleSearch}
            />
            <FormControl>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue={filter !== '' ? filter : 'All'}
                name="radio-buttons-group"
                onChange={(e) => {
                  setFilter(e.target.value);
                  setOpenFilter(false);
                }}
              >
                {filterOptions.map((item, index) => (
                  <FormControlLabel key={index} value={item.name} control={<Radio />} label={item.name} />
                ))}
              </RadioGroup>
            </FormControl>
          </Typography>
        </BottomSheet>
      </Box>
      {!!posts?.length ? (
        posts.map((item: any) => (
          <Box key={item.id} sx={{ mt: 1 }}>
            <CampignPost post={item} />
          </Box>
        ))
      ) : (
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} sx={{ pt: 3 }}>
          <img src={noDrafts} alt="noDrafts" loading="lazy" />
        </Box>
      )}
    </Box>
  );
}

export default CampaignLanding;
