import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Avatar, Box, Button, CircularProgress, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useLazyGetUserDetailQuery } from 'src/_graphql/profile/publicDetails/queries/getUser.generated';
import { useLazyOrganizationProfileCompleteQuery } from 'src/_graphql/profile/users/queries/organizationProfileComplete.generated';
import { Icon } from 'src/components/Icon';
import { PATH_APP, PathAppCaller } from 'src/routes/paths';
import { ProfileCompleteEnum } from 'src/types/serverTypes';
import sleep from 'src/utils/sleep';

import WizardMessages from '../../UserWizard.messages';

function WizardList() {
  const router = useNavigate();

  const [profileComplete, { data }] = useLazyOrganizationProfileCompleteQuery();
  const [getUserDetail, { data: userData }] = useLazyGetUserDetailQuery();

  useEffect(() => {
    profileComplete({
      filter: {
        all: true,
      },
    });
    getUserDetail({ filter: { dto: {} } });
  }, [getUserDetail, profileComplete]);

  const profileData = data?.organizationProfileComplete?.listDto?.items?.[0];
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
    } else router(PATH_APP.profile.ngo.root);
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
                {profileData?.completeProfilePercentage && user?.completeProfilePercentage + '%'}
              </Typography>
              <Typography variant="subtitle1" color="grey.500">
                <FormattedMessage {...WizardMessages.completed} />
              </Typography>
            </Stack>
          </Stack>
          <Box>
            <Button size="small" variant="text" color="info">
              <Typography
                variant="button"
                onClick={() => {
                  localStorage.removeItem('homePageWizard');
                  setTimeout(() => {
                    const paths = PathAppCaller();
                    router(paths.profile.ngo.root);
                  }, 200);
                }}
              >
                <FormattedMessage {...WizardMessages.openMyProfile} />
              </Typography>
            </Button>
          </Box>
        </Stack>
        {/* ------------------------------------------Ngo Logo------------------------------------------- */}
        {!profileData?.ngoLogo ? (
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            onClick={() => handleRoute(PATH_APP.profile.ngo.ngoEditAvatar)}
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
                  <FormattedMessage {...WizardMessages.yourNgoLogo} />
                </Typography>
                <Typography variant="caption" color="grey.500">
                  <FormattedMessage {...WizardMessages.uploadYourOfficialLogo} />
                </Typography>
              </Stack>
            </Stack>
            <IconButton sx={{ padding: 0 }} onClick={() => handleRoute(PATH_APP.profile.ngo.ngoEditAvatar)}>
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
                  <FormattedMessage {...WizardMessages.ngoLogoUploaded} />
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
            onClick={() => handleRoute(PATH_APP.profile.ngo.ngoEditCover)}
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
                  <FormattedMessage {...WizardMessages.relatedPicToYourCategory} />
                </Typography>
              </Stack>
            </Stack>
            <IconButton sx={{ padding: 0 }} onClick={() => handleRoute(PATH_APP.profile.ngo.ngoEditCover)}>
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
                <Icon name="cover-photo" size={24} color="primary.main" />
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
        {/* ------------------------------------------Bio------------------------------------------- */}
        {!profileData?.bio ? (
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            onClick={() => {
              !profileData?.bio && handleRoute(PATH_APP.profile.ngo.bioDialog);
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
                <Icon name="Saved" size={24} color="primary.main" />
              </Avatar>
              <Stack>
                <Typography variant="subtitle2" color="text.primary">
                  <FormattedMessage {...WizardMessages.addBio} />
                </Typography>
                <Typography variant="caption" color="grey.500">
                  <FormattedMessage {...WizardMessages.insertYourBio} />
                </Typography>
              </Stack>
            </Stack>
            <IconButton
              sx={{ padding: 0 }}
              onClick={() => {
                !profileData?.bio && handleRoute(PATH_APP.profile.ngo.bioDialog);
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
                <Icon name="Saved" size={24} color="primary.light" />
              </Avatar>
              <Stack>
                <Typography variant="subtitle2" color="grey.500">
                  <FormattedMessage {...WizardMessages.bioAdded} />
                </Typography>
              </Stack>
            </Stack>
            <IconButton sx={{ padding: 0 }}>
              <Icon name="Approve-Tick" type="solid" size={24} color="primary.light" />
            </IconButton>
          </Stack>
        )}
        {/* ------------------------------------------Certificate------------------------------------------- */}
        {!profileData?.certificate ? (
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            onClick={() => !profileData?.certificate && handleRoute(PATH_APP.profile.ngo.certificate.root)}
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
                <Icon name="Page-Collection" size={24} color="primary.main" />
              </Avatar>
              <Stack>
                <Typography variant="subtitle2" color="text.primary">
                  <FormattedMessage {...WizardMessages.addCertificate} />
                </Typography>
                <Typography variant="caption" color="grey.500">
                  <FormattedMessage {...WizardMessages.addYourCertificate} />
                </Typography>
              </Stack>
            </Stack>
            <IconButton sx={{ padding: 0 }} onClick={() => handleRoute(PATH_APP.profile.ngo.certificate.root)}>
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
                <Icon name="Page-Collection" size={24} color="primary.light" />
              </Avatar>
              <Stack>
                <Typography variant="subtitle2" color="grey.500">
                  <FormattedMessage {...WizardMessages.certificateAdded} />
                </Typography>
              </Stack>
            </Stack>
            <IconButton sx={{ padding: 0 }}>
              <Icon name="Approve-Tick" type="solid" size={24} color="primary.light" />
            </IconButton>
          </Stack>
        )}
        {/* ------------------------------------------Public Details------------------------------------------- */}
        <Stack
          justifyContent="space-between"
          alignItems="center"
          direction="row"
          onClick={() =>
            profileData?.profileDetails !== ProfileCompleteEnum.Complete &&
            handleRoute(PATH_APP.profile.ngo.publicDetails.main)
          }
          sx={{
            backgroundColor:
              profileData?.profileDetails === ProfileCompleteEnum.Nothing ? 'Background.paper' : 'grey.100',
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
                backgroundColor: profileData?.profileDetails === ProfileCompleteEnum.Nothing ? 'grey.100' : '#fff',
              }}
            >
              <Icon
                name="user-info"
                size={24}
                color={profileData?.profileDetails === ProfileCompleteEnum.Complete ? 'primary.light' : 'primary.main'}
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
                <Icon name="Approve-Tick" type="solid" size={24} color="primary.light" />
              </IconButton>
            ) : (
              <IconButton sx={{ padding: 0 }} onClick={() => handleRoute(PATH_APP.profile.ngo.publicDetails.main)}>
                <Icon name="right-arrow" size={24} color="grey.500" />
              </IconButton>
            )}
          </Box>
        </Stack>
        {/* ------------------------------------------Project------------------------------------------- */}
        {!profileData?.projects ? (
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            onClick={() => !profileData?.projects && handleRoute(PATH_APP.profile.ngo.project.list)}
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
                  <FormattedMessage {...WizardMessages.projects} />
                </Typography>
                <Typography variant="caption" color="grey.500">
                  <FormattedMessage {...WizardMessages.insertProjects} />
                </Typography>
              </Stack>
            </Stack>
            <IconButton sx={{ padding: 0 }} onClick={() => handleRoute(PATH_APP.profile.ngo.project.list)}>
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
                  <FormattedMessage {...WizardMessages.projectsCompleted} />
                </Typography>
              </Stack>
            </Stack>
            <IconButton sx={{ padding: 0 }}>
              <Icon name="Approve-Tick" type="solid" size={24} color="primary.light" />
            </IconButton>
          </Stack>
        )}
        {/* ------------------------------------------Website Link------------------------------------------- */}
        {!profileData?.webSiteLinks ? (
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            onClick={() => !profileData?.webSiteLinks && handleRoute(PATH_APP.profile.ngo.contactInfo.root)}
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
                <Icon name="Link" type="solid" size={24} color="primary.main" />
              </Avatar>
              <Stack>
                <Typography variant="subtitle2" color="text.primary">
                  <FormattedMessage {...WizardMessages.websiteLink} />
                </Typography>
                <Typography variant="caption" color="grey.500">
                  <FormattedMessage {...WizardMessages.insertWebsiteInfo} />
                </Typography>
              </Stack>
            </Stack>
            <IconButton sx={{ padding: 0 }} onClick={() => handleRoute(PATH_APP.profile.ngo.contactInfo.root)}>
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
                <Icon name="Link" type="solid" size={24} color="primary.light" />
              </Avatar>
              <Stack>
                <Typography variant="subtitle2" color="grey.500">
                  <FormattedMessage {...WizardMessages.websiteCompleted} />
                </Typography>
              </Stack>
            </Stack>
            <IconButton sx={{ padding: 0 }}>
              <Icon name="Approve-Tick" type="solid" size={24} color="primary.light" />
            </IconButton>
          </Stack>
        )}
        {/* ------------------------------------------Phone Number------------------------------------------- */}
        {!profileData?.phoneNumber ? (
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            onClick={() => !profileData?.phoneNumber && handleRoute(PATH_APP.profile.ngo.contactInfo.root)}
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
                <Icon name="mobile" size={24} color="primary.main" />
              </Avatar>
              <Stack>
                <Typography variant="subtitle2" color="text.primary">
                  <FormattedMessage {...WizardMessages.phoneNumber} />
                </Typography>
                <Typography variant="caption" color="grey.500">
                  <FormattedMessage {...WizardMessages.insertPhoneNumber} />
                </Typography>
              </Stack>
            </Stack>
            <IconButton sx={{ padding: 0 }} onClick={() => handleRoute(PATH_APP.profile.ngo.contactInfo.root)}>
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
                <Icon name="mobile" size={24} color="primary.light" />
              </Avatar>
              <Stack>
                <Typography variant="subtitle2" color="grey.500">
                  <FormattedMessage {...WizardMessages.phoneNumberCompleted} />
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
