import { FormattedMessage } from 'react-intl';

import { Divider, Stack, Typography } from '@mui/material';

import ProfileMainMessage from 'src/pwa-sections/profile/components/profileMain.messages';
import { GenderEnum } from 'src/types/serverTypes';

interface GenderProps {
  onChange: (value: GenderEnum) => void;
}

function MainProfileGender(props: GenderProps) {
  const { onChange } = props;

  const handleSelectGender = (gender: keyof typeof GenderEnum) => {
    onChange(GenderEnum[gender]);
  };

  return (
    <>
      <Stack spacing={2} sx={{ py: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2 }}>
          <Stack direction="row" spacing={2}>
            <Typography variant="subtitle2" color="text.primary">
              <FormattedMessage {...ProfileMainMessage.gender} />
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          {Object.keys(GenderEnum).map((gender) => (
            <Stack
              spacing={1.5}
              direction="row"
              key={gender}
              sx={{ cursor: 'pointer' }}
              onClick={() => handleSelectGender(gender as keyof typeof GenderEnum)}
            >
              <Typography variant="body2">{gender}</Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </>
  );
}

export default MainProfileGender;
