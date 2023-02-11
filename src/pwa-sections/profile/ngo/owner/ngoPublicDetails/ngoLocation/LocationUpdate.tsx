import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';

import { LoadingButton } from '@mui/lab';
import { Box, Button, Divider, IconButton, Stack, Typography } from '@mui/material';

import GoogleMapReact from 'google-map-react';
import { useSnackbar } from 'notistack';
import { useLazyGeocodeQuery } from 'src/_graphql/locality/queries/geocode.generated';
import { useUpdateOrganizationUserField2Mutation } from 'src/_graphql/profile/ngoPublicDetails/mutations/updateOrgUser.generated';
import { Icon } from 'src/components/Icon';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import GeneralMessagess from 'src/language/general.messages';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { ngoPlaceSelector, ngoPlaceUpdated, ngoPlaceWasEmpty } from 'src/store/slices/profile/ngoPublicDetails-slice';
import { PlacePayloadType } from 'src/types/profile/ngoPublicDetails';
import { AudienceEnum, OrgUserFieldEnum } from 'src/types/serverTypes';

import NgoPublicDetailsMessages from '../NgoPublicDetailsPwa.messages';
import LocationDelete from './LocationDelete';
import LocationDiscard from './LocationDiscard';
import SelectAudienceLocation from './SelectAudienceLocation';

const Marker = ({ text }: { lat?: number; lng?: number; text: JSX.Element }) => <Typography>{text}</Typography>;

export default function LocationUpdate() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [deleteLocation, setDeleteLocation] = useState(false);
  const [selectAudience, setSelectAudience] = useState(false);
  const [discard, setDiscard] = useState(false);
  const { formatMessage } = useIntl();

  const dispatch = useDispatch();
  const ngoPlace = useSelector(ngoPlaceSelector);
  // const id = navigate?.query?.id?.[0];
  const { id } = useParams();
  const isEdit = !!id;

  const [getGeocode, { data: location }] = useLazyGeocodeQuery();
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

  const [upsertPlaceNgoUser, { isLoading }] = useUpdateOrganizationUserField2Mutation();

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
          lat: ngoPlace?.lat,
          lng: ngoPlace?.lng,
        },
      },
    });
    if (response?.data?.updateOrganizationUserField?.isSuccess) {
      enqueueSnackbar('The Location has been successfully updated ', { variant: 'success' });
      dispatch(ngoPlaceWasEmpty());
      navigate(PATH_APP.profile.ngo.publicDetails.main);
    } else {
      enqueueSnackbar('The Location unfortunately not updated', { variant: 'error' });
    }
  };

  useEffect(() => {
    if (!ngoPlace) navigate(PATH_APP.profile.ngo.publicDetails.main);
  }, [ngoPlace, navigate]);

  const handleDiscardDialog = () => {
    if (isDirty || ngoPlace?.isChange) {
      dispatch(ngoPlaceUpdated({ ...ngoPlace, lat: defaultProps.center.lat, lng: defaultProps.center.lng }));
      setDiscard(true);
    } else {
      navigate(PATH_APP.profile.ngo.publicDetails.main);
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
    formState: { isValid, isDirty },
  } = methods;

  const handleUpdateAudience = () => {
    dispatch(ngoPlaceUpdated(getValues()));
    setSelectAudience(true);
  };

  const handleCurrentLatLng = (e: GoogleMapReact.ClickEventValue) => {
    // setClick(true);
    dispatch(
      ngoPlaceUpdated({
        ...ngoPlace,
        lat: e.lat,
        lng: e.lng,
        isChange: true,
      }),
    );
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} sx={{ py: 3 }}>
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
                >
                  {watch('address') || formatMessage(NgoPublicDetailsMessages.addressDetailsPlaceholder)}
                  {watch('address') && (
                    <IconButton
                      onClick={() => {
                        setValue('address', '', { shouldDirty: true });
                        dispatch(ngoPlaceUpdated({ ...getValues() }));
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
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                />
              </Box>
            )}
          </Box>
        </Stack>

        {location?.geocode?.listDto?.items?.[0] && watch('mapView') && (
          <>
            <Divider />
            <Stack py={1} px={2} sx={{ direction: 'rtl' }}>
              <Box pb={1.2}>
                <IconButton
                  sx={{ p: 0 }}
                  onClick={() => {
                    setValue('mapView', false);
                  }}
                >
                  <Icon name="Close-1" color="grey.500" />
                </IconButton>
              </Box>
              <Box style={{ height: 230 }}>
                <GoogleMapReact
                  bootstrapURLKeys={{ key: 'AIzaSyAeD8NNyr1bEJpjKnSHnKJQfj5j8Il7ct8' }}
                  defaultCenter={defaultProps.center}
                  defaultZoom={defaultProps.zoom}
                  onClick={(e) => handleCurrentLatLng(e)}
                >
                  <Marker
                    lat={ngoPlace?.lat}
                    lng={ngoPlace?.lng}
                    text={<Icon name="location" type="solid" color="error.main" />}
                  />
                </GoogleMapReact>
              </Box>
            </Stack>
          </>
        )}

        <Divider />
        {!isEdit ? (
          <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
            <Box />
            <Button
              variant="outlined"
              startIcon={<Icon name="Earth" />}
              endIcon={<Icon name="down-arrow" color="grey.500" />}
              onClick={() => setSelectAudience(true)}
            >
              <Typography color="text.primary">
                {Object.keys(AudienceEnum)[Object.values(AudienceEnum).indexOf(watch('placeAudience') as AudienceEnum)]}
              </Typography>
            </Button>
          </Stack>
        ) : (
          <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 3 }}>
            <Button color="error" onClick={() => setDeleteLocation(true)}>
              <Typography variant="button">Delete</Typography>
            </Button>
            <Button
              variant="outlined"
              startIcon={<Icon name="Earth" />}
              endIcon={<Icon name="down-arrow" color="grey.500" />}
              onClick={handleUpdateAudience}
            >
              <Typography color="text.primary">
                {Object.keys(AudienceEnum)[Object.values(AudienceEnum).indexOf(watch('placeAudience') as AudienceEnum)]}
              </Typography>
            </Button>
          </Stack>
        )}
      </Stack>

      <BottomSheet open={deleteLocation} onDismiss={() => setDeleteLocation(false)}>
        <LocationDelete />
      </BottomSheet>
      <BottomSheet open={selectAudience} onDismiss={() => setSelectAudience(false)}>
        <SelectAudienceLocation
          onChange={(value) => {
            setValue('placeAudience', value, { shouldDirty: true });
            setSelectAudience(false);
          }}
          audience={watch('placeAudience')}
        />
      </BottomSheet>
      <BottomSheet open={discard} onDismiss={() => setDiscard(false)}>
        <LocationDiscard
          onSubmit={() => {
            if (isValid) {
              onSubmit(getValues());
            }
            setDiscard(false);
          }}
          isValid={isValid}
        />
      </BottomSheet>
    </FormProvider>
  );
}
