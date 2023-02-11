import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Dialog, Divider, FormControl, FormControlLabel, IconButton, Stack, Typography, useTheme } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

import { useSnackbar } from 'notistack';
import { useUpsertUserEmailMutation } from 'src/_graphql/profile/contactInfo/mutations/upsertUserEmail.generated';
import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { addedEmail, userEmailsSelector } from 'src/store/slices/profile/contactInfo-slice-eli';
import { AudienceEnum } from 'src/types/serverTypes';

export default function SelectAudienceDialog() {
  const router = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const personEmail = useSelector(userEmailsSelector);
  const [upsertUserEmail] = useUpsertUserEmailMutation();

  const handleUpdateAudience = async (val: string) => {
    const resAudi: any = await upsertUserEmail({
      filter: {
        dto: {
          email: personEmail?.email,
          id: personEmail?.id,
          audience: val as AudienceEnum,
        },
      },
    });

    if (resAudi?.data?.upsertUserEmail?.isSuccess) {
      enqueueSnackbar('The Audience has been successfully updated', { variant: 'success' });
      router(-1);
    }
  };

  useEffect(() => {
    if (!personEmail) router(PATH_APP.profile.user.contactInfo.root);
  }, [personEmail, router]);

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => router(-1)}>
      <Stack spacing={2} sx={{ pt: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            <IconButton sx={{ p: 0, mr: 2 }} onClick={() => router(-1)}>
              <Icon name="left-arrow" />
            </IconButton>
            Privacy
          </Typography>
          <IconButton onClick={() => router(-1)}>
            <Icon name="Close" />
          </IconButton>
        </Stack>
        <Divider />
        <Stack>
          <FormControl sx={{ mb: 2 }}>
            <RadioGroup
              onChange={(e) => {
                dispatch(
                  addedEmail({
                    ...personEmail,
                    audience: (e.target as HTMLInputElement).value as AudienceEnum,
                  }),
                );
                if (personEmail?.id) handleUpdateAudience((e.target as HTMLInputElement).value);
                router(-1);
              }}
              value={personEmail?.audience}
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
