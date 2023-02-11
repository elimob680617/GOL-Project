import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';

import DonationStatusComponent from 'src/sections/Payment/DonationStatusComponent';

import { Icon } from '../Icon';
import PostComponentsMessage from './PostComponentsMessage';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 0 : 800],
  },
}));
interface donationDetailsTypes {
  dayleft: number;
  numberOfDonations: string;
  numberOfRates: string;
  averageRate: string;
  raisedMoney: string;
  target: string;
  isShared?: boolean;
}
function PostDonationDetails(props: donationDetailsTypes) {
  const { dayleft, numberOfDonations, averageRate, numberOfRates, raisedMoney, target, isShared = false } = props;
  const theme = useTheme();
  const raisedMoneyNum = Number(raisedMoney);
  const targetNum = Number(target);
  const { formatMessage } = useIntl();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Stack spacing={2} sx={{ backgroundColor: theme.palette.grey[100], borderRadius: 1, p: 2, m: 2 }}>
        {!!raisedMoney ? (
          <>
            <Typography variant="subtitle2" color={theme.palette.primary.main}>
              {`$${raisedMoney ? raisedMoney.toLocaleString() : '0'} ${formatMessage(
                PostComponentsMessage.raisedOf,
              )} $${target?.toLocaleString()}`}
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
              {`$0 ${formatMessage(PostComponentsMessage.raisedOf)} ${target?.toLocaleString()}`}
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
              {numberOfDonations} <FormattedMessage {...PostComponentsMessage.peopleDonated} />
            </Typography>
          ) : (
            <Typography variant="body2" color={theme.palette.text.primary}>
              <FormattedMessage {...PostComponentsMessage.NoDonation} />
            </Typography>
          )}

          <Box sx={{ backgroundColor: theme.palette.surface.main, p: 1, borderRadius: 0.5 }}>
            {dayleft ? (
              <>
                {dayleft > 0 && (
                  <Typography variant="subtitle2" color={theme.palette.primary.dark}>
                    {dayleft} <FormattedMessage {...PostComponentsMessage.daysLeft} />
                  </Typography>
                )}
              </>
            ) : (
              <>
                {dayleft === 0 ? (
                  <Typography variant="subtitle2" color={theme.palette.warning.dark}>
                    <FormattedMessage {...PostComponentsMessage.Expired} />
                  </Typography>
                ) : (
                  <Typography variant="subtitle2" color={theme.palette.primary.dark}>
                    <FormattedMessage {...PostComponentsMessage.NoDeadline} />
                  </Typography>
                )}
              </>
            )}
          </Box>
        </Stack>

        <Stack direction={'row'} sx={{ alignItems: 'center' }}>
          {!!averageRate ? (
            <Icon name="star" type="solid" color="secondary.main" />
          ) : (
            <Icon name="star" type="solid" color="secondary.main" />
          )}

          {!!averageRate && (
            <Typography variant="subtitle2" color={theme.palette.warning.dark} sx={{ mr: 0.5, ml: 0.5 }}>
              {averageRate}
            </Typography>
          )}
          {!!numberOfRates ? (
            <Typography variant="caption" color={theme.palette.text.secondary} sx={{ mr: 0.5, ml: 0.5 }}>
              ({numberOfRates} <FormattedMessage {...PostComponentsMessage.Rated} />)
            </Typography>
          ) : (
            <Typography variant="caption" color={theme.palette.text.secondary} sx={{ mr: 0.5, ml: 0.5 }}>
              <FormattedMessage {...PostComponentsMessage.NoRate} />
            </Typography>
          )}
        </Stack>

        {!isShared && (
          <Stack sx={{ mt: '24px !important', mb: '8px !important' }}>
            <Button variant="contained" size="small" onClick={() => setOpen!(true)}>
              <Typography variant="body2">
                <FormattedMessage {...PostComponentsMessage.Donate} />
              </Typography>
            </Button>
          </Stack>
        )}
      </Stack>
      {open && <DonationStatusComponent open={open} setOpen={setOpen} />}
    </>
  );
}

export default PostDonationDetails;
