import { FormattedMessage } from 'react-intl';

import { Circle } from '@mui/icons-material';
// @mui
import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  styled,
  useTheme,
} from '@mui/material';

import EmptyDialoge from 'src/assets/icons/EmptyDialog.svg';
import { Icon } from 'src/components/Icon';
import { DonorType } from 'src/types/serverTypes';

import PostDetailsMessages from './PostDetails.messages';

const ExplainStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));
const HeaderWrapperStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2, 1.5, 2, 2),
  boxShadow: '0px 0px 1px rgba(40, 41, 61, 0.04), 0px 2px 4px rgba(96, 97, 112, 0.16)',
}));
const PostTitleDot = styled('span')(({ theme }) => ({
  color: theme.palette.grey[300],
  fontSize: '5px',
  margin: '0 0.5rem',
  display: 'flex',
  alignItems: 'center',
}));

interface DonorListProps {
  donors?: DonorType[];
  open: boolean;
  onClose: () => void;
}
function DonorsListDialog(props: DonorListProps) {
  const { donors, open, onClose } = props;
  const theme = useTheme();

  return (
    <>
      <Dialog fullWidth open={open} aria-labelledby="responsive-dialog-title">
        <DialogTitle sx={{ padding: 0 }} id="responsive-dialog-title">
          <HeaderWrapperStyle direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle1" color={theme.palette.text.primary}>
              <FormattedMessage {...PostDetailsMessages.donorsList} />
            </Typography>
            <IconButton onClick={onClose} sx={{ padding: 0 }}>
              <Icon name="Close" type="linear" color="grey.500" />
            </IconButton>
          </HeaderWrapperStyle>
        </DialogTitle>
        <DialogContent sx={{ padding: 2 }}>
          {!!donors?.length ? (
            <Stack spacing={3} sx={{ marginTop: 3 }}>
              {donors?.map((item, index) => (
                <Stack
                  key={(item?.fullName || '') + index}
                  sx={{ cursor: 'pointer', alignItems: 'center' }}
                  spacing={2}
                  direction="row"
                >
                  <Avatar
                    src={item?.avatarUrl || undefined}
                    sx={{ width: 48, height: 48 }}
                    alt={item?.fullName || ''}
                  />
                  <Stack spacing={0.5}>
                    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                      <Typography variant="subtitle1" color={theme.palette.text.primary}>
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
                        {/* {item?.donateDate} */}
                      </Typography>
                    </Stack>

                    <ExplainStyle variant="body2">
                      {item?.isMyConnection
                        ? 'Your connection'
                        : item?.mutualConnections
                        ? `${item?.mutualConnections} mutual connections`
                        : item?.isAnonymous
                        ? ''
                        : ''}
                    </ExplainStyle>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          ) : (
            <Stack sx={{ justifyContent: 'center', alignItems: 'center', m: 8 }} spacing={2}>
              <Box>
                <img src={EmptyDialoge} width={227} height={227} alt="empty-dialog" loading="lazy" />
              </Box>

              <Typography variant="h6" color={theme.palette.text.primary}>
                <FormattedMessage {...PostDetailsMessages.noDonorHere} />
              </Typography>
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DonorsListDialog;
