import { Box, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

// import Layout from 'src/layouts';
import CampaignPostDetails from 'src/sections/post/campaignPost/postDetails/CampaignPostDetails';

// ----------------------------------------------------------------------

// PostDetails.getLayout = function getLayout(page: React.ReactElement) {
//   return <Layout variant="simple">{page}</Layout>;
// };

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  padding: theme.spacing(3, 0),
}));
function PostDetails() {
  return (
    <>
      <Box sx={{ width: '100%', bgcolor: 'background.neutral' }}>
        <Container sx={{ p: { md: 0 } }}>
          <RootStyle>
            <CampaignPostDetails />
          </RootStyle>
        </Container>
      </Box>
    </>
  );
}

export default PostDetails;
