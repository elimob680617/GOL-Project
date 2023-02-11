import { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Link as MuiLink,
  Stack,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { useLazyGetCertificatesQuery } from 'src/_graphql/profile/certificates/queries/getCertificates.generated';
import { useLazyGetProjectsQuery } from 'src/_graphql/profile/mainProfileNOG/queries/getProject.generated';
import { useLazyGetUserDetailQuery } from 'src/_graphql/profile/publicDetails/queries/getUser.generated';
import emptyCover from 'src/assets/icons/empty_cover.svg';
// import GoogleMapReact from 'google-map-react';
import BGDImage from 'src/assets/icons/mainNGO/BGD/Group3.svg';
import { Icon } from 'src/components/Icon';
import MediaCarousel from 'src/components/mediaCarousel';
import { PATH_APP } from 'src/routes/paths';
import ConnectionsOwnProfile from 'src/sections/profile/components/ConnectionsOwnProfile';
import NgoWizard from 'src/sections/profile/ngo/wizard/Wizard';
import getMonthName from 'src/utils/getMonthName';

import ProfileMainMessage from '../../../components/profileMain.messages';
import Bio from './Bio';

const CardStyle = styled(Card)(({ theme }) => ({
  minHeight: '360px',
  borderRadius: theme.spacing(1),
  margin: 'auto',
  boxShadow: 'unset',
  width: '100%',
  position: 'relative',
  [theme.breakpoints.down('md')]: {
    minHeight: '520px',
  },
  [theme.breakpoints.down('sm')]: {
    minHeight: '570px',
  },
}));
const CardContentStyle = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  width: '100%',
  position: 'absolute',
  top: '185px',
}));
const StackContentStyle = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
}));
const CardContentBtn = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    marginTop: theme.spacing(2),
  },
}));
const RootStyle = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.neutral,
  padding: theme.spacing(3, 0),
  // [theme.breakpoints.up('xl')]: {
  //   padding: theme.spacing(3, 19.5),
  // },
}));
const ProjectDescriptionStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 3,
  textAlign: 'left',
}));
const ImageArrowDown = styled(Box)(({ theme }) => ({
  width: 24,
  height: 24,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.palette.grey[300],
  borderRadius: 9,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));
const MapStyle = styled(Box)(({ theme }) => ({
  width: 328,
  height: 230,
  borderRadius: theme.spacing(1),
}));
const BgdStyle = styled(Box)(({ theme }) => ({
  cursor: 'pointer',
  position: 'absolute',
  right: theme.spacing(2),
  bottom: theme.spacing(15),
  zIndex: 1,
}));
const BioStyle = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: 1,
  padding: theme.spacing(2),
}));
const FollowersStyle = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: 1,
  padding: theme.spacing(2),
}));
const PostStyle = styled(Stack)(({ theme }) => ({
  borderRadius: 1,
}));
const bull = (
  <Box component="span" sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}>
    •
  </Box>
);
// const Marker = ({ text }: { lat?: number; lng?: number; text: JSX.Element }) => <Box>{text}</Box>;

