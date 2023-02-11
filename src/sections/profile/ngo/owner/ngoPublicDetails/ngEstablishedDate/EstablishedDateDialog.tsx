import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import DatePicker from 'src/components/DatePicker';
import { Icon } from 'src/components/Icon';
import { useDispatch, useSelector } from 'src/store';
import {
  ngoEstablishmentDateSelector,
  ngoEstablishmentDateUpdated,
} from 'src/store/slices/profile/ngoPublicDetails-slice';

import NgoPublicDetailsMessages from '../NgoPublicDetails.messages';

const EstablishedDateDialog = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ngoEstablishedDate = useSelector(ngoEstablishmentDateSelector);

  const handleChange = (value: Date) => {
    dispatch(
      ngoEstablishmentDateUpdated({
        establishmentDate: value,
        isChange: true,
      }),
    );
    navigate(-1);
  };

  return (
    <Dialog maxWidth="sm" open keepMounted onClose={() => navigate(-1)}>
      <Stack spacing={2} sx={{ py: 3, minHeight: 320 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2, justifyContent: 'space-between' }} alignItems="center">
          <Stack direction="row" spacing={2}>
            <IconButton sx={{ p: 0 }} onClick={() => navigate(-1)}>
              <Icon name="left-arrow-1" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              <FormattedMessage {...NgoPublicDetailsMessages.ngoEstablishmentDateTitle} />
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        <Box px={3}>
          <DatePicker
            value={ngoEstablishedDate?.establishmentDate ? new Date(ngoEstablishedDate?.establishmentDate) : undefined}
            views={['month', 'year']}
            onChange={handleChange}
          />
        </Box>
      </Stack>
    </Dialog>
  );
};
export default EstablishedDateDialog;
