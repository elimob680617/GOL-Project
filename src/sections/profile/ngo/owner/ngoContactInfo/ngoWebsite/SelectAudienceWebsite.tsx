import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Dialog, Divider, FormControl, FormControlLabel, IconButton, Stack, Typography } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

import { useSnackbar } from 'notistack';
import { useUpsertWebsiteMutation } from 'src/_graphql/profile/contactInfo/mutations/upsertWebsite.generated';
import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { userWebsiteSelector, websiteAdded } from 'src/store/slices/profile/userWebsite-slice';
import { AudienceEnum } from 'src/types/serverTypes';

export default function SelectAudienceWebsite() {
  const router = useNavigate();
  const dispatch = useDispatch();
  const userWebsite = useSelector(userWebsiteSelector);
  const { enqueueSnackbar } = useSnackbar();
  const [upsertUserWebsite] = useUpsertWebsiteMutation();

  const handleUpdateAudience = async (val: string) => {
    const resAudi: any = await upsertUserWebsite({
      filter: {
        dto: {
          webSiteUrl: userWebsite?.webSiteUrl,
          id: userWebsite?.id,
          audience: val as AudienceEnum,
        },
      },
    });

    if (resAudi?.data?.upsertWebSite?.isSuccess) {
      enqueueSnackbar('The audience has been successfully edited', { variant: 'success' });
      router(-1);
    }
  };

  useEffect(() => {
    if (!userWebsite) router(PATH_APP.profile.ngo.contactInfo.root);
  }, [userWebsite, router]);

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
              onChange={(e) => {
                dispatch(
                  websiteAdded({
                    ...userWebsite,
                    audience: (e.target as HTMLInputElement).value as AudienceEnum,
                  }),
                );
                if (userWebsite?.id) handleUpdateAudience((e.target as HTMLInputElement).value);
                router(-1);
              }}
              value={userWebsite?.audience}
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
    </Dialog>
  );
}
