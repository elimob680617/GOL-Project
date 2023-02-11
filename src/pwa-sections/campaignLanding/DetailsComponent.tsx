import { useEffect, useState } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { FormattedMessage, useIntl } from 'react-intl';

import { Box, IconButton, Typography } from '@mui/material';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';

import { useLazyGetFundRaisingPostQuery } from 'src/_graphql/post/post-details/queries/getFundRaisingPost.generated';
import noBody from 'src/assets/icons/campaignLanding/noBody.svg';
import noCoverImage from 'src/assets/icons/campaignLanding/noCoverImage.svg';
import { Icon } from 'src/components/Icon';
import { HeaderCampaignLanding } from 'src/components/campaignLanding';
import { UserTypeEnum } from 'src/types/serverTypes';

import PostDetailsNgoInfo from '../post/campaignPost/postDetails/PostDetailsNgoInfo';
import campaignLandingMessages from './campaignLandingMessages';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 0 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? 'primary' : '#308fe8',
  },
}));

function DetailsComponent(props: any) {
  const [getDetails] = useLazyGetFundRaisingPostQuery();
  const { formatMessage } = useIntl();
  const postId = props.match.params.id;
  const [post, setPost] = useState<any>([]);
  useEffect(() => {
    if (postId) {
      getDetails({ filter: { dto: { id: postId } } })
        .unwrap()
        .then((res: any) => {
          setPost(res?.getFundRaisingPost?.listDto?.items);
        });
    }
  }, [getDetails, postId]);
  console.log(post);
  return (
    <Box>
      <HeaderCampaignLanding title="Details" postId={post[0]?.id} post={post[0]} />
      {post[0]?.coverImageUrl !== '' ? (
        <Box>
          <img src={post[0]?.coverImageUrl} alt="coverImageUrl" width="100%" loading="lazy" />
        </Box>
      ) : (
        <Box
          sx={{ height: 176, width: '100%', bgcolor: (theme) => theme.palette.background.neutral }}
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexWrap="wrap"
        >
          <img src={noCoverImage} alt="coverImageUrl" loading="lazy" />
          <Typography variant="caption" color="text.secondary" sx={{ width: '100%', textAlign: 'center' }}>
            There is no Cover Photo
          </Typography>
        </Box>
      )}
      <Box sx={{ p: 2 }} display="flex" justifyContent={'space-between'}>
        <Typography variant="subtitle1">
          {post[0]?.title !== '' ? post[0]?.title : formatMessage(campaignLandingMessages.NoTitle)}
        </Typography>
        <IconButton>
          <Icon name="Menu" type="solid" />
        </IconButton>
      </Box>
      <Box sx={{ p: 2 }}>
        <PostDetailsNgoInfo
          fullName={post[0]?.fullName}
          avatar={post[0]?.userAvatarUrl || undefined}
          location={post[0]?.placeDescription}
          createdDateTime={`${formatMessage(campaignLandingMessages.Saved)} ${post[0]?.createdDateTime} ${formatMessage(
            campaignLandingMessages.ago,
          )}`}
          userType={UserTypeEnum.Ngo}
          ownerUserId={post[0]?.ownerUserId}
          isMine={post[0]?.isMine}
        />
      </Box>
      <Box
        sx={{
          height: 126,
          bgcolor: (theme) => theme.palette.background.neutral,
          color: (theme) => theme.palette.primary.main,
          p: 2,
        }}
      >
        <Typography variant="subtitle2" color={(theme) => theme.palette.primary.main} sx={{ mb: 2 }}>
          {post[0]?.target === 0
            ? formatMessage(campaignLandingMessages.NoMoneyAdded)
            : `$${post[0]?.raisedMoney} ${formatMessage(campaignLandingMessages.raisedOf)} $${post[0]?.target}`}
        </Typography>
        <BorderLinearProgress
          variant="determinate"
          value={post[0]?.raisedMoney !== 0 ? (post[0]?.raisedMoney * 100) / post[0]?.target : 0}
          sx={{
            [`& .${linearProgressClasses.bar}`]: {
              borderRadius: 5,
              backgroundColor: (theme) => (theme.palette.mode === 'light' ? 'primary' : 'secondary'),
            },
          }}
        />
        <Box sx={{ width: '100%' }} display="flex" justifyContent={'flex-end'}>
          <Box
            sx={{
              backgroundColor: (theme) => theme.palette.background.paper,
              p: 1,
              borderRadius: 0.5,
              m: 2,
              maxWidth: 165,
              textAlign: 'center',
            }}
          >
            {post[0]?.dayLeft ? (
              <Box>
                {post[0]?.dayLeft > 0 && (
                  <Typography variant="subtitle2" color={(theme) => theme.palette.primary.dark}>
                    {post[0]?.dayLeft} <FormattedMessage {...campaignLandingMessages.daysLeft} />
                  </Typography>
                )}
              </Box>
            ) : (
              <Box>
                {post[0]?.dayLeft === 0 ? (
                  <Typography variant="subtitle2" color={(theme) => theme.palette.warning.dark}>
                    <FormattedMessage {...campaignLandingMessages.Expired} />
                  </Typography>
                ) : (
                  <Typography variant="subtitle2" color={(theme) => theme.palette.primary.dark}>
                    <FormattedMessage {...campaignLandingMessages.NoDeadlineAdded} />
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <Box sx={{ p: 2, maxWidth: '100%', overflowX: 'hidden' }}>
        {post[0]?.body === '' ? (
          <Box display="flex" justifyContent={'center'} alignItems="center">
            <img src={noBody} alt="noBody" loading="lazy" />
          </Box>
        ) : (
          <Typography>{ReactHtmlParser(post[0]?.body || '')}</Typography>
        )}
      </Box>
    </Box>
  );
}

export default DetailsComponent;
