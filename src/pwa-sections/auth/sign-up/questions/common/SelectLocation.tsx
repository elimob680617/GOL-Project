import React, { useEffect, useLayoutEffect, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

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
import { LocationTypeEnum, OrgUserFieldEnum, RestrictionTypeEnum, UserTypeEnum } from 'src/types/serverTypes';
import debounceFn from 'src/utils/debounce';

import AfterRegistrationPwaMessages from '../afterRegistrationPwa.messages';
import DialogIconButtons from './DialogIconButtons';
import TitleAndProgress from './TitleAndProgress';

interface SelectLocationProps {
  authType?: UserTypeEnum;
  openLocationDialog?: boolean;
  setOpenLocationDialog?: React.Dispatch<
    React.SetStateAction<{
      welcome: boolean;
      gender: boolean;
      location: boolean;
      categories: boolean;
      workFields: boolean;
      joinReasons: boolean;
      suggestConnection: boolean;
      endQ: boolean;
    }>
  >;
}

export default function SelectLocation(props: SelectLocationProps) {
  const { authType, openLocationDialog, setOpenLocationDialog } = props;
  const { user } = useAuth();
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const [step, setStep] = React.useState<number>();
  const [city, setCity] = React.useState<{ id?: string; title?: string }>();

  const [searchPlaces, { data: placesData, isFetching: placesIsFetching }] = useLazySearchPlacesQuery();
  const [searchCities, { data, isFetching }] = useLazySearchCitiesQuery();
  const [upsertLocation, { isLoading }] = useUpsertLocationMutation();
  const [upsertPlaceNgoUser, { isLoading: isPlaceLoading }] = useUpdateOrganizationUserField2Mutation();

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

  useLayoutEffect(() => {
    if (localStorage.getItem('stepTitle') === 'location') {
      setOpenLocationDialog!((prev) => ({ ...prev, location: true }));
    }
  }, [setOpenLocationDialog]);

  useEffect(() => {
    if (authType === UserTypeEnum.Normal) {
      setStep(2);
    } else if (authType === UserTypeEnum.Ngo) {
      setStep(1);
    }
  }, [authType]);

  const handleInputChange = (value: string) => {
    if (value.length > 2)
      if (authType === UserTypeEnum.Normal) {
        debounceFn(() =>
          searchCities({
            filter: {
              dto: {
                seearchValue: value,
              },
            },
          }),
        );
      } else if (authType === UserTypeEnum.Ngo) {
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

  const handleChange = (value: { id: string; title: string }) => {
    setCity({
      id: value?.id,
      title: value?.title,
    });
  };

  const handleSubmitLocation = async () => {
    if (authType === UserTypeEnum.Normal) {
      const res: any = await upsertLocation({
        filter: {
          dto: {
            locationType: LocationTypeEnum.CurrnetCity,
            cityId: city?.id,
            id: city?.id,
          },
        },
      });
      if (res?.data?.upsertLocation?.isSuccess) {
        handleRouting();
      }
    } else if (authType === UserTypeEnum.Ngo) {
      const response: any = await upsertPlaceNgoUser({
        filter: {
          dto: {
            field: OrgUserFieldEnum.Place,
            googlePlaceId: city?.id,
          },
        },
      });
      if (response?.data?.updateOrganizationUserField?.isSuccess) {
        handleRouting();
      }
    }
  };

  const handleRouting = () => {
    if (authType === UserTypeEnum.Normal) {
      setOpenLocationDialog!((prev) => ({ ...prev, location: false, categories: true }));
      localStorage.setItem('stepTitle', 'categories');
    } else if (authType === UserTypeEnum.Ngo) {
      setOpenLocationDialog!((prev) => ({ ...prev, location: false, workFields: true }));
      localStorage.setItem('stepTitle', 'workFields');
    }
  };

  return (
    <>
      <Dialog fullWidth={true} open={openLocationDialog as boolean}>
        <DialogTitle>
          <DialogIconButtons router={navigate} user={user} setOpenStatusDialog={setOpenLocationDialog} hasBackIcon />
          <Stack alignItems="center" mb={4}>
            <TitleAndProgress step={step} userType={authType} />
          </Stack>
          <Stack alignItems="center" justifyContent="center" mb={2}>
            <Typography variant="h6" color="text.primary">
              <FormattedMessage {...AfterRegistrationPwaMessages.locationQuestion} />
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack alignItems="center" justifyContent="center" sx={{ minWidth: 296 }} mx={-1}>
            <Box sx={{ width: '100%', height: 48 }} mb={22}>
              <Autocomplete
                fullWidth
                autoComplete
                value={city as any}
                freeSolo
                disableClearable
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
                    placeholder={formatMessage(AfterRegistrationPwaMessages.searchLocationPlaceholder)}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <Box
                            component="img"
                            src={'/icons/Research-2.png'}
                            sx={{ width: 24, height: 24, mr: 2, ml: 3 }}
                          />
                          {params.InputProps.startAdornment}
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
          <Stack direction="row" spacing={2} justifyContent="flex-end" mx={-1}>
            <Button variant="outlined" sx={{ borderColor: 'grey.300' }} onClick={handleRouting}>
              <Typography color="grey.900">
                <FormattedMessage {...AfterRegistrationPwaMessages.skipButton} />
              </Typography>
            </Button>
            <LoadingButton
              loading={isLoading || isPlaceLoading}
              variant="contained"
              color="primary"
              endIcon={<Icon name="right-arrow-1" color="common.white" />}
              disabled={!city?.id}
              onClick={handleSubmitLocation}
            >
              <Typography>
                <FormattedMessage {...AfterRegistrationPwaMessages.nextButton} />
              </Typography>
            </LoadingButton>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
}
