import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
// import bottom sheet
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';

import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  Box,
  Button,
  CardMedia,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Typography,
  styled,
} from '@mui/material';

import { useSnackbar } from 'notistack';
import {
  useUpdatePersonProfileMutation,
  useUpdateProfileFiledMutation,
} from 'src/_graphql/profile/mainProfile/mutations/updatePersonProfile.generated';
import emptyCoverPhoto from 'src/assets/icons/empty_cover.svg';
import { Icon } from 'src/components/Icon';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import useAuth from 'src/hooks/useAuth';
import ProfileMainMessage from 'src/pwa-sections/profile/components/profileMain.messages';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { updateMainInfo, userMainInfoSelector } from 'src/store/slices/profile/userMainInfo-slice';
import { PersonInput, ProfileFieldEnum } from 'src/types/serverTypes';
import getMonthName from 'src/utils/getMonthName';

import MainProfileBirthday from './MainProfileBirthday';
import MainProfileChangePhoto from './MainProfileChangePhoto';
import MainProfileCoverAvatar from './MainProfileCoverAvatar';
import MainProfileDiscard from './MainProfileDiscard';
import MainProfileGender from './MainProfileGender';

// ------------styles !---------------------
const AvatarStyle = styled(Box)(() => ({
  position: 'absolute',
  left: 24,
  bottom: -36,
}));

const IconButtonStyle = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(0, -50%)',
  backgroundColor: theme.palette.grey[100],
  borderRadius: 8,
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
  },
}));

