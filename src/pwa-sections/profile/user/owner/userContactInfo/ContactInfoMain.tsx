// @mui
// components
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Button, CircularProgress, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';

import { useLazyGetUserEmailsQuery } from 'src/_graphql/profile/contactInfo/queries/getUserEmails.generated';
import { useLazyGetUserPhoneNumbersQuery } from 'src/_graphql/profile/contactInfo/queries/getUserPhoneNumbers.generated';
import { useLazyGetUserSocialMediasQuery } from 'src/_graphql/profile/contactInfo/queries/getUserSocialMedias.generated';
import { useLazyGetUserWebSitesQuery } from 'src/_graphql/profile/contactInfo/queries/getUserWebSites.generated';
import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch } from 'src/store';
import { addedEmail } from 'src/store/slices/profile/contactInfo-slice-eli';
import { addedSocialMedia } from 'src/store/slices/profile/socialMedia-slice';
import { phoneNumberAdded } from 'src/store/slices/profile/userPhoneNumber-slice';
import { websiteAdded } from 'src/store/slices/profile/userWebsite-slice';
import { PersonEmailType } from 'src/types/profile/userEmails';
import { UserPhoneNumberType } from 'src/types/profile/userPhoneNumber';
import { PersonSocialMediaType } from 'src/types/profile/userSocialMedia';
import { PersonWebSiteType } from 'src/types/profile/userWebsite';
import { AudienceEnum, VerificationStatusEnum } from 'src/types/serverTypes';

