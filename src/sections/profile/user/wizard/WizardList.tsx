import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Avatar, Box, Button, CircularProgress, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useLazyGetUserDetailQuery } from 'src/_graphql/profile/publicDetails/queries/getUser.generated';
import { useLazyProfileCompleteQuery } from 'src/_graphql/profile/users/queries/profileComplete.generated';
import { Icon } from 'src/components/Icon';
import { PATH_APP, PathAppCaller } from 'src/routes/paths';
import { ProfileCompleteEnum } from 'src/types/serverTypes';
import sleep from 'src/utils/sleep';

import WizardMessages from '../../UserWizard.messages';

function WizardList() {
  const router = useNavigate();

  const [profileComplete, { data }] = useLazyProfileCompleteQuery();
  const [getUserDetail, { data: userData }] = useLazyGetUserDetailQuery();

  useEffect(() => {
    profileComplete({
      filter: {
        all: true,
      },
    });
    getUserDetail({ filter: { dto: {} } });
  }, []);

  const profileData = data?.profileComplete?.listDto?.items?.[0];
  const user = userData?.getUser?.listDto?.items?.[0];

  async function handleRoute(route: string) {
    localStorage.setItem('fromWizard', 'true');
    await sleep(100);
    PathAppCaller();
    await sleep(100);
    router(route);
  }

  function handleClose() {
    const fromHomePage = localStorage.getItem('homePageWizard');
    if (fromHomePage === 'true') {
      localStorage.removeItem('homePageWizard');
      router(PATH_APP.home.index);
    } else router(PATH_APP.profile.user.root);
  }

  return (
    <Dialog fullWidth maxWidth="sm" open onClose={handleClose}>
      {/* ------------------------------------------Header------------------------------------------- */}
      <Stack sx={{ mb: 2, px: 2, pt: 3 }} direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle1">
          <FormattedMessage {...WizardMessages.completeYourProfile} />
        </Typography>
        <Stack direction="row" spacing={2}>
          <IconButton sx={{ padding: 0 }} onClick={handleClose}>
            <Icon name="Close" color="text.primary" />
          </IconButton>
        </Stack>
      </Stack>
      <Divider />
      {/* ------------------------------------------Percentage Of Complete------------------------------------------- */}
      <Stack sx={{ mt: 3, mb: 2, px: 2 }} spacing={3} alignItems="center" justifyContent="space-between">
        <Stack
          justifyContent="space-between"
          alignItems="center"
          direction="row"
          sx={{ backgroundColor: 'grey.100', width: '100%', px: 2, borderRadius: 1 }}
        >
          <Stack direction="row" alignItems="center" sx={{ gap: 2 }}>
            {profileData?.completeProfilePercentage === 100 ? (
              <Box sx={{ my: 1.7 }}>
                <Icon name="Like" type="solid" color="primary.main" />
              </Box>
            ) : (
              <Box>
                <CircularProgress
                  variant="determinate"
                  value={profileData?.completeProfilePercentage || undefined}
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
                {profileData?.completeProfilePercentage && user?.completeProfilePercentage + '%'}
              </Typography>
              <Typography variant="subtitle1" color="grey.500">
                <FormattedMessage {...WizardMessages.completed} />
              </Typography>
            </Stack>
          </Stack>
          <Box>
            <Button size="small" variant="text" color="info">
              <Typography variant="button" onClick={() => router(PATH_APP.profile.user.root)}>
                <FormattedMessage {...WizardMessages.openMyProfile} />
              </Typography>
            </Button>
          </Box>
        </Stack>
        {/* ------------------------------------------Profile Picture------------------------------------------- */}
        {!profileData?.profilePicture ? (
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            onClick={() =>
              user?.personDto?.avatarUrl
                ? handleRoute(PATH_APP.profile.user.mainProfileChangeAvatarUser)
                : handleRoute(PATH_APP.profile.user.mainProfileAddAvatarUser)
            }
            sx={{
              backgroundColor: 'background.paper',
              border: 1,
              borderColor: 'grey.300',
              width: '100%',
              px: 2,
              borderRadius: 2,
              cursor: 'pointer',
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Avatar alt="Profile Picture" sx={{ my: 1, backgroundColor: 'grey.100' }}>
                <Icon name="Profile-Photo" size={24} color="primary.main" />
              </Avatar>
              <Stack>
                <Typography variant="subtitle2" color="text.primary">
                  <FormattedMessage {...WizardMessages.profilePic} />
                </Typography>
                <Typography variant="caption" color="grey.500">
                  <FormattedMessage {...WizardMessages.uploadYourProfilePic} />
                </Typography>
              </Stack>
            </Stack>
            <IconButton
              sx={{ padding: 0 }}
              onClick={() =>
                user?.personDto?.avatarUrl
                  ? handleRoute(PATH_APP.profile.user.mainProfileChangeAvatarUser)
                  : handleRoute(PATH_APP.profile.user.mainProfileAddAvatarUser)
              }
            >
              <Icon name="right-arrow" size={24} color="grey.500" />
            </IconButton>
          </Stack>
        ) : (
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            sx={{
              backgroundColor: 'grey.100',
              border: 1,
              borderColor: 'grey.300',
              width: '100%',
              px: 2,
              borderRadius: 2,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Avatar alt="Profile Picture" sx={{ my: 1, backgroundColor: 'background.paper' }}>
                <Icon name="Profile-Photo" size={24} color="primary.light" />
              </Avatar>
              <Stack>
                <Typography variant="subtitle2" color="grey.500">
                  <FormattedMessage {...WizardMessages.profilePicUploaded} />
                </Typography>
              </Stack>
            </Stack>
            <IconButton sx={{ padding: 0 }}>
              <Icon name="Approve-Tick" type="solid" size={24} color="primary.light" />
            </IconButton>
          </Stack>
        )}
        {/* ------------------------------------------Cover Photo------------------------------------------- */}
        {!profileData?.coverPhoto ? (
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            onClick={() => {
              user?.personDto?.coverUrl
                ? handleRoute(PATH_APP.profile.user.mainProfileChangeCoverUser)
                : handleRoute(PATH_APP.profile.user.mainProfileAddCoverUser);
            }}
            sx={{
              backgroundColor: 'background.paper',
              border: 1,
              borderColor: 'grey.300',
              width: '100%',
              px: 2,
              borderRadius: 2,
              cursor: 'pointer',
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Avatar alt="Profile Picture" sx={{ my: 1, backgroundColor: 'grey.100' }}>
                <Icon name="cover-photo" size={24} color="primary.main" />
              </Avatar>
              <Stack>
                <Typography variant="subtitle2" color="text.primary">
                  <FormattedMessage {...WizardMessages.coverPhoto} />
                </Typography>
                <Typography variant="caption" color="grey.500">
                  <FormattedMessage {...WizardMessages.uploadCoverPhoto} />
                </Typography>
              </Stack>
            </Stack>
            <IconButton
              sx={{ padding: 0 }}
              onClick={() => {
                user?.personDto?.coverUrl
                  ? handleRoute(PATH_APP.profile.user.mainProfileChangeCoverUser)
                  : handleRoute(PATH_APP.profile.user.mainProfileAddCoverUser);
              }}
            >
              <Icon name="right-arrow" size={24} color="grey.500" />
            </IconButton>
          </Stack>
        ) : (
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            sx={{
              backgroundColor: 'grey.100',
              border: 1,
              borderColor: 'grey.300',
              width: '100%',
              px: 2,
              borderRadius: 2,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Avatar alt="Profile Picture" sx={{ my: 1, backgroundColor: 'background.paper' }}>
                <Icon name="cover-photo" size={24} color="primary.light" />
              </Avatar>
              <Stack>
                <Typography variant="subtitle2" color="grey.500">
                  <FormattedMessage {...WizardMessages.coverPhotoUploaded} />
                </Typography>
              </Stack>
            </Stack>
            <IconButton sx={{ padding: 0 }}>
              <Icon name="Approve-Tick" type="solid" size={24} color="primary.light" />
            </IconButton>
          </Stack>
        )}
        {/* ------------------------------------------Profile Information------------------------------------------- */}
        <Stack
          justifyContent="space-between"
          alignItems="center"
          direction="row"
          onClick={() =>
            profileData?.profileInformation !== ProfileCompleteEnum.Complete &&
            handleRoute(PATH_APP.profile.user.userEdit)
          }
          sx={{
            backgroundColor:
              profileData?.profileInformation === ProfileCompleteEnum.Nothing ? 'Background.paper' : 'grey.100',
            border: 1,
            borderColor: 'grey.300',
            width: '100%',
            px: 2,
            borderRadius: 2,
            cursor: 'pointer',
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            <Avatar
              alt="Profile Picture"
              sx={{
                my: 1,
                backgroundColor: profileData?.profileInformation === ProfileCompleteEnum.Nothing ? 'grey.100' : '#fff',
              }}
            >
              <Icon
                name="user-info"
                size={24}
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
                <Icon name="Approve-Tick" type="solid" size={24} color="primary.light" />
              </IconButton>
            ) : (
              <IconButton sx={{ padding: 0 }} onClick={() => handleRoute(PATH_APP.profile.user.userEdit)}>
                <Icon name="right-arrow" size={24} color="grey.500" />
              </IconButton>
            )}
          </Box>
        </Stack>
        {/* ------------------------------------------Location------------------------------------------- */}
        <Stack
          justifyContent="space-between"
          alignItems="center"
          direction="row"
          onClick={() =>
            profileData?.location !== ProfileCompleteEnum.Complete &&
            handleRoute(PATH_APP.profile.user.publicDetails.root)
          }
          sx={{
            backgroundColor: profileData?.location === ProfileCompleteEnum.Complete ? 'grey.100' : 'background.paper',
            border: 1,
            borderColor: 'grey.300',
            width: '100%',
            px: 2,
            borderRadius: 2,
            cursor: 'pointer',
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            <Avatar
              alt="Profile Picture"
              sx={{
                my: 1,
                backgroundColor: profileData?.location === ProfileCompleteEnum.Nothing ? 'grey.100' : '#fff',
              }}
            >
              <Icon
                name="location"
                size={24}
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
                      <FormattedMessage {...WizardMessages.insertLocationInfo} />
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
                <Icon name="Approve-Tick" type="solid" size={24} color="primary.light" />
              </IconButton>
            ) : (
              <IconButton sx={{ padding: 0 }} onClick={() => router(PATH_APP.profile.user.publicDetails.root)}>
                <Icon name="right-arrow" size={24} color="grey.500" />
              </IconButton>
            )}
          </Box>
        </Stack>
        {/* ------------------------------------------Exprience------------------------------------------- */}
        {!profileData?.experience ? (
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            onClick={() => {
              !profileData?.experience && handleRoute(PATH_APP.profile.user.experience.root);
            }}
            sx={{
              backgroundColor: 'background.paper',
              border: 1,
              borderColor: 'grey.300',
              width: '100%',
              px: 2,
              borderRadius: 2,
              cursor: 'pointer',
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Avatar alt="Profile Picture" sx={{ my: 1, backgroundColor: 'grey.100' }}>
                <Icon name="office-bag" size={24} color="primary.main" />
              </Avatar>
              <Stack>
                <Typography variant="subtitle2" color="text.primary">
                  <FormattedMessage {...WizardMessages.experience} />
                </Typography>
                <Typography variant="caption" color="grey.500">
                  <FormattedMessage {...WizardMessages.insertExprienceInfo} />
                </Typography>
              </Stack>
            </Stack>
            <IconButton
              sx={{ padding: 0 }}
              onClick={() => {
                handleRoute(PATH_APP.profile.user.experience.root);
              }}
            >
              <Icon name="right-arrow" size={24} color="grey.500" />
            </IconButton>
          </Stack>
        ) : (
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            sx={{
              backgroundColor: 'grey.100',
              border: 1,
              borderColor: 'grey.300',
              width: '100%',
              px: 2,
              borderRadius: 2,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Avatar alt="Profile Picture" sx={{ my: 1, backgroundColor: 'background.paper' }}>
                <Icon name="office-bag" size={24} color="primary.light" />
              </Avatar>
              <Stack>
                <Typography variant="subtitle2" color="grey.500">
                  <FormattedMessage {...WizardMessages.exprienceInfoCompleted} />
                </Typography>
              </Stack>
            </Stack>
            <IconButton sx={{ padding: 0 }}>
              <Icon name="Approve-Tick" type="solid" size={24} color="primary.light" />
            </IconButton>
          </Stack>
        )}
        {/* ------------------------------------------Education------------------------------------------- */}
        {!profileData?.education ? (
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            onClick={() => !profileData?.education && handleRoute(PATH_APP.profile.user.publicDetails.root)}
            sx={{
              backgroundColor: 'background.paper',
              border: 1,
              borderColor: 'grey.300',
              width: '100%',
              px: 2,
              borderRadius: 2,
              cursor: 'pointer',
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Avatar alt="Profile Picture" sx={{ my: 1, backgroundColor: 'grey.100' }}>
                <Icon name="mortarboard-Education" size={24} color="primary.main" />
              </Avatar>
              <Stack>
                <Typography variant="subtitle2" color="text.primary">
                  <FormattedMessage {...WizardMessages.education} />
                </Typography>
                <Typography variant="caption" color="grey.500">
                  <FormattedMessage {...WizardMessages.insertEducationInfo} />
                </Typography>
              </Stack>
            </Stack>
            <IconButton sx={{ padding: 0 }} onClick={() => handleRoute(PATH_APP.profile.user.publicDetails.root)}>
              <Icon name="right-arrow" size={24} color="grey.500" />
            </IconButton>
          </Stack>
        ) : (
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            sx={{
              backgroundColor: 'grey.100',
              border: 1,
              borderColor: 'grey.300',
              width: '100%',
              px: 2,
              borderRadius: 2,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Avatar alt="Profile Picture" sx={{ my: 1, backgroundColor: 'background.paper' }}>
                <Icon name="mortarboard-Education" size={24} color="primary.light" />
              </Avatar>
              <Stack>
                <Typography variant="subtitle2" color="grey.500">
                  <FormattedMessage {...WizardMessages.educationInfoCompleted} />
                </Typography>
              </Stack>
            </Stack>
            <IconButton sx={{ padding: 0 }}>
              <Icon name="Approve-Tick" type="solid" size={24} color="primary.light" />
            </IconButton>
          </Stack>
        )}
      </Stack>
    </Dialog>
  );
}

export default WizardList;
