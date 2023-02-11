import { useEffect, useLayoutEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Button, CircularProgress, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

// import GoogleMapReact from 'google-map-react';
import { useSnackbar } from 'notistack';
import { useLazyGeocodeQuery } from 'src/_graphql/locality/queries/geocode.generated';
import { useUpdateOrganizationUserField2Mutation } from 'src/_graphql/profile/ngoPublicDetails/mutations/updateOrgUser.generated';
import { Icon } from 'src/components/Icon';
import { Audience } from 'src/components/audience';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import GeneralMessagess from 'src/language/general.messages';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { ngoPlaceSelector, ngoPlaceUpdated, ngoPlaceWasEmpty } from 'src/store/slices/profile/ngoPublicDetails-slice';
import { PlacePayloadType } from 'src/types/profile/ngoPublicDetails';
import { AudienceEnum, FeatureAudienceEnum, OrgUserFieldEnum } from 'src/types/serverTypes';
import sleep from 'src/utils/sleep';

import NgoPublicDetailsMessages from '../NgoPublicDetails.messages';

// const Marker = ({ text }: { lat?: number; lng?: number; text: JSX.Element }) => <Box>{text}</Box>;

export default function LocationUpdateDialog() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const ngoPlace = useSelector(ngoPlaceSelector);
  const [getGeocode, { data: location, isFetching }] = useLazyGeocodeQuery();
  const [upsertPlaceNgoUser, { isLoading }] = useUpdateOrganizationUserField2Mutation();
  const isEdit = pathname === '/profile/ngo/public-details-edit-place';
  const [openAudience, setOpenAudience] = useState<boolean>(false);

  useLayoutEffect(() => {
    if (!ngoPlace) navigate(PATH_APP.profile.ngo.publicDetails.main);
  }, [ngoPlace, navigate]);

  useEffect(() => {
    if (!!ngoPlace?.placeId)
      getGeocode({
        filter: {
          dto: {
            placeId: ngoPlace?.placeId,
          },
        },
      });
  }, [getGeocode, ngoPlace?.placeId]);

  const defaultProps = {
    center: {
      lat: !!ngoPlace?.lat ? ngoPlace?.lat : location?.geocode?.listDto?.items?.[0]?.lat,
      lng: !!ngoPlace?.lng ? ngoPlace?.lng : location?.geocode?.listDto?.items?.[0]?.lng,
    },
    zoom: 13,
  };

  const handleNavigation = (url: string) => {
    dispatch(ngoPlaceUpdated({ ...getValues() }));
    navigate(url);
  };

  const onSubmit = async (data: PlacePayloadType) => {
    const response: any = await upsertPlaceNgoUser({
      filter: {
        dto: {
          field: OrgUserFieldEnum.Place,
          placeAudience: data.placeAudience,
          googlePlaceId: data.placeId,
          address: data.address,
          lat: defaultProps.center.lat,
          lng: defaultProps.center.lng,
        },
      },
    });
    if (response?.data?.updateOrganizationUserField?.isSuccess) {
      enqueueSnackbar('The Location has been successfully updated ', { variant: 'success' });
      navigate(PATH_APP.profile.ngo.publicDetails.main);
      await sleep(1500);
      dispatch(ngoPlaceWasEmpty());
    } else {
      enqueueSnackbar('The Location unfortunately not updated', { variant: 'error' });
    }
  };

  const handleDiscardDialog = async () => {
    if (isDirty || ngoPlace?.isChange) {
      dispatch(
        ngoPlaceUpdated({
          ...ngoPlace,
          lat: defaultProps.center.lat,
          lng: defaultProps.center.lng,
        }),
      );
      navigate(PATH_APP.profile.ngo.publicDetails.ngoPlace.discardPlace);
    } else {
      navigate(PATH_APP.profile.ngo.publicDetails.main);
      await sleep(2000);
      dispatch(ngoPlaceWasEmpty());
    }
  };

  const methods = useForm<PlacePayloadType & { addressView?: boolean; mapView?: boolean }>({
    mode: 'onChange',
    defaultValues: {
      ...ngoPlace,
      addressView: true,
      mapView: true,
    },
  });

  const {
    getValues,
    setValue,
    watch,
    handleSubmit,
    formState: { isDirty },
  } = methods;

  // const handleCurrentLatLng = (e: { lat: any; lng: any }) => {
  //   dispatch(
  //     ngoPlaceUpdated({
  //       ...ngoPlace,
  //       lat: e.lat,
  //       lng: e.lng,
  //       isChange: true,
  //     }),
  //   );
  // };

  return (
    <>
      <Dialog fullWidth={true} open={true && !openAudience} keepMounted onClose={handleDiscardDialog}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} sx={{ py: 3, minHeight: 320, minWidth: 600 }}>
            <Stack direction="row" spacing={2} px={2} justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={2}>
                <IconButton sx={{ p: 0 }} onClick={handleDiscardDialog}>
                  <Icon name="left-arrow-1" />
                </IconButton>
                <Typography variant="subtitle1" color="text.primary">
                  {isEdit
                    ? formatMessage(NgoPublicDetailsMessages.editNgoplace)
                    : formatMessage(NgoPublicDetailsMessages.addNgoplace)}
                </Typography>
              </Stack>
              <IconButton sx={{ p: 0 }} onClick={handleDiscardDialog}>
                <Icon name="Close-1" />
              </IconButton>
            </Stack>

            <Divider />
            <Stack spacing={2} sx={{ px: 2 }}>
              <Typography variant="subtitle1" color="text.primary">
                <FormattedMessage {...NgoPublicDetailsMessages.ngoplaceTitle} />
              </Typography>
              <Box onClick={() => handleNavigation(PATH_APP.profile.ngo.publicDetails.ngoPlace.LocatedIn)}>
                <Typography variant="subtitle1" color="text.secondary" sx={{ cursor: 'pointer' }}>
                  {watch('description') ? (
                    <Typography variant="body2" color="text.primary">
                      {watch('description')}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      <FormattedMessage {...NgoPublicDetailsMessages.Location} />
                    </Typography>
                  )}
                </Typography>
              </Box>
            </Stack>

            <Divider />
            <Stack spacing={2} sx={{ px: 2 }}>
              <Box>
                <Typography variant="subtitle1" color="text.primary" mb={2}>
                  <FormattedMessage {...NgoPublicDetailsMessages.addressDetailsPlaceholder} />
                </Typography>

                {watch('addressView') ? (
                  <>
                    <Typography
                      variant="body2"
                      color={watch('address') ? 'text.primary' : 'text.secondary'}
                      onClick={() => setValue('addressView', false)}
                      sx={{ cursor: watch('address') ? 'default' : 'pointer' }}
                    >
                      {watch('address') || formatMessage(NgoPublicDetailsMessages.publicDetailsTitle)}
                      {watch('address') && (
                        <IconButton
                          onClick={() => {
                            setValue('address', '', { shouldDirty: true });
                            dispatch(ngoPlaceUpdated({ ...getValues(), isChange: true }));
                          }}
                          sx={{ ml: 1 }}
                        >
                          &#215;
                        </IconButton>
                      )}
                    </Typography>
                  </>
                ) : (
                  <Box>
                    <RHFTextField
                      placeholder={formatMessage(NgoPublicDetailsMessages.addressDetailsPlaceholder)}
                      name="address"
                      size="small"
                      error={false}
                      inputProps={{ maxLength: 60 }}
                      onBlur={() => setValue('addressView', true)}
                      autoFocus
                    />
                  </Box>
                )}
              </Box>
            </Stack>
            {isFetching ? (
              <>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 2 }}>
                  <CircularProgress />
                </Box>
              </>
            ) : (
              location?.geocode?.listDto?.items?.[0] &&
              watch('mapView') && (
                <>
                  <Divider />
                  <Stack py={1} px={2}>
                    <Box>
                      <IconButton
                        sx={{ p: 0, position: 'relative', left: 536 }}
                        onClick={() => {
                          setValue('mapView', false);
                        }}
                      >
                        <Icon name="Close" />
                      </IconButton>
                    </Box>
                    <Box sx={{ height: 230, width: 552, '& div:nth-child(1)': { borderRadius: 1 } }} ml={1} pt={1}>
                      {/* <GoogleMapReact
                      bootstrapURLKeys={{ key: 'AIzaSyAeD8NNyr1bEJpjKnSHnKJQfj5j8Il7ct8' }}
                      defaultCenter={defaultProps.center}
                      defaultZoom={defaultProps.zoom}
                      yesIWantToUseGoogleMapApiInternals
                      onClick={(e: { lat: any; lng: any }) => handleCurrentLatLng(e)}
                    >
                      <Marker
                        lat={ngoPlace?.lat}
                        lng={ngoPlace?.lng}
                        text={<Icon name="location" type="solid" color="error.main" />}
                      />
                    </GoogleMapReact> */}
                    </Box>
                  </Stack>
                </>
              )
            )}

            <Divider />
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2 }}>
              <Stack direction="row" spacing={1}>
                {isEdit && (
                  <Button
                    variant="text"
                    color="error"
                    onClick={() => navigate(PATH_APP.profile.ngo.publicDetails.ngoPlace.deletePlace)}
                  >
                    <Typography variant="button">
                      <FormattedMessage {...GeneralMessagess.delete} />
                    </Typography>
                  </Button>
                )}
                <Button
                  variant="outlined"
                  onClick={() => setOpenAudience(true)}
                  startIcon={<Icon name="Earth" />}
                  endIcon={<Icon name="down-arrow" />}
                >
                  <Typography color="text.primary">
                    {
                      Object.keys(AudienceEnum)[
                        Object.values(AudienceEnum).indexOf(ngoPlace?.placeAudience as AudienceEnum)
                      ]
                    }
                  </Typography>
                </Button>
              </Stack>
              <LoadingButton
                loading={isLoading}
                variant="contained"
                color="primary"
                disabled={!(isDirty || ngoPlace?.isChange) || !ngoPlace?.description}
                type="submit"
              >
                {isEdit ? formatMessage(GeneralMessagess.save) : formatMessage(GeneralMessagess.add)}
              </LoadingButton>
            </Stack>
          </Stack>
        </FormProvider>
      </Dialog>
      {openAudience && (
        <Audience
          feature={FeatureAudienceEnum.Location}
          value={ngoPlace?.placeAudience as AudienceEnum}
          onClose={setOpenAudience}
          open={openAudience}
          onChange={(val: any) => {
            dispatch(
              ngoPlaceUpdated({
                ...ngoPlace,
                placeId: ngoPlace?.placeId,
                placeAudience: val,
                isChange: true,
              }),
            );
          }}
        />
      )}
    </>
  );
}
