import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
// import bottom sheet
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';

import { Avatar, Box, Button, CircularProgress, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useLazyProfileCompleteQuery } from 'src/_graphql/profile/users/queries/profileComplete.generated';
// services !
import { Icon } from 'src/components/Icon';
import useAuth from 'src/hooks/useAuth';
import { PATH_APP } from 'src/routes/paths';
// types
import { ProfileCompleteEnum } from 'src/types/serverTypes';

import WizardMessages from '../../WizardPwa';
// component for bottomSheet
import MainProfileCoverAvatarUser from '../owner/userMain/addAvatarCoverPhoto/MainProfileCoverAvatarUser';

// --------------start project------------------

function WizardList() {
  const navigate = useNavigate();
  const { initialize } = useAuth();
  // bottom sheet   & state for edit photo
  const [profileCoverAvatar, setProfileCoverAvatarBottomSheet] = useState(false);
  const [statusPhoto, setStatusPhoto] = useState<'cover' | 'avatar' | undefined>();
  //services !
  const [profileComplete, { data }] = useLazyProfileCompleteQuery();

  // useEffect for get data
  useEffect(() => {
    profileComplete({
      filter: {
        all: true,
      },
    });
  }, [profileComplete]);

  // useEffect for bottom sheet -------
  useEffect(() => {
    if (!profileCoverAvatar)
      profileComplete({
        filter: {
          all: true,
        },
      });
  }, [profileComplete, profileCoverAvatar]);

  const profileData = data?.profileComplete?.listDto?.items?.[0];
  // functions !
  function handleRoute(route: string) {
    localStorage.setItem('fromWizard', 'true');
    navigate(route);
  }
  function handleCoverPhoto() {
    if (!profileData?.coverPhoto) {
      setProfileCoverAvatarBottomSheet(true);
      setStatusPhoto('cover');
    }
  }
  function handleProfilePicture() {
    if (!profileData?.profilePicture) {
      setProfileCoverAvatarBottomSheet(true);
      setStatusPhoto('avatar');
    }
  }
  return (
    <>
      <Stack>
        <Stack sx={{ px: 2, pt: 3, pb: 2, gap: 1 }} direction="row" alignItems="center">
          <IconButton
            onClick={() => {
              initialize();
              navigate('/');
            }}
          >
            <Icon name="left-arrow-1" color="text.primary" />
          </IconButton>
          <Typography variant="subtitle1" color="text.primary">
            <FormattedMessage {...WizardMessages.completeYourProfile} />
          </Typography>
        </Stack>
        <Divider />
        <Stack sx={{ mt: 2, px: 2 }} spacing={3} alignItems="center" justifyContent="space-between">
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            sx={{ backgroundColor: 'grey.100', width: '100%', px: 1, borderRadius: 1, mb: 2 }}
          >
            <Stack direction="row" alignItems="center" sx={{ gap: 1 }}>
              {profileData?.completeProfilePercentage === 100 ? (
                <Box sx={{ my: 1.7 }}>
                  <Icon name="Like" type="solid" color="primary.main" />
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
              <Button size="small" variant="text" color="info" onClick={() => navigate(PATH_APP.profile.user.root)}>
                <Typography variant="button">
                  <FormattedMessage {...WizardMessages.openMyProfile} />
                </Typography>
              </Button>
            </Box>
          </Stack>
          {/*-------------------------- profile-Picture-------------------- */}
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            sx={{
              backgroundColor: profileData?.profilePicture ? 'grey.100' : 'background.paper',
              border: 1,
              borderColor: 'grey.300',
              width: '100%',
              px: 2,
              borderRadius: 2,
            }}
            onClick={handleProfilePicture}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Avatar
                alt="Profile Picture"
                sx={{ my: 1, backgroundColor: profileData?.profilePicture ? 'background.paper' : 'grey.100' }}
              >
                <Icon name="Profile-Photo" color={profileData?.profilePicture ? 'primary.light' : 'primary.main'} />
              </Avatar>
              <Stack spacing={0.5}>
                {!profileData?.profilePicture ? (
                  <>
                    <Typography variant="subtitle2" color="text.primary">
                      <FormattedMessage {...WizardMessages.profilePic} />
                    </Typography>
                    <Typography variant="caption" color="grey.500">
                      <FormattedMessage {...WizardMessages.uploadYourProfilePic} />
                    </Typography>
                  </>
                ) : (
                  <Typography variant="subtitle2" color="grey.500">
                    <FormattedMessage {...WizardMessages.profilePicUploaded} />
                  </Typography>
                )}
              </Stack>
            </Stack>
            <Box>
              {profileData?.profilePicture ? (
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
                <Icon name="cover-photo" size={24} color={profileData?.coverPhoto ? 'primary.light' : 'primary.main'} />
              </Avatar>
              <Stack spacing={0.5}>
                {!profileData?.coverPhoto ? (
                  <>
                    <Typography variant="subtitle2" color="text.primary">
                      <FormattedMessage {...WizardMessages.coverPhoto} />
                    </Typography>
                    <Typography variant="caption" color="grey.500">
                      <FormattedMessage {...WizardMessages.uploadCoverPhoto} />
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
                <IconButton
                  sx={{ padding: 0 }}
                  onClick={() => {
                    setProfileCoverAvatarBottomSheet(true);
                    setStatusPhoto('cover');
                  }}
                >
                  <Icon name="right-arrow-1" color="grey.500" />
                </IconButton>
              )}
            </Box>
          </Stack>
          {/* ---------------------------profile information ---------------- */}
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            sx={{
              backgroundColor:
                profileData?.profileInformation === ProfileCompleteEnum.Nothing ? 'background.paper' : 'grey.100',
              border: 1,
              borderColor: 'grey.300',
              width: '100%',
              px: 2,
              borderRadius: 2,
            }}
            onClick={() => {
              if (profileData?.profileInformation !== ProfileCompleteEnum.Complete) {
                handleRoute(PATH_APP.profile.user.userEdit);
              }
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Avatar
                alt="Profile Picture"
                sx={{
                  my: 1,
                  backgroundColor:
                    profileData?.profileInformation === ProfileCompleteEnum.Nothing ? 'grey.100' : 'background.paper',
                }}
              >
                <Icon
                  name="user-info"
                  color={
                    profileData?.profileInformation === ProfileCompleteEnum.Complete ? 'primary.light' : 'primary.main'
                  }
                />
              </Avatar>
              <Stack spacing={0.5}>
                {profileData?.profileInformation === ProfileCompleteEnum.Complete ? (
                  <Typography variant="subtitle2" color="grey.500">
                    <FormattedMessage {...WizardMessages.profileInfoCompleted} />
                  </Typography>
                ) : (
                  <>
                    <Typography variant="subtitle2" color="text.primary">
                      <FormattedMessage {...WizardMessages.profileInformation} />
                    </Typography>
                    {profileData?.profileInformation === ProfileCompleteEnum.Nothing ? (
                      <Typography variant="caption" color="grey.500">
                        <FormattedMessage {...WizardMessages.insertYourProfileInfo} />
                      </Typography>
                    ) : (
                      <Typography variant="caption" color="grey.500">
                        <FormattedMessage {...WizardMessages.completeYourProfileInfo} />
                      </Typography>
                    )}
                  </>
                )}
              </Stack>
            </Stack>
            <Box>
              {profileData?.profileInformation === ProfileCompleteEnum.Complete ? (
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
          {/*------------------------------------- location--------------------------- */}
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            sx={{
              backgroundColor: profileData?.location === ProfileCompleteEnum.Nothing ? 'background.paper' : 'grey.100',
              border: 1,
              borderColor: 'grey.300',
              width: '100%',
              px: 2,
              borderRadius: 2,
            }}
            onClick={() => {
              if (profileData?.location !== ProfileCompleteEnum.Complete) {
                handleRoute(PATH_APP.profile.user.publicDetails.root);
              }
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Avatar
                alt="Profile Picture"
                sx={{
                  my: 1,
                  backgroundColor:
                    profileData?.location === ProfileCompleteEnum.Nothing ? 'grey.100' : 'background.paper',
                }}
              >
                <Icon
                  name="location"
                  color={profileData?.location === ProfileCompleteEnum.Complete ? 'primary.light' : 'primary.main'}
                />
              </Avatar>
              <Stack spacing={0.5}>
                {profileData?.location === ProfileCompleteEnum.Complete ? (
                  <Typography variant="subtitle2" color="grey.500">
                    <FormattedMessage {...WizardMessages.locationInfoCompleted} />
                  </Typography>
                ) : (
                  <>
                    <Typography variant="subtitle2" color="text.primary">
                      <FormattedMessage {...WizardMessages.location} />
                    </Typography>
                    {profileData?.location === ProfileCompleteEnum.Nothing ? (
                      <Typography variant="caption" color="grey.500">
                        <FormattedMessage {...WizardMessages.insertYourProfileInfo} />
                      </Typography>
                    ) : (
                      <Typography variant="caption" color="grey.500">
                        <FormattedMessage {...WizardMessages.completeYourLocationInfo} />
                      </Typography>
                    )}
                  </>
                )}
              </Stack>
            </Stack>
            <Box>
              {profileData?.location === ProfileCompleteEnum.Complete ? (
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
          {/* ------------------------------------experience------------------------------------- */}
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            sx={{
              backgroundColor: profileData?.experience ? 'grey.100' : 'background.paper',
              border: 1,
              borderColor: 'grey.300',
              width: '100%',
              px: 2,
              borderRadius: 2,
            }}
            onClick={() => {
              if (!profileData?.experience) {
                handleRoute(PATH_APP.profile.user.experience.root);
              }
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Avatar
                alt="Profile Picture"
                sx={{ my: 1, backgroundColor: profileData?.experience ? 'background.paper' : 'grey.100' }}
              >
                <Icon name="office-bag" size={24} color={profileData?.experience ? 'primary.light ' : 'primary.main'} />
              </Avatar>
              <Stack spacing={0.5}>
                {!profileData?.experience ? (
                  <>
                    <Typography variant="subtitle2" color="text.primary">
                      <FormattedMessage {...WizardMessages.experience} />
                    </Typography>
                    <Typography variant="caption" color="grey.500">
                      <FormattedMessage {...WizardMessages.insertYourProfileInfo} />
                    </Typography>
                  </>
                ) : (
                  <Typography variant="subtitle2" color="grey.500">
                    <FormattedMessage {...WizardMessages.exprienceInfoCompleted} />
                  </Typography>
                )}
              </Stack>
            </Stack>
            <Box>
              {profileData?.experience ? (
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
          {/* -----------------------------------------education--------------------------------- */}
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            sx={{
              backgroundColor: profileData?.education ? 'grey.100' : 'background.paper',
              border: 1,
              borderColor: 'grey.300',
              width: '100%',
              px: 2,
              borderRadius: 2,
            }}
            onClick={() => {
              if (!profileData?.education) {
                handleRoute(PATH_APP.profile.user.publicDetails.root);
              }
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Avatar
                alt="Profile Picture"
                sx={{ my: 1, backgroundColor: profileData?.education ? 'background.paper' : 'grey.100' }}
              >
                <Icon
                  name="mortarboard-Education"
                  size={24}
                  color={profileData?.education ? 'primary.light' : 'primary.main'}
                />
              </Avatar>
              <Stack spacing={0.5}>
                {!profileData?.education ? (
                  <>
                    <Typography variant="subtitle2" color="text.primary">
                      <FormattedMessage {...WizardMessages.education} />
                    </Typography>
                    <Typography variant="caption" color="grey.500">
                      <FormattedMessage {...WizardMessages.insertEducationInfo} />
                    </Typography>
                  </>
                ) : (
                  <Typography variant="subtitle2" color="grey.500">
                    <FormattedMessage {...WizardMessages.educationInfoCompleted} />
                  </Typography>
                )}
              </Stack>
            </Stack>
            <Box>
              {profileData?.education ? (
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
      {/*------------------------------- bottom sheet------------------ */}
      <BottomSheet open={profileCoverAvatar} onDismiss={() => setProfileCoverAvatarBottomSheet(false)}>
        <MainProfileCoverAvatarUser
          isAvatar={statusPhoto === 'avatar'}
          onCloseBottomSheet={() => {
            setProfileCoverAvatarBottomSheet(false);
          }}
        />
      </BottomSheet>
    </>
  );
}

export default WizardList;
