import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, Divider, IconButton, Skeleton, Stack, Typography, styled } from '@mui/material';

import { useLazyGetUserEmailsQuery } from 'src/_graphql/profile/contactInfo/queries/getUserEmails.generated';
import { useLazyGetUserPhoneNumbersQuery } from 'src/_graphql/profile/contactInfo/queries/getUserPhoneNumbers.generated';
import { useLazyGetUserSocialMediasQuery } from 'src/_graphql/profile/contactInfo/queries/getUserSocialMedias.generated';
import { useLazyGetUserWebSitesQuery } from 'src/_graphql/profile/contactInfo/queries/getUserWebSites.generated';
import { Icon } from 'src/components/Icon';
import { VerificationStatusEnum } from 'src/types/serverTypes';

import NormalAndNgoProfileViewMessages from '../UserProfileView.messages';

const ContactsListBoxStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
}));

export default function ContactInfoView() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [getUserEmails, { data: emailData, isFetching: isFetchingEmail }] = useLazyGetUserEmailsQuery();
  const [getUserPhoneNumbers, { data: phoneNumberData, isFetching: isFetchingPhoneNumber }] =
    useLazyGetUserPhoneNumbersQuery();
  const [getUserSocialMedias, { data: socialMediaData, isFetching: isFetchingSocialMedia }] =
    useLazyGetUserSocialMediasQuery();
  const [getUserWebSites, { data: websitesData, isFetching: isFetchingWebsite }] = useLazyGetUserWebSitesQuery();

  useEffect(() => {
    getUserEmails({ filter: { dto: { status: VerificationStatusEnum.Confirmed, userId: userId } } });
    getUserPhoneNumbers({ filter: { dto: { status: VerificationStatusEnum.Confirmed, userId: userId } } });
    getUserSocialMedias({ filter: { dto: { userId: userId } } });
    getUserWebSites({ filter: { dto: { userId: userId } } });
  }, [userId, getUserEmails, getUserPhoneNumbers, getUserSocialMedias, getUserWebSites]);

  return (
    <>
      <ContactsListBoxStyle>
        <Stack direction="row" justifyContent="flex-start" mb={3} spacing={2}>
          <IconButton sx={{ padding: 0 }} onClick={() => navigate(-1)}>
            <Icon name="left-arrow" color="grey.500" />
          </IconButton>
          <Typography variant="body1">
            <FormattedMessage {...NormalAndNgoProfileViewMessages.contactInfo} />
          </Typography>
        </Stack>

        <Stack spacing={2} my={2}>
          <Typography variant="subtitle2" color="primary.main">
            <FormattedMessage {...NormalAndNgoProfileViewMessages.email} />
          </Typography>

          {isFetchingEmail ? (
            <>
              {[...Array(3)].map((item, i) => (
                <Stack spacing={1} key={i + 1}>
                  <Skeleton variant="text" width={328} />
                </Stack>
              ))}
            </>
          ) : (
            emailData?.getUserEmails?.listDto?.items?.map((email) => (
              <Typography variant="body2" mb={1} color="text.primary" key={email?.id}>
                {email?.email}
              </Typography>
            ))
          )}
        </Stack>
        <Divider />
        <Stack spacing={2} my={2}>
          <Typography variant="subtitle2" color="primary.main">
            <FormattedMessage {...NormalAndNgoProfileViewMessages.phoneNumber} />
          </Typography>

          {isFetchingPhoneNumber ? (
            <>
              {[...Array(3)].map((item, i) => (
                <Stack spacing={1} key={i + 1}>
                  <Skeleton variant="text" width={328} />
                </Stack>
              ))}
            </>
          ) : (
            phoneNumberData?.getUserPhoneNumbers?.listDto?.items?.map((number) => (
              <Typography variant="body2" mb={1} color="text.primary" key={number?.id}>
                {number?.phoneNumber}
              </Typography>
            ))
          )}
        </Stack>
        <Divider />
        <Stack spacing={2} my={2}>
          <Typography variant="subtitle2" color="primary.main">
            <FormattedMessage {...NormalAndNgoProfileViewMessages.socialLinks} />
          </Typography>

          {isFetchingSocialMedia ? (
            <>
              {[...Array(3)].map((item, i) => (
                <Stack spacing={1} key={i + 1}>
                  <Skeleton variant="text" width={328} />
                </Stack>
              ))}
            </>
          ) : (
            socialMediaData?.getUserSocialMedias?.listDto?.items?.map((socialLink) => (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center' }} mb={1} key={socialLink?.id}>
                  <img
                    loading="lazy"
                    src={socialLink?.socialMediaDto?.logoUrl as string}
                    alt=""
                    // style={{ marginRight: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary" key={socialLink?.id} sx={{ ml: 1 }}>
                    {socialLink?.socialMediaDto?.title}:
                  </Typography>
                  <Typography variant="body2" color="text.primary" key={socialLink?.id} sx={{ ml: 1 }}>
                    {socialLink?.userName}
                  </Typography>
                </Box>
              </>
            ))
          )}
        </Stack>
        <Divider />
        <Stack spacing={2} my={2}>
          <Typography variant="subtitle2" color="primary.main">
            <FormattedMessage {...NormalAndNgoProfileViewMessages.website} />
          </Typography>
          {isFetchingWebsite ? (
            <>
              {[...Array(3)].map((item, i) => (
                <Stack spacing={1} key={i + 1}>
                  <Skeleton variant="text" width={328} />
                </Stack>
              ))}
            </>
          ) : (
            websitesData?.getUserWebSites?.listDto?.items?.map((website) => (
              <Typography variant="body2" mb={1} color="text.primary" key={website?.id}>
                {website?.webSiteUrl}
              </Typography>
            ))
          )}
        </Stack>
        <Divider />
      </ContactsListBoxStyle>
    </>
  );
}
