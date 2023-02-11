import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Dialog, Divider, FormControl, FormControlLabel, IconButton, Stack, Typography } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { userSchoolUpdated, userSchoolsSelector } from 'src/store/slices/profile/userSchool-slice';
import { AudienceEnum } from 'src/types/serverTypes';

export default function SelectAudienceSchoolDialog() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userHighSchool = useSelector(userSchoolsSelector);

  const handleUpdateAudience = async (val: string) => {
    dispatch(
      userSchoolUpdated({
        audience: val as AudienceEnum,
        isChange: true,
      }),
    );
    navigate(-1);
  };

  useEffect(() => {
    if (!userHighSchool) navigate(PATH_APP.profile.user.publicDetails.root);
  }, [userHighSchool, navigate]);

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => navigate(-1)}>
      <Stack spacing={2} sx={{ pt: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            <IconButton sx={{ p: 0, mr: 2 }} onClick={() => navigate(-1)}>
              {/* <ArrowLeft /> */}
            </IconButton>
            Privacy
          </Typography>
          <IconButton>{/* <CloseSquare variant="Outline" onClick={() => navigate(-1)} /> */}</IconButton>
        </Stack>
        <Divider />
        <Stack>
          <FormControl sx={{ mb: 2 }}>
            <RadioGroup
              onChange={(e) => {
                handleUpdateAudience((e.target as HTMLInputElement).value);
              }}
              value={userHighSchool?.audience}
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
