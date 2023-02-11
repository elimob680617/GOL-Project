import { useNavigate } from 'react-router-dom';

import { Divider, FormControl, FormControlLabel, IconButton, Stack, Typography } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

import { Icon } from 'src/components/Icon';
import { AudienceEnum } from 'src/types/serverTypes';

interface AudienceProps {
  onChange: (value: AudienceEnum) => void;
  audience?: AudienceEnum;
}

export default function SizeSelectAudience(props: AudienceProps) {
  const { onChange, audience } = props;
  const navigate = useNavigate();

  function changeAudienceHandler(value: AudienceEnum) {
    onChange(value);
  }

  return (
    <Stack spacing={2} sx={{ pt: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
        <Typography variant="subtitle1" color="text.primary">
          <IconButton sx={{ p: 0, mr: 2 }} onClick={() => navigate(-1)}>
            <Icon name="left-arrow-1" />
          </IconButton>
          Privacy
        </Typography>
        <IconButton onClick={() => navigate(-1)}>
          <Icon name="Close-1" />
        </IconButton>
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
            <FormControlLabel
              value={AudienceEnum.Public}
              control={<Radio />}
              label={'Public'}
              sx={{ ml: '8px !important', mt: '8px !important' }}
            />
            <FormControlLabel
              value={AudienceEnum.Private}
              control={<Radio />}
              label={'Private'}
              sx={{ ml: '8px !important', mt: '8px !important' }}
            />
            <FormControlLabel
              value={AudienceEnum.OnlyMe}
              control={<Radio />}
              label={'Only me'}
              sx={{ ml: '8px !important', mt: '8px !important' }}
            />
            <FormControlLabel
              value={AudienceEnum.SpecificFollowes}
              control={<Radio />}
              label={'Specific followers'}
              sx={{ ml: '8px !important', mt: '8px !important' }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ ml: 6, mb: 1 }}>
              Select Specific followers as your audience
            </Typography>

            <FormControlLabel
              value={AudienceEnum.ExceptFollowes}
              control={<Radio />}
              label={'All followers except'}
              sx={{ ml: '8px !important', mt: '8px !important' }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ ml: 6, mb: 1 }}>
              Select followers that you dont want as an audience
            </Typography>
          </RadioGroup>
        </FormControl>
      </Stack>
    </Stack>
  );
}
