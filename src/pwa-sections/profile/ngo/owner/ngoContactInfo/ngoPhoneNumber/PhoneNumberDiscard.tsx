import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Box, Divider, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useUpsertPhoneNumberMutation } from 'src/_graphql/profile/contactInfo/mutations/upsertPhoneNumber.generated';
import { Icon } from 'src/components/Icon';
import NormalAndNgoProfileContactInfoMessages from 'src/pwa-sections/profile/UserProfileContactInfoPwa.messages';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { phoneNumberAdded, userPhoneNumberSelector } from 'src/store/slices/profile/userPhoneNumber-slice';
import { AudienceEnum } from 'src/types/serverTypes';

export default function PhoneNumberDiscard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const userPhoneNumber = useSelector(userPhoneNumberSelector);
  const [upsertUserPhoneNumber] = useUpsertPhoneNumberMutation();

  function handlerDiscardPhoneNumber() {
    dispatch(phoneNumberAdded({ audience: AudienceEnum.Public }));
    navigate(PATH_APP.profile.ngo.contactInfo.root);
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
      navigate(PATH_APP.profile.ngo.contactInfo.root);
      dispatch(phoneNumberAdded({ audience: AudienceEnum.Public }));
    }
    if (!resData.data?.upsertUserPhoneNumber?.isSuccess) {
      enqueueSnackbar(resData.data?.upsertUserPhoneNumber?.messagingKey, { variant: 'error' });
    }
  };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.saveChangeQuestion} />
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer' }} onClick={handleSaveChangePhoneNumber}>
          <Icon name="Save" color="grey.700" />
          <Typography variant="body2" color="text.primary">
            <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.saveChange} />
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }} onClick={handlerDiscardPhoneNumber}>
          <Icon name="Close-1" color="grey.500" />
          <Typography variant="body2" color="error">
            <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.discard} />
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}
