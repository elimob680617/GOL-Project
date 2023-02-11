import { useEffect, useState } from 'react';
// Rhf and yup
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
// bottom sheet
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';

import { LoadingButton } from '@mui/lab';
import { Box, Divider, IconButton, Stack, useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
// toast
import { useSnackbar } from 'notistack';
import { useUpsertCertificateMutation } from 'src/_graphql/profile/certificates/mutations/upsertCertificate.generated';
import { Icon } from 'src/components/Icon';
import { FormProvider, RHFCheckbox, RHFTextField } from 'src/components/hook-form';
import UserCertificates from 'src/pwa-sections/profile/UserCertificatesPwa.messages';
import { useDispatch, useSelector } from 'src/store';
import { certificateCleared, userCertificateSelector } from 'src/store/slices/profile/userCertificates-slice';
import { AudienceEnum, Certificate } from 'src/types/serverTypes';
import getMonthName from 'src/utils/getMonthName';

import DeleteConfirm from './DeleteConfirm';
import DiscardCertificate from './DiscardCertificate';
import ExpirationDate from './ExpirationDate';
import IssueDate from './IssueDate';
// import components
import SearchCertificateNamesDialog from './SearchCertificateNames';
import SearchIssingOrganization from './SearchIssingOrganization';
import SelectAudienceCertificate from './SelectAudienceCertificate';

function AddCertificate() {
  // useState for bottomSheet
  const [certificateNameBottomSheet, setCertificateNameBottomSheet] = useState(false);
  const [issuingOrganizationBottomSheet, setIssuingOrganizationBottomSheet] = useState(false);
  const [issueDateBottomSheet, setIssueDateBottomSheet] = useState(false);
  const [expireDateBottomSheet, setExpireDateBottomSheet] = useState(false);
  const [audienceBottomSheet, setAudienceBottomSheet] = useState(false);
  const [discardCertificateBottomSheet, setDiscardCertificateBottomSheet] = useState(false);
  const [deleteCertificateBottomSheet, setDeleteCertificateBottomSheet] = useState(false);

  // URl for validation of credential URL
  const URL =
    /^((https?|ftp):\/\/)?(www.)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;

  //  tools
  const { enqueueSnackbar } = useSnackbar();
  // const router = useRouter();
  const navigate = useNavigate();
  const theme = useTheme();
  const userCertificate = useSelector(userCertificateSelector);
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  // useEffect for Refreshing
  useEffect(() => {
    if (!userCertificate) navigate('/profile/user/certificate/list');
  }, [userCertificate, navigate]);

  // mutation !
  const [upsertCertificate, { isLoading }] = useUpsertCertificateMutation();
  // yup
  const certificateValidation = Yup.object().shape({
    certificateName: Yup.object()
      .shape({
        title: Yup.string(),
      })
      .required(),
    issuingOrganization: Yup.object()
      .shape({
        title: Yup.string(),
      })
      .required(),

    credentialUrl: Yup.string()
      .matches(URL, { message: formatMessage(UserCertificates.enterValidUrl), excludeEmptyString: true })
      .notRequired()
      .nullable(),
    issueDate: Yup.string().required(''),
  });

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
    watch,
    getValues,
    handleSubmit,
    setValue,
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
          audience: data.audience,
        },
      },
    });
    if (resData?.data?.upsertCertificate.isSuccess) {
      if (userCertificate?.id) enqueueSnackbar(formatMessage(UserCertificates.successEdited), { variant: 'success' });
      else enqueueSnackbar(formatMessage(UserCertificates.successAdded), { variant: 'success' });
      dispatch(certificateCleared());
      navigate('/profile/user/certificate/list');
    } else {
      enqueueSnackbar(formatMessage(UserCertificates.notSuccess), { variant: 'error' });
    }
  };

  // useEffecgt for Trigger
  useEffect(() => {
    trigger(['certificateName', 'issuingOrganization']);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // click on closeicon and go to Discard or profile
  function handleCloseCertificateDialog() {
    if (isDirty || userCertificate?.isChange) {
      setDiscardCertificateBottomSheet(true);
    } else {
      dispatch(certificateCleared());
      navigate('/profile/user/certificate/list');
    }
  }

  // navigate and send data to Redux with open BottomSheet;
  const handleCertificateBottomSheet = () => {
    // setFocus()

    setCertificateNameBottomSheet(true);
  };

  const handleIssueBottomSheet = () => {
    setIssuingOrganizationBottomSheet(true);
  };

  const handleIssueDateBottomSheet = () => {
    setIssueDateBottomSheet(true);
  };

  const handleExpireDateBottomSheet = () => {
    setExpireDateBottomSheet(true);
  };

  const handleDeleteBottomSheet = () => {
    setDeleteCertificateBottomSheet(true);
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ mb: 2, px: 2, pt: 3 }} direction="row" alignItems="center" justifyContent="space-between">
          <Stack spacing={2} direction="row" alignItems="center">
            <IconButton sx={{ p: 0 }} onClick={handleCloseCertificateDialog}>
              <Icon name="left-arrow-1" color="text.primary" />
            </IconButton>
            <Typography variant="subtitle1">
              {userCertificate?.id
                ? formatMessage(UserCertificates.editCertificate)
                : formatMessage(UserCertificates.addCertificate)}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <LoadingButton loading={isLoading} type="submit" variant="contained" disabled={!isValid || !isDirty}>
              {userCertificate?.id ? formatMessage(UserCertificates.save) : formatMessage(UserCertificates.add)}
            </LoadingButton>
          </Stack>
        </Stack>
        <Stack spacing={2}>
          <Divider />
          <Box sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              <FormattedMessage {...UserCertificates.certificateName} />
            </Typography>
            <Box mt={2} />
            <Box onClick={handleCertificateBottomSheet}>
              {watch('certificateName') ? (
                <Typography variant="body2" color="text.primary">
                  {watch('certificateName')?.title}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  <FormattedMessage {...UserCertificates.certificateName} />
                </Typography>
              )}
            </Box>
          </Box>
          <Divider />
          <Box sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              <FormattedMessage {...UserCertificates.Issueingorganization} />
            </Typography>
            <Box mt={2} />
            <Box onClick={handleIssueBottomSheet}>
              {watch('issuingOrganization') ? (
                <Typography variant="body2" color="text.primary">
                  {watch('issuingOrganization')?.title}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary">
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
                  <Typography color={theme.palette.text.primary} variant="body2">
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
              <Typography variant="body2" color="text.secondary">
                {getMonthName(new Date(watch('issueDate')))} , {new Date(watch('issueDate')).getFullYear()}
                <IconButton
                  onClick={() => {
                    setValue('issueDate', undefined, { shouldValidate: true, shouldDirty: true });
                  }}
                  sx={{ ml: 1 }}
                >
                  &#215;
                </IconButton>
              </Typography>
            ) : (
              <Box onClick={handleIssueDateBottomSheet}>
                <Typography variant="body2" color="text.secondary">
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
              <Typography variant="body2" color="text.secondary">
                {getMonthName(new Date(watch('expirationDate')))} , {new Date(watch('expirationDate')).getFullYear()}
                <IconButton
                  onClick={() => {
                    setValue('expirationDate', undefined, { shouldValidate: true, shouldDirty: true });
                    // dispatch(certificateUpdated({ ...getValues() }));
                  }}
                  sx={{ ml: 1 }}
                >
                  &#215;
                </IconButton>
              </Typography>
            ) : (
              <Box onClick={() => (watch('credentialDoesExpire') ? undefined : handleExpireDateBottomSheet())}>
                <Typography variant="body2" color="text.secondary">
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
                <Button sx={{ color: 'error.main', padding: '11px 33px' }} onClick={handleDeleteBottomSheet}>
                  <Typography variant="button">
                    <FormattedMessage {...UserCertificates.delete} />
                  </Typography>
                </Button>
              )}
            </Stack>

            <Button
              onClick={() => setAudienceBottomSheet(true)}
              variant="outlined"
              startIcon={<Icon name="Earth" size="18" color="text.primary" />}
              endIcon={<Icon name="down-arrow" size="16" color="text.primary" />}
            >
              <Typography color={theme.palette.text.primary}>
                {Object.keys(AudienceEnum)[Object.values(AudienceEnum).indexOf(watch('audience') as AudienceEnum)]}
              </Typography>
            </Button>
          </Stack>
        </Stack>
      </FormProvider>

      <BottomSheet
        open={certificateNameBottomSheet}
        onDismiss={() => setCertificateNameBottomSheet(false)}
        snapPoints={({ maxHeight }) => maxHeight / 2}
      >
        <SearchCertificateNamesDialog
          onChange={(value) => {
            setValue('certificateName', value, { shouldDirty: true, shouldValidate: true });

            setCertificateNameBottomSheet(false);
          }}
        />
      </BottomSheet>

      <BottomSheet
        open={issuingOrganizationBottomSheet}
        onDismiss={() => setIssuingOrganizationBottomSheet(false)}
        snapPoints={({ maxHeight }) => maxHeight / 2}
      >
        <SearchIssingOrganization
          onChange={(value) => {
            setValue('issuingOrganization', value, { shouldDirty: true, shouldValidate: true });
            setIssuingOrganizationBottomSheet(false);
          }}
        />
      </BottomSheet>
      <BottomSheet open={issueDateBottomSheet} onDismiss={() => setIssueDateBottomSheet(false)}>
        <IssueDate
          issueDate={watch('issueDate')}
          expirationDate={watch('expirationDate')}
          onChange={(value) => {
            setValue('issueDate', value, { shouldDirty: true, shouldValidate: true });
            setIssueDateBottomSheet(false);
          }}
        />
      </BottomSheet>
      <BottomSheet open={expireDateBottomSheet} onDismiss={() => setExpireDateBottomSheet(false)}>
        <ExpirationDate
          issueDate={watch('issueDate')}
          expirationDate={watch('expirationDate')}
          onChange={(value) => {
            setValue('expirationDate', value, { shouldDirty: true });
            setExpireDateBottomSheet(false);
          }}
        />
      </BottomSheet>
      <BottomSheet open={discardCertificateBottomSheet} onDismiss={() => setDiscardCertificateBottomSheet(false)}>
        <DiscardCertificate
          onSubmit={() => {
            if (isValid) {
              onSubmit(getValues());
            }
            setDiscardCertificateBottomSheet(false);
          }}
          isValid={isValid}
        />
      </BottomSheet>
      <BottomSheet open={deleteCertificateBottomSheet} onDismiss={() => setDeleteCertificateBottomSheet(false)}>
        <DeleteConfirm />
      </BottomSheet>

      <BottomSheet open={audienceBottomSheet} onDismiss={() => setAudienceBottomSheet(false)}>
        <SelectAudienceCertificate
          onChange={(value) => {
            setValue('audience', value, { shouldDirty: true });
            setAudienceBottomSheet(false);
          }}
          audience={watch('audience') as AudienceEnum}
        />
      </BottomSheet>
    </>
  );
}

export default AddCertificate;
