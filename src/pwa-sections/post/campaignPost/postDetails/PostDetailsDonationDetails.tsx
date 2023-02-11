import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

// @mui
import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';

import { Icon } from 'src/components/Icon';

import PostDetailsMessages from './PostDetails.messages';

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
interface donationDetailsTypes {
  dayleft: number;
  numberOfDonations: string;
  numberOfRates: string;
  averageRate: string;
  raisedMoney: string;
  target: string;
}

function PostDetailsDonationDetails(props: donationDetailsTypes) {
  const { dayleft, numberOfDonations, averageRate, numberOfRates, raisedMoney, target } = props;
  const theme = useTheme();
  const raisedMoneyNum = Number(raisedMoney);
  const targetNum = Number(target);
  return (
    <>
      <Stack spacing={2} sx={{ backgroundColor: theme.palette.background.neutral, p: 2 }}>
        {!!raisedMoney ? (
          <>
            <Typography variant="subtitle2" color={theme.palette.primary.main}>
              ${raisedMoney?.toLocaleString()} <FormattedMessage {...PostDetailsMessages.raisedOf} /> $
              {target?.toLocaleString()}
            </Typography>

            {!(raisedMoney === target) ? (
              <BorderLinearProgress
                variant="determinate"
                value={(raisedMoneyNum / targetNum) * 100}
                sx={{
                  [`& .${linearProgressClasses.bar}`]: {
                    borderRadius: 5,
                    backgroundColor: theme.palette.mode === 'light' ? 'primary' : 'secondary',
                  },
                }}
              />
            ) : (
              <BorderLinearProgress
                variant="determinate"
                value={(raisedMoneyNum / targetNum) * 100}
                sx={{
                  [`& .${linearProgressClasses.bar}`]: {
                    borderRadius: 5,
                    backgroundColor: theme.palette.warning.dark,
                  },
                }}
              />
            )}
          </>
        ) : (
          <>
            <Typography variant="subtitle2" color={theme.palette.primary.main}>
              $0 <FormattedMessage {...PostDetailsMessages.raisedOf} /> ${target?.toLocaleString()}
            </Typography>
            <BorderLinearProgress
              variant="determinate"
              value={0}
              sx={{
                [`& .${linearProgressClasses.bar}`]: {
                  borderRadius: 5,
                  backgroundColor: theme.palette.mode === 'light' ? 'primary' : 'secondary',
                },
              }}
            />
          </>
        )}
        <Stack direction={'row'} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          {!!numberOfDonations ? (
            <Typography variant="body2" color={theme.palette.text.primary}>
              {numberOfDonations} <FormattedMessage {...PostDetailsMessages.donatedPeople} />
            </Typography>
          ) : (
            <Typography variant="body2" color={theme.palette.text.primary}>
              <FormattedMessage {...PostDetailsMessages.noDonation} />
            </Typography>
          )}
          <Box sx={{ backgroundColor: theme.palette.background.paper, p: 1, borderRadius: 0.5 }}>
            {dayleft ? (
              <>
                {dayleft > 0 && (
                  <Typography variant="subtitle2" color={theme.palette.primary.dark}>
                    {dayleft} <FormattedMessage {...PostDetailsMessages.daysLeft} />
                  </Typography>
                )}
              </>
            ) : (
              <>
                {dayleft === 0 ? (
                  <Typography variant="subtitle2" color={theme.palette.warning.dark}>
                    <FormattedMessage {...PostDetailsMessages.expired} />
                  </Typography>
                ) : (
                  <Typography variant="subtitle2" color={theme.palette.primary.dark}>
                    <FormattedMessage {...PostDetailsMessages.noDeadline} />
                  </Typography>
                )}
              </>
            )}
          </Box>
        </Stack>
        <Stack direction={'row'} sx={{ alignItems: 'center' }}>
          {!!averageRate ? (
            <Icon name="star" type="solid" color="primary.main" />
          ) : (
            <Icon name="star" type="linear" color="primary.main" />
          )}

          {!!averageRate && (
            <Typography variant="subtitle2" color={theme.palette.warning.dark} sx={{ mr: 0.5, ml: 0.5 }}>
              {averageRate}
            </Typography>
          )}
          {Number(numberOfRates) > 0 ? (
            <Typography variant="caption" color={theme.palette.text.secondary} sx={{ mr: 0.5, ml: 0.5 }}>
              ({numberOfRates} <FormattedMessage {...PostDetailsMessages.rated} /> )
            </Typography>
          ) : (
            <Typography variant="caption" color={theme.palette.text.secondary} sx={{ mr: 0.5, ml: 0.5 }}>
              (<FormattedMessage {...PostDetailsMessages.noRate} /> )
            </Typography>
          )}
        </Stack>
        <Stack sx={{ mt: '24px !important', mb: '8px !important' }}>
          {dayleft === 0 ? (
            <Button variant="contained" size="small" disabled>
              <Typography variant="body2">
                <FormattedMessage {...PostDetailsMessages.donate} />
              </Typography>
            </Button>
          ) : (
            <Link to="#">
              <Button variant="contained" size="small">
                <Typography variant="body2">
                  <FormattedMessage {...PostDetailsMessages.donate} />
                </Typography>
              </Button>
            </Link>
          )}
        </Stack>
      </Stack>
    </>
  );
}

export default PostDetailsDonationDetails;