function MainProfileEditDialog() {
  const { initialize, user, loading: userFetching } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const userMainInfo = useSelector(userMainInfoSelector);
  // services !
  const [updateProfile, { isLoading }] = useUpdatePersonProfileMutation();
  const [updateProfileField, { isLoading: isLoadingField }] = useUpdateProfileFiledMutation();

  // bottom sheet state
  const [discardBottomSheet, setDiscardBottomSheet] = useState(false);
  const [birthDayBottomSheet, setBirthDayBottomSheet] = useState(false);
  const [genderBottomSheet, setGenderBottomSheet] = useState(false);
  const [profileChangePhoto, setProfileChangePhotoBottomSheet] = useState(false);
  const [profileCoverAvatar, setProfileCoverAvatarBottomSheet] = useState(false);
  //
  const [statusPhoto, setStatusPhoto] = useState<'cover' | 'avatar' | undefined>();

  const methods = useForm<PersonInput & { headlineView?: boolean }>({
    // resolver: yupResolver(ExperienceFormSchema),
    defaultValues: { ...userMainInfo, headlineView: true },
    mode: 'onBlur',
  });
  const {
    handleSubmit,
    watch,
    reset,
    getValues,
    setValue,
    formState: { isDirty },
  } = methods;
  useEffect(() => {
    if (user && !userFetching) {
      reset({
        avatarUrl: user?.personDto?.avatarUrl,
        birthday: user?.personDto?.birthday,
        coverUrl: user?.personDto?.coverUrl,
        gender: user?.personDto?.gender,
        headline: user?.personDto?.headline,
        headlineView: true,
      });
    }
  }, [reset, user, userFetching]);

  const onSubmit = async (value: PersonInput) => {
    let birthdayValue;
    if (value?.birthday) {
      const date = new Date(value?.birthday);
      birthdayValue = `${date.getFullYear()}-${('0' + (date?.getMonth() + 1)).slice(-2)}-${(
        '0' + date?.getDate()
      ).slice(-2)}`;
    }
    const res: any = await updateProfile({
      filter: {
        dto: {
          birthday: birthdayValue,
          gender: value.gender,
          headline: value.headline,
        },
      },
    });

    const resCover: any = await updateProfileField({
      filter: {
        dto: {
          field: ProfileFieldEnum.CoverUrl,
          coverUrl: value.coverUrl,
        },
      },
    });

    const resAvatar: any = await updateProfileField({
      filter: {
        dto: {
          field: ProfileFieldEnum.AvatarUrl,
          avatarUrl: value.avatarUrl,
        },
      },
    });
    if (
      res?.data?.updatePersonProfile?.isSuccess &&
      resCover?.data?.updateProfileFiled?.isSuccess &&
      resAvatar?.data?.updateProfileFiled?.isSuccess
    ) {
      initialize();
      enqueueSnackbar('Profile Updated', { variant: 'success' });
      handleCloseInDiscardAndSubmit();
    }
  };

  const handleClose = () => {
    if (isDirty) {
      setDiscardBottomSheet(true);
    } else {
      handleCloseInDiscardAndSubmit();
    }
  };

  function handleCloseInDiscardAndSubmit() {
    const fromWizard = localStorage.getItem('fromWizard') === 'true';
    initialize();
    if (fromWizard) {
      localStorage.removeItem('fromWizard');
      navigate(PATH_APP.profile.user.wizard.wizardList);
    } else {
      navigate(PATH_APP.profile.user.root);
    }
  }

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ mb: 2, px: 2, pt: 3 }} direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" justifyContent="center" spacing={2}>
            <IconButton sx={{ p: 0 }} onClick={handleClose}>
              <Icon name="left-arrow-1" color="text.primary" />
            </IconButton>
            <Typography variant="subtitle1">
              <FormattedMessage {...ProfileMainMessage.editProfile} />
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2}>
            <LoadingButton
              loading={isLoading || isLoadingField}
              variant="contained"
              color="primary"
              type="submit"
              disabled={!isDirty}
            >
              <Typography variant="button">
                <FormattedMessage {...ProfileMainMessage.save} />
              </Typography>
            </LoadingButton>
          </Stack>
        </Stack>
        <Divider />
        {userFetching ? (
          <Stack alignItems="center" justifyContent="center" sx={{ height: 200 }}>
            <CircularProgress />
          </Stack>
        ) : (
          <Stack>
            <Box sx={{ position: 'relative' }}>
              <Box>
                <CardMedia
                  component="img"
                  alt="Cover Image"
                  height={'250px'}
                  image={watch('coverUrl') || emptyCoverPhoto}
                  sx={{ objectFit: 'unset' }}
                />
                <IconButtonStyle
                  sx={{ transform: 'translate(-50%,-50%)' }}
                  onClick={() => {
                    watch('coverUrl') ? setProfileChangePhotoBottomSheet(true) : setProfileCoverAvatarBottomSheet(true);
                    setStatusPhoto('cover');
                  }}
                >
                  <Icon name="camera" size="24" color="text.secondary" />
                </IconButtonStyle>
              </Box>
              <AvatarStyle>
                <Box sx={{ position: 'relative', width: 80 }}>
                  <Avatar
                    alt={user?.fullName || undefined}
                    src={watch('avatarUrl') || undefined}
                    sx={{ width: 80, height: 80 }}
                  />

                  <IconButtonStyle
                    sx={{ left: '25%' }}
                    onClick={() => {
                      watch('avatarUrl')
                        ? setProfileChangePhotoBottomSheet(true)
                        : setProfileCoverAvatarBottomSheet(true);
                      setStatusPhoto('avatar');
                    }}
                  >
                    <Icon name="camera" size="24" color="text.secondary" />
                  </IconButtonStyle>
                </Box>
              </AvatarStyle>
            </Box>
            <Stack spacing={2} sx={{ pt: 9, pb: 3 }}>
              <Stack sx={{ px: 2 }} spacing={2}>
                <Box display="flex" alignItems="center">
                  <Typography variant="subtitle2">
                    <FormattedMessage {...ProfileMainMessage.headline} />
                  </Typography>
                  {watch('headline') && watch('headlineView') && (
                    <IconButton onClick={() => setValue('headlineView', false)}>
                      <Icon name="Edit-Pen" color="text.primary" />
                    </IconButton>
                  )}
                </Box>
                {!watch('headline') && watch('headlineView') ? (
                  <Button variant="outlined" onClick={() => setValue('headlineView', false)}>
                    <Icon name="Plus" color="text.primary" />
                    <Typography color="text.primary">
                      <FormattedMessage {...ProfileMainMessage.addHeadline} />
                    </Typography>
                  </Button>
                ) : watch('headlineView') ? (
                  <Typography
                    color="text.primary"
                    variant="body2"
                    onClick={() => setValue('headlineView', false)}
                    sx={{ wordBreak: 'break-all' }}
                  >
                    {watch('headline')}
                  </Typography>
                ) : (
                  <Box>
                    <RHFTextField
                      name="headline"
                      size="small"
                      placeholder="Add Headline"
                      inputProps={{ maxLength: 100 }}
                      onBlur={() => setValue('headlineView', true, { shouldDirty: true })}
                      autoFocus
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      component="div"
                      sx={{ width: '100%', textAlign: 'right' }}
                    >
                      {watch('headline')?.length || 0}/100
                    </Typography>
                  </Box>
                )}
              </Stack>
              <Divider />
              <Stack sx={{ px: 2 }} spacing={2}>
                <Box display="flex" alignItems="center">
                  <Typography variant="subtitle2">
                    <FormattedMessage {...ProfileMainMessage.birthday} />
                  </Typography>
                  {watch('birthday') && (
                    <IconButton onClick={() => setBirthDayBottomSheet(true)}>
                      <Icon name="Edit-Pen" color="text.primary" />
                    </IconButton>
                  )}
                </Box>
                {!watch('birthday') ? (
                  <Button variant="outlined" onClick={() => setBirthDayBottomSheet(true)}>
                    <Icon name="Plus" color="text.primary" />
                    <Typography color="text.primary">
                      <FormattedMessage {...ProfileMainMessage.addBirthday} />
                    </Typography>
                  </Button>
                ) : (
                  <Typography color="text.primary" variant="body2">
                    {new Date(watch('birthday')).getDate()}, {getMonthName(new Date(watch('birthday')))},{' '}
                    {new Date(watch('birthday')).getFullYear()}
                    <IconButton
                      sx={{ p: 0, ml: 1 }}
                      onClick={() => {
                        setValue('birthday', undefined, { shouldDirty: true });
                        dispatch(updateMainInfo({ ...getValues() }));
                      }}
                    >
                      &#215;
                    </IconButton>
                  </Typography>
                )}
              </Stack>
              <Divider />
              <Stack sx={{ px: 2 }} spacing={2}>
                <Box display="flex" alignItems="center">
                  <Typography variant="subtitle2">
                    <FormattedMessage {...ProfileMainMessage.gender} />
                  </Typography>
                  {watch('gender') && (
                    <IconButton onClick={() => setGenderBottomSheet(true)}>
                      <Icon name="Edit-Pen" color="text.primary" />
                    </IconButton>
                  )}
                </Box>
                {!watch('gender') ? (
                  <Button variant="outlined" onClick={() => setGenderBottomSheet(true)}>
                    <Icon name="Plus" color="text.primary" />
                    <Typography color="text.primary">
                      <FormattedMessage {...ProfileMainMessage.addGender} />
                    </Typography>
                  </Button>
                ) : (
                  <Typography color="text.primary" variant="body2">
                    {watch('gender')!.toString()[0] + watch('gender')!.substring(1).toLowerCase()}
                    <IconButton
                      onClick={() => {
                        setValue('gender', undefined, { shouldDirty: true });
                        dispatch(updateMainInfo({ ...getValues() }));
                      }}
                      sx={{ ml: 1 }}
                    >
                      &#215;
                    </IconButton>
                  </Typography>
                )}
              </Stack>
              <Divider />
            </Stack>
          </Stack>
        )}
      </FormProvider>
      <BottomSheet open={discardBottomSheet} onDismiss={() => setDiscardBottomSheet(false)}>
        <MainProfileDiscard
          onSubmit={() => {
            onSubmit(getValues());
            setDiscardBottomSheet(false);
          }}
          onDiscard={handleCloseInDiscardAndSubmit}
        />
      </BottomSheet>
      <BottomSheet
        open={birthDayBottomSheet}
        onDismiss={() => setBirthDayBottomSheet(false)}
        snapPoints={({ minHeight }) => minHeight - 2}
      >
        <MainProfileBirthday
          onChange={(value) => {
            setValue('birthday', value, { shouldDirty: true });
            setBirthDayBottomSheet(false);
          }}
          birthDay={watch('birthday')}
        />
      </BottomSheet>
      <BottomSheet
        open={genderBottomSheet}
        onDismiss={() => setGenderBottomSheet(false)}
        snapPoints={({ maxHeight }) => maxHeight / 2.5}
      >
        <MainProfileGender
          onChange={(value) => {
            setValue('gender', value, { shouldDirty: true });
            setGenderBottomSheet(false);
          }}
        />
      </BottomSheet>
      <BottomSheet
        open={profileChangePhoto}
        onDismiss={() => setProfileChangePhotoBottomSheet(false)}
        // snapPoints={({ minHeight }) => minHeight * 3}
      >
        <MainProfileChangePhoto
          isProfilePhoto={statusPhoto === 'avatar'}
          onRemove={() => {
            setValue(statusPhoto === 'avatar' ? 'avatarUrl' : 'coverUrl', undefined, { shouldDirty: true });
            setProfileChangePhotoBottomSheet(false);
          }}
          onUpload={() => {
            setProfileChangePhotoBottomSheet(false);
            setProfileCoverAvatarBottomSheet(true);
          }}
        />
      </BottomSheet>
      <BottomSheet
        open={profileCoverAvatar}
        onDismiss={() => setProfileCoverAvatarBottomSheet(false)}
        snapPoints={({ minHeight, maxHeight }) => [maxHeight, minHeight, maxHeight]}
      >
        <MainProfileCoverAvatar
          isAvatar={statusPhoto === 'avatar'}
          onChange={(value) => {
            setValue(statusPhoto === 'avatar' ? 'avatarUrl' : 'coverUrl', value, { shouldDirty: true });
            setProfileCoverAvatarBottomSheet(false);
          }}
        />
      </BottomSheet>
    </>
  );
}

export default MainProfileEditDialog;
