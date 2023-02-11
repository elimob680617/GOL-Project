// @mui
import { FormattedMessage, useIntl } from 'react-intl';

import { Circle } from '@mui/icons-material';
import { Avatar, Box, Stack, Typography, styled, useTheme } from '@mui/material';

import EmptyDialoge from 'src/assets/icons/EmptyDialog.svg';
import { DonorType } from 'src/types/serverTypes';

import PostDetailsMessages from './PostDetails.messages';

const ExplainStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

const PostTitleDot = styled('span')(({ theme }) => ({
  color: theme.palette.grey[300],
  fontSize: '5px',
  margin: '0 0.5rem',
  display: 'flex',
  alignItems: 'center',
}));

interface DonorListProps {
  donors: DonorType[];
}
function DonorsList(props: DonorListProps) {
  const { donors } = props;
  const theme = useTheme();
  const { formatMessage } = useIntl();

  return (
    <>
      <Stack>
        {donors?.length ? (
          <Stack spacing={3} sx={{ marginTop: 3 }}>
            {donors?.map((item, index) => (
              <Stack key={index} sx={{ cursor: 'pointer' }} spacing={2} direction="row">
                <Avatar sx={{ width: 48, height: 48 }} src={item?.avatarUrl || undefined} alt={item?.fullName || ''} />
                <Stack spacing={0.5} justifyContent="center">
                  <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                    <Typography variant="body2" color={theme.palette.text.primary}>
                      {item?.fullName
                        ? item?.fullName
                        : item?.firstName || item?.lastName
                        ? `${item?.firstName} ${item?.lastName}`
                        : ' '}
                    </Typography>
                    <PostTitleDot>
                      <Circle fontSize="inherit" />
                    </PostTitleDot>
                    <Typography variant="caption" color={theme.palette.text.secondary}>
                      {/* {item.donateDate} */}
                    </Typography>
                  </Stack>

                  <ExplainStyle variant="body2">
                    {item?.isMyConnection
                      ? `${formatMessage(PostDetailsMessages.yourConnection)}`
                      : item?.mutualConnections
                      ? `${item?.mutualConnections} ${formatMessage(PostDetailsMessages.mutualConnections)}`
                      : item?.isAnonymous
                      ? ''
                      : ''}
                  </ExplainStyle>
                </Stack>
              </Stack>
            ))}
          </Stack>
        ) : (
          <Stack sx={{ justifyContent: 'center', alignItems: 'center', m: 6 }} spacing={2}>
            <Box>
              <img src={EmptyDialoge} width={227} height={227} loading="lazy" alt="empty-state" />
            </Box>

            <Typography variant="h6" color={theme.palette.text.primary}>
              <FormattedMessage {...PostDetailsMessages.noDonorHere} />
            </Typography>
          </Stack>
        )}
      </Stack>
    </>
  );
}

export default DonorsList;
