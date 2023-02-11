import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Button, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { useUpsertWebsiteMutation } from 'src/_graphql/profile/contactInfo/mutations/upsertWebsite.generated';
import { Icon } from 'src/components/Icon';
import { Audience } from 'src/components/audience';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { PATH_APP } from 'src/routes/paths';
import NormalAndNgoProfileContactInfoMessages from 'src/sections/profile/UserProfileContactInfo.messages';
import { dispatch, useSelector } from 'src/store';
import { userWebsiteSelector, websiteAdded } from 'src/store/slices/profile/userWebsite-slice';
import { PersonWebSiteType } from 'src/types/profile/userWebsite';
import { AudienceEnum, FeatureAudienceEnum } from 'src/types/serverTypes';

function UpsertWebsite() {
  const router = useNavigate();
  const { formatMessage } = useIntl();
  const [openAudience, setOpenAudience] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const userWebsite = useSelector(userWebsiteSelector);
  const [addPersonWebsite, { isLoading }] = useUpsertWebsiteMutation();

  useEffect(() => {
    if (!userWebsite) router(PATH_APP.profile.user.contactInfo.root);
  }, [userWebsite, router]);

  const WebsiteSchema = Yup.object().shape({
    webSiteUrl: Yup.string()
      .required(formatMessage(NormalAndNgoProfileContactInfoMessages.fillThisField))
      .matches(
        /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
        formatMessage(NormalAndNgoProfileContactInfoMessages.useValidUrl),
      ),
  });

  const defaultValues = {
    id: userWebsite?.id,
    audience: userWebsite?.audience,
    webSiteUrl: userWebsite?.webSiteUrl || '',
  };

  const methods = useForm<PersonWebSiteType>({
    resolver: yupResolver(WebsiteSchema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    handleSubmit,
    getValues,
    formState: { isValid },
  } = methods;

  const onSubmit = async (data: PersonWebSiteType) => {
    const resData: any = await addPersonWebsite({
      filter: {
        dto: {
          id: data.id,
          webSiteUrl: data.webSiteUrl,
          audience: userWebsite?.audience || data.audience,
        },
      },
    });

    if (resData.data.upsertWebSite?.isSuccess) {
      dispatch(
        websiteAdded({
          id: data.id,
          webSiteUrl: data.webSiteUrl,
          audience: userWebsite?.audience || data.audience,
        }),
      );
      router(PATH_APP.profile.user.contactInfo.root);
      enqueueSnackbar(formatMessage(NormalAndNgoProfileContactInfoMessages.addWebsiteSuccessfull), {
        variant: 'success',
      });
    }
  };

  const handleDialogDeleteWebsite = () => {
    router(PATH_APP.profile.user.contactInfo.website.delete);
  };

  const handleNavigation = (url: string) => {
    dispatch(websiteAdded({ ...getValues(), audience: userWebsite?.audience }));
    router(url);
  };

  function closeHandler() {
    if (isValid) {
      handleNavigation(PATH_APP.profile.user.root);
    } else {
      dispatch(websiteAdded({ audience: AudienceEnum.Public }));
      router(PATH_APP.profile.user.contactInfo.root);
    }
  }

  const handleBackRoute = () => {
    dispatch(websiteAdded({ audience: AudienceEnum.Public }));
    router(PATH_APP.profile.user.contactInfo.root);
  };

  return (
    <>
      <Dialog fullWidth={true} open={true && !openAudience} keepMounted onClose={handleBackRoute}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} sx={{ py: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
              <Stack spacing={2} direction="row" alignItems="center">
                <IconButton sx={{ p: 0, mr: 2 }} onClick={handleBackRoute}>
                  <Icon name="left-arrow" />
                </IconButton>
                <Typography variant="subtitle1" color="text.primary">
                  {userWebsite?.id
                    ? formatMessage(NormalAndNgoProfileContactInfoMessages.editWebsite)
                    : formatMessage(NormalAndNgoProfileContactInfoMessages.addWebsite)}
                </Typography>
              </Stack>
              {!userWebsite?.id ? (
                <IconButton onClick={handleBackRoute}>
                  <Icon name="Close" />
                </IconButton>
              ) : (
                <IconButton onClick={closeHandler}>
                  <Icon name="Close" />
                </IconButton>
              )}
            </Stack>
            <Divider />
            <Stack spacing={2} sx={{ justifyContent: 'space-between', px: 2 }}>
              <Typography variant="subtitle1">
                <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.website} />
              </Typography>
              {!userWebsite?.id ? (
                <RHFTextField
                  autoComplete="WebSiteUrl"
                  type="text"
                  name="webSiteUrl"
                  placeholder={formatMessage(NormalAndNgoProfileContactInfoMessages.website)}
                  inputProps={{ maxLength: 200 }}
                />
              ) : (
                <Stack spacing={2}>
                  <Typography variant="body1">{userWebsite.webSiteUrl}</Typography>
                </Stack>
              )}
            </Stack>
            <Divider />
            {!userWebsite?.id ? (
              <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
                {/* <Link to={PATH_APP.profile.user.contactInfo.website.audience}> */}
                <Button
                  variant="outlined"
                  startIcon={<Icon name="Earth" size={18} color="text.primary" />}
                  endIcon={<Icon name="down-arrow" size={16} color="text.primary" />}
                  onClick={() => {
                    setOpenAudience(true);
                  }}
                >
                  <Typography color="text.primary">
                    {
                      Object.keys(AudienceEnum)[
                        Object.values(AudienceEnum).indexOf(userWebsite?.audience as AudienceEnum)
                      ]
                    }
                  </Typography>
                </Button>
                {/* </Link> */}
                <LoadingButton type="submit" variant="contained" loading={isLoading} disabled={!isValid}>
                  <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.add} />
                </LoadingButton>
              </Stack>
            ) : (
              <Stack direction="row" spacing={2} alignItems="center" sx={{ px: 6 }}>
                <Button variant="text" color="error" onClick={() => handleDialogDeleteWebsite()}>
                  <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.delete} />
                </Button>
                {/* <Link to={PATH_APP.profile.user.contactInfo.website.audience}> */}
                <Button
                  variant="outlined"
                  startIcon={<Icon name="Earth" size={18} color="text.primary" />}
                  endIcon={<Icon name="down-arrow" size={16} color="text.primary" />}
                  onClick={() => {
                    setOpenAudience(true);
                  }}
                >
                  <Typography color="text.primary">
                    {
                      Object.keys(AudienceEnum)[
                        Object.values(AudienceEnum).indexOf(userWebsite?.audience as AudienceEnum)
                      ]
                    }
                  </Typography>
                </Button>
                {/* </Link> */}
              </Stack>
            )}
          </Stack>
        </FormProvider>
      </Dialog>
      {openAudience && (
        <Audience
          open={openAudience}
          onClose={setOpenAudience}
          feature={FeatureAudienceEnum.UserWebSite}
          value={userWebsite?.audience as AudienceEnum}
          onChange={(val: any) => {
            dispatch(websiteAdded({ ...userWebsite, audience: val }));
          }}
        />
      )}
    </>
  );
}

export default UpsertWebsite;
