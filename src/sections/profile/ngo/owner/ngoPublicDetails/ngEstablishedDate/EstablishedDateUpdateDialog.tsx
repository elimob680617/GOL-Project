import { useLayoutEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useUpdateOrganizationUserField2Mutation } from 'src/_graphql/profile/ngoPublicDetails/mutations/updateOrgUser.generated';
import { Icon } from 'src/components/Icon';
import { Audience } from 'src/components/audience';
import { FormProvider } from 'src/components/hook-form';
import GeneralMessagess from 'src/language/general.messages';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import {
  ngoEstablishmentDateSelector,
  ngoEstablishmentDateUpdated,
  ngoEstablishmentDateWasEmpty,
} from 'src/store/slices/profile/ngoPublicDetails-slice';
import { EstablishmentdDatePayloadType } from 'src/types/profile/ngoPublicDetails';
import { AudienceEnum, FeatureAudienceEnum, OrgUserFieldEnum } from 'src/types/serverTypes';
import getMonthName from 'src/utils/getMonthName';
import sleep from 'src/utils/sleep';

import NgoPublicDetailsMessages from '../NgoPublicDetails.messages';

export default function EstablishedDateUpdateDialog() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const ngoEstablishmentDate = useSelector(ngoEstablishmentDateSelector);
  const [upsertEstablishmentDateNgoUser, { isLoading }] = useUpdateOrganizationUserField2Mutation();
  const isEdit = pathname === '/profile/ngo/public-details-edit-establishment';
  const [openAudience, setOpenAudience] = useState<boolean>(false);

  const handleNavigation = (url: string) => {
    dispatch(
      ngoEstablishmentDateUpdated({
        ...getValues(),
        isChange: isDirty || ngoEstablishmentDate?.isChange,
      }),
    );
    navigate(url);
  };
  const onSubmit = async (data: EstablishmentdDatePayloadType) => {
    const EstablishedDate = new Date(data.establishmentDate!);
    const result: any = await upsertEstablishmentDateNgoUser({
      filter: {
        dto: {
          field: OrgUserFieldEnum.EstablishmentDate,
          establishmentDate: !!ngoEstablishmentDate?.establishmentDate
            ? EstablishedDate.getFullYear() + '-' + ('0' + (EstablishedDate.getMonth() + 1)).slice(-2) + '-01'
            : null,
          establishmentDateAudience: data.establishmentDateAudience,
        },
      },
    });
    if (result?.data?.updateOrganizationUserField?.isSuccess) {
      enqueueSnackbar(
        isEdit
          ? formatMessage(NgoPublicDetailsMessages.ngoDateSuccessEditAlert)
          : formatMessage(NgoPublicDetailsMessages.ngoDateSuccessAddAlert),
        { variant: 'success' },
      );
      navigate(PATH_APP.profile.ngo.publicDetails.main);
      dispatch(ngoEstablishmentDateWasEmpty());
    }
  };

  const defaultValues = {
    ...ngoEstablishmentDate,
  };
  const methods = useForm<EstablishmentdDatePayloadType>({
    defaultValues,
    mode: 'onChange',
  });

  const {
    getValues,
    watch,
    handleSubmit,
    setValue,
    formState: { isDirty },
  } = methods;

  const handelCloseDialog = async () => {
    if ((ngoEstablishmentDate?.isChange && ngoEstablishmentDate?.establishmentDate) || isDirty) {
      navigate(PATH_APP.profile.ngo.publicDetails.ngoEstablishedDate.discardEstablsihedDate);
    } else {
      navigate(PATH_APP.profile.ngo.publicDetails.main);
      await sleep(500);
      dispatch(ngoEstablishmentDateWasEmpty());
    }
  };

  useLayoutEffect(() => {
    const fetchData = async () => {
      await sleep(500);
    };
    if (!ngoEstablishmentDate) {
      navigate(PATH_APP.profile.ngo.publicDetails.main);
    }
    fetchData();
  }, [ngoEstablishmentDate, navigate]);

  return (
    <>
      <Dialog fullWidth={true} open={true && !openAudience} keepMounted onClose={handelCloseDialog}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} sx={{ minWidth: 600, minHeight: 234, py: 3 }}>
            <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton sx={{ p: 0 }} onClick={handelCloseDialog}>
                  <Icon name="left-arrow-1" />
                </IconButton>
                <Typography variant="subtitle1" color="text.primary">
                  {isEdit
                    ? formatMessage(NgoPublicDetailsMessages.editNgoEstablishmentDate)
                    : formatMessage(NgoPublicDetailsMessages.addNgoEstablishmentDate)}
                </Typography>
              </Box>

              <IconButton onClick={handelCloseDialog}>
                <Icon name="Close-1" />
              </IconButton>
            </Stack>

            <Divider />
            <Stack spacing={2} sx={{ px: 2 }}>
              <Typography variant="subtitle1" color="text.primary">
                <FormattedMessage {...NgoPublicDetailsMessages.ngoEstablishmentDateTitle} />
              </Typography>
              {watch('establishmentDate') ? (
                <Typography
                  variant="body2"
                  color={ngoEstablishmentDate?.establishmentDate ? 'text.primary' : 'text.secondary'}
                  sx={{ cursor: 'pointer' }}
                >
                  {getMonthName(new Date(watch('establishmentDate')!))},{' '}
                  {new Date(watch('establishmentDate')!).getFullYear()}
                  <IconButton
                    onClick={() => {
                      setValue('establishmentDate', undefined, { shouldDirty: true });
                      dispatch(ngoEstablishmentDateUpdated({ ...getValues(), isChange: true }));
                    }}
                    sx={{ ml: 1 }}
                  >
                    &#215;
                  </IconButton>
                </Typography>
              ) : (
                <Box onClick={() => handleNavigation(PATH_APP.profile.ngo.publicDetails.ngoEstablishedDate.selectDate)}>
                  <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>
                    <FormattedMessage {...NgoPublicDetailsMessages.ngoEstablishmentDateTitle} />
                  </Typography>
                </Box>
              )}
            </Stack>
            <Divider />

            <Stack direction="row" spacing={2} sx={{ px: 2, justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {isEdit && (
                  <Link to={PATH_APP.profile.ngo.publicDetails.ngoEstablishedDate.deleteEstablishedDate}>
                    <Button color="error">
                      <Typography variant="button">
                        <FormattedMessage {...GeneralMessagess.delete} />
                      </Typography>
                    </Button>
                  </Link>
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
                        Object.values(AudienceEnum).indexOf(
                          ngoEstablishmentDate?.establishmentDateAudience as AudienceEnum,
                        )
                      ]
                    }
                  </Typography>
                </Button>
              </Box>
              <Box>
                <LoadingButton
                  loading={isLoading}
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={!(isDirty || ngoEstablishmentDate?.isChange) || !ngoEstablishmentDate?.establishmentDate}
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
          feature={FeatureAudienceEnum.EstablishmentDate}
          value={ngoEstablishmentDate?.establishmentDateAudience as AudienceEnum}
          onClose={setOpenAudience}
          open={openAudience}
          onChange={(val: any) => {
            dispatch(
              ngoEstablishmentDateUpdated({
                ...ngoEstablishmentDate,
                establishmentDateAudience: val,
                isChange: true,
              }),
            );
          }}
        />
      )}
    </>
  );
}
