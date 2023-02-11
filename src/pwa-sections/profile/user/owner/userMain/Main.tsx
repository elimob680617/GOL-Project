import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useParams } from 'react-router-dom';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Link as MuiLink,
  Stack,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// services !
import { useLazyGetCertificatesQuery } from 'src/_graphql/profile/certificates/queries/getCertificates.generated';
import { useLazyGetUserEmailsQuery } from 'src/_graphql/profile/contactInfo/queries/getUserEmails.generated';
import { useLazyGetUserPhoneNumbersQuery } from 'src/_graphql/profile/contactInfo/queries/getUserPhoneNumbers.generated';
import { useLazyGetUserSocialMediasQuery } from 'src/_graphql/profile/contactInfo/queries/getUserSocialMedias.generated';
import { useLazyGetUserWebSitesQuery } from 'src/_graphql/profile/contactInfo/queries/getUserWebSites.generated';
import { useLazyGetExperiencesQuery } from 'src/_graphql/profile/experiences/queries/getExperiences.generated';
import { useLazyGetUserDetailQuery } from 'src/_graphql/profile/publicDetails/queries/getUser.generated';
import { useLazyGetPersonSkillsQuery } from 'src/_graphql/profile/skills/queries/getPersonSkills.generated';
import cameraPhoto from 'src/assets/icons/camera.svg';
import emptyCoverImage from 'src/assets/icons/empty_cover.svg';
import { Icon } from 'src/components/Icon';
import Image from 'src/components/Image';
import useAuth from 'src/hooks/useAuth';
import ConnectionOwnProfile from 'src/pwa-sections/profile/components/ConnectionOwnProfile';
import ProfilePostTabs from 'src/pwa-sections/profile/components/posts/ProfilePostTabs';
import ProfileMainMessage from 'src/pwa-sections/profile/components/profileMain.messages';
import MainProfileChangePhotoUser from 'src/pwa-sections/profile/user/owner/userMain/addAvatarCoverPhoto/MainProfileChangePhotoUser';
import { PATH_APP } from 'src/routes/paths';
import MainProfileCoverAvatarUser from 'src/sections/profile/user/owner/userMain/addAvatarCoverPhoto/MainProfileCoverAvatarUser';
import { VerificationStatusEnum } from 'src/types/serverTypes';
import getMonthName from 'src/utils/getMonthName';

// ----------------------------------------------
// styles
const CardStyle = styled(Card)(({ theme }) => ({
  minHeight: '358px',
  borderRadius: 0,
  margin: 'auto',
  boxShadow: 'unset',
  width: '100%',
  position: 'relative',
}));

const CardContentStyle = styled(CardContent)(({ theme }) => ({
  // paddingBottom: theme.spacing(2),
  // paddingTop: theme.spacing(2),
  width: '95%',
  position: 'absolute',
  top: '120px',
  padding: theme.spacing(2),
  // paddingInline: theme.spacing(3),
  minHeight: 182,
}));
const StackContentStyle = styled(Stack)(({ theme }) => ({
  justifyContent: 'space-between',
}));

const RootStyle = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));
const ExperienceDescriptionStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,

  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 3,
  textAlign: 'left',
}));
const ExperienceImage = styled(Stack)(({ theme }) => ({
  maxHeight: '184px',
  minWidth: '328px',
  backgroundColor: theme.palette.grey[100],
}));

const bull = (
  <Box component="span" sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}>
    •
  </Box>
);

