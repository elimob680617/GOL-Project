import { FormattedMessage } from 'react-intl';

import { Box, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { Icon } from '../Icon';
import campaignLandingComponentsMessages from './campaignLandingComponentsMessages';

interface ICard {
  data: any;
}
const CardBadge = styled(Box)(({ theme }) => ({
  width: 8,
  height: 85,
  borderTopLeftRadius: '8px',
  borderBottomLeftRadius: '8px',
}));
const DonateCard = styled(Box)(({ theme }) => ({
  width: '98%',
  height: 85,
  backgroundColor: theme.palette.surface.main,
  borderTopRightRadius: '8px',
  borderBottomRightRadius: '8px',
  padding: 8,
}));

function DonationCards(props: ICard) {
  const { data } = props;
  return (
    <Box display={'flex'} sx={{ m: 2 }}>
      <CardBadge
        sx={{
          backgroundColor: (theme) =>
            data.status === 'INTERRUPTED'
              ? theme.palette.secondary.main
              : data.status === 'ACTIVE'
              ? theme.palette.primary.main
              : data.status === 'FINISHED'
              ? theme.palette.info.main
              : theme.palette.success.main,
        }}
      />
      <DonateCard>
        <Grid container xs={12}>
          <Grid xs={2}>
            <img src={data.avatarImageUrl} width={48} height={48} alt="" loading="lazy" />
          </Grid>
          <Grid xs={7}>
            <Typography>{`${data.campaignName.substring(0, 21)} ${
              data.campaignName.lenth <= 20 ? '...' : ''
            }`}</Typography>
            <Typography
              variant="caption"
              sx={{
                color: (theme) =>
                  data.status === 'Interrupted'
                    ? theme.palette.secondary.main
                    : data.status === 'ACTIVE'
                    ? theme.palette.primary.main
                    : data.status === 'FINISHED'
                    ? theme.palette.info.main
                    : theme.palette.success.main,
              }}
            >
              {data.campaignStatus}
            </Typography>
          </Grid>
          <Grid xs={3}>
            <Box sx={{ width: '100%' }}>
              <Typography variant="overline" sx={{ width: '100%' }}>
                {`$${data.raisedFund}`}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ width: '100%' }}>
              <Icon type="solid" name="star" color="error.main" />
              <FormattedMessage {...campaignLandingComponentsMessages.Rated} />: {data.rate}
            </Typography>
          </Grid>
          <Grid item xs={2} />
          <Grid xs={10}>
            <Typography variant="caption" color="text.secondary">
              {data.raisedFundDateTime.substring(0, 10)},{data.raisedFundDateTime.substring(11, 16)}
            </Typography>
          </Grid>
        </Grid>
      </DonateCard>
    </Box>
  );
}

export default DonationCards;
