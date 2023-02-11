import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useUpsertPhoneNumberMutation } from 'src/_graphql/profile/contactInfo/mutations/upsertPhoneNumber.generated';
import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import NormalAndNgoProfileContactInfoMessages from 'src/sections/profile/UserProfileContactInfo.messages';
import { useDispatch, useSelector } from 'src/store';
import { phoneNumberAdded, userPhoneNumberSelector } from 'src/store/slices/profile/userPhoneNumber-slice';
import { AudienceEnum } from 'src/types/serverTypes';

function PhoneNumberDiscardDialog() {
  const router = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const userPhoneNumber = useSelector(userPhoneNumberSelector);
  const [upsertUserPhoneNumber] = useUpsertPhoneNumberMutation();

  function handlerDiscardPhoneNumber() {
    dispatch(phoneNumberAdded({ audience: AudienceEnum.Public }));
    router(PATH_APP.profile.user.contactInfo.root);
  }

  const handleSaveChangePhoneNumber = async () => {
    const resData: any = await upsertUserPhoneNumber({
      filter: {
        dto: {
          id: userPhoneNumber?.id,
          phoneNumber: userPhoneNumber?.phoneNumber,
          audience: userPhoneNumber?.audience,
        },
      },
    });

    if (resData.data?.upsertUserPhoneNumber?.isSuccess) {
      router(PATH_APP.profile.user.contactInfo.root);
      dispatch(phoneNumberAdded({ audience: AudienceEnum.Public }));
    }
    if (!resData.data?.upsertUserPhoneNumber?.isSuccess) {
      enqueueSnackbar(resData.data?.upsertUserPhoneNumber?.messagingKey, { variant: 'error' });
    }
  };

  const handleBackRoute = () => {
    dispatch(phoneNumberAdded({ audience: AudienceEnum.Public }));
    router(-1);
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={handleBackRoute}>
      <Stack spacing={2} sx={{ py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={handleBackRoute}>
              <Icon name="left-arrow" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.saveChangeQuestion} />
            </Typography>
          </Box>

          <IconButton onClick={handleBackRoute}>
            <Icon name="Close" />
          </IconButton>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          {userPhoneNumber?.id && (
            <>
              <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer' }} onClick={handleSaveChangePhoneNumber}>
                <Icon name="Save" size={24} />
                <Typography variant="body2" color="text.primary">
                  <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.saveChange} />
                </Typography>
              </Box>
              <Box
                sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }}
                onClick={handlerDiscardPhoneNumber}
              >
                <Icon name="Close" size={24} color="error.main" />
                <Typography variant="body2" color="error">
                  <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.discard} />
                </Typography>
              </Box>
            </>
          )}
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default PhoneNumberDiscardDialog;
