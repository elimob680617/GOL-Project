import { Box, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const ImgStyle = styled('img')(({ theme }) => ({
  display: 'block',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  objectFit: 'cover',
}));
const SentPostTitle = styled(Box)(({ theme }) => ({
  display: '-webkit-box',
  '-webkit-line-clamp': '1',
  '-webkit-box-orient': 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));
interface IPostCardInterface {
  sentPost: any;
}
function CampaignPostCard(props: IPostCardInterface) {
  const { sentPost } = props;
  return (
    <>
      <Stack spacing={1} sx={{ bgcolor: 'background.neutral', borderRadius: 1 }}>
        <Stack direction={'row'} spacing={1} alignItems="center">
          <ImgStyle src={sentPost?.coverImageUrl} width={'64px'} height={'64px'} sx={{ borderRadius: 1 }} />
          <Stack sx={{ p: 1 }} spacing={1}>
            <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
              {sentPost?.firstName && sentPost?.lastName
                ? `${sentPost?.firstName} ${sentPost?.lastName}`
                : `${sentPost?.fullName}`}
            </Typography>

            <SentPostTitle>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {sentPost?.title}
              </Typography>
            </SentPostTitle>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}

export default CampaignPostCard;
