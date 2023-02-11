import { useEffect, useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';

import { LoadingButton } from '@mui/lab';
// @mui
import { Box, Button, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { useUpsertUserSocialMediaMutation } from 'src/_graphql/profile/contactInfo/mutations/upsertUserSocialMedia.generated';
import { Icon } from 'src/components/Icon';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import {
  addedSocialMedia,
  emptySocialMedia,
  userSocialMediasSelector,
} from 'src/store/slices/profile/socialMedia-slice';
import { AudienceEnum, SocialMedia } from 'src/types/serverTypes';

import SelectAudience from './SelectAudience';
import SocialLinkDelete from './SocialLinkDelete';
import SocialLinkPlatform from './SocialLinkPlatform';

type SocialMediaValueProps = {
  id?: string;
  socialMediaDto: SocialMedia;
  audience: AudienceEnum;
  userName: string;
};

function AddSocialLinkNewForm() {
  const { enqueueSnackbar } = useSnackbar();
  const [upsertUserSocialMedia, { isLoading }] = useUpsertUserSocialMediaMutation();
  const navigate = useNavigate();
  const personSocialMedia = useSelector(userSocialMediasSelector);
  const theme = useTheme();
  const dispatch = useDispatch();
  const [deleteSocialLink, setDeleteSocialLink] = useState(false);
  const [selectPlatform, setSelectPlatform] = useState(false);
  const [selectAudience, setSelectAudience] = useState(false);

  useEffect(() => {
    if (!personSocialMedia) navigate(PATH_APP.profile.user.contactInfo.root);
  }, [personSocialMedia, navigate]);

  const SocialLinkSchema = Yup.object().shape({
    userName: Yup.string().required('Please fill out this field.'),
    socialMediaDto: Yup.object().shape({ title: Yup.string().required('') }),
  });

  const defaultValues = {
    id: personSocialMedia?.id,
    socialMediaDto: personSocialMedia?.socialMediaDto || undefined,
    audience: personSocialMedia?.audience || AudienceEnum.Public,
    userName: personSocialMedia?.userName || '',
  };

  const methods = useForm<SocialMediaValueProps>({
    mode: 'onChange',
    resolver: yupResolver(SocialLinkSchema),
    defaultValues,
  });
  const {
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { isValid },
  } = methods;

  useEffect(() => {
    trigger(['socialMediaDto.title']);
  }, [trigger]);

  const onSubmit = async (data: SocialMediaValueProps) => {
    const { id, userName, audience, socialMediaDto } = data;
    const resData: any = await upsertUserSocialMedia({
      filter: {
        dto: {
          id: id,
          userName: userName,
          socialMediaId: socialMediaDto?.id,
          audience: audience,
        },
      },
    });
    if (resData.data?.upsertUserSocialMedia?.isSuccess) {
      dispatch(
        addedSocialMedia({
          id: id,
          userName: userName,
          socialMediaDto: socialMediaDto,
          audience: audience,
        }),
      );
      navigate(PATH_APP.profile.user.contactInfo.root);
      dispatch(emptySocialMedia({ audience: AudienceEnum.Public }));
      enqueueSnackbar('The Social link has been successfully added', { variant: 'success' });
    }
    if (!resData.data?.upsertUserSocialMedia?.isSuccess) {
      enqueueSnackbar(resData.data?.upsertUserSocialMedia?.messagingKey, { variant: 'error' });
    }
  };
  const handleBackRoute = () => {
    dispatch(emptySocialMedia({ audience: AudienceEnum.Public }));
    navigate(PATH_APP.profile.user.contactInfo.root);
  };

  const changeAudienceHandler = async (value: AudienceEnum) => {
    setValue('audience', value, { shouldDirty: true });
    setSelectAudience(false);
    if (personSocialMedia?.id) {
      await upsertUserSocialMedia({
        filter: {
          dto: {
            socialMediaId: personSocialMedia.userName,
            id: personSocialMedia.id,
            audience: value as AudienceEnum,
          },
        },
      });
      navigate(-1);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} sx={{ py: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            <IconButton sx={{ p: 0, mr: 2 }} onClick={handleBackRoute}>
              <Icon name="left-arrow-1" color="grey.500" />
            </IconButton>
            {!personSocialMedia?.id ? 'Add Social Link' : 'Edit Social Link'}
          </Typography>
          {!personSocialMedia?.id ? (
            <LoadingButton type="submit" variant="contained" disabled={!isValid}>
              Add
            </LoadingButton>
          ) : (
            <></>
          )}
        </Stack>
        <Divider />
        {!personSocialMedia?.id ? (
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              Social Link
            </Typography>
            <Button
              fullWidth
              size="large"
              startIcon={<Icon name="down-arrow" color="background.paper" size={16} />}
              variant="contained"
              onClick={() => setSelectPlatform(true)}
            >
              <Typography variant="button">{watch('socialMediaDto.title') || 'Platform'}</Typography>
            </Button>
            <RHFTextField autoComplete="UserName" placeholder="Username" type="text" name="userName" size="small" />
          </Stack>
        ) : (
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              {personSocialMedia?.socialMediaDto?.title}
            </Typography>
            <Typography variant="body2" color="text.primary">
              {personSocialMedia?.userName}
            </Typography>
          </Stack>
        )}
        <Divider />
        {!personSocialMedia?.id ? (
          <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
            <Box />
            <Button
              variant="outlined"
              startIcon={<Icon name="Earth" size="18" color="text.primary" />}
              onClick={() => setSelectAudience(true)}
              endIcon={<Icon name="down-arrow" size="16" color="text.primary" />}
            >
              <Typography color={theme.palette.text.primary}>
                {Object.keys(AudienceEnum)[Object.values(AudienceEnum).indexOf(watch('audience'))]}
              </Typography>
            </Button>
          </Stack>
        ) : (
          <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 3 }}>
            <Button variant="text" color="error" onClick={() => setDeleteSocialLink(true)}>
              Delete
            </Button>

            <LoadingButton
              loading={!!personSocialMedia?.id && isLoading}
              variant="outlined"
              startIcon={<Icon name="Earth" size="18" color="text.primary" />}
              onClick={() => setSelectAudience(true)}
              endIcon={<Icon name="down-arrow" size={16} color="text.primary" />}
            >
              <Typography color={theme.palette.text.primary}>
                {Object.keys(AudienceEnum)[Object.values(AudienceEnum).indexOf(watch('audience'))]}
              </Typography>
            </LoadingButton>
          </Stack>
        )}
      </Stack>
      <BottomSheet
        open={selectPlatform}
        onDismiss={() => setSelectPlatform(false)}
        snapPoints={({ maxHeight }) => maxHeight / 2}
      >
        <SocialLinkPlatform
          onChange={(value) => {
            setValue('socialMediaDto', value);
            setSelectPlatform(false);
          }}
        />
      </BottomSheet>
      <BottomSheet open={deleteSocialLink} onDismiss={() => setDeleteSocialLink(false)}>
        <SocialLinkDelete />
      </BottomSheet>
      <BottomSheet open={selectAudience} onDismiss={() => setSelectAudience(false)}>
        <SelectAudience
          onChange={(value) => {
            changeAudienceHandler(value);
          }}
          audience={watch('audience')}
        />
      </BottomSheet>
    </FormProvider>
  );
}

export default AddSocialLinkNewForm;
