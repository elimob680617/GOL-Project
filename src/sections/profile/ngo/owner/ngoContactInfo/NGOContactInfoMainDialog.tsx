import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Box, Button, CircularProgress, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useLazyGetUserEmailsQuery } from 'src/_graphql/profile/contactInfo/queries/getUserEmails.generated';
import { useLazyGetUserPhoneNumbersQuery } from 'src/_graphql/profile/contactInfo/queries/getUserPhoneNumbers.generated';
import { useLazyGetUserSocialMediasQuery } from 'src/_graphql/profile/contactInfo/queries/getUserSocialMedias.generated';
import { useLazyGetUserWebSitesQuery } from 'src/_graphql/profile/contactInfo/queries/getUserWebSites.generated';
import { Icon } from 'src/components/Icon';
import useAuth from 'src/hooks/useAuth';
import { PATH_APP } from 'src/routes/paths';
import NormalAndNgoProfileContactInfoMessages from 'src/sections/profile/UserProfileContactInfo.messages';
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

export default function NGOContactInfoMainDialog() {
  const router = useNavigate();
  const dispatch = useDispatch();
  const { initialize } = useAuth();

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
  }, [getUserEmails, getUserPhoneNumbers, getUserSocialMedias, getUserWebSites]);

  const handleEditEmail = (email: PersonEmailType) => {
    dispatch(
      addedEmail({
        id: email.id,
        audience: email.audience,
        email: email.email,
        status: email.status,
      }),
    );

    router(PATH_APP.profile.ngo.contactInfo.email.root);
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
    router(PATH_APP.profile.ngo.contactInfo.phoneNumber.edit);
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

    router(PATH_APP.profile.ngo.contactInfo.socialLink.root);
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
    router(PATH_APP.profile.ngo.contactInfo.website.edit);
  };

  const handleRoutingPhoneNumber = (number: UserPhoneNumberType) => {
    dispatch(phoneNumberAdded(number));
    router(PATH_APP.profile.ngo.contactInfo.phoneNumber.root);
  };

  const handleRoutingWebsite = (website: PersonWebSiteType) => {
    dispatch(websiteAdded(website));
    router(PATH_APP.profile.ngo.contactInfo.website.root);
  };

  const handleRoutingEmail = (email: PersonEmailType) => {
    dispatch(addedEmail(email));
    router(PATH_APP.profile.ngo.contactInfo.email.root);
  };

  const handleRoutingSocialMedia = (socialLink: PersonSocialMediaType) => {
    dispatch(addedSocialMedia(socialLink));
    router(PATH_APP.profile.ngo.contactInfo.socialLink.root);
  };

  function handleClose() {
    const fromWizard = localStorage.getItem('fromWizard') === 'true';
    const fromHomePage = localStorage.getItem('fromHomePage') === 'true';
    if (fromWizard) {
      initialize();
      localStorage.removeItem('fromWizard');
      if (fromHomePage) {
        router(PATH_APP.home.wizard.wizardList);
      } else {
        router(PATH_APP.profile.ngo.wizard.wizardList);
      }
    } else {
      router(PATH_APP.profile.ngo.root);
    }
  }

  return (
    <>
      <Dialog fullWidth={true} open={true} keepMounted onClose={handleClose}>
        <Stack spacing={2} sx={{ py: 3, minHeight: 320 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.contactInfo} />
            </Typography>
            <IconButton onClick={handleClose}>
              <Icon name="Close-1" />
            </IconButton>
          </Stack>
          <Divider />

          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle2" color="text.primary">
              <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.email} />
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
                <Typography>
                  <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.addEmail} />
                </Typography>
              </Button>
            )}
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle2" color="text.primary">
              <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.phoneNumber} />
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
                  <Typography>
                    <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.addPhoneNumber} />
                  </Typography>
                </Button>
              )}
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle2" color="text.primary">
              <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.socialLinks} />
            </Typography>

            {isFetchingSocialMedia ? (
              <CircularProgress size={20} />
            ) : (
              socialMediaData?.getUserSocialMedias?.listDto?.items?.map((socialLink) => (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center' }} key={socialLink?.id}>
                    <Typography variant="body2" color="text.secondary" key={socialLink?.id} sx={{ ml: 1 }}>
                      {socialLink?.socialMediaDto?.title}:
                    </Typography>
                    <Typography variant="body2" color="text.primary" key={socialLink?.id} sx={{ ml: 1 }}>
                      {socialLink?.userName}
                    </Typography>
                    <IconButton
                      sx={{ mr: 1 }}
                      onClick={() => handleEditSocialLick(socialLink as PersonSocialMediaType)}
                    >
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
                  <Typography>
                    <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.addSocialLink} />
                  </Typography>
                </Button>
              )}
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle2" color="text.primary">
              <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.website} />
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
            {websitesData?.getUserWebSites?.listDto?.items &&
              websitesData?.getUserWebSites?.listDto?.items?.length < 3 && (
                <Button
                  variant="outlined"
                  sx={{ height: '40px', color: 'text.primary' }}
                  onClick={() => handleRoutingWebsite({ audience: AudienceEnum.Public })}
                >
                  <Icon name="Plus" color="text.primary" />
                  <Typography>
                    <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.addWebsite} />
                  </Typography>
                </Button>
              )}
          </Stack>
          <Divider />
        </Stack>
      </Dialog>
    </>
  );
}
