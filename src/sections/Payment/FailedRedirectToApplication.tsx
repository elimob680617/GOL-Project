import { Button, Card, Stack, Typography, styled } from '@mui/material';

import FormStyleComponent from './FormStyleComponent';

const FailedRedirectToApplication = () => {
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

  return (
    <FormStyleComponent title="payment">
      <ContentStyle>
        <Stack spacing={2} width={296} justifyContent="center">
          <Typography variant="subtitle2" textAlign="center" color="error.main">
            Unfortunately, Your Donation Was UNSUCCESSFUL, Please try again.
          </Typography>
          <Typography variant="subtitle2" textAlign="center" color="grey.700">
            Our goal is to help people, provide good senses, and spread love to the world. Your donation will help to
            solve the proposed issue in the {/*<campaignTitle>*/} campaign.
          </Typography>
        </Stack>
        <Button variant="primary">Return to Garden of Love</Button>
      </ContentStyle>
    </FormStyleComponent>
  );
};

export default FailedRedirectToApplication;