export default function Main() {
  // bottom sheet   & state for edit photo
  const [profileChangePhoto, setProfileChangePhotoBottomSheet] = useState(false);
  const [profileCoverAvatar, setProfileCoverAvatarBottomSheet] = useState(false);
  const [statusPhoto, setStatusPhoto] = useState<'cover' | 'avatar' | undefined>();
  const [logoutBottomSheet, setLogoutBottomSheet] = useState(false);
  // -------------tools-----------------------------
  const { logout } = useAuth();
  const { query } = useParams();
  const { formatMessage } = useIntl();
  // --------services------------------------------
  const [getUserDetail, { data: userData }] = useLazyGetUserDetailQuery();
  const [getSocialLinks, { data: socialMediaData, isFetching: isFetchingSocialMedia }] =
    useLazyGetUserSocialMediasQuery();
  const [getSkills, { data: skillsData }] = useLazyGetPersonSkillsQuery();
  const [getExperiences, { data: experienceData, isFetching: isFetchingExprience }] = useLazyGetExperiencesQuery();
  const [getWebSites, { data: websitesData, isFetching: isFetchingWebsite }] = useLazyGetUserWebSitesQuery();
  const [getCertificates, { data: certificateData, isFetching: isFetchingCertificate }] = useLazyGetCertificatesQuery();
  const [getUserEmails, { data: emailData, isFetching: isFetchingEmail }] = useLazyGetUserEmailsQuery();
  const [getUserPhoneNumbers, { data: phoneNumberData, isFetching: isFetchingPhoneNumber }] =
    useLazyGetUserPhoneNumbersQuery();

  useEffect(() => {
    // if (router.query.profile === 'user') {
    getUserDetail({ filter: { dto: {} } });
    getSocialLinks({ filter: { dto: { id: null } } });
    getSkills({ filter: { dto: {} } });
    getExperiences({ filter: { all: true, orderByDescendings: [true], orderByFields: ['CreatedDateTime'] } });
    getWebSites({ filter: { all: true } });
    getCertificates({ filter: { dto: {} } });
    getUserEmails({ filter: { dto: { status: VerificationStatusEnum.Confirmed } } });
    getUserPhoneNumbers({ filter: { dto: { status: VerificationStatusEnum.Confirmed } } });
    // }
  }, [
    getCertificates,
    getExperiences,
    getSkills,
    getSocialLinks,
    getUserDetail,
    getUserEmails,
    getUserPhoneNumbers,
    getWebSites,
    query,
  ]);
  // useEffect for bottom sheet on cover avatar photo
  useEffect(() => {
    if (!profileChangePhoto && !profileCoverAvatar) getUserDetail({ filter: { dto: {} } });
  }, [getUserDetail, profileChangePhoto, profileCoverAvatar]);

  const showDifferenceExp = (year: number, month: number) => {
    if (year === 0 && month === 0) return null;
    let finalValue = '';

    if (year > 0) finalValue = `${year} Year${year > 1 ? 's' : ''}  `;
    if (finalValue && month) finalValue += 'and ';
    if (month > 0) finalValue += `${month} Month${month > 1 ? 's' : ''}`;
    return <span>&#8226; {finalValue}</span>;
  };

  const certificates = certificateData?.getCertificates?.listDto?.items;
  const experiences = experienceData?.getExpriences?.listDto?.items;
  const skills = skillsData?.getPersonSkills?.listDto?.items;
  const user = userData?.getUser?.listDto?.items?.[0];
  const hometown = user?.personDto?.hometown;
  const currentCity = user?.personDto?.currnetCity;
  const relationship = user?.personDto?.relationship;
  const userExperience = user?.personDto?.experience;
  const currentExperiences = user?.personDto?.personCurrentExperiences;
  const university = user?.personDto?.personUniversities;
  const schools = user?.personDto?.personSchools;
  const emails = emailData?.getUserEmails?.listDto?.items;
  const phoneNumbers = phoneNumberData?.getUserPhoneNumbers?.listDto?.items;
  const hasPublicDetail =
    !!userExperience ||
    !!currentExperiences?.length ||
    !!university?.length ||
    !!schools?.length ||
    !!currentCity ||
    !!hometown ||
    !!relationship;

  return (
    <>
      <RootStyle>
        <Stack sx={{ width: '100%' }}>
          <Grid item lg={12}>
            <CardStyle>
              <CardMedia
                onClick={() => {
                  user?.personDto?.coverUrl
                    ? setProfileChangePhotoBottomSheet(true)
                    : setProfileCoverAvatarBottomSheet(true);
                  setStatusPhoto('cover');
                }}
                component="img"
                alt="Cover Image"
                height={'176px'}
                image={user?.personDto?.coverUrl || emptyCoverImage}
              />

              <CardContentStyle>
                <StackContentStyle>
                  <Avatar
                    onClick={() => {
                      user?.personDto?.avatarUrl
                        ? setProfileChangePhotoBottomSheet(true)
                        : setProfileCoverAvatarBottomSheet(true);
                      setStatusPhoto('avatar');
                    }}
                    alt={user?.personDto?.fullName || ''}
                    src={user?.personDto?.avatarUrl || undefined}
                    sx={{ width: 80, height: 80, backgroundColor: 'background.neutral' }}
                  >
                    <Image src={cameraPhoto} width={28} height={22} alt="avatar" />
                  </Avatar>

                  <Stack direction={'row'} spacing={0.5} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack>
                      <Typography gutterBottom variant="subtitle1" sx={{ mt: 1 }} color="text.primary">
                        {user?.personDto?.firstName} {user?.personDto?.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user?.userType}
                      </Typography>
                    </Stack>
                    <Box>
                      <Box sx={{ backgroundColor: 'secondary.main', padding: '16px 8px', borderRadius: 1 }}>
                        <Typography color="background.paper">
                          <FormattedMessage {...ProfileMainMessage.bgd} />
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                  {/* -------------------------{LOCATON AND HEADLINE} -----------------*/}
                  <Stack alignItems="flex-start">
                    <Typography sx={{ mt: 2 }}>
                      <Typography
                        color="text.primary"
                        sx={{
                          ...(!user?.personDto?.currnetCity?.city?.name && {
                            ml: 0,
                          }),
                        }}
                      >
                        {user?.personDto?.currnetCity?.city?.name || 'Your Location'}
                      </Typography>
                    </Typography>
                    <Typography sx={{ mt: 1.5 }}>
                      <Typography
                        color="text.primary"
                        sx={{
                          ...(!user?.personDto?.headline && {
                            ml: 0,
                          }),
                        }}
                      >
                        {user?.personDto?.headline || 'Your Headline'}
                      </Typography>
                    </Typography>
                  </Stack>
                </StackContentStyle>
              </CardContentStyle>
            </CardStyle>
            {/* <Divider /> */}
          </Grid>
          <Grid item lg={12}>
            <Stack sx={{ backgroundColor: 'background.paper' }}>
              {/* {BUTTONS} */}
              <Divider sx={{ mt: 1.25, mb: 1 }} />
              <Stack direction="row" justifyContent="space-between" sx={{ borderRadius: 1, px: 2, py: 1 }}>
                <Stack direction="row" spacing={1.8}>
                  <Link to={PATH_APP.post.createPost.socialPost.index}>
                    <Button size="small" startIcon={<Icon name="Plus" color="background.paper" />} variant="contained">
                      <Typography>
                        <FormattedMessage {...ProfileMainMessage.addPost} />
                      </Typography>
                    </Button>
                  </Link>
                  <Link to={PATH_APP.profile.user.userEdit}>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: (theme) => 'text.secondary',
                      }}
                      startIcon={<Icon name="Edit-Pen" color="text.secondary" />}
                    >
                      <Typography color="text.primary">
                        <FormattedMessage {...ProfileMainMessage.editProfile} />
                      </Typography>
                    </Button>
                  </Link>
                </Stack>
                <IconButton onClick={() => setLogoutBottomSheet(true)}>
                  <Icon name="Menu" type="solid" color="grey.500" />
                </IconButton>
              </Stack>
              <Divider sx={{ mt: 1, mb: 1.25 }} />
              {/*-------------------------------------------- {PUBLIC DETAILS}--------------------------------------- */}
              <Stack spacing={1} sx={{ borderRadius: 1, p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1" color="text.primary">
                    <FormattedMessage {...ProfileMainMessage.publicDetails} />
                  </Typography>
                  {hasPublicDetail && (
                    <Link to="user/public-details/list">
                      <Typography variant="subtitle1" sx={{ color: 'primary.main', cursor: 'pointer' }}>
                        <FormattedMessage {...ProfileMainMessage.edit} />
                      </Typography>
                    </Link>
                  )}
                </Box>
                {!hasPublicDetail ? (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton>
                        <Icon name="Occupation" color="text.secondary" />
                      </IconButton>
                      <Typography variant="body2" color="text.secondary">
                        <FormattedMessage {...ProfileMainMessage.occupation} />
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton>
                        <Icon name="mortarboard-Education" color="text.secondary" />
                      </IconButton>
                      <Typography variant="body2" color="text.secondary">
                        <FormattedMessage {...ProfileMainMessage.education} />
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton>
                        <Icon name="City" color="text.secondary" />
                      </IconButton>
                      <Typography variant="body2" color="text.secondary">
                        <FormattedMessage {...ProfileMainMessage.currentCity} />
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton>
                        <Icon name="Hometown" color="text.secondary" />
                      </IconButton>
                      <Typography variant="body2" color="text.secondary">
                        <FormattedMessage {...ProfileMainMessage.hometown} />
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton>
                        <Icon name="Relationship" color="text.secondary" />
                      </IconButton>
                      <Typography variant="body2" color="text.secondary">
                        <FormattedMessage {...ProfileMainMessage.relationship} />
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <>
                    {currentExperiences?.map((experience) => (
                      <Box sx={{ display: 'flex', alignItems: 'center' }} key={experience?.id}>
                        <IconButton>
                          <Icon name="office-bag" color="text.secondary" />
                        </IconButton>

                        <Typography variant="body1" color="text.primary" component="span">
                          {experience?.title}
                          <FormattedMessage
                            {...ProfileMainMessage.experienceInfo}
                            values={{
                              title: experience?.title,
                              name: experience?.companyDto?.title,
                              Typography: (str) => (
                                <Typography component="span" variant="subtitle2" sx={{ ml: 0.5 }}>
                                  {str}
                                </Typography>
                              ),
                            }}
                          />
                        </Typography>
                      </Box>
                    ))}

                    {university?.map((uni) => (
                      <Box sx={{ display: 'flex', alignItems: 'center' }} key={uni?.id}>
                        <IconButton>
                          <Icon name="mortarboard-Education" color="text.secondary" />
                        </IconButton>
                        <Typography variant="body1" color="text.primary" component="span">
                          <FormattedMessage
                            {...ProfileMainMessage.universityInfo}
                            values={{
                              title: uni?.concentrationDto?.title,
                              name: uni?.collegeDto?.name,
                              startDate: `${getMonthName(new Date(uni?.startDate))} ${new Date(
                                uni?.startDate,
                              ).getFullYear()}`,
                              endDate: uni?.endDate
                                ? getMonthName(new Date(uni?.endDate)) + ' ' + new Date(uni?.endDate).getFullYear()
                                : formatMessage(ProfileMainMessage.presentWord),
                              Typography: (str) => (
                                <Typography component="span" variant="subtitle2" sx={{ ml: 0.5 }}>
                                  {str}
                                </Typography>
                              ),
                            }}
                          />
                        </Typography>
                      </Box>
                    ))}
                    {schools?.map((school) => (
                      <Box sx={{ display: 'flex', alignItems: 'center' }} key={school?.id}>
                        <IconButton>
                          <Icon name="mortarboard-Education" color="text.secondary" />
                        </IconButton>

                        <Typography variant="body1" color="text.primary" component="span">
                          <FormattedMessage
                            {...ProfileMainMessage.schoolInfo}
                            values={{
                              title: school?.school?.title,
                              year: school?.year,
                              Typography: (str) => {
                                school?.year && (
                                  <Typography component="span" variant="subtitle2" sx={{ ml: 0.5 }}>
                                    {str}
                                  </Typography>
                                );
                              },
                            }}
                          />
                        </Typography>
                      </Box>
                    ))}
                    {currentCity && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton>
                          <Icon name="City" color="text.secondary" />
                        </IconButton>

                        <Typography variant="body1" color="text.primary" component="span">
                          <FormattedMessage
                            {...ProfileMainMessage.currentCityInfo}
                            values={{
                              name: currentCity?.city?.name,
                              Typography: (str) => (
                                <Typography component="span" variant="subtitle2" sx={{ ml: 0.5 }}>
                                  {str}
                                </Typography>
                              ),
                            }}
                          />
                        </Typography>
                      </Box>
                    )}

                    {hometown && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton>
                          <Icon name="Hometown" color="text.secondary" />
                        </IconButton>

                        <Typography variant="body1" color="text.primary" component="span">
                          <FormattedMessage
                            {...ProfileMainMessage.homeTownInfo}
                            values={{
                              homeTown: hometown?.city?.name,
                              Typography: (str) => (
                                <Typography component="span" variant="subtitle2" sx={{ ml: 0.5 }}>
                                  {str}
                                </Typography>
                              ),
                            }}
                          />
                        </Typography>
                      </Box>
                    )}
                    {relationship && (
                      <Box>
                        <IconButton>
                          <Icon name="Relationship" color="text.secondary" />
                        </IconButton>
                        <Typography variant="subtitle2" color="text.primary" component="span" sx={{ mr: 1 }}>
                          {relationship?.relationshipStatus?.title}
                        </Typography>
                      </Box>
                    )}
                  </>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton>
                    <Icon name="Join-Calendar" color="text.primary" />
                  </IconButton>

                  <Typography variant="body1" color="text.primary" component="span">
                    <FormattedMessage
                      {...ProfileMainMessage.joinMessage}
                      values={{
                        brand: 'Garden of love',
                        date: `${getMonthName(new Date(user?.personDto?.joinDateTime))} ${new Date(
                          user?.personDto?.joinDateTime,
                        ).getFullYear()}`,
                        Typography: (str) => {
                          user?.personDto?.joinDateTime && (
                            <Typography component="span" variant="subtitle2" sx={{ ml: 0.5 }}>
                              {str}
                            </Typography>
                          );
                        },
                      }}
                    />
                  </Typography>
                </Box>
                {/* ))} */}

                {!hasPublicDetail && (
                  <Box>
                    <Link to="user/public-details/list">
                      <Button
                        fullWidth
                        size="small"
                        variant="outlined"
                        sx={{ height: '40px', color: 'text.primary', borderColor: 'text.secondary' }}
                        startIcon={<Icon name="Plus" color="grey.500" />}
                      >
                        <FormattedMessage {...ProfileMainMessage.addPublicDetails} />
                      </Button>
                    </Link>
                  </Box>
                )}
              </Stack>
              {/* -----------------------------------{EXPERIENCE} -------------------*/}
              <Stack spacing={1} sx={{ backgroundColor: 'background.paper', borderRadius: 1, p: 2 }}>
                {experiences?.length ? (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" color="text.primary">
                        <FormattedMessage {...ProfileMainMessage.experiences} />
                      </Typography>

                      <Link to={PATH_APP.profile.user.experience.root}>
                        <Typography variant="subtitle1" sx={{ color: 'primary.main', cursor: 'pointer' }}>
                          <FormattedMessage {...ProfileMainMessage.edit} />
                        </Typography>
                      </Link>
                    </Box>

                    {isFetchingExprience ? (
                      <CircularProgress size={20} />
                    ) : (
                      experiences?.slice(0, 1)?.map((experience, index) => (
                        <Box key={experience?.id}>
                          <Box>
                            <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
                              <FormattedMessage
                                {...ProfileMainMessage.experienceTitle}
                                values={{
                                  title: experience?.title,
                                  name: experience?.companyDto?.title,
                                }}
                              />
                            </Typography>
                          </Box>

                          <Box>
                            <Typography variant="caption" color={'text.secondary'}>
                              {getMonthName(new Date(experience?.startDate)) +
                                ' ' +
                                new Date(experience?.startDate).getFullYear() +
                                ' - ' +
                                (experience?.endDate
                                  ? getMonthName(new Date(experience?.startDate)) +
                                    ' ' +
                                    new Date(experience?.startDate).getFullYear()
                                  : 'Present ')}
                              {showDifferenceExp(
                                experience?.dateDiff?.years as number,
                                experience?.dateDiff?.months as number,
                              )}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              {experience?.cityDto?.name}
                            </Typography>
                          </Box>

                          <Stack>
                            <Box>
                              {experience?.description && (
                                <ExperienceDescriptionStyle variant="body2">
                                  {experience?.description.split('\n').map((str, i) => (
                                    <p key={i}>{str}</p>
                                  ))}
                                </ExperienceDescriptionStyle>
                              )}
                            </Box>
                            {experience?.mediaUrl && (
                              <ExperienceImage
                                alignItems="center"
                                justifyContent="center"
                                sx={{ mr: 1, borderRadius: 1 }}
                              >
                                <Image src={experience?.mediaUrl} width={328} height={184} alt="experience-picture" />
                              </ExperienceImage>
                            )}
                          </Stack>
                        </Box>
                      ))
                    )}
                    {experiences.length - 1 > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
                        <Link to={PATH_APP.profile.user.experience.root}>
                          <Button variant="text" size="small">
                            <FormattedMessage
                              {...ProfileMainMessage.seeMoreExperience}
                              values={{ count: experiences?.length - 1 }}
                            />
                          </Button>
                        </Link>
                      </Box>
                    )}
                  </>
                ) : (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" color="text.primary">
                        <FormattedMessage {...ProfileMainMessage.experiences} />
                      </Typography>
                    </Box>
                    <Box>
                      <Link to={PATH_APP.profile.user.experience.root}>
                        <Button
                          fullWidth
                          size="small"
                          variant="outlined"
                          sx={{
                            height: '40px',
                            color: 'text.primary',
                            mt: 1,
                            borderColor: 'text.secondary',
                          }}
                          startIcon={<Icon name="Plus" color="grey.500" />}
                        >
                          <FormattedMessage {...ProfileMainMessage.addExperience} />
                        </Button>
                      </Link>
                    </Box>
                  </>
                )}
              </Stack>
              {/* ---------------------------------{CERTIFICATE}--------------------------------------- */}
              <Stack spacing={1} sx={{ backgroundColor: 'background.paper', borderRadius: 1, p: 2 }}>
                {certificates?.length ? (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" color="text.primary">
                        <FormattedMessage {...ProfileMainMessage.certificate} />
                      </Typography>

                      <Link to="certificate/list">
                        <Typography variant="subtitle1" sx={{ color: 'primary.main', cursor: 'pointer' }}>
                          <FormattedMessage {...ProfileMainMessage.edit} />
                        </Typography>
                      </Link>
                    </Box>
                    {isFetchingCertificate ? (
                      <CircularProgress size={20} />
                    ) : (
                      certificates.slice(0, 1).map((certificate) => (
                        <Box key={certificate?.id}>
                          <Box>
                            <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
                              {certificate?.certificateName?.title}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              {certificate?.issueDate &&
                                `${formatMessage(ProfileMainMessage.issued)} ${getMonthName(
                                  new Date(certificate?.issueDate),
                                )}
                  ${new Date(certificate?.issueDate).getFullYear()}`}
                              {certificate?.issueDate && bull}
                              {certificate?.expirationDate
                                ? ` ${getMonthName(new Date(certificate?.expirationDate))} ${new Date(
                                    certificate?.expirationDate,
                                  ).getFullYear()} `
                                : !certificate?.credentialDoesExpire &&
                                  formatMessage(ProfileMainMessage.noExpirationMessage)}
                            </Typography>
                          </Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
                            <FormattedMessage
                              {...ProfileMainMessage.issuingOrganization}
                              values={{ title: certificate?.issuingOrganization?.title }}
                            />
                          </Typography>
                          {certificate?.credentialID && (
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                <FormattedMessage
                                  {...ProfileMainMessage.credentialID}
                                  values={{ CredentialID: certificate?.credentialID }}
                                />
                              </Typography>
                            </Box>
                          )}
                          {certificate?.credentialUrl && (
                            <Box>
                              <Link to={'https://' + certificate?.credentialUrl.replace('https://', '')}>
                                <MuiLink target={'_blank'} underline="none">
                                  <Button
                                    size="small"
                                    color="inherit"
                                    variant="outlined"
                                    sx={{ borderColor: 'text.primary', color: 'text.primary', mt: 1, mb: 1 }}
                                  >
                                    <Typography variant="body2">
                                      <FormattedMessage {...ProfileMainMessage.seeCertificate} />
                                    </Typography>
                                  </Button>
                                </MuiLink>
                              </Link>
                            </Box>
                          )}
                        </Box>
                      ))
                    )}
                    {certificates.length - 1 > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
                        <Link to={PATH_APP.profile.user.certificate.root}>
                          <Button variant="text" size="small">
                            <FormattedMessage
                              {...ProfileMainMessage.seeMoreCertificate}
                              values={{ count: certificates?.length - 1 }}
                            />
                          </Button>
                        </Link>
                      </Box>
                    )}
                  </>
                ) : (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" color="text.primary">
                        <FormattedMessage {...ProfileMainMessage.certificate} />
                      </Typography>
                    </Box>
                    <Box>
                      <Link to={PATH_APP.profile.user.certificate.root}>
                        <Button
                          fullWidth
                          size="small"
                          variant="outlined"
                          sx={{ height: '40px', color: 'text.primary', borderColor: 'text.secondary' }}
                          startIcon={<Icon name="Plus" color="grey.500" />}
                        >
                          <FormattedMessage {...ProfileMainMessage.addCertificate} />
                        </Button>
                      </Link>
                    </Box>
                  </>
                )}
              </Stack>
              {/*---------------------------- {SKILL} ---------------------------------*/}
              <Stack spacing={2} sx={{ backgroundColor: 'background.paper', borderRadius: 1, p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1" color="text.primary">
                    <FormattedMessage {...ProfileMainMessage.skillsAndEndorsements} />
                  </Typography>
                  {!!skills?.length && (
                    <Link to={PATH_APP.profile.user.skill.root}>
                      <Typography variant="subtitle1" sx={{ color: 'primary.main', cursor: 'pointer' }}>
                        <FormattedMessage {...ProfileMainMessage.edit} />
                      </Typography>
                    </Link>
                  )}
                </Box>
                {!!skills?.length ? (
                  <>
                    {skills?.slice(0, 3)?.map((skill) => (
                      <Box key={skill?.skill?.id}>
                        <Typography variant="body2" color="text.primary" sx={{ display: 'flex' }}>
                          {skill?.skill?.title}
                          <Typography variant="body2" sx={{ color: 'primary.main', pl: 1 }}>
                            {!!skill?.endorsementsCount && skill?.endorsementsCount}
                          </Typography>
                        </Typography>
                      </Box>
                    ))}
                    {skills?.length - 3 > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
                        <Link to={PATH_APP.profile.user.skill.root}>
                          <Button variant="text" size="small">
                            <FormattedMessage
                              {...ProfileMainMessage.seeMoreSkill}
                              values={{ count: skills?.length - 3 }}
                            />
                          </Button>
                        </Link>
                      </Box>
                    )}
                  </>
                ) : (
                  <Box>
                    <Link to={PATH_APP.profile.user.skill.root}>
                      <Button
                        fullWidth
                        size="small"
                        startIcon={<Icon name="Plus" color="grey.500" />}
                        variant="outlined"
                        sx={{ height: '40px', color: 'text.primary', borderColor: 'text.secondary' }}
                      >
                        <FormattedMessage {...ProfileMainMessage.addSkillsAndEndorsements} />
                      </Button>
                    </Link>
                  </Box>
                )}
              </Stack>
              {/*----------------------------------- {CONTACT INFO} ------------------------------------*/}
              <Stack spacing={2} sx={{ backgroundColor: 'background.paper', borderRadius: 1, p: 2 }}>
                {!!emails?.length ||
                !!phoneNumbers?.length ||
                !!socialMediaData?.getUserSocialMedias?.listDto?.items?.length ||
                !!websitesData?.getUserWebSites?.listDto?.items?.length ? (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" color="text.primary">
                        <FormattedMessage {...ProfileMainMessage.contactInfo} />
                      </Typography>

                      <Link to={PATH_APP.profile.user.contactInfo.root}>
                        <Typography variant="subtitle1" sx={{ color: 'primary.main', cursor: 'pointer' }}>
                          <FormattedMessage {...ProfileMainMessage.edit} />
                        </Typography>
                      </Link>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ pl: 1, color: 'primary.main', pb: 1 }}>
                        <FormattedMessage {...ProfileMainMessage.email} />
                      </Typography>
                      {isFetchingEmail ? (
                        <CircularProgress size={20} />
                      ) : (
                        emails?.map((email) => (
                          <Typography variant="body2" color="text.primary" sx={{ pl: 1 }} key={email?.id}>
                            {email?.email}
                          </Typography>
                        ))
                      )}
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ pl: 1, color: 'primary.main', pb: 1 }}>
                        <FormattedMessage {...ProfileMainMessage.phoneNumber} />
                      </Typography>
                      {isFetchingPhoneNumber ? (
                        <CircularProgress size={20} />
                      ) : (
                        phoneNumbers?.map((phone) => (
                          <Typography variant="body2" color="text.primary" sx={{ pl: 1 }} key={phone?.id}>
                            {phone?.phoneNumber}
                          </Typography>
                        ))
                      )}
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" sx={{ pl: 1, color: 'primary.main', pb: 1 }}>
                        <FormattedMessage {...ProfileMainMessage.socialLinks} />
                      </Typography>
                      {isFetchingSocialMedia ? (
                        <CircularProgress size={20} />
                      ) : (
                        socialMediaData?.getUserSocialMedias?.listDto?.items?.map((social) => (
                          <Box sx={{ display: 'flex', alignItems: 'center' }} key={social?.id}>
                            <Typography variant="body2" color="text.secondary" sx={{ pl: 1 }}>
                              {social?.socialMediaDto?.title}
                            </Typography>
                            <Typography variant="body2" color="text.primary" sx={{ pl: 1 }}>
                              {social?.userName}
                            </Typography>
                          </Box>
                        ))
                      )}
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ pl: 1, color: 'primary.main', pb: 1 }}>
                        <FormattedMessage {...ProfileMainMessage.Website} />
                      </Typography>
                      {isFetchingWebsite ? (
                        <CircularProgress size={20} />
                      ) : (
                        websitesData?.getUserWebSites?.listDto?.items?.map((webSite) => (
                          <Typography variant="body2" color="text.primary" sx={{ pl: 1 }} key={webSite?.id}>
                            {webSite?.webSiteUrl}
                          </Typography>
                        ))
                      )}
                    </Box>
                  </>
                ) : (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" color="text.primary">
                        <FormattedMessage {...ProfileMainMessage.contactInfo} />
                      </Typography>
                    </Box>
                    <Box>
                      <Link to={PATH_APP.profile.user.contactInfo.root}>
                        <Button
                          fullWidth
                          size="small"
                          variant="outlined"
                          startIcon={<Icon name="Plus" color="grey.500" />}
                          sx={{
                            height: '40px',
                            color: 'text.primary',
                            mt: 1,
                            borderColor: 'text.secondary',
                          }}
                        >
                          <FormattedMessage {...ProfileMainMessage.addContactInfo} />
                        </Button>
                      </Link>
                    </Box>
                  </>
                )}
              </Stack>
              {/* -----------------------------------followers ----------------------------------- */}
              <Stack sx={{ backgroundColor: 'background.paper', pt: 3, pb: 1 }}>
                <Box sx={{ px: 2 }}>
                  <ConnectionOwnProfile />
                </Box>
              </Stack>
              {/*---------------------------------- posts----------------------------------------------- */}
              <Stack sx={{ backgroundColor: 'background.paper', pt: 2, pb: 2 }}>
                <Box sx={{ px: 2 }}>
                  <ProfilePostTabs />
                </Box>
              </Stack>
              {/*---------------------------------- end sections --------------------------------  */}
            </Stack>
          </Grid>
        </Stack>
      </RootStyle>
      {/* ------------------------------------------bottom sheets---------------------------------- */}
      <BottomSheet open={profileChangePhoto} onDismiss={() => setProfileChangePhotoBottomSheet(false)}>
        <MainProfileChangePhotoUser
          isProfilePhoto={statusPhoto === 'avatar'}
          onClose={() => {
            setProfileChangePhotoBottomSheet(false);
          }}
          onUpload={() => {
            setProfileChangePhotoBottomSheet(false);
            setProfileCoverAvatarBottomSheet(true);
          }}
        />
      </BottomSheet>
      <BottomSheet open={profileCoverAvatar} onDismiss={() => setProfileCoverAvatarBottomSheet(false)}>
        <MainProfileCoverAvatarUser
          isAvatar={statusPhoto === 'avatar'}
          onClose={() => {
            return setProfileCoverAvatarBottomSheet(false);
          }}
        />
      </BottomSheet>
      <BottomSheet open={logoutBottomSheet} onDismiss={() => setLogoutBottomSheet(false)}>
        <Box sx={{ p: 2 }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            onClick={() => {
              localStorage.removeItem('closeWizard');
              logout();
            }}
          >
            <Icon name="Block" color="error.main" />
            <Typography variant="body2" sx={{ color: 'error.main' }}>
              <FormattedMessage {...ProfileMainMessage.logOut} />
            </Typography>
          </Stack>
        </Box>
      </BottomSheet>
    </>
  );
}
