import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';

import { LoadingButton } from '@mui/lab';
import { Box, Button, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';

import { ArrowDown2, Eye } from 'iconsax-react';
import { useSnackbar } from 'notistack';
import { useUpsertLocationMutation } from 'src/_graphql/profile/publicDetails/mutations/addCurrentCity.generated';
import { Icon } from 'src/components/Icon';
import { FormProvider } from 'src/components/hook-form';
import GeneralMessagess from 'src/language/general.messages';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { emptyLocation, userLocationSelector } from 'src/store/slices/profile/userLocation-slice';
import { AudienceEnum, Location, LocationTypeEnum } from 'src/types/serverTypes';
import sleep from 'src/utils/sleep';

import NormalPublicDetailsMessages from '../NormalPublicDetailsPwa.messages';
import CloseCurrentCity from './CloseCurrentCity';
import ConfirmDeleteCurrentCity from './ConfirmDeleteCurrentCity';
import CurrentCity from './CurrentCity';
import SelectAudienceCurrentCity from './SelectAudienceCurrentCity';

function UpsertCurrentCity() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [deleteCurrentCity, setDeleteCurrentCity] = useState(false);
  const [currentCity, setCurrentCity] = useState(false);
  const [selectAudience, setSelectAudience] = useState(false);
  const [discard, setDiscard] = useState(false);
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();

  const userCity = useSelector(userLocationSelector);

  const { enqueueSnackbar } = useSnackbar();
  const isEdit = !!userCity?.id;

  const [upsertLocation, { isLoading }] = useUpsertLocationMutation();

  const onSubmit = async (data: Location) => {
    const result: any = await upsertLocation({
      filter: {
        dto: {
          audience: data.audience,
          cityId: data.city?.id,
          id: data.id,
          locationType: LocationTypeEnum.CurrnetCity,
        },
      },
    });

    if (result?.data?.upsertLocation?.isSuccess) {
      enqueueSnackbar(
        isEdit
          ? formatMessage(NormalPublicDetailsMessages.currentCityEditedAlertMessage)
          : formatMessage(NormalPublicDetailsMessages.currentCityAddedAlertMessage),
        { variant: 'success' },
      );
      navigate(-1);
      dispatch(emptyLocation());
    }
  };

  const defaultValues = {
    id: userCity?.id,
    audience: userCity?.audience,
    city: userCity?.city,
  };

  const methods = useForm<Location>({
    defaultValues,
    mode: 'onChange',
  });

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isDirty },
  } = methods;

  useEffect(() => {
    if (!userCity) navigate(PATH_APP.profile.user.publicDetails.root);
  }, [userCity, navigate]);

  const handelCloseDialog = async () => {
    if (isDirty) {
      setDiscard(true);
    } else {
      navigate(PATH_APP.profile.user.publicDetails.root);
      await sleep(200);
      dispatch(emptyLocation());
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} sx={{ py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={handelCloseDialog}>
              <Icon name="left-arrow-1" color="text.primary" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              {isEdit ? (
                <FormattedMessage {...NormalPublicDetailsMessages.editCurrentCity} />
              ) : (
                <FormattedMessage {...NormalPublicDetailsMessages.addCurrentCity} />
              )}
            </Typography>
          </Box>
          <Box>
            <LoadingButton loading={isLoading} type="submit" color="primary" variant="contained" disabled={!isDirty}>
              {isEdit ? formatMessage(GeneralMessagess.save) : formatMessage(GeneralMessagess.add)}
            </LoadingButton>
          </Box>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            <FormattedMessage {...NormalPublicDetailsMessages.currentCity} />
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 2 }}>
            <Icon name="Company-Logo-Empty" />
            <Typography
              variant="body2"
              color={userCity?.city?.name ? 'text.primary' : 'text.secondary'}
              sx={{ cursor: 'pointer' }}
              onClick={() => setCurrentCity(true)}
            >
              {watch('city') ? watch('city.name') : formatMessage(NormalPublicDetailsMessages.currentCity)}
            </Typography>
          </Box>
        </Stack>
        <Divider />
        {!isEdit ? (
          <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
            <Box />
            <Button
              variant="outlined"
              startIcon={<Eye size="18" color={theme.palette.text.primary} />}
              endIcon={<ArrowDown2 size="16" color={theme.palette.text.primary} />}
              onClick={() => setSelectAudience(true)}
            >
              <Typography color={theme.palette.text.primary}>
                {Object.keys(AudienceEnum)[Object.values(AudienceEnum).indexOf(watch('audience') as AudienceEnum)]}
              </Typography>
            </Button>
          </Stack>
        ) : (
          <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 3 }}>
            <Button color="error" onClick={() => setDeleteCurrentCity(true)}>
              <Typography variant="button">
                <FormattedMessage {...GeneralMessagess.delete} />
              </Typography>
            </Button>
            <Button
              variant="outlined"
              startIcon={<Eye size="18" color={theme.palette.text.primary} />}
              endIcon={<ArrowDown2 size="16" color={theme.palette.text.primary} />}
              onClick={() => setSelectAudience(true)}
            >
              <Typography color={theme.palette.text.primary}>
                {Object.keys(AudienceEnum)[Object.values(AudienceEnum).indexOf(watch('audience') as AudienceEnum)]}
              </Typography>
            </Button>
          </Stack>
        )}
      </Stack>
      <BottomSheet open={deleteCurrentCity} onDismiss={() => setDeleteCurrentCity(false)}>
        <ConfirmDeleteCurrentCity />
      </BottomSheet>
      <BottomSheet
        open={currentCity}
        onDismiss={() => setCurrentCity(false)}
        snapPoints={({ maxHeight }) => maxHeight / 1.8}
      >
        <CurrentCity
          onChange={(value) => {
            setValue('city', value, { shouldDirty: true });
            setCurrentCity(false);
          }}
        />
      </BottomSheet>
      <BottomSheet open={selectAudience} onDismiss={() => setSelectAudience(false)}>
        <SelectAudienceCurrentCity
          onChange={(value) => {
            setValue('audience', value, { shouldDirty: true });
            setSelectAudience(false);
          }}
          audience={watch('audience') as AudienceEnum}
        />
      </BottomSheet>
      <BottomSheet open={discard} onDismiss={() => setDiscard(false)}>
        <CloseCurrentCity />
      </BottomSheet>
    </FormProvider>
  );
}

export default UpsertCurrentCity;
