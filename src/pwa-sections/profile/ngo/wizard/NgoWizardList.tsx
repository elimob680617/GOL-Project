import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
// import bottom sheet
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';

import { Avatar, Box, Button, CircularProgress, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';

import { useLazyOrganizationProfileCompleteQuery } from 'src/_graphql/profile/users/queries/organizationProfileComplete.generated';
import { Icon } from 'src/components/Icon';
import MainProfileCoverAvatarNgo from 'src/pwa-sections/profile/ngo/owner/ngoMain/editCoverPhoto/MainProfileCoverAvatarNgo';
import { PATH_APP } from 'src/routes/paths';
// types
import { ProfileCompleteEnum } from 'src/types/serverTypes';

import WizardMessages from '../../WizardPwa';

// --------------start project------------------

export default function NgoWizardList() {
  const theme = useTheme();
  const navigate = useNavigate();
  // bottom sheet   & state for edit photo
  const [profileCoverAvatar, setProfileCoverAvatarBottomSheet] = useState(false);
  const [statusPhoto, setStatusPhoto] = useState<'cover' | 'avatar' | undefined>();
  //services !
  const [organizationProfileComplete, { data }] = useLazyOrganizationProfileCompleteQuery();

  // useEffect for get data
  useEffect(() => {
    organizationProfileComplete({
      filter: {
        all: true,
      },
    });
  }, [organizationProfileComplete]);

  // useEffect for bottom sheet -------
  useEffect(() => {
    if (!profileCoverAvatar)
      organizationProfileComplete({
        filter: {
          all: true,
        },
      });
  }, [organizationProfileComplete, profileCoverAvatar]);

  const profileData = data?.organizationProfileComplete?.listDto?.items?.[0];

  // functions !
  function handleRoute(route: string) {
    localStorage.setItem('fromWizardNgo', 'true');
    navigate(route);
  }
  function handleNgoLogo() {
    if (!profileData?.ngoLogo) {
      setProfileCoverAvatarBottomSheet(true);
      setStatusPhoto('avatar');
    }
  }
  function handleCoverPhoto() {
    if (!profileData?.coverPhoto) {
      setProfileCoverAvatarBottomSheet(true);
      setStatusPhoto('cover');
    }
  }
  return (
    <>
      <Stack>
        <Stack sx={{ px: 2, pt: 3, pb: 2, gap: 1 }} direction="row" alignItems="center">
          <IconButton onClick={() => navigate('/')}>
            <Icon name="left-arrow-1" color="text.primary" />
          </IconButton>
          <Typography variant="subtitle1" color="text.primary">
            <FormattedMessage {...WizardMessages.completeYourProfile} />
          </Typography>
        </Stack>
        <Divider />
        <Stack sx={{ mt: 2, px: 2, mb: 2 }} spacing={3} alignItems="center" justifyContent="space-between">
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            sx={{ backgroundColor: 'grey.100', width: '100%', px: 1, borderRadius: 1, mb: 2 }}
          >
            <Stack direction="row" alignItems="center" sx={{ gap: 2 }}>
              {profileData?.completeProfilePercentage === 100 ? (
                <Box sx={{ my: 1.7 }}>
                  <Icon name="Like" color="primary.main" />
                </Box>
              ) : (
                <Box>
                  <CircularProgress
                    variant="determinate"
                    value={profileData?.completeProfilePercentage as number}
                    sx={{ my: 1, position: 'relative', zIndex: 10 }}
                  />
                  <CircularProgress
                    variant="determinate"
                    value={100}
                    sx={{ my: 1, position: 'absolute', ml: -5, color: 'grey.300', zIndex: 1 }}
                  />
                </Box>
              )}
              <Stack direction="row" alignItems="center" sx={{ gap: 1 }}>
                <Typography variant="subtitle1" color="primary.main">
                  {profileData?.completeProfilePercentage} %
                </Typography>
                <Typography variant="subtitle1" color="grey.500">
                  <FormattedMessage {...WizardMessages.completed} />
                </Typography>
              </Stack>
            </Stack>
            <Box>
              <Button size="small" variant="text" color="info" onClick={() => navigate(PATH_APP.profile.ngo.root)}>
                <Typography variant="button">
                  <FormattedMessage {...WizardMessages.openMyProfile} />
                </Typography>
              </Button>
            </Box>
          </Stack>
          {/*-------------------------- Ngo Logo-------------------- */}
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            sx={{
              backgroundColor: profileData?.ngoLogo ? 'grey.100' : 'background.paper',
              border: 1,
              borderColor: 'grey.300',
              width: '100%',
              px: 2,
              borderRadius: 2,
            }}
            onClick={handleNgoLogo}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Avatar
                alt="Profile Picture"
                sx={{ my: 1, backgroundColor: profileData?.ngoLogo ? 'background.paper' : 'grey.100' }}
              >
                <Icon name="Profile-Photo" color={profileData?.ngoLogo ? 'primary.light' : 'primary.main'} />
              </Avatar>
              <Stack spacing={0.5}>
                {!profileData?.ngoLogo ? (
                  <>
                    <Typography variant="subtitle2" color="text.primary">
                      <FormattedMessage {...WizardMessages.yourNgoLogo} />
                    </Typography>
                    <Typography variant="caption" color="grey.500">
                      <FormattedMessage {...WizardMessages.uploadYourOfficialLogo} />
                    </Typography>
                  </>
                ) : (
                  <Typography variant="subtitle2" color="grey.500">
                    <FormattedMessage {...WizardMessages.ngoLogoUploaded} />
                  </Typography>
                )}
              </Stack>
            </Stack>
            <Box>
              {profileData?.ngoLogo ? (
                <IconButton sx={{ padding: 0 }}>
                  <Icon type="solid" name="Approve-Tick-1" color="primary.light" />
                </IconButton>
              ) : (
                <IconButton sx={{ padding: 0 }}>
                  <Icon name="right-arrow-1" color="grey.500" />
                </IconButton>
              )}
            </Box>
          </Stack>
          {/*-------------------------- cover photo -------------------------- */}
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            sx={{
              backgroundColor: profileData?.coverPhoto ? 'grey.100' : 'background.paper',
              border: 1,
              borderColor: 'grey.300',
              width: '100%',
              px: 2,
              borderRadius: 2,
            }}
            onClick={handleCoverPhoto}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Avatar
                alt="Profile Picture"
                sx={{ my: 1, backgroundColor: profileData?.coverPhoto ? 'background.paper' : 'grey.100' }}
              >
                <Icon
                  name="cover-photo"
                  size={24}
                  color={profileData?.coverPhoto ? theme.palette.primary.light : theme.palette.primary.main}
                />
              </Avatar>
              <Stack spacing={0.5}>
                {!profileData?.coverPhoto ? (
                  <>
                    <Typography variant="subtitle2" color="text.primary">
                      <FormattedMessage {...WizardMessages.coverPhoto} />
                    </Typography>
                    <Typography variant="caption" color="grey.500">
                      <FormattedMessage {...WizardMessages.relatedPicToYourCategory} />
                    </Typography>
                  </>
                ) : (
                  <Typography variant="subtitle2" color="grey.500">
                    <FormattedMessage {...WizardMessages.coverPhotoUploaded} />
                  </Typography>
                )}
              </Stack>
            </Stack>
            <Box>
              {profileData?.coverPhoto ? (
                <IconButton sx={{ padding: 0 }}>
                  <Icon type="solid" name="Approve-Tick-1" color="primary.light" />
                </IconButton>
              ) : (
                <IconButton sx={{ padding: 0 }}>
                  <Icon name="right-arrow-1" color="grey.500" />
                </IconButton>
              )}
            </Box>
          </Stack>
          {/* ---------------------------Bio ---------------- */}

          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            sx={{
              backgroundColor: profileData?.bio ? 'grey.100' : 'background.paper',
              border: 1,
              borderColor: 'grey.300',
              width: '100%',
              px: 2,
              borderRadius: 2,
            }}
            onClick={() => {
              if (!profileData?.bio) {
                handleRoute(PATH_APP.profile.ngo.bioDialog);
              }
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Avatar
                alt="Profile Picture"
                sx={{ my: 1, backgroundColor: profileData?.bio ? 'background.paper' : 'grey.100' }}
              >
                <Icon name="cover-photo" size={24} color={profileData?.bio ? 'primary.light' : 'primary.main'} />
              </Avatar>
              <Stack spacing={0.5}>
                {!profileData?.bio ? (
                  <>
                    <Typography variant="subtitle2" color="text.primary">
                      <FormattedMessage {...WizardMessages.addBio} />
                    </Typography>
                    <Typography variant="caption" color="grey.500">
                      <FormattedMessage {...WizardMessages.insertYourBio} />
                    </Typography>
                  </>
                ) : (
                  <Typography variant="subtitle2" color="grey.500">
                    <FormattedMessage {...WizardMessages.bioAdded} />
                  </Typography>
                )}
              </Stack>
            </Stack>
            <Box>
              {profileData?.bio ? (
                <IconButton sx={{ padding: 0 }}>
                  <Icon type="solid" name="Approve-Tick-1" color="primary.light" />
                </IconButton>
              ) : (
                <IconButton sx={{ padding: 0 }}>
                  <Icon name="right-arrow-1" color="grey.500" />
                </IconButton>
              )}
            </Box>
          </Stack>
          {/*----------------------------- certificate----------------------- */}
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            sx={{
              backgroundColor: profileData?.certificate ? 'grey.100' : 'background.paper',
              border: 1,
              borderColor: 'grey.300',
              width: '100%',
              px: 2,
              borderRadius: 2,
            }}
            onClick={() => {
              if (!profileData?.certificate) {
                handleRoute(PATH_APP.profile.ngo.certificate.root);
              }
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Avatar
                alt="Profile Picture"
                sx={{ my: 1, backgroundColor: profileData?.certificate ? 'background.paper' : 'grey.100' }}
              >
                <Icon
                  name="cover-photo"
                  size={24}
                  color={profileData?.certificate ? 'primary.light' : 'primary.main'}
                />
              </Avatar>
              <Stack spacing={0.5}>
                {!profileData?.certificate ? (
                  <>
                    <Typography variant="subtitle2" color="text.primary">
                      <FormattedMessage {...WizardMessages.addCertificate} />
                    </Typography>
                    <Typography variant="caption" color="grey.500">
                      <FormattedMessage {...WizardMessages.addYourCertificate} />
                    </Typography>
                  </>
                ) : (
                  <Typography variant="subtitle2" color="grey.500">
                    <FormattedMessage {...WizardMessages.certificateAdded} />
                  </Typography>
                )}
              </Stack>
            </Stack>
            <Box>
              {profileData?.certificate ? (
                <IconButton sx={{ padding: 0 }}>
                  <Icon type="solid" name="Approve-Tick-1" color="primary.light" />
                </IconButton>
              ) : (
                <IconButton sx={{ padding: 0 }}>
                  <Icon name="right-arrow-1" color="grey.500" />
                </IconButton>
              )}
            </Box>
          </Stack>
          {/* -----------------------------Public details--------------------------- */}
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            sx={{
              backgroundColor:
                profileData?.profileDetails === ProfileCompleteEnum.Nothing ? 'background.paper' : 'grey.100',
              border: 1,
              borderColor: 'grey.300',
              width: '100%',
              px: 2,
              borderRadius: 2,
            }}
            onClick={() => {
              if (profileData?.profileDetails !== ProfileCompleteEnum.Complete) {
                handleRoute(PATH_APP.profile.ngo.publicDetails.main);
              }
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Avatar
                alt="Profile Picture"
                sx={{
                  my: 1,
                  backgroundColor:
                    profileData?.profileDetails === ProfileCompleteEnum.Nothing ? 'grey.100' : 'background.paper',
                }}
              >
                <Icon
                  name="user-info"
                  color={
                    profileData?.profileDetails === ProfileCompleteEnum.Complete ? 'primary.light' : 'primary.main'
                  }
                />
              </Avatar>
              <Stack spacing={0.5}>
                {profileData?.profileDetails === ProfileCompleteEnum.Complete ? (
                  <Typography variant="subtitle2" color="grey.500">
                    <FormattedMessage {...WizardMessages.publicDetailsCompleted} />
                  </Typography>
                ) : (
                  <>
                    <Typography variant="subtitle2" color="text.primary">
                      <FormattedMessage {...WizardMessages.publicDetails} />
                    </Typography>
                    {profileData?.profileDetails === ProfileCompleteEnum.Nothing ? (
                      <Typography variant="caption" color="grey.500">
                        <FormattedMessage {...WizardMessages.insertYourPublicDetails} />
                      </Typography>
                    ) : (
                      <Typography variant="caption" color="grey.500">
                        <FormattedMessage {...WizardMessages.completeYourPublicDetails} />
                      </Typography>
                    )}
                  </>
                )}
              </Stack>
            </Stack>
            <Box>
              {profileData?.profileDetails === ProfileCompleteEnum.Complete ? (
                <IconButton sx={{ padding: 0 }}>
                  <Icon type="solid" name="Approve-Tick-1" color="primary.light" />
                </IconButton>
              ) : (
                <IconButton sx={{ padding: 0 }}>
                  <Icon name="right-arrow-1" color="grey.500" />
                </IconButton>
              )}
            </Box>
          </Stack>

          {/* ------------------------------------project------------------------------------- */}
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            sx={{
              backgroundColor: profileData?.projects ? 'grey.100' : 'background.paper',
              border: 1,
              borderColor: 'grey.300',
              width: '100%',
              px: 2,
              borderRadius: 2,
            }}
            onClick={() => {
              if (!profileData?.projects) {
                handleRoute(PATH_APP.profile.ngo.project.list);
              }
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Avatar
                alt="Profile Picture"
                sx={{ my: 1, backgroundColor: profileData?.projects ? 'background.paper' : 'grey.100' }}
              >
                <Icon name="office-bag" size={24} color={profileData?.projects ? 'primary.light' : 'primary.main'} />
              </Avatar>
              <Stack spacing={0.5}>
                {!profileData?.projects ? (
                  <>
                    <Typography variant="subtitle2" color="text.primary">
                      <FormattedMessage {...WizardMessages.projects} />
                    </Typography>
                    <Typography variant="caption" color="grey.500">
                      <FormattedMessage {...WizardMessages.insertProjects} />
                    </Typography>
                  </>
                ) : (
                  <Typography variant="subtitle2" color="grey.500">
                    <FormattedMessage {...WizardMessages.projectsCompleted} />
                  </Typography>
                )}
              </Stack>
            </Stack>
            <Box>
              {profileData?.projects ? (
                <IconButton sx={{ padding: 0 }}>
                  <Icon type="solid" name="Approve-Tick-1" color="primary.light" />
                </IconButton>
              ) : (
                <IconButton sx={{ padding: 0 }}>
                  <Icon name="right-arrow-1" color="grey.500" />
                </IconButton>
              )}
            </Box>
          </Stack>

          {/*---------------------- Website link--------------------------- */}
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            sx={{
              backgroundColor: profileData?.webSiteLinks ? 'grey.100' : 'background.paper',
              border: 1,
              borderColor: 'grey.300',
              width: '100%',
              px: 2,
              borderRadius: 2,
            }}
            onClick={() => {
              if (!profileData?.webSiteLinks) {
                handleRoute(PATH_APP.profile.ngo.contactInfo.root);
              }
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Avatar
                alt="Profile Picture"
                sx={{ my: 1, backgroundColor: profileData?.webSiteLinks ? 'background.paper' : 'grey.100' }}
              >
                <Icon
                  name="mortarboard-Education"
                  color={profileData?.webSiteLinks ? 'primary.light' : 'primary.main'}
                />
              </Avatar>
              <Stack spacing={0.5}>
                {!profileData?.webSiteLinks ? (
                  <>
                    <Typography variant="subtitle2" color="text.primary">
                      <FormattedMessage {...WizardMessages.websiteLink} />
                    </Typography>
                    <Typography variant="caption" color="grey.500">
                      <FormattedMessage {...WizardMessages.insertWebsiteInfo} />
                    </Typography>
                  </>
                ) : (
                  <Typography variant="subtitle2" color="grey.500">
                    <FormattedMessage {...WizardMessages.websiteCompleted} />
                  </Typography>
                )}
              </Stack>
            </Stack>
            <Box>
              {profileData?.webSiteLinks ? (
                <IconButton sx={{ padding: 0 }}>
                  <Icon type="solid" name="Approve-Tick-1" color="primary.light" />
                </IconButton>
              ) : (
                <IconButton sx={{ padding: 0 }}>
                  <Icon name="right-arrow-1" color="grey.500" />
                </IconButton>
              )}
            </Box>
          </Stack>
          {/* -----------------------------------------------phoneNumber--------------------------------------- */}
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            sx={{
              backgroundColor: profileData?.phoneNumber ? 'grey.100' : 'background.paper',
              border: 1,
              borderColor: 'grey.300',
              width: '100%',
              px: 2,
              borderRadius: 2,
            }}
            onClick={() => {
              if (!profileData?.phoneNumber) {
                handleRoute(PATH_APP.profile.ngo.contactInfo.root);
              }
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Avatar
                alt="Profile Picture"
                sx={{ my: 1, backgroundColor: profileData?.phoneNumber ? 'background.paper' : 'grey.100' }}
              >
                <Icon
                  name="mortarboard-Education"
                  color={profileData?.phoneNumber ? 'primary.light' : 'primary.main'}
                />
              </Avatar>
              <Stack spacing={0.5}>
                {!profileData?.phoneNumber ? (
                  <>
                    <Typography variant="subtitle2" color="text.primary">
                      <FormattedMessage {...WizardMessages.phoneNumber} />
                    </Typography>
                    <Typography variant="caption" color="grey.500">
                      <FormattedMessage {...WizardMessages.insertPhoneNumber} />
                    </Typography>
                  </>
                ) : (
                  <Typography variant="subtitle2" color="grey.500">
                    <FormattedMessage {...WizardMessages.phoneNumberCompleted} />
                  </Typography>
                )}
              </Stack>
            </Stack>
            <Box>
              {profileData?.phoneNumber ? (
                <IconButton sx={{ padding: 0 }}>
                  <Icon type="solid" name="Approve-Tick-1" color="primary.light" />
                </IconButton>
              ) : (
                <IconButton sx={{ padding: 0 }}>
                  <Icon name="right-arrow-1" color="grey.500" />
                </IconButton>
              )}
            </Box>
          </Stack>
        </Stack>
      </Stack>
      {/*------------------------------------ bottom sheet ------------------ */}
      <BottomSheet open={profileCoverAvatar} onDismiss={() => setProfileCoverAvatarBottomSheet(false)}>
        <MainProfileCoverAvatarNgo
          isAvatar={statusPhoto === 'avatar'}
          onCloseBottomSheet={() => {
            setProfileCoverAvatarBottomSheet(false);
          }}
        />
      </BottomSheet>
    </>
  );
}
