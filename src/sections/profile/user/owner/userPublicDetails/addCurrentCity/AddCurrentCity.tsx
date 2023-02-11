import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useUpsertLocationMutation } from 'src/_graphql/profile/publicDetails/mutations/addCurrentCity.generated';
import { Icon } from 'src/components/Icon';
import { Audience } from 'src/components/audience';
import { FormProvider } from 'src/components/hook-form';
import GeneralMessagess from 'src/language/general.messages';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { emptyLocation, userLocationSelector, userLocationUpdated } from 'src/store/slices/profile/userLocation-slice';
import { AudienceEnum, FeatureAudienceEnum, Location, LocationTypeEnum } from 'src/types/serverTypes';
import sleep from 'src/utils/sleep';

import NormalPublicDetailsMessages from '../NormalPublicDetails.messages';

function AddCurrentCity() {
  const dispatch = useDispatch();
  const userCity = useSelector(userLocationSelector);
  const [openAudience, setOpenAudience] = useState<boolean>(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();
  const isEdit = !!userCity?.id;
  const [upsertLocation, { isLoading }] = useUpsertLocationMutation();

  const onSubmit = async (data: Location) => {
    const result: any = await upsertLocation({
      filter: {
        dto: {
          audience: userCity?.audience || data.audience,
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
    getValues,
    handleSubmit,
    // eslint-disable-next-line no-empty-pattern
    formState: {},
  } = methods;

  const handelCloseDialog = async () => {
    if ((userCity?.city?.name && !getValues().id) || (userCity?.city?.name && userCity?.isChange)) {
      navigate(PATH_APP.profile.user.publicDetails.currentCity.discard);
    } else {
      navigate(PATH_APP.profile.user.publicDetails.root);
      await sleep(200);
      dispatch(emptyLocation());
    }
  };

  useEffect(() => {
    if (!userCity) navigate(PATH_APP.profile.user.publicDetails.root);
  }, [userCity, navigate]);

  return (
    <>
      <Dialog fullWidth={true} open={true && !openAudience} keepMounted onClose={() => handelCloseDialog()}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} sx={{ minWidth: 600, minHeight: 234, py: 3 }}>
            <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton sx={{ p: 0 }} onClick={handelCloseDialog}>
                  <Icon name="left-arrow-1" />
                </IconButton>
                <Typography variant="subtitle1" color="text.primary">
                  {isEdit ? (
                    <FormattedMessage {...NormalPublicDetailsMessages.editCurrentCity} />
                  ) : (
                    <FormattedMessage {...NormalPublicDetailsMessages.addCurrentCity} />
                  )}
                </Typography>
              </Box>

              <IconButton onClick={() => handelCloseDialog()}>
                <Icon name="Close-1" />
              </IconButton>
            </Stack>
            <Divider />
            <Stack spacing={2} sx={{ px: 2 }}>
              <Typography variant="subtitle1" color="text.primary">
                <FormattedMessage {...NormalPublicDetailsMessages.currentCity} />
              </Typography>

              <Link
                to={PATH_APP.profile.user.publicDetails.currentCity.currentCityName}
                style={{ textDecoration: 'none' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 2 }}>
                  {!!userCity?.city?.name && <Icon name="Company-Logo-Empty" color="text.primary" />}
                  <Typography
                    variant="body2"
                    color={userCity?.city?.name ? 'text.primary' : 'text.secondary'}
                    sx={{ cursor: 'pointer' }}
                  >
                    {userCity?.city?.name || formatMessage(NormalPublicDetailsMessages.currentCity)}
                  </Typography>
                </Box>
              </Link>
            </Stack>
            <Divider />

            <Stack direction="row" spacing={2} sx={{ px: 2, justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {isEdit && (
                  <Link to={PATH_APP.profile.user.publicDetails.currentCity.delete}>
                    <Button color="error">
                      <Typography variant="button">
                        <FormattedMessage {...GeneralMessagess.delete} />
                      </Typography>
                    </Button>
                  </Link>
                )}
                {/* <Link to={PATH_APP.profile.user.publicDetails.currentCity.audience} style={{ textDecoration: 'none' }}> */}
                <Button
                  variant="outlined"
                  startIcon={<Icon name="Earth" color="text.primary" />}
                  endIcon={<Icon name="down-arrow" color="text.primary" />}
                  onClick={() => {
                    setOpenAudience(true);
                  }}
                >
                  <Typography color="text.primary">
                    {Object.keys(AudienceEnum)[Object.values(AudienceEnum).indexOf(userCity?.audience as AudienceEnum)]}
                  </Typography>
                </Button>
                {/* </Link> */}
              </Box>
              <Box>
                <LoadingButton
                  loading={isLoading}
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={!userCity?.city?.name || !userCity?.isChange}
                >
                  {isEdit ? formatMessage(GeneralMessagess.save) : formatMessage(GeneralMessagess.add)}
                </LoadingButton>
              </Box>
            </Stack>
          </Stack>
        </FormProvider>
      </Dialog>
      {openAudience && (
        <Audience
          open={openAudience}
          onClose={setOpenAudience}
          feature={FeatureAudienceEnum.Location}
          value={userCity?.audience as AudienceEnum}
          onChange={(val: any) => {
            dispatch(userLocationUpdated({ audience: val, isChange: true }));
          }}
        />
      )}
    </>
  );
}

export default AddCurrentCity;
