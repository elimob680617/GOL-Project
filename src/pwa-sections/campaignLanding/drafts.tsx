import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { Box, Typography } from '@mui/material';

import { useLazyGetFundRaisingPostsQuery } from 'src/_graphql/post/campaign-post/queries/getCampaignPosts.generated';
import NGOsIcon from 'src/assets/icons/campaignLanding/NGOs.svg';
import noDrafts from 'src/assets/icons/campaignLanding/NoDrafts.svg';
import { DraftPostCard, HeaderCampaignLanding, MenuItemCampaignLanding } from 'src/components/campaignLanding';
import useAuth from 'src/hooks/useAuth';
import { PostStatus } from 'src/types/serverTypes';

import campaignLandingMessages from './campaignLandingMessages';

function Drafts() {
  const [getDraft] = useLazyGetFundRaisingPostsQuery();
  const [drafts, setDrafts] = useState([]);
  const user = useAuth();

  useEffect(() => {
    getDraft({
      filter: { pageSize: 900, pageIndex: 0, dto: { status: PostStatus.Draft, ownerUserId: user?.user?.id } },
    })
      .unwrap()
      .then((res: any) => {
        setDrafts(res?.getHomePageFundRaisingPosts?.listDto?.items);
      });
  }, [getDraft, user]);
  return (
    <Box>
      <HeaderCampaignLanding title="Campaign Landing" />
      <Box display={'flex'} sx={{ overflow: 'auto' }}>
        <MenuItemCampaignLanding active="drafts" />
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
      <Box>
        {drafts?.length > 0 ? (
          drafts.map((item: any) => <DraftPostCard key={item.id} data={item} drafts={drafts} setDrafts={setDrafts} />)
        ) : (
          <Box display={'flex'} justifyContent={'center'} alignItems={'center'} sx={{ pt: 3 }}>
            <img src={noDrafts} alt="noDrafts" loading="lazy" />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Drafts;
