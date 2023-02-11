import { useNavigate } from 'react-router-dom';

import { Box, Divider, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useUpsertUserEmailMutation } from 'src/_graphql/profile/contactInfo/mutations/upsertUserEmail.generated';
import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { addedEmail, userEmailsSelector } from 'src/store/slices/profile/contactInfo-slice-eli';
import { AudienceEnum } from 'src/types/serverTypes';

export default function EmailDiscardDialog() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const personEmail = useSelector(userEmailsSelector);
  const [upsertUserEmail] = useUpsertUserEmailMutation();

  function handlerDiscardEmail() {
    dispatch(addedEmail({ audience: AudienceEnum.Public }));
    navigate(PATH_APP.profile.user.contactInfo.root);
  }

  const handleSaveChangeEmail = async () => {
    const resData: any = await upsertUserEmail({
      filter: {
        dto: {
          id: personEmail?.id,
          email: personEmail?.email,
          audience: personEmail?.audience,
        },
      },
    });

    if (resData.data?.upsertUserEmail?.isSuccess) {
      navigate(PATH_APP.profile.user.contactInfo.root);
      dispatch(addedEmail({ audience: AudienceEnum.Public }));
    }
    if (!resData.data?.upsertUserEmail?.isSuccess) {
      enqueueSnackbar(resData.data?.upsertUserEmail?.messagingKey, { variant: 'error' });
    }
  };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            Do you want to save changes?
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer' }} onClick={handleSaveChangeEmail}>
          <Icon name="Save" color="grey.700" />
          <Typography variant="body2" color="text.primary">
            Save Change
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }} onClick={handlerDiscardEmail}>
          <Icon name="Close-1" color="grey.500" />
          <Typography variant="body2" color="error">
            Discard
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}
