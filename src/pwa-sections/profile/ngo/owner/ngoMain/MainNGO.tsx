// @mui
import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useParams } from 'react-router-dom';
// import bottom sheet
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
  Grid,
  IconButton,
  Link as MuiLink,
  Stack,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// import map !
import GoogleMapReact from 'google-map-react';
import { useLazyGetCertificatesQuery } from 'src/_graphql/profile/certificates/queries/getCertificates.generated';
import { useLazyGetUserEmailsQuery } from 'src/_graphql/profile/contactInfo/queries/getUserEmails.generated';
import { useLazyGetUserPhoneNumbersQuery } from 'src/_graphql/profile/contactInfo/queries/getUserPhoneNumbers.generated';
import { useLazyGetUserSocialMediasQuery } from 'src/_graphql/profile/contactInfo/queries/getUserSocialMedias.generated';
import { useLazyGetUserWebSitesQuery } from 'src/_graphql/profile/contactInfo/queries/getUserWebSites.generated';
import { useLazyGetProjectsQuery } from 'src/_graphql/profile/mainProfileNOG/queries/getProject.generated';
import { useLazyGetUserDetailQuery } from 'src/_graphql/profile/publicDetails/queries/getUser.generated';
import { Icon } from 'src/components/Icon';
import Image from 'src/components/Image';
import MediaCarousel from 'src/components/mediaCarousel';
import useAuth from 'src/hooks/useAuth';
import ConnectionOwnProfile from 'src/pwa-sections/profile/components/ConnectionOwnProfile';
import ProfilePostTabs from 'src/pwa-sections/profile/components/posts/ProfilePostTabs';
import ProfileMainMessage from 'src/pwa-sections/profile/components/profileMain.messages';
import { PATH_APP } from 'src/routes/paths';
import { VerificationStatusEnum } from 'src/types/serverTypes';
import getMonthName from 'src/utils/getMonthName';

import MainProfileChangePhotoNgo from './editCoverPhoto/MainProfileChangePhotoNgo';
import MainProfileCoverAvatarNgo from './editCoverPhoto/MainProfileCoverAvatarNgo';

// --------------------
const CardStyle = styled(Card)(({ theme }) => ({
  minHeight: '280px',
  borderRadius: 0,
  margin: 'auto',
  boxShadow: 'unset',
  width: '100%',
  position: 'relative',
}));

const Marker = ({ text }: { lat?: number; lng?: number; text: JSX.Element }) => <Typography>{text}</Typography>;

const CardContentStyle = styled(CardContent)(({ theme }) => ({
  paddingBottom: theme.spacing(2),
  paddingTop: theme.spacing(2),
  width: '100%',
  position: 'absolute',
  top: '120px',
  paddingInline: theme.spacing(3),
  minHeight: 182,
}));
const StackContentStyle = styled(Stack)(({ theme }) => ({
  justifyContent: 'space-between',
}));

const RootStyle = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));
const ProjectDescriptionStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,

  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 3,
  textAlign: 'left',
}));

const BioMoreDescriptionStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
}));
const BioBriefDescriptionStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 3,
  height: 38,
}));

const MapStyle = styled(Box)(({ theme }) => ({
  height: 230,
}));
const bull = (
  <Box component="span" sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}>
    •
  </Box>
);

