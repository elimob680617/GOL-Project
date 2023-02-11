// @mui
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { Avatar, AvatarGroup, Box, Button, Stack, Typography, useTheme } from '@mui/material';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';

import { Icon } from 'src/components/Icon';
import { DonorType } from 'src/types/serverTypes';

import DonorsListDialog from './DonorsListDialog';
import PostDetailsMessages from './PostDetails.messages';

const DonorCardStyled = styled(Box)(({ theme }) => ({
  padding: 8,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: 8,
  border: `1px solid ${theme.palette.grey[100]}`,
  cursor: 'pointer',
}));
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
}));
interface donationDetailsTypes {
  dayleft?: number;
  numberOfDonations?: string;
  numberOfRates?: string;
  averageRate?: string;
  raisedMoney?: string;
  target?: string;
  donors?: DonorType[];
}
function PostDetailsDonationDetails(props: donationDetailsTypes) {
  const { dayleft, numberOfDonations, averageRate, numberOfRates, raisedMoney, target, donors } = props;
  const theme = useTheme();
  const raisedMoneyNum = Number(raisedMoney);
  const targetNum = Number(target);
  const [openDonorsDialog, setOpenDonorsDialog] = useState(false);

  return (
    <>
      <Stack
        spacing={2}
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: 1,
          p: 2,
          position: 'fixed',
          width: '352px',
        }}
      >
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
          {Number(numberOfDonations) > 0 ? (
            <Typography variant="body2" color={theme.palette.text.primary}>
              {numberOfDonations}
              <FormattedMessage {...PostDetailsMessages.donatedPeople} />
            </Typography>
          ) : (
            <Typography variant="body2" color={theme.palette.text.primary}>
              <FormattedMessage {...PostDetailsMessages.noDonation} />
            </Typography>
          )}

          {dayleft ? (
            <>
              {dayleft > 0 && (
                <Box sx={{ backgroundColor: theme.palette.background.neutral, p: 1, borderRadius: 0.5 }}>
                  <Typography variant="subtitle2" color={theme.palette.primary.dark}>
                    {dayleft} <FormattedMessage {...PostDetailsMessages.daysLeft} />
                  </Typography>
                </Box>
              )}
            </>
          ) : (
            <>
              {dayleft === 0 ? (
                <Box sx={{ backgroundColor: theme.palette.background.neutral, p: 1, borderRadius: 0.5 }}>
                  <Typography variant="subtitle2" color={theme.palette.warning.dark}>
                    <FormattedMessage {...PostDetailsMessages.expired} />
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ backgroundColor: theme.palette.background.neutral, p: 1, borderRadius: 0.5 }}>
                  <Typography variant="subtitle2" color={theme.palette.primary.dark}>
                    <FormattedMessage {...PostDetailsMessages.noDeadline} />
                  </Typography>
                </Box>
              )}
            </>
          )}
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
          {!!numberOfRates ? (
            <Typography variant="caption" color={theme.palette.text.secondary} sx={{ mr: 0.5, ml: 0.5 }}>
              ({numberOfRates} <FormattedMessage {...PostDetailsMessages.rated} />)
            </Typography>
          ) : (
            <Typography variant="caption" color={theme.palette.text.secondary} sx={{ mr: 0.5, ml: 0.5 }}>
              (<FormattedMessage {...PostDetailsMessages.noRate} />)
            </Typography>
          )}
        </Stack>
        <Stack sx={{ mt: '24px !important', mb: '8px !important' }}>
          <Link to="#">
            <Button variant="contained" size="small" disabled={dayleft === 0}>
              <Typography variant="body2">
                <FormattedMessage {...PostDetailsMessages.donate} />
              </Typography>
            </Button>
          </Link>
        </Stack>
        <Stack>
          <DonorCardStyled onClick={() => setOpenDonorsDialog(true)}>
            <Stack direction={'row'}>
              <Box sx={{ p: 2, borderRadius: '50%' }} bgcolor="background.neutral">
                <Icon name="Poverty-Alleviation" type="linear" color="primary.main" />
              </Box>

              <Box sx={{ ml: 1 }}>
                <Typography variant="body1" color={theme.palette.text.primary}>
                  <FormattedMessage {...PostDetailsMessages.donors} />
                </Typography>
                <Stack direction={'row'} sx={{ mt: 0.5 }}>
                  {donors ? (
                    <>
                      <Stack spacing={0.5} direction="row" alignItems="center">
                        <AvatarGroup spacing="medium" max={4} total={0}>
                          {donors?.map((item: DonorType, index: number) => (
                            <Avatar
                              sx={{ width: 16, height: 16 }}
                              key={`${index}-${item?.fullName}`}
                              alt={item?.fullName || 'avatar'}
                              src={item?.avatarUrl || undefined}
                            />
                          ))}
                        </AvatarGroup>
                      </Stack>
                      <Typography variant="caption" color={theme.palette.text.secondary} sx={{ ml: 0.5 }}>
                        <FormattedMessage {...PostDetailsMessages.seeAllDonors} />
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="caption" color={theme.palette.text.secondary}>
                      <FormattedMessage {...PostDetailsMessages.noDonors} />
                    </Typography>
                  )}
                </Stack>
              </Box>
            </Stack>
            <Icon name="right-arrow" type="linear" color="grey.500" />
          </DonorCardStyled>
        </Stack>
      </Stack>
      <DonorsListDialog donors={donors} open={openDonorsDialog} onClose={() => setOpenDonorsDialog(false)} />
    </>
  );
}

export default PostDetailsDonationDetails;
