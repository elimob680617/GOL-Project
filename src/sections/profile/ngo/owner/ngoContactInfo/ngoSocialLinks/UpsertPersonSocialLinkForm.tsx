import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Button, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { useUpsertUserSocialMediaMutation } from 'src/_graphql/profile/contactInfo/mutations/upsertUserSocialMedia.generated';
import { Icon } from 'src/components/Icon';
import { Audience } from 'src/components/audience';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { PATH_APP } from 'src/routes/paths';
import NormalAndNgoProfileContactInfoMessages from 'src/sections/profile/UserProfileContactInfo.messages';
import { useDispatch, useSelector } from 'src/store';
import {
  addedSocialMedia,
  emptySocialMedia,
  userSocialMediasSelector,
} from 'src/store/slices/profile/socialMedia-slice';
import { AudienceEnum, FeatureAudienceEnum, SocialMedia } from 'src/types/serverTypes';
import sleep from 'src/utils/sleep';

type SocialMediaValueProps = {
  id?: string;
  socialMediaDto: SocialMedia;
  audience: AudienceEnum;
  userName: string;
};

function AddSocialLinkNewForm() {
  const [openAudience, setOpenAudience] = useState<boolean>(false);

  const router = useNavigate();
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const personSocialMedia = useSelector(userSocialMediasSelector);
  const [upsertUserSocialMedia] = useUpsertUserSocialMediaMutation();

  useEffect(() => {
    if (!personSocialMedia) router(PATH_APP.profile.ngo.contactInfo.root);
  }, [personSocialMedia, router]);

  const SocialLinkSchema = Yup.object().shape({
    userName: Yup.string().required(formatMessage(NormalAndNgoProfileContactInfoMessages.fillThisField)),
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
    getValues,
    handleSubmit,
    trigger,
    formState: { isValid },
  } = methods;

  useEffect(() => {
    trigger(['socialMediaDto.title']);
  }, [trigger]);
  // click on closeicon and go to Discard or profile
  const handlePlatformClick = () => {
    dispatch(addedSocialMedia(getValues()));
    router(PATH_APP.profile.ngo.contactInfo.socialLink.platform);
  };

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
      router(PATH_APP.profile.ngo.contactInfo.root);
      enqueueSnackbar(formatMessage(NormalAndNgoProfileContactInfoMessages.addSocialSuccessful), {
        variant: 'success',
      });
      await sleep(1500);
      dispatch(emptySocialMedia({ audience: AudienceEnum.Public }));
    }
    if (!resData.data?.upsertUserSocialMedia?.isSuccess) {
      enqueueSnackbar(resData.data?.upsertUserSocialMedia?.messagingKey, { variant: 'error' });
    }
  };
  const handleBackRoute = async () => {
    router(PATH_APP.profile.ngo.contactInfo.root);
    await sleep(1500);
    dispatch(emptySocialMedia({ audience: AudienceEnum.Public }));
  };

  return (
    <>
      <Dialog fullWidth={true} open={true && !openAudience} keepMounted onClose={handleBackRoute}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} sx={{ py: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
              <Typography variant="subtitle1" color="text.primary">
                <IconButton sx={{ p: 0, mr: 2 }} onClick={handleBackRoute}>
                  <Icon name="left-arrow-1" />
                </IconButton>
                {!personSocialMedia?.id
                  ? formatMessage(NormalAndNgoProfileContactInfoMessages.socialLinks)
                  : formatMessage(NormalAndNgoProfileContactInfoMessages.editSocialLink)}
              </Typography>
              <IconButton onClick={handleBackRoute}>
                <Icon name="Close-1" />
              </IconButton>
              {/* {!personSocialMedia?.userName ? (
            ) : (
              <IconButton onClick={handleBackRoute}>
                <CloseCircle variant="Outline" />
              </IconButton>
            )} */}
            </Stack>
            <Divider />
            {!personSocialMedia?.id ? (
              <Stack spacing={2} sx={{ px: 2 }}>
                <Typography variant="subtitle1" color="text.primary">
                  <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.socialLinks} />
                </Typography>
                <Button
                  fullWidth
                  size="large"
                  startIcon={<Icon name="down-arrow" />}
                  variant="contained"
                  onClick={handlePlatformClick}
                >
                  <Typography variant="button">
                    {personSocialMedia?.socialMediaDto?.title ||
                      formatMessage(NormalAndNgoProfileContactInfoMessages.pltaform)}
                  </Typography>
                </Button>
                <RHFTextField
                  autoComplete="UserName"
                  placeholder={formatMessage(NormalAndNgoProfileContactInfoMessages.username)}
                  type="text"
                  name="userName"
                  size="small"
                />
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
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{
                justifyContent: 'space-between',
                px: 2,
                ...(personSocialMedia?.id && {
                  justifyContent: 'unset',
                  px: 6,
                }),
              }}
            >
              {!!personSocialMedia?.id && (
                <Link to={PATH_APP.profile.ngo.contactInfo.socialLink.delete}>
                  <Button variant="text" color="error">
                    <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.delete} />
                  </Button>
                </Link>
              )}

              <Button
                variant="outlined"
                startIcon={<Icon name="Earth" />}
                endIcon={<Icon name="down-arrow" />}
                onClick={(e) => {
                  setOpenAudience(true);
                }}
              >
                <Typography color="text.primary">
                  {Object.keys(AudienceEnum)
                    [Object.values(AudienceEnum).indexOf(personSocialMedia?.audience as AudienceEnum)]?.replace(
                      /([A-Z])/g,
                      ' $1',
                    )
                    .trim()}
                </Typography>
              </Button>
              {!personSocialMedia?.id && (
                <LoadingButton type="submit" variant="contained" disabled={!isValid}>
                  <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.add} />
                </LoadingButton>
              )}
            </Stack>
          </Stack>
        </FormProvider>
      </Dialog>
      {openAudience && (
        <Audience
          feature={FeatureAudienceEnum.UserSocialMedia}
          value={personSocialMedia?.audience as AudienceEnum}
          onClose={setOpenAudience}
          open={openAudience}
          onChange={(val: any) => {
            dispatch(
              addedSocialMedia({
                ...personSocialMedia,
                audience: val,
              }),
            );
          }}
        />
      )}
    </>
  );
}

export default AddSocialLinkNewForm;
