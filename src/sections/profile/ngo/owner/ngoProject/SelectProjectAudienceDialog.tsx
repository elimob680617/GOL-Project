import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Dialog, Divider, FormControl, FormControlLabel, IconButton, Stack, Typography } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { ngoProjectSelector, projectAdded } from 'src/store/slices/profile/ngoProject-slice';
import { AudienceEnum } from 'src/types/serverTypes';

import NgoProjectMessages from './NgoProject.messages';

export default function SelectProjectAudienceDialog() {
  const router = useNavigate();
  const dispatch = useDispatch();
  const projectData = useSelector(ngoProjectSelector);

  const handleUpdateAudience = async (val: string) => {
    dispatch(
      projectAdded({
        // audience: val,
        isChange: true,
      }),
    );
    router(-1);
  };

  useEffect(() => {
    if (!projectData) router(PATH_APP.profile.ngo.project.list);
  }, [projectData, router]);

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => router(-1)}>
      <Stack spacing={2} sx={{ pt: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            <IconButton sx={{ p: 0, mr: 2 }} onClick={() => router(-1)}>
              <Icon name="left-arrow-1" />
            </IconButton>
            <FormattedMessage {...NgoProjectMessages.privacy} />
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
                handleUpdateAudience((e.target as HTMLInputElement).value);
              }}
              value={projectData?.audience}
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
            >
              {Object.keys(AudienceEnum).map((_audience) => (
                <>
                  <FormControlLabel
                    // value={AudienceEnum[_audience]}
                    key={_audience}
                    control={<Radio />}
                    label={_audience}
                    sx={{ ml: '8px !important', mt: '8px !important' }}
                  />
                  {_audience === 'SpecificFollowes' && (
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 6, mb: 1 }}>
                      <FormattedMessage {...NgoProjectMessages.selectSpecificFollowersAsYourAudience} />
                    </Typography>
                  )}
                  {_audience === 'ExceptFollowes' && (
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 6, mb: 1 }}>
                      <FormattedMessage {...NgoProjectMessages.selectFollowersThatYouDontWantAsAnAudience} />
                    </Typography>
                  )}
                </>
              ))}
            </RadioGroup>
          </FormControl>
        </Stack>
      </Stack>
    </Dialog>
  );
}
