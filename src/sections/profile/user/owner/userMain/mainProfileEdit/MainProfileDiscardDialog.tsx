import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import {
  useUpdatePersonProfileMutation,
  useUpdateProfileFiledMutation,
} from 'src/_graphql/profile/mainProfile/mutations/updatePersonProfile.generated';
import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import ProfileMainMessage from 'src/sections/profile/components/profileMain.messages';
import { useDispatch, useSelector } from 'src/store';
import { mainInfoCleared, userMainInfoSelector } from 'src/store/slices/profile/userMainInfo-slice';
import { ProfileFieldEnum } from 'src/types/serverTypes';

function MainProfileDiscardDialog() {
  const { enqueueSnackbar } = useSnackbar();
  const userMainInfo = useSelector(userMainInfoSelector);
  const [updateProfile, { isLoading }] = useUpdatePersonProfileMutation();
  const [updateProfileField, { isLoading: isLoadingField }] = useUpdateProfileFiledMutation();

  const dispatch = useDispatch();
  const router = useNavigate();

  function discardHandler() {
    dispatch(mainInfoCleared());
    router(PATH_APP.profile.user.root);
  }

  const saveHandler = async () => {
    let birthdayValue;
    if (userMainInfo?.birthday) {
      const date = new Date(userMainInfo?.birthday);
      birthdayValue = `${date.getFullYear()}-${('0' + (date?.getMonth() + 1)).slice(-2)}-${(
        '0' + date?.getDate()
      ).slice(-2)}`;
    }
    const res: any = await updateProfile({
      filter: {
        dto: {
          birthday: birthdayValue,
          gender: userMainInfo?.gender,
          headline: userMainInfo?.headline,
        },
      },
    });

    const resCover: any = await updateProfileField({
      filter: {
        dto: {
          field: ProfileFieldEnum.CoverUrl,
          coverUrl: userMainInfo?.coverUrl,
        },
      },
    });

    const resAvatar: any = await updateProfileField({
      filter: {
        dto: {
          field: ProfileFieldEnum.AvatarUrl,
          avatarUrl: userMainInfo?.avatarUrl,
        },
      },
    });

    if (
      res?.data?.updatePersonProfile?.isSuccess &&
      resCover?.data?.updateProfileFiled?.isSuccess &&
      resAvatar?.data?.updateProfileFiled?.isSuccess
    ) {
      enqueueSnackbar('Profile Updated', { variant: 'success' });
      router(PATH_APP.profile.user.root);
      setTimeout(() => {
        dispatch(mainInfoCleared());
      }, 100);
    }
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted>
      <Stack spacing={2} sx={{ minWidth: 600, minHeight: 194, py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => router(-1)}>
              <Icon name="left-arrow-1" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              <FormattedMessage {...ProfileMainMessage.wantSaveChanges} />
            </Typography>
          </Box>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <LoadingButton
            loading={isLoading || isLoadingField}
            startIcon={<Icon name="Save" />}
            variant="text"
            color="inherit"
            onClick={saveHandler}
            sx={{ maxWidth: 130 }}
          >
            <Typography variant="body2" color="text.primary">
              <FormattedMessage {...ProfileMainMessage.saveChanges} />
            </Typography>
          </LoadingButton>
          <Button
            variant="text"
            color="error"
            startIcon={<Icon name="Close-1" color="error.main" />}
            onClick={discardHandler}
            sx={{ maxWidth: 99 }}
          >
            <Typography variant="body2" color="error">
              <FormattedMessage {...ProfileMainMessage.discard} />
            </Typography>
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default MainProfileDiscardDialog;
