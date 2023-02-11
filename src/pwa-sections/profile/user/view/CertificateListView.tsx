import { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useNavigate, useParams } from 'react-router-dom';

import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Link as MuiLink,
  Stack,
  Typography,
  styled,
} from '@mui/material';

import { useLazyGetCertificatesQuery } from 'src/_graphql/profile/certificates/queries/getCertificates.generated';
import { Icon } from 'src/components/Icon';
import getMonthName from 'src/utils/getMonthName';

import ProfileViewPwaMessages from '../../UserProfileViewPwa.messages';

const bull = (
  <Box component="span" sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}>
    •
  </Box>
);

// const NoResultStyle = styled(Stack)(({ theme }) => ({
//   maxWidth: 164,
//   maxHeight: 164,
//   width: 164,
//   height: 164,
//   background: theme.palette.grey[100],
//   borderRadius: '100%',
// }));

const CertificateWrapperStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const CertificateImage = styled(Stack)(({ theme }) => ({
  width: 48,
  height: 48,
  backgroundColor: theme.palette.grey[100],
}));
const CertificateListBoxStyle = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
}));

function CertificateListView() {
  const router = useNavigate();
  const { formatMessage } = useIntl();
  const { userId } = useParams();

  const [getCertificates, { data, isFetching }] = useLazyGetCertificatesQuery();

  useEffect(() => {
    getCertificates({
      filter: {
        dto: { userId },
      },
    });
  }, [getCertificates, userId]);

  const certificateData = data?.getCertificates?.listDto?.items;
  return (
    <CertificateListBoxStyle>
      <Stack direction="row" justifyContent="flex-start" mb={1} spacing={2} sx={{ pt: 2, pl: 2 }}>
        <IconButton sx={{ padding: 0 }} onClick={() => router(-1)}>
          <Icon name="left-arrow" color="grey.500" />
        </IconButton>
        <Typography variant="subtitle1">
          <FormattedMessage {...ProfileViewPwaMessages.certificate} />
        </Typography>
      </Stack>
      {isFetching ? (
        <Stack sx={{ py: 6 }} alignItems="center" justifyContent="center">
          <CircularProgress />
        </Stack>
      ) : (
        certificateData?.map((certificate, index) => (
          <Box key={certificate?.id}>
            <CertificateWrapperStyle spacing={1} direction="row">
              <CertificateImage alignItems="center" justifyContent="center">
                <img src="src/assets/companylogo/Vector.png" width={32} height={32} alt="" loading="lazy" />
              </CertificateImage>
              <Stack sx={{ flex: 1 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle2" sx={{ color: 'primary.dark' }}>
                    {certificate?.certificateName?.title}
                  </Typography>
                </Stack>
                {
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
                    {`${formatMessage(ProfileViewPwaMessages.issued)} ${getMonthName(new Date(certificate?.issueDate))}
                  ${new Date(certificate?.issueDate).getFullYear()} `}

                    {(certificate?.expirationDate && bull) || (!certificate?.credentialDoesExpire && bull)}

                    {certificate?.expirationDate
                      ? ` ${getMonthName(new Date(certificate?.expirationDate))} ${new Date(
                          certificate?.expirationDate,
                        ).getFullYear()} `
                      : !certificate?.expirationDate && certificate?.credentialDoesExpire
                      ? ''
                      : formatMessage(ProfileViewPwaMessages.noExpirationMessage)}
                  </Typography>
                }

                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
                  <FormattedMessage
                    {...ProfileViewPwaMessages.issuingOrganizationMessage}
                    values={{ title: certificate?.issuingOrganization?.title }}
                  />
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
                  {certificate?.credentialID && (
                    <FormattedMessage
                      {...ProfileViewPwaMessages.credentialID}
                      values={{ CredentialID: certificate?.credentialID }}
                    />
                  )}
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
                            <FormattedMessage {...ProfileViewPwaMessages.seeCertificate} />
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