export default function Main() {
  const { formatMessage } = useIntl();

  const router = useNavigate();
  const location = useLocation();
  const [getNgoDetail, { data: ngoData, isFetching }] = useLazyGetUserDetailQuery();
  const [getProject, { data: projectData, isFetching: isFetchingProject }] = useLazyGetProjectsQuery();
  const [getCertificates, { data: certificateData, isFetching: isFetchingCertificate }] = useLazyGetCertificatesQuery();

  useEffect(() => {
    if (location.pathname === '/profile/ngo') {
      getNgoDetail({ filter: { dto: {} } });
      getProject({ filter: { all: true, orderByDescendings: [true], orderByFields: ['CreatedDateTime'] } });
      getCertificates({ filter: { dto: {} } });
    }
  }, [getCertificates, getNgoDetail, getProject, location.pathname]);

  const showDifferenceExp = (year: number, month: number) => {
    if (year === 0 && month === 0) return null;
    let finalValue = '';
    if (year > 0) finalValue = `${year} Year${year > 1 ? 's' : ''}  `;
    if (finalValue && month) finalValue += 'and ';
    if (month > 0) finalValue += `${month} Month${month > 1 ? 's' : ''}`;
    return <span>&#8226; {finalValue}</span>;
  };

  const ngo = ngoData?.getUser?.listDto?.items?.[0];
  const locatedIn = ngo?.organizationUserDto?.place?.description;
  const size = ngo?.organizationUserDto?.numberRange;
  const EstablishedDate = ngo?.organizationUserDto?.establishmentDate;
  const category = ngo?.organizationUserDto?.groupCategory;
  const emails = ngo?.contactInfoEmails;
  const phoneNumbers = ngo?.contactInfoPhoneNumbers;
  const socialLinks = ngo?.contactInfoSocialLinks;
  const websites = ngo?.contactInfoWebSites;
  const projects = projectData?.getProjects?.listDto?.items;
  const certificates = certificateData?.getCertificates?.listDto?.items;
  const hasPublicDetail = !!category || !!size || !!locatedIn;

  const handelEditPhotoCover = () => {
    if (ngo?.organizationUserDto?.coverUrl) {
      router(PATH_APP.profile.ngo.mainProfileNChangePhotoCover);
    } else {
      router(PATH_APP.profile.ngo.ngoEditCover);
    }
  };
  const handelEditPhotoAvatar = () => {
    if (ngo?.organizationUserDto?.avatarUrl) {
      router(PATH_APP.profile.ngo.mainProfileNChangePhotoAvatar);
    } else {
      router(PATH_APP.profile.ngo.ngoEditAvatar);
    }
  };

  return (
    <Box bgcolor="background.neutral">
      <Container
        maxWidth="lg"
        sx={(theme) => ({
          [theme.breakpoints.up('sm')]: {
            px: 0,
          },
        })}
      >
        <RootStyle>
          <Grid container spacing={3}>
            <Grid item lg={8} xs={12}>
              <Stack spacing={3}>
                <CardStyle>
                  <CardMedia
                    sx={{ cursor: 'pointer' }}
                    component="img"
                    alt="Cover Image"
                    height={'250px'}
                    image={ngo?.organizationUserDto?.coverUrl || emptyCover}
                    onClick={handelEditPhotoCover}
                  />
                  <BgdStyle>
                    <img loading="lazy" src={BGDImage} alt="BGD" />
                  </BgdStyle>
                  <CardContentStyle>
                    <StackContentStyle>
                      <Box>
                        <Avatar
                          onClick={handelEditPhotoAvatar}
                          variant="rounded"
                          alt={ngo?.organizationUserDto?.fullName || ''}
                          src={ngo?.organizationUserDto?.avatarUrl || undefined}
                          sx={{ width: 80, height: 80, backgroundColor: 'background.neutral', cursor: 'pointer' }}
                        >
                          <Icon name="camera" type="solid" />
                        </Avatar>
                      </Box>
                    </StackContentStyle>
                    <Stack direction="row" justifyContent="space-between" mt={1}>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography gutterBottom variant="subtitle1" sx={{ mt: 1 }}>
                            {ngo?.organizationUserDto?.fullName}
                          </Typography>
                          {ngo?.organizationUserDto?.fullName && (
                            <ImageArrowDown>
                              <Icon name="down-arrow" />
                            </ImageArrowDown>
                          )}
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {ngo?.userType}
                        </Typography>
                      </Box>
                      <CardContentBtn>
                        <Button
                          size="large"
                          variant="contained"
                          onClick={() => router(PATH_APP.post.createPost.socialPost.index)}
                        >
                          <Icon name="Plus" color="background.paper" />
                          <Typography sx={{ ml: 1.5 }}>
                            <FormattedMessage {...ProfileMainMessage.addPost} />
                          </Typography>
                        </Button>
                        <Button
                          size="large"
                          variant="outlined"
                          sx={{
                            ml: 2,
                            '@media (max-width:425px)': {
                              mt: 2,
                              ml: 0,
                            },
                          }}
                        >
                          <Icon name="public" color="text.secondary" />
                          <Typography sx={{ ml: 1.5 }} color="text.secondary">
                            <FormattedMessage {...ProfileMainMessage.Administrators} />
                          </Typography>
                        </Button>
                        <IconButton sx={{ ml: 3 }}>
                          <Icon name="Menu" color="text.primary" />
                        </IconButton>
                      </CardContentBtn>
                    </Stack>
                  </CardContentStyle>
                </CardStyle>
                <BioStyle spacing={3}>
                  <Bio text={ngo?.organizationUserDto?.bio as string} />
                </BioStyle>
                <NgoWizard percentage={ngo?.completeProfilePercentage || 0} fromHomePage={false} />
                <FollowersStyle>
                  <ConnectionsOwnProfile isOwn={ngo?.userType || undefined} />
                </FollowersStyle>
                <PostStyle spacing={3}>{/* <ProfileOwnerPostTabs /> */}</PostStyle>
              </Stack>
            </Grid>
            <Grid item lg={4} xs={12}>
              <Stack spacing={3}>
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
                        <Box>
                          <Icon name="NGO" color="grey.500" />
                        </Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          <FormattedMessage {...ProfileMainMessage.nGOCategory} />
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box>
                          <Icon name="NGO" color="grey.500" />
                        </Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          <FormattedMessage {...ProfileMainMessage.nGOSize} />
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box>
                          <Icon name="calendar" color="grey.500" />
                        </Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          <FormattedMessage {...ProfileMainMessage.dateOfEstablishment} />
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box>
                          <Icon name="City" color="grey.500" />
                        </Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          <FormattedMessage {...ProfileMainMessage.locatedIn} />
                        </Typography>
                      </Box>
                    </>
                  ) : (
                    <>
                      {category && (
                        <Box
                          sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'row', gap: 0.5 }}
                          key={category.id}
                        >
                          <Box>
                            <Icon name="NGO" />
                          </Box>
                          <Typography variant="subtitle2" color="text.primary" component={'span'}>
                            <FormattedMessage {...ProfileMainMessage.nGOCategory} />
                            <Typography
                              variant="subtitle2"
                              color="text.primary"
                              sx={{ fontWeight: 'Bold' }}
                              component={'span'}
                              ml={0.5}
                            >
                              {category.title}
                            </Typography>
                          </Typography>
                        </Box>
                      )}

                      {size && (
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'row', gap: 0.5 }}>
                          <Box>
                            <Icon name="NGO" />
                          </Box>
                          <Typography variant="subtitle2" color="text.primary" component={'span'}>
                            <FormattedMessage {...ProfileMainMessage.nGOSize} />
                            <Typography
                              variant="subtitle2"
                              color="text.primary"
                              sx={{ fontWeight: 'Bold' }}
                              component={'span'}
                              ml={0.5}
                            >
                              {size?.desc}
                            </Typography>
                          </Typography>
                        </Box>
                      )}

                      {EstablishedDate && (
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'row', gap: 0.5 }}>
                          <Box>
                            <Icon name="calendar" />
                          </Box>
                          <Typography variant="subtitle2" color="text.primary" component={'span'}>
                            <FormattedMessage {...ProfileMainMessage.dateOfEstablishment} />
                            <Typography
                              variant="subtitle2"
                              color="text.primary"
                              sx={{ mr: 1, fontWeight: 'Bold' }}
                              component={'span'}
                              ml={0.5}
                            >
                              {getMonthName(new Date(EstablishedDate))} {new Date(EstablishedDate).getFullYear()}
                            </Typography>
                          </Typography>
                        </Box>
                      )}

                      {locatedIn && (
                        <>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'row', gap: 0.5 }}>
                            <Box>
                              <Icon name="City" />
                            </Box>
                            <Typography variant="subtitle2" color="text.primary" component={'span'}>
                              <FormattedMessage {...ProfileMainMessage.locatedIn} />
                              <Typography
                                variant="subtitle2"
                                color="text.primary"
                                sx={{ fontWeight: 'Bold' }}
                                component={'span'}
                                ml={0.5}
                              >
                                {!!ngo?.organizationUserDto?.address && `${ngo?.organizationUserDto?.address}, `}
                                {locatedIn}
                              </Typography>
                            </Typography>
                          </Box>
                          {ngo?.organizationUserDto?.placeId && (
                            <MapStyle>
                              <Box sx={{ height: 230, width: 328, '& div:nth-of-type(1)': { borderRadius: 1 } }}>
                                {/* <GoogleMapReact
                                  bootstrapURLKeys={{ key: 'AIzaSyAeD8NNyr1bEJpjKnSHnKJQfj5j8Il7ct8' }}
                                  defaultCenter={{
                                    lat: ngo?.organizationUserDto?.lat!,
                                    lng: ngo?.organizationUserDto?.lng!,
                                  }}
                                  defaultZoom={13}
                                >
                                  <Marker
                                    lat={ngo?.organizationUserDto?.lat!}
                                    lng={ngo?.organizationUserDto?.lng!}
                                    text={<Icon name="location" type="solid" color="error.main" />}
                                  />
                                </GoogleMapReact> */}
                              </Box>
                            </MapStyle>
                          )}
                        </>
                      )}
                    </>
                  )}

                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box>
                      <Icon name="Join-Calendar" color="text.secondary" />
                    </Box>
                    <Typography variant="body1" color="text.primary" component="span">
                      <FormattedMessage
                        {...ProfileMainMessage.joinNgoMessage}
                        values={{
                          brand: 'Garden of love',
                          date: ` ${getMonthName(new Date(ngo?.organizationUserDto?.joinDateTime))}
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

                  {!hasPublicDetail && (
                    <Box>
                      <Link to={PATH_APP.profile.ngo.publicDetails.main}>
                        <Button
                          fullWidth
                          size="small"
                          variant="outlined"
                          sx={{ height: '40px', color: 'text.primary' }}
                          startIcon={<Icon name="Plus" color="text.primary" />}
                        >
                          <FormattedMessage {...ProfileMainMessage.addPublicDetails} />
                        </Button>
                      </Link>
                    </Box>
                  )}
                </Stack>

                <Stack spacing={2} sx={{ backgroundColor: 'background.paper', borderRadius: 1, p: 2 }}>
                  {!!emails?.length || !!phoneNumbers?.length || !!socialLinks?.length || !!websites?.length ? (
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
                        {isFetching ? (
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
                        {isFetching ? (
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
                        {isFetching ? (
                          <CircularProgress size={20} />
                        ) : (
                          socialLinks?.map((social) => (
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
                        {isFetching ? (
                          <CircularProgress size={20} />
                        ) : (
                          websites?.map((webSite) => (
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
                            sx={{ height: '40px', color: 'text.primary', mt: 1 }}
                          >
                            <Icon name="Plus" color="text.primary" />
                            <FormattedMessage {...ProfileMainMessage.addContactInfo} />
                          </Button>
                        </Link>
                      </Box>
                    </>
                  )}
                </Stack>

                <Stack spacing={2} sx={{ backgroundColor: 'background.paper', borderRadius: 1, p: 2 }}>
                  <Box>
                    <Typography variant="subtitle1" color="text.primary">
                      <FormattedMessage {...ProfileMainMessage.analytics} />
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={5.5}>
                    <Box>
                      <Typography variant="subtitle1" color="text.primary">
                        0
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        <FormattedMessage {...ProfileMainMessage.profileViews} />
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" color="text.primary">
                        0
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        <FormattedMessage {...ProfileMainMessage.profileViews} />
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" color="text.primary">
                        0
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        <FormattedMessage {...ProfileMainMessage.profileViews} />
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>

                <Stack spacing={1} sx={{ backgroundColor: 'background.paper', borderRadius: 1, p: 2 }}>
                  {projects?.length ? (
                    <>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1" color="text.primary">
                          <FormattedMessage {...ProfileMainMessage.project} />
                        </Typography>

                        <Link to="/profile/ngo/project-list">
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
                                {!project?.endDate &&
                                  showDifferenceExp(
                                    project?.dateDiff?.years as number,
                                    project?.dateDiff?.months as number,
                                  )}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                {project?.cityDto?.name}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', pt: 1, alignItems: 'center', flexDirection: 'column', gap: 2 }}>
                              <Box>
                                {project?.description && (
                                  <ProjectDescriptionStyle variant="body2">
                                    {project?.description.split('\n').map((str, i) => (
                                      <p key={i}>{str}</p>
                                    ))}
                                  </ProjectDescriptionStyle>
                                )}
                              </Box>
                              {!!project?.projectMedias?.length && (
                                <Box maxHeight={184} maxWidth={328} mx={'auto'} mb={2} py={1}>
                                  <MediaCarousel media={project?.projectMedias} dots arrows height={184} width={328} />
                                </Box>
                              )}
                            </Box>
                          </Box>
                        ))
                      )}
                      {projects?.length - 1 > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
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
                          <FormattedMessage {...ProfileMainMessage.project} />
                        </Typography>
                      </Box>
                      <Box>
                        <Link to={PATH_APP.profile.ngo.project.list}>
                          <Button
                            fullWidth
                            size="small"
                            variant="outlined"
                            sx={{ height: '40px', color: 'text.primary', mt: 1 }}
                          >
                            <Icon name="Plus" color="text.primary" />
                            <FormattedMessage {...ProfileMainMessage.addProject} />
                          </Button>
                        </Link>
                      </Box>
                    </>
                  )}
                </Stack>

                <Stack spacing={1} sx={{ backgroundColor: 'background.paper', borderRadius: 1, p: 2 }}>
                  {certificates?.length ? (
                    <>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1" color="text.primary">
                          <FormattedMessage {...ProfileMainMessage.certificate} />
                        </Typography>

                        <Link to={PATH_APP.profile.ngo.certificate.add}>
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
                                      <FormattedMessage {...ProfileMainMessage.seeCertificate} />
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
                            sx={{ height: '40px', color: 'text.primary' }}
                          >
                            <Icon name="Plus" color="text.primary" />
                            <FormattedMessage {...ProfileMainMessage.addCertificate} />
                          </Button>
                        </Link>
                      </Box>
                    </>
                  )}
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </RootStyle>
      </Container>
      <Outlet />
    </Box>
  );
}
