import { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  Divider,
  IconButton,
  Link as MuiLink,
  Stack,
  Typography,
  styled,
} from '@mui/material';

import { useLazyGetCertificatesQuery } from 'src/_graphql/profile/certificates/queries/getCertificates.generated';
import { Icon } from 'src/components/Icon';
import useAuth from 'src/hooks/useAuth';
import { PATH_APP } from 'src/routes/paths';
import UserCertificates from 'src/sections/profile/UserCertificates.messages';
import { useDispatch } from 'src/store';
import { certificateUpdated } from 'src/store/slices/profile/userCertificates-slice';
import { CertificateType } from 'src/types/profile/userCertificate';
import { AudienceEnum, Certificate } from 'src/types/serverTypes';
import getMonthName from 'src/utils/getMonthName';

const bull = (
  <Box component="span" sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}>
    •
  </Box>
);

const NoResultStyle = styled(Stack)(({ theme }) => ({
  maxWidth: 164,
  maxHeight: 164,
  width: 164,
  height: 164,
  background: theme.palette.grey[100],
  borderRadius: '100%',
}));

const CertificateWrapperStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const CertificateImage = styled(Stack)(({ theme }) => ({
  width: 48,
  height: 48,
  backgroundColor: theme.palette.grey[100],
}));

function CertificateListDialog() {
  const navigate = useNavigate();
  const { initialize } = useAuth();
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();

  const [getCertificates, { data, isFetching }] = useLazyGetCertificatesQuery();

  useEffect(() => {
    getCertificates({
      filter: {
        dto: {},
      },
    });
  }, [getCertificates]);

  const certificateData = data?.getCertificates?.listDto?.items;

  function handleEditCertificate(item: Certificate) {
    dispatch(certificateUpdated({ ...item, credentialDoesExpire: !item.credentialDoesExpire }));
    navigate(PATH_APP.profile.ngo.certificate.add);
  }

  const handleRouting = (certificate: CertificateType) => {
    dispatch(certificateUpdated(certificate));
    navigate(PATH_APP.profile.ngo.certificate.add);
  };

  function handleClose() {
    const fromWizard = localStorage.getItem('fromWizard') === 'true';
    const fromHomePage = localStorage.getItem('fromHomePage') === 'true';
    if (fromWizard) {
      initialize();
      localStorage.removeItem('fromWizard');
      if (fromHomePage) {
        navigate(PATH_APP.home.wizard.wizardList);
      } else {
        navigate(PATH_APP.profile.ngo.wizard.wizardList);
      }
    } else {
      navigate(PATH_APP.profile.ngo.root);
    }
  }

  return (
    <Dialog fullWidth maxWidth="sm" open onClose={handleClose}>
      <Stack sx={{ mb: 2, px: 2, pt: 3 }} direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle1">
          <FormattedMessage {...UserCertificates.certificate} />
        </Typography>
        <Stack direction="row" spacing={2}>
          {/* FIXME add primary variant to button variants */}
          {!!certificateData?.length && (
            <Button onClick={() => handleRouting({ audience: AudienceEnum.Public })} variant="contained">
              <Typography variant="button">
                <FormattedMessage {...UserCertificates.add} />
              </Typography>
            </Button>
          )}
          <IconButton sx={{ padding: 0 }} onClick={handleClose}>
            <Icon name="Close-1" />
          </IconButton>
        </Stack>
      </Stack>
      <Divider />
      {isFetching ? (
        <Stack sx={{ py: 6 }} alignItems="center" justifyContent="center">
          <CircularProgress />
        </Stack>
      ) : !certificateData?.length ? (
        <Stack sx={{ py: 6, minHeight: '390px' }} alignItems="center" justifyContent="center">
          <NoResultStyle alignItems="center" justifyContent="center">
            <Typography variant="subtitle1" sx={{ color: (theme) => 'text.secondary', textAlign: 'center' }}>
              <FormattedMessage {...UserCertificates.noResult} />
            </Typography>
          </NoResultStyle>
          <Box sx={{ mt: 3 }} />
          <Button
            onClick={() => handleRouting({ audience: AudienceEnum.Public })}
            variant="text"
            startIcon={<Icon name="Plus" color="info.main" />}
          >
            {/* FIXME add varient button sm to typography */}
            <Typography color="info.main">
              <FormattedMessage {...UserCertificates.addCertificate} />
            </Typography>
          </Button>
        </Stack>
      ) : (
        certificateData?.map((certificate, index) => (
          <Box key={certificate?.id}>
            <CertificateWrapperStyle spacing={1} direction="row">
              <CertificateImage alignItems="center" justifyContent="center">
                <Icon name="Company-Logo-Empty" />
              </CertificateImage>
              <Stack sx={{ flex: 1 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle2" sx={{ color: 'primary.dark' }}>
                    {certificate?.certificateName?.title}
                  </Typography>
                  <Box onClick={() => handleEditCertificate(certificate as Certificate)}>
                    <Typography sx={{ color: 'text.secondary', cursor: 'pointer' }} variant="subtitle2">
                      <FormattedMessage {...UserCertificates.edit} />
                    </Typography>
                  </Box>
                </Stack>
                {
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
                    {`Issued ${getMonthName(new Date(certificate?.issueDate))}
                  ${new Date(certificate?.issueDate).getFullYear()} `}

                    {(certificate?.expirationDate && bull) || (!certificate?.credentialDoesExpire && bull)}

                    {certificate?.expirationDate ? (
                      ` ${getMonthName(new Date(certificate?.expirationDate))} ${new Date(
                        certificate?.expirationDate,
                      ).getFullYear()} `
                    ) : !certificate?.expirationDate && certificate?.credentialDoesExpire ? (
                      <Typography />
                    ) : (
                      formatMessage(UserCertificates.noExpireDates)
                    )}
                  </Typography>
                }

                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
                  <FormattedMessage
                    {...UserCertificates.Issuingorganization}
                    values={{ title: certificate?.issuingOrganization?.title }}
                  />
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
                  {certificate?.credentialID && `Credential ID ${certificate?.credentialID}`}
                </Typography>
                <Box>
                  {certificate?.credentialUrl && (
                    <Link
                      to={`https://` + certificate?.credentialUrl.replace('https://', '')}
                      replace
                      // locale={''}
                    >
                      <MuiLink underline="none" target={'_blank'}>
                        <Button
                          color="inherit"
                          variant="outlined"
                          sx={{ borderColor: 'text.primary', color: 'text.primary', mt: 2 }}
                        >
                          <Typography variant="button">
                            <FormattedMessage {...UserCertificates.seeCertificate} />
                          </Typography>
                        </Button>
                      </MuiLink>
                    </Link>
                  )}
                </Box>
              </Stack>
            </CertificateWrapperStyle>
            {index < certificateData?.length - 1 && <Divider />}
          </Box>
        ))
      )}
    </Dialog>
  );
}

export default CertificateListDialog;
