// import { useEffect } from 'react';
import { Dialog, Divider, FormControl, FormControlLabel, Stack, Typography, useTheme } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

// import { ArrowLeft, CloseSquare } from 'iconsax-react';
// import { useRouter } from 'next/router';
// import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { userCollegeUpdated, userCollegesSelector } from 'src/store/slices/profile/userColloges-slice';
import { AudienceEnum } from 'src/types/serverTypes';

export default function SelectAudienceCollegeDialog() {
  const theme = useTheme();
  // const router = useRouter();
  //For Redux Tools
  const dispatch = useDispatch();
  const userCollege = useSelector(userCollegesSelector);

  const handleUpdateAudience = async (val: string) => {
    dispatch(
      userCollegeUpdated({
        audience: val as AudienceEnum,
        isChange: true,
      }),
    );
    // router.back();
  };

  // useEffect(() => {
  //   if (!userCollege) router.push(PATH_APP.profile.user.publicDetails.root);
  // }, [userCollege, router]);

  return (
    <Dialog fullWidth={true} open={true} keepMounted>
      <Stack spacing={2} sx={{ pt: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            {/* <IconButton sx={{ p: 0, mr: 2 }} onClick={() => router.back()}>
              <ArrowLeft />
            </IconButton> */}
            Privacy
          </Typography>
          {/* <IconButton onClick={() => router.back()}>
            <CloseSquare variant="Outline" />
          </IconButton> */}
        </Stack>
        <Divider />
        <Stack>
          <FormControl sx={{ mb: 2 }}>
            <RadioGroup
              onChange={(e) => {
                handleUpdateAudience((e.target as HTMLInputElement).value);
              }}
              value={userCollege?.audience}
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
