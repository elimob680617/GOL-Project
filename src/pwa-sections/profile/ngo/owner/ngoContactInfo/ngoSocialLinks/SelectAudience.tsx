import { Divider, FormControl, FormControlLabel, Stack, Typography, useTheme } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

import { AudienceEnum } from 'src/types/serverTypes';

interface AudienceProps {
  onChange: (value: AudienceEnum) => void;
  audience?: AudienceEnum;
}

export default function SelectAudience(props: AudienceProps) {
  const { onChange, audience } = props;

  const theme = useTheme();
  function changeAudienceHandler(value: AudienceEnum) {
    onChange(value);
  }
  return (
    <Stack spacing={2} sx={{ pt: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
        <Typography variant="subtitle1" color="text.primary">
          Privacy
        </Typography>
      </Stack>
      <Divider />
      <Stack>
        <FormControl sx={{ mb: 2 }}>
          <RadioGroup
            onChange={(e) => {
              changeAudienceHandler((e.target as HTMLInputElement).value as AudienceEnum);
            }}
            value={audience}
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
          >
            <FormControlLabel value={AudienceEnum.Public} control={<Radio />} label={'Public'} sx={{ ml: 1, mt: 1 }} />
            <FormControlLabel
              value={AudienceEnum.Private}
              control={<Radio />}
              label={'Private'}
              sx={{ ml: 1, mt: 1 }}
            />
            <FormControlLabel value={AudienceEnum.OnlyMe} control={<Radio />} label={'Only me'} sx={{ ml: 1, mt: 1 }} />
            <FormControlLabel
              value={AudienceEnum.SpecificFollowes}
              control={<Radio />}
              label={'Specific followers'}
              sx={{ ml: 1, mt: 1 }}
            />
            <Typography variant="caption" color={theme.palette.text.secondary} sx={{ ml: 6, mb: 1 }}>
              Select Specific followers as your audience
            </Typography>

            <FormControlLabel
              value={AudienceEnum.ExceptFollowes}
              control={<Radio />}
              label={'All followers except'}
              sx={{ ml: 1, mt: 1 }}
            />
            <Typography variant="caption" color={theme.palette.text.secondary} sx={{ ml: 6, mb: 1 }}>
              Select followers that you dont want as an audience
            </Typography>
          </RadioGroup>
        </FormControl>
      </Stack>
    </Stack>
  );
}
