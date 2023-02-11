import React, { useEffect, useLayoutEffect, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { useLazySearchCitiesQuery } from 'src/_graphql/locality/queries/searchCities.generated';
import { useLazySearchPlacesQuery } from 'src/_graphql/locality/queries/searchPlaces.generated';
import { useUpdateOrganizationUserField2Mutation } from 'src/_graphql/profile/ngoPublicDetails/mutations/updateOrgUser.generated';
import { useUpsertLocationMutation } from 'src/_graphql/profile/publicDetails/mutations/addCurrentCity.generated';
import { Icon } from 'src/components/Icon';
import useAuth from 'src/hooks/useAuth';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { registerLocationSelector, registerLocationUpdated } from 'src/store/slices/afterRegistration';
import { LocationTypeEnum, OrgUserFieldEnum, RestrictionTypeEnum, UserTypeEnum } from 'src/types/serverTypes';
import debounceFn from 'src/utils/debounce';

import AfterRegistrationMessages from '../afterRegistration.messages';
import DialogIconButtons from './DialogIconButtons';
import TitleAndProgress from './TitleAndProgress';

export default function SelectLocation() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const locationSelector = useSelector(registerLocationSelector);

  const [step, setStep] = React.useState<number>();
  const [showDialog, setShowDialog] = React.useState<boolean>(true);
  const [searchPlaces, { data: placesData, isFetching: placesIsFetching }] = useLazySearchPlacesQuery();
  const [searchCities, { data, isFetching }] = useLazySearchCitiesQuery();
  const [upsertLocation, { isLoading }] = useUpsertLocationMutation();
  const [upsertPlaceNgoUser, { isLoading: isPlaceLoading }] = useUpdateOrganizationUserField2Mutation();

  useLayoutEffect(() => {
    if (pathname === 'location' && user?.completeQar) {
      setShowDialog(false);
      navigate(PATH_APP.home.index);
    }
  }, [navigate, pathname, user?.completeQar]);

  const cityOptions = useMemo(
    () => data?.searchCities?.listDto?.items?.map((item) => ({ id: item?.id, title: item?.name })),
    [data?.searchCities.listDto?.items],
  );
  const placeOptions = useMemo(
    () =>
      placesData?.searchPlaces?.listDto?.items?.[0]?.predictions?.map((item) => ({
        id: item?.placeId,
        title: item?.description,
      })),
    [placesData?.searchPlaces?.listDto?.items],
  );

  useEffect(() => {
    if (user?.userType === UserTypeEnum.Normal) {
      setStep(2);
    } else if (user?.userType === UserTypeEnum.Ngo) {
      setStep(1);
    }
  }, [navigate, user?.userType]);

  const handleInputChange = (value: string) => {
    if (value.length > 2)
      if (user?.userType === UserTypeEnum.Normal) {
        debounceFn(() =>
          searchCities({
            filter: {
              dto: {
                seearchValue: value,
              },
            },
          }),
        );
      } else if (user?.userType === UserTypeEnum.Ngo) {
        debounceFn(() =>
          searchPlaces({
            filter: {
              dto: {
                searchText: value,
                restrictionType: RestrictionTypeEnum.None,
              },
            },
          }),
        );
      }
  };

  const handleChange = (value: { id: any; title: any }) => {
    dispatch(registerLocationUpdated({ id: value?.id, title: value?.title }));
  };

  const handleSubmitLocation = async () => {
    if (user?.userType === UserTypeEnum.Normal) {
      const res: any = await upsertLocation({
        filter: {
          dto: {
            locationType: LocationTypeEnum.CurrnetCity,
            cityId: locationSelector?.id,
            id: locationSelector?.id,
          },
        },
      });
      if (res?.data?.upsertLocation?.isSuccess) {
        handleRouting();
        // dispatch(registerLocationUpdated(undefined));
      }
    } else if (user?.userType === UserTypeEnum.Ngo) {
      const response: any = await upsertPlaceNgoUser({
        filter: {
          dto: {
            field: OrgUserFieldEnum.Place,
            googlePlaceId: locationSelector?.id,
          },
        },
      });
      if (response?.data?.updateOrganizationUserField?.isSuccess) {
        handleRouting();
        // dispatch(registerLocationUpdated(undefined));
      }
    }
  };

  const handleRouting = () => {
    if (user?.userType === UserTypeEnum.Normal) {
      navigate(PATH_APP.home.afterRegister.category);
    } else if (user?.userType === UserTypeEnum.Ngo) {
      navigate(PATH_APP.home.afterRegister.field);
    }
  };

  return (
    <Dialog fullWidth={true} open={showDialog}>
      <DialogTitle>
        <DialogIconButtons router={navigate} user={user} hasBackIcon />
        <Stack alignItems="center" mt={-5}>
          <TitleAndProgress step={step as number} userType={user?.userType as UserTypeEnum} />
        </Stack>
        <Stack alignItems="center" justifyContent="center" mb={3}>
          <Typography variant="h6" color="text.primary">
            <FormattedMessage {...AfterRegistrationMessages.locationQuestion} />
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack alignItems="center" justifyContent="center" mb={3}>
          <Box sx={{ width: 388, height: 48 }}>
            <Autocomplete
              fullWidth
              autoComplete
              value={locationSelector as any}
              disableClearable
              freeSolo
              loading={isFetching || placesIsFetching}
              options={cityOptions || placeOptions || []}
              getOptionLabel={(option) => option?.title as string}
              onInputChange={(event, value) => {
                handleInputChange(value);
              }}
              onChange={(ev, val) => handleChange(val)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px !important' } }}
                  placeholder={formatMessage(AfterRegistrationMessages.searchLocationPlaceholder)}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <Box sx={{ marginRight: 2, marginLeft: 3 }}>
                          <Icon name="Research" type="solid" color="grey.500" />
                          {params.InputProps.startAdornment}
                        </Box>
                      </>
                    ),
                  }}
                />
              )}
            />
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={2} justifyContent="flex-end" mx={3}>
          <Button variant="outlined" sx={{ borderColor: 'grey.300' }} onClick={handleRouting}>
            <Typography color="grey.900">
              <FormattedMessage {...AfterRegistrationMessages.skipButton} />
            </Typography>
          </Button>

          <LoadingButton
            loading={isLoading || isPlaceLoading}
            variant="contained"
            color="primary"
            endIcon={<Icon name="right-arrow-1" color="common.white" />}
            disabled={!locationSelector?.id}
            onClick={handleSubmitLocation}
          >
            <Typography>
              <FormattedMessage {...AfterRegistrationMessages.nextButton} />
            </Typography>
          </LoadingButton>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
