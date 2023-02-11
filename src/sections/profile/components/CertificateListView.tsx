import { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { Box, Button, Divider, IconButton, Link as MuiLink, Skeleton, Stack, Typography, styled } from '@mui/material';

import { useLazyGetCertificatesQuery } from 'src/_graphql/profile/certificates/queries/getCertificates.generated';
import { Icon } from 'src/components/Icon';
import getMonthName from 'src/utils/getMonthName';

import NormalAndNgoProfileViewMessages from '../UserProfileView.messages';

const bull = (
  <Box component="span" sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}>
    •
  </Box>
);
const CertificateWrapperStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
}));
const CertificateImage = styled(Stack)(({ theme }) => ({
  width: 48,
  height: 48,
  backgroundColor: theme.palette.grey[100],
}));
const CertificateListBoxStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
}));

function CertificateListView() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { formatMessage } = useIntl();
  // const ID = userId;
  // const ID = router?.query?.userId?.[0];

  const [getCertificates, { data, isFetching }] = useLazyGetCertificatesQuery();

  useEffect(() => {
    getCertificates({
      filter: {
        dto: { userId: userId },
      },
    });
  }, [userId, getCertificates]);

  const certificateData = data?.getCertificates?.listDto?.items;

  return (
    <CertificateListBoxStyle>
      <Stack direction="row" justifyContent="flex-start" mb={3} spacing={2}>
        <IconButton sx={{ padding: 0 }} onClick={() => navigate(-1)}>
          <Icon name="left-arrow" color="grey.500" />
        </IconButton>
        <Typography variant="body1">
          <FormattedMessage {...NormalAndNgoProfileViewMessages.certificate} />
        </Typography>
      </Stack>
      {isFetching ? (
        <Stack mt={1} sx={{ pb: 3 }} alignItems="center" justifyContent="flex-start" spacing={2}>
          {[...Array(3)].map((item, i) => (
            <Stack direction="row" spacing={1} key={i + 1} minWidth={784}>
              <Skeleton variant="rectangular" width={48} height={48} />
              <Stack spacing={1}>
                <Skeleton variant="text" width={328} height={30} />
                <Skeleton variant="text" width={328} />
                <Skeleton variant="text" width={328} />
                <Skeleton variant="rectangular" width={710} />
              </Stack>
            </Stack>
          ))}
        </Stack>
      ) : (
        certificateData?.map((certificate, index: number) => (
          <Box key={certificate?.id}>
            <CertificateWrapperStyle spacing={1} direction="row">
              <CertificateImage alignItems="center" justifyContent="center">
                <img loading="lazy" src="src/assets/companylogo/Vector.png" style={{ width: 32, height: 32 }} alt="" />
              </CertificateImage>
              <Stack sx={{ flex: 1 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle2" sx={{ color: 'primary.dark' }}>
                    {certificate?.certificateName?.title}
                  </Typography>
                </Stack>
                {
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
                    {`${formatMessage(NormalAndNgoProfileViewMessages.issued)} ${getMonthName(
                      new Date(certificate?.issueDate),
                    )}
                  ${new Date(certificate?.issueDate).getFullYear()} `}

                    {(certificate?.expirationDate && bull) || (!certificate?.credentialDoesExpire && bull)}

                    {certificate?.expirationDate
                      ? ` ${getMonthName(new Date(certificate?.expirationDate))} ${new Date(
                          certificate?.expirationDate,
                        ).getFullYear()} `
                      : !certificate?.expirationDate && certificate?.credentialDoesExpire
                      ? ''
                      : formatMessage(NormalAndNgoProfileViewMessages.noExpirationMessage)}
                  </Typography>
                }

                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
                  <FormattedMessage
                    {...NormalAndNgoProfileViewMessages.issuingOrganizationMessage}
                    values={{ title: certificate?.issuingOrganization?.title }}
                  />
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
                  {certificate?.credentialID && (
                    <FormattedMessage
                      {...NormalAndNgoProfileViewMessages.credentialID}
                      values={{ CredentialID: certificate?.credentialID }}
                    />
                  )}
                </Typography>
                <Box>
                  {certificate?.credentialUrl && (
                    <Link to={`https://` + certificate?.credentialUrl.replace('https://', '')} replace>
                      {/* locale={''} */}
                      <MuiLink underline="none" target={'_blank'}>
                        <Button
                          color="inherit"
                          variant="outlined"
                          sx={{ borderColor: 'text.primary', color: 'text.primary', mt: 2 }}
                        >
                          <Typography variant="button">
                            <FormattedMessage {...NormalAndNgoProfileViewMessages.seeCertificate} />
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
    </CertificateListBoxStyle>
  );
}

export default CertificateListView;
