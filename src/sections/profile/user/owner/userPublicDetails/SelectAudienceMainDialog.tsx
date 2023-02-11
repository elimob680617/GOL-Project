import { useNavigate, useSearchParams } from 'react-router-dom';

import { Dialog, Divider, FormControl, FormControlLabel, IconButton, Stack, Typography, useTheme } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

import { useSnackbar } from 'notistack';
import { useUpdateJoinAudienceMutation } from 'src/_graphql/profile/publicDetails/mutations/updateJoinAudience.generated';
import { Icon } from 'src/components/Icon';
import { AudienceEnum } from 'src/types/serverTypes';

export default function SelectAudienceMainDialog() {
  const router = useNavigate();
  const [searchParams] = useSearchParams();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [updateJoinAudience] = useUpdateJoinAudienceMutation();
  const handelJoinAudience = async (value: string) => {
    const resAudi: any = await updateJoinAudience({
      filter: {
        dto: {
          joinAudience: value as AudienceEnum,
        },
      },
    });
    if (resAudi?.data?.updateJoinAudience?.isSuccess) {
      enqueueSnackbar('Audience Updated', { variant: 'success' });
      router(-1);
    }
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => router(-1)}>
      <Stack spacing={2} sx={{ pt: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            <IconButton sx={{ p: 0, mr: 2 }} onClick={() => router(-1)}>
              <Icon name="left-arrow-1" />
            </IconButton>
            Privacy
          </Typography>
          <IconButton onClick={() => router(-1)}>
            <Icon name="Close-1" />
          </IconButton>
        </Stack>
        <Divider />
        <Stack>
          <FormControl sx={{ mb: 2 }}>
            <RadioGroup
              onChange={(e) => handelJoinAudience((e.target as HTMLInputElement).value)}
              value={searchParams.get('audience')}
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
              <Typography variant="caption" color={theme.palette.text.secondary} sx={{ ml: 6, mb: 1 }}>
                Select Specific followers as your audience
              </Typography>

              <FormControlLabel
                value={AudienceEnum.ExceptFollowes}
                control={<Radio />}
                label={'All followers except'}
                sx={{ ml: '8px !important', mt: '8px !important' }}
              />
              <Typography variant="caption" color={theme.palette.text.secondary} sx={{ ml: 6, mb: 1 }}>
                Select followers that you dont want as an audience
              </Typography>
            </RadioGroup>
          </FormControl>
        </Stack>
      </Stack>
    </Dialog>
  );
}
