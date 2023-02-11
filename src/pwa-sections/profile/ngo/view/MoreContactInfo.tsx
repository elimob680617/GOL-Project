import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, CircularProgress, Divider, IconButton, Stack, Typography, styled } from '@mui/material';

import { useLazyGetUserEmailsQuery } from 'src/_graphql/profile/contactInfo/queries/getUserEmails.generated';
import { useLazyGetUserPhoneNumbersQuery } from 'src/_graphql/profile/contactInfo/queries/getUserPhoneNumbers.generated';
import { useLazyGetUserSocialMediasQuery } from 'src/_graphql/profile/contactInfo/queries/getUserSocialMedias.generated';
import { useLazyGetUserWebSitesQuery } from 'src/_graphql/profile/contactInfo/queries/getUserWebSites.generated';
import { Icon } from 'src/components/Icon';
import { VerificationStatusEnum } from 'src/types/serverTypes';

import ProfileViewPwaMessages from '../../UserProfileViewPwa.messages';

const ContactsListBoxStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
}));

export default function ContactInfoView() {
  const router = useNavigate();
  const { userId } = useParams();

  const [getUserEmails, { data: emailData, isFetching: isFetchingEmail }] = useLazyGetUserEmailsQuery();

  const [getUserPhoneNumbers, { data: phoneNumberData, isFetching: isFetchingPhoneNumber }] =
    useLazyGetUserPhoneNumbersQuery();

  const [getUserSocialMedias, { data: socialMediaData, isFetching: isFetchingSocialMedia }] =
    useLazyGetUserSocialMediasQuery();

  const [getUserWebSites, { data: websitesData, isFetching: isFetchingWebsite }] = useLazyGetUserWebSitesQuery();

  useEffect(() => {
    getUserEmails({ filter: { dto: { status: VerificationStatusEnum.Confirmed, userId } } });
    getUserPhoneNumbers({ filter: { dto: { status: VerificationStatusEnum.Confirmed, userId } } });
    getUserSocialMedias({ filter: { dto: { userId } } });
    getUserWebSites({ filter: { dto: { userId } } });
  }, [getUserEmails, getUserPhoneNumbers, getUserSocialMedias, getUserWebSites, userId]);

  return (
    <>
      <ContactsListBoxStyle>
        <Stack direction="row" justifyContent="flex-start" mb={3} spacing={2}>
          <IconButton sx={{ padding: 0 }} onClick={() => router(-1)}>
            <Icon name="left-arrow" color="grey.500" />
          </IconButton>
          <Typography variant="subtitle1">
            <FormattedMessage {...ProfileViewPwaMessages.contactInfo} />
          </Typography>
        </Stack>

        <Stack spacing={2} my={2}>
          <Typography variant="subtitle2" color="primary.main">
            <FormattedMessage {...ProfileViewPwaMessages.email} />
          </Typography>

          {isFetchingEmail ? (
            <CircularProgress size={20} />
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
            <FormattedMessage {...ProfileViewPwaMessages.phoneNumber} />
          </Typography>

          {isFetchingPhoneNumber ? (
            <CircularProgress size={22} />
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
            <FormattedMessage {...ProfileViewPwaMessages.socialLinks} />
          </Typography>

          {isFetchingSocialMedia ? (
            <CircularProgress size={20} />
          ) : (
            socialMediaData?.getUserSocialMedias?.listDto?.items?.map((socialLink) => (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center' }} mb={1} key={socialLink?.id}>
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
            <FormattedMessage {...ProfileViewPwaMessages.website} />
          </Typography>
          {isFetchingWebsite ? (
            <CircularProgress size={22} />
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
