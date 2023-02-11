import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  Box,
  Button,
  CardMedia,
  CircularProgress,
  Dialog,
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
import { useLazyGetUserDetailQuery } from 'src/_graphql/profile/publicDetails/queries/getUser.generated';
import cameraPhoto from 'src/assets/icons/camera2.svg';
import emptyCover from 'src/assets/icons/empty_cover.svg';
import { Icon } from 'src/components/Icon';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import useAuth from 'src/hooks/useAuth';
import { PATH_APP } from 'src/routes/paths';
import ProfileMainMessage from 'src/sections/profile/components/profileMain.messages';
import { useDispatch, useSelector } from 'src/store';
import { mainInfoCleared, updateMainInfo, userMainInfoSelector } from 'src/store/slices/profile/userMainInfo-slice';
import { PersonInput, ProfileFieldEnum } from 'src/types/serverTypes';
import getMonthName from 'src/utils/getMonthName';

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
  const router = useNavigate();
  const dispatch = useDispatch();
  const { initialize } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const userMainInfo = useSelector(userMainInfoSelector);
  const [getUser, { data: userData, isFetching: userFetching }] = useLazyGetUserDetailQuery();
  const [updateProfile, { isLoading }] = useUpdatePersonProfileMutation();
  const [updateProfileField, { isLoading: isLoadingField }] = useUpdateProfileFiledMutation();

  const fromWizard = localStorage.getItem('fromWizard') === 'true';
  const fromHomePage = localStorage.getItem('fromHomePage') === 'true';

  useEffect(() => {
    if (!userMainInfo)
      getUser({
        filter: {
          dto: {},
        },
      });
  }, [getUser, userMainInfo]);

  const user = userData?.getUser?.listDto?.items?.[0];

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
    if (user && !userMainInfo && !userFetching) {
      dispatch(
        updateMainInfo({
          avatarUrl: user?.personDto?.avatarUrl,
          birthday: user?.personDto?.birthday,
          coverUrl: user?.personDto?.coverUrl,
          gender: user?.personDto?.gender,
          headline: user?.personDto?.headline,
        }),
      );
      reset({
        avatarUrl: user?.personDto?.avatarUrl,
        birthday: user?.personDto?.birthday,
        coverUrl: user?.personDto?.coverUrl,
        gender: user?.personDto?.gender,
        headline: user?.personDto?.headline,
        headlineView: true,
      });
    }
  }, [dispatch, reset, user, userFetching, userMainInfo]);

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
      enqueueSnackbar('Profile Updated', { variant: 'success' });
      // initialize();
      if (fromWizard) {
        initialize();
        localStorage.removeItem('fromWizard');
        if (fromHomePage) {
          router(PATH_APP.home.wizard.wizardList);
        } else {
          router(PATH_APP.profile.user.wizard.wizardList);
        }
      } else {
        router(PATH_APP.profile.user.root);
      }
      setTimeout(() => {
        dispatch(mainInfoCleared());
      }, 100);
    }
  };

  const handleRouting = (url: string) => {
    dispatch(updateMainInfo(getValues()));
    router(url);
  };

  const handleClose = () => {
    if (isDirty) {
      handleRouting(PATH_APP.profile.user.userEditDiscard);
    } else {
      if (fromWizard) {
        initialize();
        localStorage.removeItem('fromWizard');
        if (fromHomePage) {
          router(PATH_APP.home.wizard.wizardList);
        } else {
          router(PATH_APP.profile.user.wizard.wizardList);
        }
      } else {
        router(PATH_APP.profile.user.root);
      }
      setTimeout(() => {
        dispatch(mainInfoCleared());
      }, 100);
    }
  };

  return (
    <Dialog fullWidth maxWidth="sm" open onClose={handleClose}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ mb: 2, px: 2, pt: 3 }} direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1">Edit Profile</Typography>
          <Stack direction="row" spacing={2}>
            <IconButton sx={{ padding: 0 }} onClick={handleClose}>
              <Icon name="Close-1" />
            </IconButton>
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
                <CardMedia component="img" alt="Cover Image" height={'250px'} image={watch('coverUrl') || emptyCover} />
                <IconButtonStyle
                  onClick={() =>
                    router(
                      watch('coverUrl')
                        ? PATH_APP.profile.user.mainProfileNChangePhotoCover
                        : PATH_APP.profile.user.userEditCover,
                    )
                  }
                >
                  <img loading="lazy" src={cameraPhoto} width={28} height={22} alt="avatar" />
                </IconButtonStyle>
              </Box>
              <AvatarStyle>
                <Box sx={{ position: 'relative', width: 80 }}>
                  <Avatar
                    alt={user?.personDto?.fullName || ''}
                    src={watch('avatarUrl') || undefined}
                    sx={{ width: 80, height: 80 }}
                  />

                  <IconButtonStyle
                    sx={{ left: '25%' }}
                    onClick={() =>
                      router(
                        watch('avatarUrl')
                          ? PATH_APP.profile.user.mainProfileNChangePhotoAvatar
                          : PATH_APP.profile.user.userEditAvatar,
                      )
                    }
                  >
                    <img loading="lazy" src={cameraPhoto} width={28} height={22} alt="avatar" />
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
                      <FormattedMessage {...ProfileMainMessage.headline} />
                    </Typography>
                  </Button>
                ) : watch('headlineView') ? (
                  <Typography color="text.primary" variant="body2" onClick={() => setValue('headlineView', false)}>
                    {watch('headline')}
                  </Typography>
                ) : (
                  <Box>
                    <RHFTextField
                      name="headline"
                      size="small"
                      placeholder="Add Headline"
                      inputProps={{ maxLength: 60 }}
                      onBlur={() => setValue('headlineView', true)}
                      // eslint-disable-next-line jsx-a11y/no-autofocus
                      autoFocus
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      component="div"
                      sx={{ width: '100%', textAlign: 'right' }}
                    >
                      {watch('headline')?.length || 0}/60
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
                    <IconButton onClick={() => handleRouting(PATH_APP.profile.user.birthday)}>
                      <Icon name="Edit-Pen" color="text.primary" />
                    </IconButton>
                  )}
                </Box>
                {!watch('birthday') ? (
                  <Button variant="outlined" onClick={() => handleRouting(PATH_APP.profile.user.birthday)}>
                    <Icon name="Plus" color="text.primary" />
                    <Typography color="text.primary">
                      <FormattedMessage {...ProfileMainMessage.addBirthday} />
                    </Typography>
                  </Button>
                ) : (
                  <Typography color="text.secondary" variant="body2">
                    <Stack direction="row">
                      <Typography variant="body2" color="text.secondry">
                        {new Date(watch('birthday')).getDate()}, {getMonthName(new Date(watch('birthday')))},{' '}
                        {new Date(watch('birthday')).getFullYear()}
                        <IconButton onClick={() => setValue('birthday', undefined)} sx={{ ml: 1 }}>
                          &#215;
                        </IconButton>
                      </Typography>
                    </Stack>
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
                    <IconButton onClick={() => handleRouting(PATH_APP.profile.user.gender)}>
                      <Icon name="Edit-Pen" color="text.primary" />
                    </IconButton>
                  )}
                </Box>
                {!watch('gender') ? (
                  <Button variant="outlined" onClick={() => handleRouting(PATH_APP.profile.user.gender)}>
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
                        setValue('gender', undefined);
                        dispatch(updateMainInfo({ ...getValues(), isChange: true }));
                      }}
                      sx={{ ml: 1 }}
                    >
                      &#215;
                    </IconButton>
                  </Typography>
                )}
              </Stack>
              <Divider />
              <Box display="flex" justifyContent="flex-end" sx={{ px: 2 }}>
                <LoadingButton loading={isLoading || isLoadingField} variant="contained" color="primary" type="submit">
                  <Typography variant="button">
                    <FormattedMessage {...ProfileMainMessage.save} />
                  </Typography>
                </LoadingButton>
              </Box>
            </Stack>
          </Stack>
        )}
      </FormProvider>
    </Dialog>
  );
}

export default MainProfileEditDialog;
