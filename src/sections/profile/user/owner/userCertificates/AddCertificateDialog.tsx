import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Divider, IconButton, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { useUpsertCertificateMutation } from 'src/_graphql/profile/certificates/mutations/upsertCertificate.generated';
import { Icon } from 'src/components/Icon';
import { Audience } from 'src/components/audience';
import { FormProvider, RHFCheckbox, RHFTextField } from 'src/components/hook-form';
import { PATH_APP } from 'src/routes/paths';
import UserCertificates from 'src/sections/profile/UserCertificates.messages';
import { useDispatch, useSelector } from 'src/store';
import {
  certificateCleared,
  certificateUpdated,
  userCertificateSelector,
} from 'src/store/slices/profile/userCertificates-slice';
import { AudienceEnum, Certificate, FeatureAudienceEnum } from 'src/types/serverTypes';
import getMonthName from 'src/utils/getMonthName';

function AddCertificateDialog() {
  const URL =
    /^((https?|ftp):\/\/)?(www.)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
  const { enqueueSnackbar } = useSnackbar();
  const router = useNavigate();
  const [openAudience, setOpenAudience] = useState<boolean>(false);
  const { formatMessage } = useIntl();
  const userCertificate = useSelector(userCertificateSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userCertificate) router(PATH_APP.profile.user.certificate.root);
  }, [userCertificate, router]);

  const [upsertCertificate, { isLoading }] = useUpsertCertificateMutation();

  const certificateValidation = Yup.object()
    .shape({
      certificateName: Yup.object()
        .shape({
          title: Yup.string().required(),
        })
        .required(),
      issuingOrganization: Yup.object()
        .shape({
          title: Yup.string().required(),
        })
        .required(),

      credentialUrl: Yup.string()
        .matches(URL, { message: formatMessage(UserCertificates.enterValidUrl), excludeEmptyString: true })
        .notRequired()
        .nullable(),
      issueDate: Yup.string().required(''),
    })
    .required();

  const methods = useForm<Certificate>({
    defaultValues: {
      ...userCertificate,
      credentialID: userCertificate?.credentialID ? userCertificate?.credentialID : '',
      credentialUrl: userCertificate?.credentialUrl ? userCertificate?.credentialUrl : '',
    },
    resolver: yupResolver(certificateValidation),
    mode: 'onChange',
  });

  const {
    trigger,
    setValue,
    watch,
    getValues,
    handleSubmit,
    formState: { isValid, isDirty },
  } = methods;

  const onSubmit = async (data: Certificate) => {
    const resData: any = await upsertCertificate({
      filter: {
        dto: {
          id: userCertificate?.id,
          certificateNameId: data.certificateName?.id,
          issuingOrganizationId: data.issuingOrganization?.id,
          credentialDoesExpire: !data.credentialDoesExpire,
          issueDate: new Date(data.issueDate).toISOString(),
          expirationDate: !data?.credentialDoesExpire ? data?.expirationDate : undefined,
          credentialID: data?.credentialID?.length === 0 ? undefined : data.credentialID,
          credentialUrl: data?.credentialUrl?.length === 0 ? undefined : data.credentialUrl,
          audience: userCertificate?.audience || data.audience,
        },
      },
    });
    if (resData?.data?.upsertCertificate.isSuccess) {
      if (userCertificate?.id) enqueueSnackbar(formatMessage(UserCertificates.successEdited), { variant: 'success' });
      else enqueueSnackbar(formatMessage(UserCertificates.successAdded), { variant: 'success' });
      dispatch(certificateCleared());
      router(PATH_APP.profile.user.certificate.root);
    } else {
      enqueueSnackbar(formatMessage(UserCertificates.notSuccess), { variant: 'error' });
    }
  };

  // navigate and send data to Redux
  const handleNavigation = (url: string) => {
    dispatch(
      certificateUpdated({
        ...getValues(),
        audience: userCertificate?.audience,
        isChange: isDirty || userCertificate?.isChange,
      }),
    );
    router(url);
  };

  // useEffecgt for Trigger
  useEffect(() => {
    trigger(['certificateName', 'issuingOrganization']);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // click on closeicon and go to Discard or profile
  function handleCloseCertificateDialog() {
    if (isDirty || userCertificate?.isChange) {
      dispatch(
        certificateUpdated({
          ...getValues(),
          audience: userCertificate?.audience,
          isChange: isDirty || userCertificate?.isChange,
          isValid: isValid || userCertificate?.isValid,
        }),
      );
      router(PATH_APP.profile.user.certificate.discard);
    } else {
      router(PATH_APP.profile.user.certificate.root);
      dispatch(certificateCleared());
    }
  }

  return (
    <>
      <Dialog fullWidth maxWidth="sm" open={true && !openAudience} onClose={handleCloseCertificateDialog}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack sx={{ mb: 2, px: 2, pt: 3 }} direction="row" alignItems="center" justifyContent="space-between">
            <Stack spacing={2} direction="row" alignItems="center">
              <IconButton sx={{ p: 0 }} onClick={handleCloseCertificateDialog}>
                <Icon name="left-arrow" color="text.primary" />
              </IconButton>
              <Typography variant="subtitle1">
                {userCertificate?.id
                  ? formatMessage(UserCertificates.editCertificate)
                  : formatMessage(UserCertificates.addCertificate)}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
              <IconButton sx={{ p: 0 }} onClick={handleCloseCertificateDialog}>
                <Icon name="Close-1" color="text.secondary" />
              </IconButton>
            </Stack>
          </Stack>
          <Stack spacing={2}>
            <Divider />
            <Box sx={{ px: 2 }}>
              <Typography variant="subtitle1" color="text.primary">
                <FormattedMessage {...UserCertificates.certificateName} />
              </Typography>
              <Box mt={2} />
              <Box onClick={() => handleNavigation(PATH_APP.profile.user.certificate.searchName)}>
                {watch('certificateName') ? (
                  <Typography variant="body2" color="text.primary" sx={{ cursor: 'pointer' }}>
                    {watch('certificateName')?.title}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>
                    <FormattedMessage {...UserCertificates.exampleCertificateName} />
                  </Typography>
                )}
              </Box>
            </Box>
            <Divider />
            <Box sx={{ px: 2 }}>
              <Typography variant="subtitle1" color="text.primary">
                <FormattedMessage {...UserCertificates.IssuingorganizationI} />*
              </Typography>
              <Box mt={2} />
              <Box onClick={() => handleNavigation(PATH_APP.profile.user.certificate.issueOrganizationName)}>
                {watch('issuingOrganization') ? (
                  <Typography variant="body2" color="text.primary" sx={{ cursor: 'pointer' }}>
                    {watch('issuingOrganization')?.title}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>
                    <FormattedMessage {...UserCertificates.exampleOrg} />
                  </Typography>
                )}
              </Box>
            </Box>
            <Divider />
            <Box sx={{ px: 2 }}>
              <Stack direction="row" alignItems="center">
                <RHFCheckbox
                  label={
                    <Typography color="text.primary" variant="body2">
                      <FormattedMessage {...UserCertificates.notExpire} />
                    </Typography>
                  }
                  name="credentialDoesExpire"
                  sx={{
                    color: 'primary.main',
                    '&.Mui-checked': {
                      color: 'primary.main',
                    },
                    pl: 0,
                    m: 0,
                  }}
                />
              </Stack>
            </Box>
            <Divider />
            <Box sx={{ px: 2 }}>
              <Typography variant="subtitle1" color="text.primary">
                <FormattedMessage {...UserCertificates.issueDate} />
              </Typography>
              <Box mt={2} />
              {watch('issueDate') ? (
                <Typography variant="body2" color="text.primary" sx={{ cursor: 'default' }}>
                  {getMonthName(new Date(watch('issueDate')))} , {new Date(watch('issueDate')).getFullYear()}
                  <IconButton
                    onClick={() => {
                      setValue('issueDate', undefined, { shouldValidate: true, shouldDirty: true });
                      // setValue('expirationDate', undefined, { shouldDirty: true });
                      dispatch(certificateUpdated({ ...getValues() }));
                    }}
                    sx={{ ml: 1 }}
                  >
                    &#215;
                  </IconButton>
                </Typography>
              ) : (
                <Box onClick={() => handleNavigation(PATH_APP.profile.user.certificate.issueDate)}>
                  <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>
                    <FormattedMessage {...UserCertificates.dateNotRequired} />
                  </Typography>
                </Box>
              )}
            </Box>
            <Divider />
            <Box sx={{ px: 2 }}>
              <Typography variant="subtitle1" color="text.primary">
                <FormattedMessage {...UserCertificates.expirationDate} />
              </Typography>

              <Box mt={2} />
              {watch('expirationDate') && !watch('credentialDoesExpire') ? (
                <Typography variant="body2" color="text.primary" sx={{ cursor: 'pointer' }}>
                  {getMonthName(new Date(watch('expirationDate')))} , {new Date(watch('expirationDate')).getFullYear()}
                  <IconButton
                    onClick={() => {
                      setValue('expirationDate', undefined, { shouldValidate: true, shouldDirty: true });
                      dispatch(certificateUpdated({ ...getValues(), isChange: true }));
                    }}
                    sx={{ ml: 1 }}
                  >
                    &#215;
                  </IconButton>
                </Typography>
              ) : (
                <Box
                  onClick={() =>
                    watch('credentialDoesExpire')
                      ? undefined
                      : handleNavigation(PATH_APP.profile.user.certificate.expirationDate)
                  }
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ cursor: watch('credentialDoesExpire') ? 'default' : 'pointer' }}
                  >
                    {watch('credentialDoesExpire') ? 'No Expiration' : 'Expiration Date'}
                  </Typography>
                </Box>
              )}
            </Box>
            <Divider />
            <Box sx={{ px: 2 }}>
              <Typography variant="subtitle1" color="text.primary">
                <FormattedMessage {...UserCertificates.credentialId} />
              </Typography>
              <Box mt={2} />
              <RHFTextField
                name="credentialID"
                placeholder="Credential ID"
                size="small"
                inputProps={{ maxLength: 100 }}
              />
            </Box>
            <Divider />
            <Box sx={{ px: 2 }}>
              <Typography variant="subtitle1" color="text.primary">
                <FormattedMessage {...UserCertificates.credentialURL} />
              </Typography>
              <Box mt={2} />
              <RHFTextField
                name="credentialUrl"
                placeholder="Credential Url"
                size="small"
                inputProps={{ maxLength: 200 }}
              />
            </Box>
            <Divider />
            <Stack direction="row" justifyContent="space-between" sx={{ px: 2, pb: 3 }}>
              <Stack direction="row" alignItems="center">
                {userCertificate?.id && (
                  <Button
                    sx={{ color: 'error.main', padding: '11px 33px' }}
                    onClick={() => handleNavigation(PATH_APP.profile.user.certificate.delete)}
                  >
                    <Typography variant="button">
                      <FormattedMessage {...UserCertificates.delete} />
                    </Typography>
                  </Button>
                )}
                {/* <Link to={PATH_APP.profile.user.certificate.audience}> */}
                <Button
                  variant="outlined"
                  startIcon={<Icon name="Earth" color="text.primary" />}
                  endIcon={<Icon name="down-arrow" color="text.primary" />}
                  onClick={() => {
                    setOpenAudience(true);
                    // dispatch(experienceAdded(getValues()));
                    // router(PATH_APP.profile.user.experience.audience);
                  }}
                >
                  <Typography color="text.primary">
                    {
                      Object.keys(AudienceEnum)[
                        Object.values(AudienceEnum).indexOf(userCertificate?.audience as AudienceEnum)
                      ]
                    }
                  </Typography>
                </Button>
                {/* </Link> */}
              </Stack>
              <LoadingButton
                loading={isLoading}
                type="submit"
                variant="contained"
                disabled={!isValid || !(isDirty || userCertificate?.isChange)}
              >
                {userCertificate?.id ? formatMessage(UserCertificates.save) : formatMessage(UserCertificates.add)}
              </LoadingButton>
            </Stack>
          </Stack>
        </FormProvider>
      </Dialog>
      {openAudience && (
        <Audience
          open={openAudience}
          onClose={setOpenAudience}
          feature={FeatureAudienceEnum.Certificate}
          value={userCertificate?.audience as AudienceEnum}
          onChange={(val: any) => {
            dispatch(certificateUpdated({ audience: val, isChange: true }));
          }}
        />
      )}
    </>
  );
}

export default AddCertificateDialog;
