import { Button, Card, Stack, Typography, styled } from '@mui/material';

import FormStyleComponent from './FormStyleComponent';

const ContentStyle = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(5, 2),
  borderRadius: theme.spacing(2),
  bgcolor: theme.palette.background.paper,
  maxWidth: 328,
  margin: 'auto',
  gap: theme.spacing(2),
  justifyContent: 'center',
  alignItems: 'center',
}));
const SuccessRedirectToApplication = () => {
  return (
    <FormStyleComponent title="payment">
      <ContentStyle>
        <Stack spacing={2} width={296} justifyContent="center">
          <Typography variant="subtitle2" textAlign="center" color="grey.700">
            Your Donation Has Been Done SUCCESSFULLY.
          </Typography>
          <Typography variant="subtitle2" textAlign="center" color="grey.700">
            We really appreciate your amazing gesture in donating to the campaignTitle campaign.
          </Typography>
        </Stack>
        <Button variant="primary" sx={{ minWidth: 200 }}>
          Return to Garden of Love
        </Button>
      </ContentStyle>
    </FormStyleComponent>
  );
};

export default SuccessRedirectToApplication;
