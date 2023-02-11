import { FormattedMessage } from 'react-intl';

import { Box, Divider, Stack, Typography } from '@mui/material';

import DatePicker from 'src/components/DatePicker';

import NormalPublicDetailsMessages from '../../NormalPublicDetailsPwa.messages';

interface SchoolYearProps {
  onChange: (value: number) => void;
  value?: number;
}

export default function SchoolYear(props: SchoolYearProps) {
  const { onChange, value } = props;
  const handleChange = (val: Date) => {
    onChange(val.getFullYear());
  };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2, justifyContent: 'space-between' }} alignItems="center">
        <Stack direction="row" spacing={2}>
          <Typography variant="subtitle1" color="text.primary">
            <FormattedMessage {...NormalPublicDetailsMessages.classYear} />
          </Typography>
        </Stack>
      </Stack>
      <Divider />
      <Box>
        <DatePicker
          value={!!value ? new Date(value, 1) : new Date(2022, 1)}
          views={['year']}
          minDate={new Date(1970, 1)}
          onChange={(date) => handleChange(date)}
        />
      </Box>
    </Stack>
  );
}
