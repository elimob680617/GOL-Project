import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';

import { LoadingButton } from '@mui/lab';
import { Button, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { useUpsertWebsiteMutation } from 'src/_graphql/profile/contactInfo/mutations/upsertWebsite.generated';
import { Icon } from 'src/components/Icon';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { PATH_APP } from 'src/routes/paths';
import { dispatch, useSelector } from 'src/store';
import { userWebsiteSelector, websiteAdded } from 'src/store/slices/profile/userWebsite-slice';
import { PersonWebSiteType } from 'src/types/profile/userWebsite';
import { AudienceEnum } from 'src/types/serverTypes';

import ConfirmDeleteWebsite from './ConfirmDeleteWebsite';
import SelectAudienceWebsite from './SelectAudience';

function UpsertWebsite() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const userWebsite = useSelector(userWebsiteSelector);
  const [addPersonWebsite, { isLoading }] = useUpsertWebsiteMutation();
  const [deleteWebsite, setDeleteWebsite] = useState(false);
  const [selectAudience, setSelectAudience] = useState(false);

  useEffect(() => {
    if (!userWebsite) navigate(PATH_APP.profile.user.contactInfo.root);
  }, [userWebsite, navigate]);

  const WebsiteSchema = Yup.object().shape({
    webSiteUrl: Yup.string()
      .required('Please fill out this field.')
      .matches(
        /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
        'Please use a valid website url',
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

  const { handleSubmit, setValue, watch } = methods;

  const onSubmit = async (data: PersonWebSiteType) => {
    const resData: any = await addPersonWebsite({
      filter: {
        dto: {
          id: data.id,
          webSiteUrl: data.webSiteUrl,
          audience: data.audience,
        },
      },
    });

    if (resData.data.upsertWebSite?.isSuccess) {
      dispatch(
        websiteAdded({
          id: data.id,
          webSiteUrl: data.webSiteUrl,
          audience: data.audience,
        }),
      );
      navigate(PATH_APP.profile.user.contactInfo.root);
      enqueueSnackbar('The website has been successfully added', { variant: 'success' });
    }
  };

  const handleBackRoute = () => {
    dispatch(websiteAdded({ audience: AudienceEnum.Public }));
    navigate(PATH_APP.profile.user.contactInfo.root);
  };

  const changeAudienceHandler = async (value: AudienceEnum) => {
    setValue('audience', value, { shouldDirty: true });
    setSelectAudience(false);
    if (userWebsite?.id) {
      await addPersonWebsite({
        filter: {
          dto: {
            webSiteUrl: userWebsite.webSiteUrl,
            id: userWebsite.id,
            audience: value as AudienceEnum,
          },
        },
      });
      navigate(-1);
    }
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} sx={{ py: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
            <Stack spacing={2} direction="row" alignItems="center">
              <IconButton sx={{ p: 0 }} onClick={handleBackRoute}>
                <Icon name="left-arrow-1" color="text.primary" />
              </IconButton>
              <Typography variant="subtitle1" color="text.primary">
                {userWebsite?.id ? 'Edit Website' : 'Add Website'}
              </Typography>
            </Stack>
            {!userWebsite?.id ? (
              <LoadingButton type="submit" variant="contained" loading={isLoading}>
                Add
              </LoadingButton>
            ) : (
              <></>
            )}
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ justifyContent: 'space-between', px: 2 }}>
            <Typography variant="subtitle1">Website</Typography>
            {!userWebsite?.id ? (
              <RHFTextField autoComplete="WebSiteUrl" type="text" name="webSiteUrl" placeholder="Website" />
            ) : (
              <Stack spacing={2}>
                <Typography variant="body1">{userWebsite.webSiteUrl}</Typography>
              </Stack>
            )}
          </Stack>
          <Divider />
          {!userWebsite?.id ? (
            <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Icon name="Earth" size="18" color="text.primary" />}
                onClick={() => setSelectAudience(true)}
                endIcon={<Icon name="down-arrow" size="16" color="text.primary" />}
              >
                <Typography color={theme.palette.text.primary}>
                  {Object.keys(AudienceEnum)[Object.values(AudienceEnum).indexOf(watch('audience') as AudienceEnum)]}
                </Typography>
              </Button>
            </Stack>
          ) : (
            <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 3 }}>
              <Button variant="text" color="error" onClick={() => setDeleteWebsite(true)}>
                Delete
              </Button>

              <LoadingButton
                loading={!!userWebsite?.id && isLoading}
                variant="outlined"
                startIcon={<Icon name="Earth" size="18" color="text.primary" />}
                onClick={() => setSelectAudience(true)}
                endIcon={<Icon name="down-arrow" size="16" color="text.primary" />}
              >
                <Typography color={theme.palette.text.primary}>
                  {Object.keys(AudienceEnum)[Object.values(AudienceEnum).indexOf(watch('audience') as AudienceEnum)]}
                </Typography>
              </LoadingButton>
            </Stack>
          )}
        </Stack>
        <BottomSheet open={deleteWebsite} onDismiss={() => setDeleteWebsite(false)}>
          <ConfirmDeleteWebsite />
        </BottomSheet>
        <BottomSheet open={selectAudience} onDismiss={() => setSelectAudience(false)}>
          <SelectAudienceWebsite
            onChange={(value) => {
              changeAudienceHandler(value);
            }}
            audience={watch('audience') as AudienceEnum}
          />
        </BottomSheet>
      </FormProvider>
    </>
  );
}

export default UpsertWebsite;