//
export default function MainNGO() {
  const [isLoadMore, setIsLoadMore] = useState(true);

  const { query } = useParams();
  const { logout } = useAuth();
  const { formatMessage } = useIntl();
  // bottom sheet   & state for edit photo
  const [profileChangePhoto, setProfileChangePhotoBottomSheet] = useState(false);
  const [profileCoverAvatar, setProfileCoverAvatarBottomSheet] = useState(false);
  const [logoutBottomSheet, setLogoutBottomSheet] = useState(false);
  const [statusPhoto, setStatusPhoto] = useState<'cover' | 'avatar' | undefined>();
  // services
  const [getUserDetail, { data: userData }] = useLazyGetUserDetailQuery();
  const [getSocialLinks, { data: socialMediaData, isFetching: isFetchingSocialMedia }] =
    useLazyGetUserSocialMediasQuery();
  const [getWebSites, { data: websitesData, isFetching: isFetchingWebsite }] = useLazyGetUserWebSitesQuery();
  const [getCertificates, { data: certificateData, isFetching: isFetchingCertificate }] = useLazyGetCertificatesQuery();
  const [getUserEmails, { data: emailData, isFetching: isFetchingEmail }] = useLazyGetUserEmailsQuery();
  const [getUserPhoneNumbers, { data: phoneNumberData, isFetching: isFetchingPhoneNumber }] =
    useLazyGetUserPhoneNumbersQuery();
  const [getProjects, { data: projectData, isFetching: isFetchingProject }] = useLazyGetProjectsQuery();
  // useEffect for services
  useEffect(() => {
    getUserDetail({ filter: { dto: {} } });
    getSocialLinks({ filter: { dto: { id: null } } });
    getProjects({ filter: { all: true, orderByDescendings: [true], orderByFields: ['CreatedDateTime'] } });
    getWebSites({ filter: { all: true } });
    getCertificates({ filter: { dto: {} } });
    getUserEmails({ filter: { dto: { status: VerificationStatusEnum.Confirmed } } });
    getUserPhoneNumbers({ filter: { dto: { status: VerificationStatusEnum.Confirmed } } });
  }, [
    getCertificates,
    getProjects,
    getSocialLinks,
    getUserDetail,
    getUserEmails,
    getUserPhoneNumbers,
    getWebSites,
    query,
  ]);
  // useEffect for bottom sheet
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
  const projects = projectData?.getProjects?.listDto?.items;
  const emails = emailData?.getUserEmails?.listDto?.items;
  const phoneNumbers = phoneNumberData?.getUserPhoneNumbers?.listDto?.items;
  // ------------------------------------------------------
  const ngo = userData?.getUser?.listDto?.items?.[0];
  const locatedIn = ngo?.organizationUserDto?.place?.description;
  const size = ngo?.organizationUserDto?.numberRange;
  const EstablishedDate = ngo?.organizationUserDto?.establishmentDate;
  const category = ngo?.organizationUserDto?.groupCategory;
  // const bioText = ngo?.organizationUserDto?.bio;
  const hasPublicDetail = !!category || !!size || !!locatedIn;
  // -----------------------------------------
  // functions !!
  // const handleClick = () => setIsLoadMore(!isLoadMore);
  const handleSeeMoreClick = () => {
    setIsLoadMore(!isLoadMore);
  };
  return (
    <>
      <RootStyle>
        <Stack sx={{ width: '100%' }}>
          <Grid item lg={12}>
            <CardStyle>
              <CardMedia
                onClick={() => {
                  ngo?.organizationUserDto?.coverUrl
                    ? setProfileChangePhotoBottomSheet(true)
                    : setProfileCoverAvatarBottomSheet(true);
                  setStatusPhoto('cover');
                }}
                component="img"
                alt="Cover Image"
                height={'176px'}
                image={ngo?.organizationUserDto?.coverUrl || '/icons/empty_cover.svg'}
              />

              <CardContentStyle>
                <StackContentStyle>
                  <Avatar
                    onClick={() => {
                      ngo?.organizationUserDto?.avatarUrl
                        ? setProfileChangePhotoBottomSheet(true)
                        : setProfileCoverAvatarBottomSheet(true);
                      setStatusPhoto('avatar');
                    }}
                    alt={ngo?.organizationUserDto?.fullName || '' || ''}
                    src={ngo?.organizationUserDto?.avatarUrl || undefined}
                    sx={{ width: 80, height: 80, backgroundColor: 'background.neutral' }}
                    variant="rounded"
                  >
                    <Image src="/icons/camera.svg" width={28} height={22} alt="avatar" />
                  </Avatar>
                  <Stack direction={'row'} spacing={0.5} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack>
                      <Typography gutterBottom variant="subtitle1" sx={{ mt: 1 }} color="text.primary">
                        {ngo?.organizationUserDto?.fullName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {ngo?.userType}
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
                </StackContentStyle>
              </CardContentStyle>
            </CardStyle>
          </Grid>
          {/* =================================={BUTTONS}============================= */}
          <Grid item lg={12}>
            <Stack spacing={0.25}>
              <Stack
                direction="row"
                justifyContent="space-between"
                mt={0.25}
                sx={{ backgroundColor: 'background.paper', borderRadius: 1, px: 2, py: 2 }}
              >
                <Link to={PATH_APP.post.createPost.socialPost.index}>
                  <Button
                    size="small"
                    sx={{ width: '100%' }}
                    startIcon={<Icon name="Plus" color="background.paper" />}
                    variant="contained"
                  >
                    <Typography>
                      <FormattedMessage {...ProfileMainMessage.addPost} />
                    </Typography>
                  </Button>
                </Link>

                <IconButton onClick={() => setLogoutBottomSheet(true)}>
                  <Icon name="Menu" type="solid" color="grey.700" />
                </IconButton>
              </Stack>
              {/*===================================== Bio =================== */}

              <Stack spacing={1} sx={{ backgroundColor: 'background.paper', borderRadius: 1, px: 2, py: 2 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle1" color="text.primary">
                    <FormattedMessage {...ProfileMainMessage.bio} />
                  </Typography>
                  {ngo?.organizationUserDto?.bio && (
                    <Link to={PATH_APP.profile.ngo.bioDialog + `/${ngo?.organizationUserDto?.id}`}>
                      <Typography variant="subtitle1" sx={{ color: 'primary.main', cursor: 'pointer' }}>
                        <FormattedMessage {...ProfileMainMessage.edit} />
                      </Typography>
                    </Link>
                  )}
                </Stack>
                {!ngo?.organizationUserDto?.bio ? (
                  <Link to={PATH_APP.profile.ngo.bioDialog}>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: 'text.secondary',
                      }}
                      startIcon={<Icon name="Plus" color="text.secondary" />}
                    >
                      <Typography color="text.primary">
                        <FormattedMessage {...ProfileMainMessage.addBio} />
                      </Typography>
                    </Button>
                  </Link>
                ) : (
                  <>
                    {isLoadMore &&
                    (ngo?.organizationUserDto?.bio.length > 180 ||
                      ngo?.organizationUserDto?.bio.trim().split('\n').length > 3) ? (
                      <>
                        <BioBriefDescriptionStyle>
                          {ngo?.organizationUserDto?.bio.split('\n').map((str, i) => (
                            <Typography variant="body2" style={{ marginBottom: 0 }} key={i}>
                              {str}
                            </Typography>
                          ))}
                        </BioBriefDescriptionStyle>
                        <Typography
                          variant="body2"
                          color={'info.main'}
                          sx={{ cursor: 'pointer' }}
                          onClick={handleSeeMoreClick}
                        >
                          <FormattedMessage {...ProfileMainMessage.seeMore} />
                        </Typography>
                      </>
                    ) : (
                      <BioMoreDescriptionStyle>
                        {ngo?.organizationUserDto?.bio.split('\n').map((str, i) => (
                          <Typography variant="body2" style={{ marginBottom: 0, minHeight: 18 }} key={i}>
                            {str}
                          </Typography>
                        ))}
                      </BioMoreDescriptionStyle>
                    )}
                  </>
                )}
              </Stack>
              {/*------------------------------ analytics-------------- */}
              <Stack
                sx={{
                  backgroundColor: 'background.paper',
                  py: 1,
                }}
              >
                <Box sx={{ px: 2 }}>
                  <Typography variant="subtitle1" color="text.primary">
                    <FormattedMessage {...ProfileMainMessage.analytics} />
                  </Typography>
                  <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
                    <Box>
                      <Typography color="text.primary">0</Typography>
                      <Typography color="text.secondary">
                        <FormattedMessage {...ProfileMainMessage.profileViews} />
                      </Typography>
                    </Box>
                    <Box>
                      <Typography color="text.primary">0</Typography>
                      <Typography color="text.secondary">
                        <FormattedMessage {...ProfileMainMessage.postViews} />
                      </Typography>
                    </Box>
                    <Box>
                      <Typography color="text.primary">0</Typography>
                      <Typography color="text.secondary">
                        <FormattedMessage {...ProfileMainMessage.searchAppernce} />
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Stack>
              {/* ==============================={PUBLIC DETAILS} ================================*/}
              <Stack spacing={1} sx={{ backgroundColor: 'background.paper', borderRadius: 1, p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1" color="text.primary">
                    <FormattedMessage {...ProfileMainMessage.publicDetails} />
                  </Typography>
                  {hasPublicDetail && (
                    <Link to={PATH_APP.profile.ngo.publicDetails.main}>
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
                        <Icon name="NGO" color="grey.500" />
                      </IconButton>

                      <Typography variant="subtitle2" color="text.secondary">
                        <FormattedMessage {...ProfileMainMessage.nGOCategory} />
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton>
                        <Icon name="NGO" color="grey.500" />
                      </IconButton>

                      <Typography variant="subtitle2" color="text.secondary">
                        <FormattedMessage {...ProfileMainMessage.nGOSize} />
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton>
                        <Icon name="calendar" color="grey.500" />
                      </IconButton>

                      <Typography variant="subtitle2" color="text.secondary">
                        <FormattedMessage {...ProfileMainMessage.dateOfEstablishment} />
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton>
                        <Icon name="City" color="grey.500" />
                      </IconButton>

                      <Typography variant="subtitle2" color="text.secondary">
                        <FormattedMessage {...ProfileMainMessage.locatedIn} />
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <>
                    {category && (
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 0.5 }}
                        key={category.id}
                      >
                        <IconButton>
                          <Icon name="NGO" />
                        </IconButton>
                        <Typography variant="subtitle2" color="text.primary">
                          <FormattedMessage {...ProfileMainMessage.nGOCategory} />
                        </Typography>
                        <Typography variant="subtitle2" color="text.primary">
                          {category.title}
                        </Typography>
                      </Box>
                    )}

                    {size && (
                      <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 0.5 }}>
                        <IconButton>
                          <Icon name="NGO" />
                        </IconButton>
                        <Typography variant="subtitle2" color="text.primary">
                          <FormattedMessage {...ProfileMainMessage.nGOSize} />
                        </Typography>
                        <Typography variant="subtitle2" color="text.primary">
                          {size?.desc}
                        </Typography>
                      </Box>
                    )}
                    {EstablishedDate && (
                      <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 0.5 }}>
                        <IconButton>
                          <Icon name="calendar" />
                        </IconButton>
                        <Typography variant="subtitle2" color="text.primary">
                          <FormattedMessage {...ProfileMainMessage.dateOfEstablishment} />
                        </Typography>
                        <Typography variant="subtitle2" color="text.primary" sx={{ mr: 1 }}>
                          {getMonthName(new Date(EstablishedDate))} {new Date(EstablishedDate).getFullYear()}
                        </Typography>
                      </Box>
                    )}
                    {locatedIn && (
                      <>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 0.5 }}>
                          <IconButton>
                            <Icon name="City" />
                          </IconButton>
                          <Typography variant="subtitle2" color="text.primary">
                            <FormattedMessage {...ProfileMainMessage.locatedIn} />
                          </Typography>
                          <Typography variant="subtitle2" color="text.primary">
                            {!!ngo?.organizationUserDto?.address && `${ngo?.organizationUserDto?.address}, `}
                            {locatedIn}
                          </Typography>
                        </Box>
                        {/* ----------------map---------- */}
                        {ngo?.organizationUserDto?.lat && (
                          <MapStyle>
                            <Box style={{ height: 230 }}>
                              <GoogleMapReact
                                bootstrapURLKeys={{ key: 'AIzaSyAeD8NNyr1bEJpjKnSHnKJQfj5j8Il7ct8' }}
                                defaultCenter={{
                                  lat: ngo?.organizationUserDto?.lat,
                                  lng: ngo?.organizationUserDto?.lng as number,
                                }}
                                defaultZoom={11}
                              >
                                <Marker
                                  lat={ngo?.organizationUserDto?.lat}
                                  lng={ngo?.organizationUserDto?.lng as number}
                                  text={<Icon name="location" type="solid" color="error.main" />}
                                />
                              </GoogleMapReact>
                            </Box>
                          </MapStyle>
                        )}
                      </>
                    )}
                  </>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton>
                    <Icon name="Join-Calendar" color="text.secondary" />
                  </IconButton>

                  <Typography variant="body1" color="text.primary" component="span">
                    <FormattedMessage
                      {...ProfileMainMessage.joinNgoMessage}
                      values={{
                        brand: 'Garden of love',
                        date: ` ${getMonthName(new Date(ngo?.organizationUserDto?.joinDateTime))}{' '}
                          ${new Date(ngo?.organizationUserDto?.joinDateTime).getFullYear()}`,
                        Typography: (str) =>
                          ngo?.organizationUserDto?.joinDateTime && (
                            <Typography component="span" variant="subtitle2" sx={{ ml: 0.5, fontWeight: 'Bold' }}>
                              {str}
                            </Typography>
                          ),
                      }}
                    />
                  </Typography>
                </Box>
                {/* ))} */}

                {!hasPublicDetail && (
                  <Box>
                    <Link to={PATH_APP.profile.ngo.publicDetails.main}>
                      <Button
                        fullWidth
                        size="small"
                        variant="outlined"
                        sx={{ height: '40px', color: 'text.primary', borderColor: 'text.secondary' }}
                        startIcon={<Icon name="Plus" color="text.secondary" />}
                      >
                        <FormattedMessage {...ProfileMainMessage.addPublicDetails} />
                      </Button>
                    </Link>
                  </Box>
                )}
              </Stack>
              {/* =============================={Projects} ==============================*/}
              <Stack spacing={1} sx={{ backgroundColor: 'background.paper', borderRadius: 1, p: 2 }}>
                {projects?.length ? (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" color="text.primary">
                        <FormattedMessage {...ProfileMainMessage.projects} />
                      </Typography>

                      <Link to={PATH_APP.profile.ngo.project.list}>
                        <Typography variant="subtitle1" sx={{ color: 'primary.main', cursor: 'pointer' }}>
                          <FormattedMessage {...ProfileMainMessage.edit} />
                        </Typography>
                      </Link>
                    </Box>

                    {isFetchingProject ? (
                      <CircularProgress size={20} />
                    ) : (
                      projects?.slice(0, 1)?.map((project, index) => (
                        <Box key={project?.id}>
                          <Box>
                            <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
                              {project?.title}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              {getMonthName(new Date(project?.startDate)) +
                                ' ' +
                                new Date(project?.startDate).getFullYear() +
                                ' - ' +
                                (project?.endDate
                                  ? getMonthName(new Date(project?.startDate)) +
                                    ' ' +
                                    new Date(project?.startDate).getFullYear()
                                  : 'Present ')}
                              {showDifferenceExp(
                                project?.dateDiff?.years as number,
                                project?.dateDiff?.months as number,
                              )}
                            </Typography>
                          </Box>
                          {project?.cityDto?.name && (
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                {project?.cityDto?.name}
                              </Typography>
                            </Box>
                          )}
                          <Stack>
                            <Box>
                              {project?.description && (
                                <ProjectDescriptionStyle variant="body2">
                                  {project?.description?.split('\n').map((str, i) => (
                                    <p key={i}>{str}</p>
                                  ))}
                                </ProjectDescriptionStyle>
                              )}
                            </Box>
                            {project?.projectMedias && project?.projectMedias && project?.projectMedias?.length > 0 && (
                              <Box sx={{ py: 2 }}>
                                <MediaCarousel media={project?.projectMedias} dots height={184} width={328} />
                              </Box>
                            )}
                          </Stack>
                        </Box>
                      ))
                    )}
                    {projects.length - 1 > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Link to={PATH_APP.profile.ngo.project.list}>
                          <Button variant="text" size="small">
                            <FormattedMessage
                              {...ProfileMainMessage.seeMoreProject}
                              values={{ count: projects?.length - 1 }}
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
                        <FormattedMessage {...ProfileMainMessage.projects} />
                      </Typography>
                    </Box>
                    <Box>
                      <Link to={PATH_APP.profile.ngo.project.list}>
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
                          startIcon={<Icon name="Plus" color="text.secondary" />}
                        >
                          <FormattedMessage {...ProfileMainMessage.addProject} />
                        </Button>
                      </Link>
                    </Box>
                  </>
                )}
              </Stack>
              {/* =========================================={CERTIFICATE} ==============================*/}
              <Stack spacing={1} sx={{ backgroundColor: 'background.paper', borderRadius: 1, p: 2 }}>
                {certificates?.length ? (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" color="text.primary">
                        <FormattedMessage {...ProfileMainMessage.certificate} />
                      </Typography>

                      <Link to={PATH_APP.profile.ngo.certificate.root}>
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
                        <Link to={PATH_APP.profile.ngo.certificate.root}>
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
                      <Link to={PATH_APP.profile.ngo.certificate.root}>
                        <Button
                          fullWidth
                          size="small"
                          variant="outlined"
                          sx={{ height: '40px', color: 'text.primary', borderColor: 'text.secondary' }}
                          startIcon={<Icon name="Plus" color="text.secondary" />}
                        >
                          <FormattedMessage {...ProfileMainMessage.addCertificate} />
                        </Button>
                      </Link>
                    </Box>
                  </>
                )}
              </Stack>

              {/* ============================================{CONTACT INFO}======================== */}
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

                      <Link to={PATH_APP.profile.ngo.contactInfo.root}>
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
                            {/* <img src={`/icons/socials/${social?.socialMediaDto?.title}.svg`} width={24} height={24}/> */}
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
                      <Link to={PATH_APP.profile.ngo.contactInfo.root}>
                        <Button
                          fullWidth
                          size="small"
                          variant="outlined"
                          startIcon={<Icon name="Plus" color="text.secondary" />}
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
              {/*================================= Followers =============================*/}
              <Stack sx={{ backgroundColor: 'background.paper', pt: 3, pb: 1 }}>
                <Box sx={{ px: 2 }}>
                  <ConnectionOwnProfile />
                </Box>
              </Stack>
              {/*================================= post =============================*/}

              <Stack sx={{ backgroundColor: 'background.paper', pt: 2, pb: 2 }}>
                <Box sx={{ px: 2 }}>
                  <ProfilePostTabs />
                </Box>
              </Stack>
              {/* ------------------------------- ENd sections----------------------------------------- */}
            </Stack>
          </Grid>
        </Stack>
      </RootStyle>
      {/*============================= bottomSheets================================ */}
      <BottomSheet open={profileChangePhoto} onDismiss={() => setProfileChangePhotoBottomSheet(false)}>
        <MainProfileChangePhotoNgo
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
        <MainProfileCoverAvatarNgo
          isAvatar={statusPhoto === 'avatar'}
          onCloseBottomSheet={() => {
            setProfileCoverAvatarBottomSheet(false);
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
              localStorage.removeItem('closeWizardNgo');
              logout();
            }}
          >
            <Icon name="Block" size="16" color="error.main" />
            <Typography variant="body2" sx={{ color: 'error.main' }}>
              <FormattedMessage {...ProfileMainMessage.logOut} />
            </Typography>
          </Stack>
        </Box>
      </BottomSheet>
    </>
  );
}
