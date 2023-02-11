import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import ProfileMainMessage from 'src/sections/profile/components/profileMain.messages';
import { useDispatch, useSelector } from 'src/store';
import { updateMainInfo, userMainInfoSelector } from 'src/store/slices/profile/userMainInfo-slice';
import { GenderEnum, InputMaybe } from 'src/types/serverTypes';

function MainProfileGenderDialog() {
  const router = useNavigate();
  const dispatch = useDispatch();
  const userMainInfo = useSelector(userMainInfoSelector);

  useEffect(() => {
    if (!userMainInfo) router(PATH_APP.profile.user.userEdit);
  }, [userMainInfo, router]);

  const handleSelectGender = (gender?: InputMaybe<GenderEnum>) => {
    dispatch(
      updateMainInfo({
        gender,
      }),
    );
    router(-1);
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted>
      <Stack spacing={2} sx={{ py: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2 }}>
          <Stack direction="row" spacing={2}>
            <IconButton sx={{ p: 0 }} onClick={() => router(-1)}>
              <Icon name="left-arrow-1" />
            </IconButton>
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
              onClick={() => handleSelectGender(gender as InputMaybe<GenderEnum>)}
            >
              <Typography variant="body2">{gender}</Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default MainProfileGenderDialog;
