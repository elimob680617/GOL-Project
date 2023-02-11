import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Box, Divider, IconButton, Stack, Typography } from '@mui/material';

import DatePicker from 'src/components/DatePicker';
import { Icon } from 'src/components/Icon';

import NgoPublicDetailsMessages from '../NgoPublicDetailsPwa.messages';

interface SelectDateType {
  establishmentDate?: Date;
  onChange: (value: Date) => void;
}

const EstablishedDate = (props: SelectDateType) => {
  const navigate = useNavigate();
  const { onChange, establishmentDate } = props;

  const handleChange = (value: Date) => {
    onChange(value);
  };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
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
          value={establishmentDate ? new Date(establishmentDate) : undefined}
          views={['month', 'year']}
          onChange={handleChange}
        />
      </Box>
    </Stack>
  );
};
export default EstablishedDate;
