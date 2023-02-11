import { Dialog, Divider, FormControl, FormControlLabel, IconButton, Stack, Typography } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

// import { useRouter } from 'next/router';
// import { useSnackbar } from 'notistack';
// import { useUpdateOrganizationUserFieldMutation } from 'src/_graphql/profile/ngoPublicDetails/mutations/updateOrgUser.generated';
import { Icon } from 'src/components/Icon';

// import { AudienceEnum, OrgUserFieldEnum } from 'src/types/serverTypes';

export default function SelectAudienceMainDialog() {
  // const router = useRouter();
  // const { enqueueSnackbar } = useSnackbar();
  // const [upsertPublicAudienceNgoUser] = useUpdateOrganizationUserFieldMutation();

  const handelJoinAudience = async (value: string) => {
    // console.log('value', value);
    // const resAudi: any = await upsertPublicAudienceNgoUser({
    //   filter: {
    //     dto: {
    //       field: OrgUserFieldEnum.JoinDateAudience,
    //       joinAudience: value,
    //     },
    //   },
    // });
    // if (resAudi?.data?.updateOrganizationUserField?.isSuccess) {
    //   enqueueSnackbar('Join Audience Updated', { variant: 'success' });
    //   router.back();
    // }
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted>
      <Stack spacing={2} sx={{ pt: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            <IconButton sx={{ p: 0, mr: 2 }}>
              <Icon name="left-arrow" />
            </IconButton>
            Privacy
          </Typography>
          <IconButton>
            <Icon name="Close-1" />
          </IconButton>
        </Stack>
        <Divider />
        <Stack>
          <FormControl sx={{ mb: 2 }}>
            <RadioGroup
              onChange={(e) => handelJoinAudience((e.target as HTMLInputElement).value)}
              // value={router.query.audience}
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
            >
              <FormControlLabel
                // value={AudienceEnum.Public}
                control={<Radio />}
                label={'Public'}
                sx={{ ml: '8px !important', mt: '8px !important' }}
              />
              <FormControlLabel
                // value={AudienceEnum.Private}
                control={<Radio />}
                label={'Private'}
                sx={{ ml: '8px !important', mt: '8px !important' }}
              />
              <FormControlLabel
                // value={AudienceEnum.OnlyMe}
                control={<Radio />}
                label={'Only me'}
                sx={{ ml: '8px !important', mt: '8px !important' }}
              />
              <FormControlLabel
                // value={AudienceEnum.SpecificFollowes}
                control={<Radio />}
                label={'Specific followers'}
                sx={{ ml: '8px !important', mt: '8px !important' }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ ml: 6, mb: 1 }}>
                Select Specific followers as your audience
              </Typography>

              <FormControlLabel
                // value={AudienceEnum.ExceptFollowes}
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
