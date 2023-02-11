import { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';

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
import Image from 'src/components/Image';
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

function MoreCertificates() {
  const router = useNavigate();
  const { formatMessage } = useIntl();
  // const dispatch = useDispatch();

  const [getCertificates, { data, isFetching }] = useLazyGetCertificatesQuery();

  useEffect(() => {
    getCertificates({
      filter: {
        dto: {},
      },
    });
  }, [getCertificates]);

  const certificateData = data?.getCertificates?.listDto?.items;

  // function handleEditCertificate(item: Certificate) {
  //   dispatch(certificateUpdated({ ...item, credentialDoesExpire: !item.credentialDoesExpire }));
  //   router('/profile/ngo/certificate/newForm');
  // }

  // const handleRouting = (certificate: CertificateType) => {
  //   dispatch(certificateUpdated(certificate));
  //   router('/profile/ngo/certificate/newForm');
  // };
  return (
    <>
      <Stack sx={{ mb: 2, px: 2, pt: 3 }} direction="row" alignItems="center" justifyContent="space-between">
        <Stack spacing={2} direction="row" alignItems="center">
          <IconButton sx={{ p: 0 }} onClick={() => router(-1)}>
            <Icon name="left-arrow" color="text.primary" />
          </IconButton>
          <Typography variant="subtitle1">
            <FormattedMessage {...ProfileViewPwaMessages.certificate} />
          </Typography>
        </Stack>
      </Stack>
      <Divider />
      {isFetching ? (
        <Stack sx={{ py: 6 }} alignItems="center" justifyContent="center">
          <CircularProgress />
        </Stack>
      ) : (
        certificateData?.map((certificate, index) => (
          <Box key={certificate?.id}>
            <CertificateWrapperStyle spacing={1} direction="row">
              <CertificateImage alignItems="center" justifyContent="center">
                <Image src="src/assets/companylogo/Vector.png" width={32} height={32} alt="image" />
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

                    {certificate?.expirationDate ? (
                      ` ${getMonthName(new Date(certificate?.expirationDate))} ${new Date(
                        certificate?.expirationDate,
                      ).getFullYear()} `
                    ) : !certificate?.expirationDate && certificate?.credentialDoesExpire ? (
                      <Typography />
                    ) : (
                      formatMessage(ProfileViewPwaMessages.noExpirationMessage)
                    )}
                  </Typography>
                }

                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
                  <FormattedMessage
                    {...ProfileViewPwaMessages.issuingOrganizationMessage}
                    values={{ title: certificate?.issuingOrganization?.title }}
                  />
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
                  <FormattedMessage
                    {...ProfileViewPwaMessages.credentialID}
                    values={{ CredentialID: certificate?.credentialID }}
                  />
                </Typography>
                <Box>
                  {certificate?.credentialUrl && (
                    <Link to={`https://` + certificate?.credentialUrl.replace('https://', '')} replace>
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
    </>
  );
}

export default MoreCertificates;