export default function ContactInfoNewDialog() {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [getUserEmails, { data: emailData, isFetching: isFetchingEmail }] = useLazyGetUserEmailsQuery();

  const [getUserPhoneNumbers, { data: phoneNumberData, isFetching: isFetchingPhoneNumber }] =
    useLazyGetUserPhoneNumbersQuery();

  const [getUserSocialMedias, { data: socialMediaData, isFetching: isFetchingSocialMedia }] =
    useLazyGetUserSocialMediasQuery();

  const [getUserWebSites, { data: websitesData, isFetching: isFetchingWebsite }] = useLazyGetUserWebSitesQuery();

  useEffect(() => {
    getUserEmails({ filter: { dto: { status: VerificationStatusEnum.Confirmed } } });
    getUserPhoneNumbers({ filter: { dto: { status: VerificationStatusEnum.Confirmed } } });
    getUserSocialMedias({ filter: { dto: { id: null } } });
    getUserWebSites({ filter: { all: true } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditEmail = (email: PersonEmailType) => {
    dispatch(
      addedEmail({
        id: email.id,
        audience: email.audience,
        email: email.email,
        status: email.status,
      }),
    );

    navigate(PATH_APP.profile.user.contactInfo.email.root);
  };

  const handleEditPhoneNumber = (number: UserPhoneNumberType) => {
    dispatch(
      phoneNumberAdded({
        id: number.id,
        userId: number.userId,
        phoneNumber: number.phoneNumber,
        status: number.status,
        audience: number.audience,
        verificationCode: number.verificationCode,
      }),
    );
    navigate(PATH_APP.profile.user.contactInfo.phoneNumber.root);
  };

  const handleEditSocialLick = (socialLink: PersonSocialMediaType) => {
    dispatch(
      addedSocialMedia({
        id: socialLink.id,
        audience: socialLink.audience,
        userName: socialLink.userName,
        socialMediaDto: socialLink.socialMediaDto,
      }),
    );

    navigate(PATH_APP.profile.user.contactInfo.socialLink.root);
  };

  const handleEditWebsite = (website: PersonWebSiteType) => {
    dispatch(
      websiteAdded({
        id: website.id,
        userId: website.userId,
        audience: website.audience,
        webSiteUrl: website.webSiteUrl,
      }),
    );
    navigate(PATH_APP.profile.user.contactInfo.website.root);
  };

  const handleRoutingPhoneNumber = (number: UserPhoneNumberType) => {
    dispatch(phoneNumberAdded(number));
    navigate(PATH_APP.profile.user.contactInfo.phoneNumber.root);
  };

  const handleRoutingWebsite = (website: PersonWebSiteType) => {
    dispatch(websiteAdded(website));
    navigate(PATH_APP.profile.user.contactInfo.website.root);
  };
  const handleRoutingEmail = (email: PersonEmailType) => {
    dispatch(addedEmail(email));
    navigate(PATH_APP.profile.user.contactInfo.email.root);
  };
  const handleRoutingSocialMedia = (socialLink: PersonSocialMediaType) => {
    dispatch(addedSocialMedia(socialLink));
    navigate(PATH_APP.profile.user.contactInfo.socialLink.root);
  };

  return (
    <>
      <Stack spacing={2} sx={{ py: 3 }}>
        <Stack direction="row" alignItems="center">
          <IconButton sx={{ mr: 1 }} onClick={() => navigate('/profile/user')}>
            <Icon name="left-arrow-1" color="text.primary" />
          </IconButton>
          <Typography variant="subtitle1" color="text.primary">
            Contact Info
          </Typography>
        </Stack>
        <Divider />

        <Stack spacing={2} sx={{ px: 2 }}>
          <Typography variant="subtitle2" color="text.primary">
            Email
          </Typography>

          {isFetchingEmail ? (
            <CircularProgress size={20} />
          ) : (
            emailData?.getUserEmails?.listDto?.items?.map((email) => (
              <Typography variant="body2" color="text.primary" key={email?.id}>
                {email?.email}
                <IconButton sx={{ mr: 1 }} onClick={() => handleEditEmail(email as PersonEmailType)}>
                  <Icon name="Edit-Pen" color="text.primary" />
                </IconButton>
              </Typography>
            ))
          )}

          {emailData?.getUserEmails?.listDto?.items && emailData?.getUserEmails?.listDto?.items?.length < 3 && (
            <Button
              variant="outlined"
              sx={{ height: '40px', color: 'text.primary' }}
              onClick={() => handleRoutingEmail({ audience: AudienceEnum.Public })}
            >
              <Icon name="Plus" color="text.primary" />
              <Typography>Add Email</Typography>
            </Button>
          )}
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Typography variant="subtitle2" color="text.primary">
            Phone Number
          </Typography>

          {isFetchingPhoneNumber ? (
            <CircularProgress size={22} />
          ) : (
            phoneNumberData?.getUserPhoneNumbers?.listDto?.items?.map((number) => (
              <Typography variant="body2" color="text.primary" key={number?.id}>
                {number?.phoneNumber}
                <IconButton sx={{ mr: 1 }} onClick={() => handleEditPhoneNumber(number as UserPhoneNumberType)}>
                  <Icon name="Edit-Pen" color="text.primary" />
                </IconButton>
              </Typography>
            ))
          )}
          {phoneNumberData?.getUserPhoneNumbers?.listDto?.items &&
            phoneNumberData?.getUserPhoneNumbers?.listDto?.items?.length < 3 && (
              <Button
                variant="outlined"
                sx={{ height: '40px', color: 'text.primary' }}
                onClick={() => handleRoutingPhoneNumber({ audience: AudienceEnum.Public })}
              >
                <Icon name="Plus" color="text.primary" />
                <Typography>Add Phone Number</Typography>
              </Button>
            )}
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Typography variant="subtitle2" color="text.primary">
            Social Link
          </Typography>

          {isFetchingSocialMedia ? (
            <CircularProgress size={20} />
          ) : (
            socialMediaData?.getUserSocialMedias?.listDto?.items?.map((socialLink) => (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center' }} key={socialLink?.id}>
                  <Typography variant="body2" color={theme.palette.text.secondary} key={socialLink?.id} sx={{ ml: 1 }}>
                    {socialLink?.socialMediaDto?.title}:
                  </Typography>
                  <Typography variant="body2" color="text.primary" key={socialLink?.id} sx={{ ml: 1 }}>
                    {socialLink?.userName}
                  </Typography>
                  <IconButton sx={{ mr: 1 }} onClick={() => handleEditSocialLick(socialLink as PersonSocialMediaType)}>
                    <Icon name="Edit-Pen" color="text.primary" />
                  </IconButton>
                </Box>
              </>
            ))
          )}

          {socialMediaData?.getUserSocialMedias?.listDto?.items &&
            socialMediaData?.getUserSocialMedias?.listDto?.items?.length < 10 && (
              <Button
                startIcon={<Icon name="Plus" color="text.primary" />}
                variant="outlined"
                sx={{ height: '40px', color: 'text.primary' }}
                onClick={() => handleRoutingSocialMedia({ audience: AudienceEnum.Public })}
              >
                <Typography>Add Social Link</Typography>
              </Button>
            )}
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Typography variant="subtitle2" color="text.primary">
            Website
          </Typography>
          {isFetchingWebsite ? (
            <CircularProgress size={22} />
          ) : (
            websitesData?.getUserWebSites?.listDto?.items?.map((website) => (
              <Typography variant="body2" color="text.primary" key={website?.id}>
                {website?.webSiteUrl}
                <IconButton sx={{ mr: 1 }} onClick={() => handleEditWebsite(website as PersonWebSiteType)}>
                  <Icon name="Edit-Pen" color="text.primary" />
                </IconButton>
              </Typography>
            ))
          )}
          {websitesData?.getUserWebSites?.listDto?.items && websitesData?.getUserWebSites?.listDto?.items?.length < 3 && (
            <Button
              variant="outlined"
              sx={{ height: '40px', color: 'text.primary' }}
              onClick={() => handleRoutingWebsite({ audience: AudienceEnum.Public })}
            >
              <Icon name="Plus" color="text.primary" />
              <Typography>Add Website</Typography>
            </Button>
          )}
        </Stack>
        <Divider />
      </Stack>
    </>
  );
}
