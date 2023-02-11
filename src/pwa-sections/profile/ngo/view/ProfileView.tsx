import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useParams } from 'react-router-dom';
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
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import GoogleMapReact from 'google-map-react';
import { useLazyGetCertificatesQuery } from 'src/_graphql/profile/certificates/queries/getCertificates.generated';
import { useLazyGetProjectsQuery } from 'src/_graphql/profile/mainProfileNOG/queries/getProject.generated';
import { useLazyGetUserDetailQuery } from 'src/_graphql/profile/publicDetails/queries/getUser.generated';
import { Icon } from 'src/components/Icon';
import MediaCarousel from 'src/components/mediaCarousel';
import PostView from 'src/pwa-sections/profile/components/PostView';
import ConnectionView from 'src/sections/profile/components/ConnectionView';
import { ConnectionStatusEnum } from 'src/types/serverTypes';
import getMonthName from 'src/utils/getMonthName';

import ProfileViewPwaMessages from '../../UserProfileViewPwa.messages';
import RequestMessage from '../../components/RequestMessage';
import ButtonStatusView from './ButtonStatusView';

// --------------------
const CardStyle = styled(Card)(({ theme }) => ({
  minHeight: 282,
  borderRadius: 0,
  margin: 'auto',
  boxShadow: 'unset',
  width: '100%',
  position: 'relative',
}));

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
  marginTop: theme.spacing(1),
}));

const ProjectMoreDescriptionStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  marginTop: theme.spacing(1),
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
}));

const BioMoreDescriptionStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  marginTop: theme.spacing(1),
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
}));
const BioBriefDescriptionStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  marginTop: theme.spacing(1),
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 3,
}));
const MapStyle = styled(Box)(({ theme }) => ({
  width: 328,
  height: 230,
}));
const bull = (
  <Box component="span" sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}>
    •
  </Box>
);
const Marker = ({ text }: { lat?: number; lng?: number; text: JSX.Element }) => <Box>{text}</Box>;

export default function ProfileViewNgo() {
  const [isLoadMore, setIsLoadMore] = useState(true);
  const { id } = useParams();
  const { formatMessage } = useIntl();
  const _Id = id;
  const theme = useTheme();

  // bottom sheet   & state for edit photo
  const [, setProfileChangePhotoBottomSheet] = useState(false);
  const [, setProfileCoverAvatarBottomSheet] = useState(false);
  const [, setStatusPhoto] = useState<'cover' | 'avatar' | undefined>();

  // services
  const [getUserDetail, { data: userData, isFetching: userFetching }] = useLazyGetUserDetailQuery();
  const [getCertificates, { data: certificateData, isFetching: isFetchingCertificate }] = useLazyGetCertificatesQuery();
  const [getProjects, { data: projectData, isFetching: isFetchingProject }] = useLazyGetProjectsQuery();

  // useEffect for services
  const ngo = userData?.getUser?.listDto?.items?.[0];
  const userBlockStatus = ngo?.connectionDto?.meBlockedOther || ngo?.connectionDto?.otherBlockedMe;
  // const ngoIsVisible =
  //   ngo?.accountPrivacy === AccountPrivacyEnum.Public ||
  //   ngo?.connectionDto?.meToOtherStatus === ConnectionStatusEnum.Accepted;

  useEffect(() => {
    if (_Id) {
      getUserDetail({ filter: { dto: { id: _Id } } });
      if (!userBlockStatus && !ngo?.meReportedOther) {
        getProjects({
          filter: { dto: { userId: _Id }, orderByDescendings: [true], orderByFields: ['CreatedDateTime'] },
        });
        getCertificates({ filter: { dto: { userId: _Id } } });
      }
    }
  }, [_Id, getCertificates, getProjects, getUserDetail, ngo?.meReportedOther, userBlockStatus]);

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
  // ------------------------------------------------------
  const locatedIn = ngo?.organizationUserDto?.place?.description;
  const size = ngo?.organizationUserDto?.numberRange;
  const EstablishedDate = ngo?.organizationUserDto?.establishmentDate;
  const category = ngo?.organizationUserDto?.groupCategory;
  const emails = ngo?.contactInfoEmails;
  const phoneNumbers = ngo?.contactInfoPhoneNumbers;
  const socialLinks = ngo?.contactInfoSocialLinks;
  const websites = ngo?.contactInfoWebSites;
  const hasContactInfo = !!emails?.length || !!phoneNumbers?.length || !!websites?.length || !!socialLinks?.length;
  const hasPublicDetail = !!category || !!size || !!EstablishedDate || !!locatedIn;

  // -----------------------------------------
  // functions !!
  const handleSeeMoreClick = () => {
    setIsLoadMore(!isLoadMore);
  };

  return (
    <>
      <RootStyle>
        <Stack sx={{ width: '100%' }}>
          <Grid item lg={12}>
            {/* HAS REQUEST MODE CONDITION */}
            {ngo?.connectionDto?.otherToMeStatus === ConnectionStatusEnum.Requested && (
              <RequestMessage fullName={ngo?.organizationUserDto?.fullName || ''} itemId={ngo?.connectionDto?.itemId} />
            )}
            {/* HAS BEEN REPORTED */}
            {ngo?.meReportedOther && (
              <Stack
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: theme.spacing(1),
                  padding: theme.spacing(2),
                }}
                direction="row"
                alignItems="center"
                spacing={1}
              >
                <img src="src/assets/icons/report-message.svg" alt="" loading="lazy" />
                <Typography color="text.secondary" variant="subtitle2">
                  <FormattedMessage {...ProfileViewPwaMessages.reportMessage} />
                </Typography>
              </Stack>
            )}
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
                    variant="rounded"
                    alt={ngo?.organizationUserDto?.fullName || ''}
                    src={ngo?.organizationUserDto?.avatarUrl || undefined}
                    sx={{ width: 80, height: 80, backgroundColor: 'background.neutral' }}
                  >
                    <img src="/icons/camera.svg" width={28} height={22} alt="avatar" loading="lazy" />
                  </Avatar>
                  <Stack direction={'row'} spacing={0.5} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack>
                      <Typography gutterBottom variant="subtitle1" sx={{ mt: 1 }} color="text.primary">
                        {ngo?.organizationUserDto?.fullName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {!!ngo?.userType && 'NGO'}
                      </Typography>
                    </Stack>
                    <Box>
                      <Box sx={{ backgroundColor: 'secondary.main', padding: '16px 8px', borderRadius: 1 }}>
                        <Typography color="background.paper">BGD</Typography>
                      </Box>
                    </Box>
                  </Stack>
                </StackContentStyle>
              </CardContentStyle>
            </CardStyle>
          </Grid>
          <Grid item lg={12}>
            <Stack spacing={0.25}>
              {/* =================================={BUTTONS}============================= */}
              <ButtonStatusView ngo={ngo} itemId={ngo?.connectionDto?.itemId} />
              {/* =================================={CONTENT OF PROFILE}============================= */}
              {/* BLOCK MODE CONDITION */}
              {!userBlockStatus && !ngo?.meReportedOther ? (
                <>
                  {/*============================= Bio =================== */}
                  {!ngo?.organizationUserDto?.bio ? (
                    <></>
                  ) : (
                    <Stack sx={{ backgroundColor: 'background.paper', borderRadius: 1, px: 2, py: 2 }}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="subtitle1" color={theme.palette.text.primary}>
                          Bio
                        </Typography>
                      </Stack>
                      <Box>
                        {isLoadMore &&
                        (ngo?.organizationUserDto?.bio.length > 210 ||
                          ngo?.organizationUserDto?.bio.split('\n').length > 3) ? (
                          <>
                            <BioBriefDescriptionStyle variant="body2">
                              {ngo?.organizationUserDto?.bio.split('\n').map((str, i) => (
                                <p key={i}>{str}</p>
                              ))}
                            </BioBriefDescriptionStyle>
                            <Typography
                              variant="body2"
                              color={theme.palette.info.main}
                              sx={{ cursor: 'pointer' }}
                              onClick={handleSeeMoreClick}
                            >
                              <FormattedMessage {...ProfileViewPwaMessages.seeMoreButton} />
                            </Typography>
                          </>
                        ) : (
                          <BioMoreDescriptionStyle>
                            {ngo?.organizationUserDto?.bio.split('\n').map((str, i) => (
                              <p key={i}>{str}</p>
                            ))}
                          </BioMoreDescriptionStyle>
                        )}
                      </Box>
                    </Stack>
                  )}
                  {/* ============================{PUBLIC DETAILS} =======================*/}
                  <Stack spacing={1} sx={{ backgroundColor: 'background.paper', borderRadius: 1, p: 2 }}>
                    {!hasPublicDetail ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton>
                          <Icon name="Join-Calendar" color="text.primary" />
                        </IconButton>
                        <Typography variant="body1" color={theme.palette.text.primary} component="span">
                          <FormattedMessage
                            {...ProfileViewPwaMessages.joinMessage}
                            values={{
                              brand: 'Garden of love',
                              Date: `${getMonthName(new Date(ngo?.organizationUserDto?.joinDateTime))} ${new Date(
                                ngo?.organizationUserDto?.joinDateTime,
                              ).getFullYear()}`,
                              Typography: (str) =>
                                ngo?.organizationUserDto?.joinDateTime && (
                                  <Typography component="span" variant="subtitle2" sx={{ pl: 0.5 }}>
                                    {str}
                                  </Typography>
                                ),
                            }}
                          />
                        </Typography>
                      </Box>
                    ) : (
                      <>
                        <>
                          {category && (
                            <Box
                              sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 0.5 }}
                              key={category.id}
                            >
                              <IconButton>
                                <img
                                  src="src/assets/icons/mainNGO/active/NGO/24/Outline.svg"
                                  alt="ngo"
                                  loading="lazy"
                                />
                              </IconButton>
                              <Typography variant="subtitle2" color={theme.palette.text.primary}>
                                <FormattedMessage
                                  {...ProfileViewPwaMessages.ngoCategory}
                                  values={{
                                    NGO: 'NGO',
                                    title: category?.title,
                                    Typography: (str) => (
                                      <Typography
                                        variant="subtitle2"
                                        color="text.primary"
                                        component="span"
                                        sx={{ pl: 1 }}
                                      >
                                        {str}
                                      </Typography>
                                    ),
                                  }}
                                />
                              </Typography>
                            </Box>
                          )}

                          {size && (
                            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 0.5 }}>
                              <IconButton>
                                <img
                                  src="src/assets/icons/mainNGO/active/NGO/24/Outline.svg"
                                  alt="ngo"
                                  loading="lazy"
                                />
                              </IconButton>
                              <Typography variant="subtitle2" color={theme.palette.text.primary}>
                                <FormattedMessage
                                  {...ProfileViewPwaMessages.ngoSize}
                                  values={{
                                    NGO: 'NGO',
                                    title: size?.desc,
                                    Typography: (str) => (
                                      <Typography
                                        variant="subtitle2"
                                        color="text.primary"
                                        component="span"
                                        sx={{ pl: 1 }}
                                      >
                                        {str}
                                      </Typography>
                                    ),
                                  }}
                                />
                              </Typography>
                            </Box>
                          )}
                          {EstablishedDate && (
                            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 0.5 }}>
                              <IconButton>
                                <img
                                  src="src/assets/icons/mainNGO/active/calendar/24/Outline.svg"
                                  alt="ngo"
                                  loading="lazy"
                                />
                              </IconButton>
                              <Typography variant="subtitle2" color={theme.palette.text.primary}>
                                <FormattedMessage
                                  {...ProfileViewPwaMessages.ngoEstablishmentDate}
                                  values={{
                                    date: `${getMonthName(new Date(EstablishedDate))} ${new Date(
                                      EstablishedDate,
                                    ).getFullYear()}`,
                                    Typography: (str) => (
                                      <Typography
                                        variant="subtitle2"
                                        color="text.primary"
                                        component="span"
                                        sx={{ pl: 1 }}
                                      >
                                        {str}
                                      </Typography>
                                    ),
                                  }}
                                />
                              </Typography>
                              {/* <Typography variant="subtitle2" color={theme.palette.text.primary} sx={{ mr: 1 }}>
                                {getMonthName(new Date(EstablishedDate))} {new Date(EstablishedDate).getFullYear()}
                              </Typography> */}
                            </Box>
                          )}
                          {locatedIn && (
                            <>
                              <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 0.5 }}>
                                <IconButton>
                                  <img
                                    src="src/assets/icons/mainNGO/active/City/24/Outline.svg"
                                    alt="ngo"
                                    loading="lazy"
                                  />
                                </IconButton>
                                <Typography variant="subtitle2" color={theme.palette.text.primary}>
                                  <FormattedMessage
                                    {...ProfileViewPwaMessages.ngoplaceInfo}
                                    values={{
                                      place: `${
                                        !!ngo?.organizationUserDto?.address && `${ngo?.organizationUserDto?.address},`
                                      } ${locatedIn}`,
                                      Typography: (str) => (
                                        <Typography
                                          variant="subtitle2"
                                          color="text.primary"
                                          component="span"
                                          sx={{ pl: 1 }}
                                        >
                                          {str}
                                        </Typography>
                                      ),
                                    }}
                                  />
                                </Typography>
                                {/* <Typography variant="subtitle2" color={theme.palette.text.primary}>
                                  {!!ngo?.organizationUserDto?.address && `${ngo?.organizationUserDto?.address}, `}
                                  {locatedIn}
                                </Typography> */}
                              </Box>
                              {/* ----------------map---------- */}
                              {ngo?.organizationUserDto?.lat && (
                                <MapStyle>
                                  <Box style={{ height: 230, width: 328 }}>
                                    <GoogleMapReact
                                      bootstrapURLKeys={{ key: 'AIzaSyAeD8NNyr1bEJpjKnSHnKJQfj5j8Il7ct8' }}
                                      defaultCenter={{
                                        lat: ngo?.organizationUserDto?.lat as number,
                                        lng: ngo?.organizationUserDto?.lng as number,
                                      }}
                                      defaultZoom={13}
                                    >
                                      <Marker
                                        lat={ngo?.organizationUserDto?.lat as number}
                                        lng={ngo?.organizationUserDto?.lng as number}
                                        text={
                                          <Box>
                                            <Icon name="location" type="solid" color="error.main" />
                                          </Box>
                                        }
                                      />
                                    </GoogleMapReact>
                                  </Box>
                                </MapStyle>
                              )}
                            </>
                          )}
                        </>

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton>
                            <Icon name="Join-Calendar" color="text.primary" />
                          </IconButton>

                          <Typography variant="body1" color={theme.palette.text.primary} component="span">
                            <FormattedMessage
                              {...ProfileViewPwaMessages.joinMessage}
                              values={{
                                brand: 'Garden of love',
                                Date: `${getMonthName(new Date(ngo?.organizationUserDto?.joinDateTime))} ${new Date(
                                  ngo?.organizationUserDto?.joinDateTime,
                                ).getFullYear()}`,
                                Typography: (str) =>
                                  ngo?.organizationUserDto?.joinDateTime && (
                                    <Typography component="span" variant="subtitle2" sx={{ pl: 0.5 }}>
                                      {str}
                                    </Typography>
                                  ),
                              }}
                            />
                          </Typography>
                        </Box>
                      </>
                    )}
                  </Stack>
                  {/* =============================={Projects} ==============================*/}
                  {projects?.length ? (
                    <Stack spacing={1} sx={{ backgroundColor: 'background.paper', borderRadius: 1, p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1" color={theme.palette.text.primary}>
                          <FormattedMessage {...ProfileViewPwaMessages.ngoprojectTitle} />
                        </Typography>
                      </Box>

                      {isFetchingProject ? (
                        <CircularProgress size={20} />
                      ) : (
                        projects?.slice(0, 1)?.map((project, index: any) => (
                          <Box key={project?.id}>
                            <Box>
                              <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
                                {project?.title}
                              </Typography>
                            </Box>

                            <Box>
                              <Typography variant="caption" color={theme.palette.text.secondary}>
                                {getMonthName(new Date(project?.startDate)) +
                                  ' ' +
                                  new Date(project?.startDate).getFullYear() +
                                  ' - ' +
                                  (project?.endDate
                                    ? getMonthName(new Date(project?.startDate)) +
                                      ' ' +
                                      new Date(project?.startDate).getFullYear()
                                    : formatMessage(ProfileViewPwaMessages.presentWord))}
                                {showDifferenceExp(
                                  project?.dateDiff?.years as number,
                                  project?.dateDiff?.months as number,
                                )}
                              </Typography>
                            </Box>
                            {project?.cityDto?.name && (
                              <Box>
                                <Typography variant="caption" color={theme.palette.text.secondary}>
                                  {project?.cityDto?.name}
                                </Typography>
                              </Box>
                            )}
                            <Stack>
                              <Box>
                                {project?.description && (
                                  <ProjectDescriptionStyle variant="body2">
                                    {project?.description.split('\n').map((str, i) => (
                                      <p key={i}>{str}</p>
                                    ))}
                                  </ProjectDescriptionStyle>
                                )}
                                {project?.description && (
                                  <>
                                    {isLoadMore &&
                                    (project?.description.length > 210 ||
                                      project?.description.split('\n').length > 3) ? (
                                      <>
                                        <ProjectDescriptionStyle variant="body2">
                                          {project?.description.split('\n').map((str, i) => (
                                            <p key={i}>{str}</p>
                                          ))}
                                        </ProjectDescriptionStyle>
                                        <Typography
                                          variant="body2"
                                          color={theme.palette.info.main}
                                          sx={{ cursor: 'pointer' }}
                                          onClick={handleSeeMoreClick}
                                        >
                                          see more
                                        </Typography>
                                      </>
                                    ) : (
                                      <ProjectMoreDescriptionStyle>
                                        {project?.description.split('\n').map((str, i) => (
                                          <p key={i}>{str}</p>
                                        ))}
                                      </ProjectMoreDescriptionStyle>
                                    )}
                                  </>
                                )}
                              </Box>
                              {!!project?.projectMedias?.length && (
                                <Box sx={{ py: 2 }}>
                                  <MediaCarousel media={project?.projectMedias} dots height={184} width={328} />
                                </Box>
                              )}
                            </Stack>
                          </Box>
                        ))
                      )}
                      {projects.length - 3 > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Link to={`project/${_Id}`}>
                            <Button variant="text" size="small">
                              {/* See {projects.length - 1} More Projects */}
                              <FormattedMessage
                                {...ProfileViewPwaMessages.seeMoreProjectMessage}
                                values={{ count: projects?.length - 3 }}
                              />
                            </Button>
                          </Link>
                        </Box>
                      )}
                    </Stack>
                  ) : (
                    <></>
                  )}

                  {/* =============================={CERTIFICATE} ===========================*/}
                  {certificates?.length ? (
                    <Stack spacing={1} sx={{ backgroundColor: 'background.paper', borderRadius: 1, p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1" color={theme.palette.text.primary}>
                          <FormattedMessage {...ProfileViewPwaMessages.certificate} />
                        </Typography>
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
                              <Typography variant="caption" color={theme.palette.text.secondary}>
                                {certificate?.issueDate &&
                                  `${formatMessage(ProfileViewPwaMessages.issued)} ${getMonthName(
                                    new Date(certificate?.issueDate),
                                  )}
                    ${new Date(certificate?.issueDate).getFullYear()}`}
                                {certificate?.issueDate && bull}
                                {certificate?.expirationDate
                                  ? ` ${getMonthName(new Date(certificate?.expirationDate))} ${new Date(
                                      certificate?.expirationDate,
                                    ).getFullYear()} `
                                  : !certificate?.credentialDoesExpire &&
                                    formatMessage(ProfileViewPwaMessages.noExpirationMessage)}
                              </Typography>
                            </Box>
                            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
                              {/* Issuing organization: {certificate.issuingOrganization.title} */}
                              <FormattedMessage
                                {...ProfileViewPwaMessages.issuingOrganizationMessage}
                                values={{ title: certificate?.issuingOrganization?.title }}
                              />
                            </Typography>
                            {certificate?.credentialID && (
                              <Box>
                                <Typography variant="caption" color={theme.palette.text.secondary}>
                                  {/* Credential ID {certificate?.credentialID} */}
                                  <FormattedMessage
                                    {...ProfileViewPwaMessages.credentialID}
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
                                      <Typography variant="body2">see certificate</Typography>
                                    </Button>
                                  </MuiLink>
                                </Link>
                              </Box>
                            )}
                          </Box>
                        ))
                      )}
                      {certificates.length - 3 > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
                          <Link to={`certificate/${_Id}`}>
                            <Button variant="text" size="small">
                              {/* See {certificates.length - 1} More Certificate */}
                              <FormattedMessage
                                {...ProfileViewPwaMessages.seeMoreCertificateMessages}
                                values={{ count: certificates?.length - 3 }}
                              />
                            </Button>
                          </Link>
                        </Box>
                      )}
                    </Stack>
                  ) : (
                    <></>
                  )}

                  {/* =============================={CONTACT INFO}======================== */}

                  {hasContactInfo ? (
                    <Stack spacing={2} sx={{ backgroundColor: 'background.paper', borderRadius: 1, p: 2 }}>
                      <>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1" color={theme.palette.text.primary}>
                            Contact Info
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" sx={{ pl: 1, color: 'primary.main', pb: 1 }}>
                            Email
                          </Typography>
                          {userFetching ? (
                            <CircularProgress size={20} />
                          ) : (
                            emails?.slice(0, 2)?.map((email) => (
                              <Typography variant="body2" color="text.primary" sx={{ pl: 1 }} key={email?.id}>
                                {email?.email}
                              </Typography>
                            ))
                          )}
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" sx={{ pl: 1, color: 'primary.main', pb: 1 }}>
                            Phone Number
                          </Typography>
                          {userFetching ? (
                            <CircularProgress size={20} />
                          ) : (
                            phoneNumbers?.map((phone) => (
                              <Typography
                                variant="body2"
                                color={theme.palette.text.primary}
                                sx={{ pl: 1 }}
                                key={phone?.id}
                              >
                                {phone?.phoneNumber}
                              </Typography>
                            ))
                          )}
                        </Box>

                        <Box>
                          <Typography variant="subtitle2" sx={{ pl: 1, color: 'primary.main', pb: 1 }}>
                            Social Links
                          </Typography>
                          {userFetching ? (
                            <CircularProgress size={20} />
                          ) : (
                            socialLinks?.map((social) => (
                              <Box sx={{ display: 'flex', alignItems: 'center' }} key={social?.id}>
                                {/* <img src={`/icons/socials/${social?.socialMediaDto?.title}.svg`} width={24} height={24}/> */}
                                <Typography variant="body2" color={theme.palette.text.secondary} sx={{ pl: 1 }}>
                                  {social?.socialMediaDto?.title}
                                </Typography>
                                <Typography variant="body2" color={theme.palette.text.primary} sx={{ pl: 1 }}>
                                  {social?.userName}
                                </Typography>
                              </Box>
                            ))
                          )}
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" sx={{ pl: 1, color: 'primary.main', pb: 1 }}>
                            Website
                          </Typography>
                          {userFetching ? (
                            <CircularProgress size={20} />
                          ) : (
                            websites?.map((webSite) => (
                              <Typography
                                variant="body2"
                                color={theme.palette.text.primary}
                                sx={{ pl: 1 }}
                                key={webSite?.id}
                              >
                                {webSite?.webSiteUrl}
                              </Typography>
                            ))
                          )}
                        </Box>
                      </>
                    </Stack>
                  ) : (
                    <></>
                  )}

                  {/*================================= Followers =============================*/}
                  <Stack sx={{ backgroundColor: 'background.paper', pt: 1, pb: 1 }}>
                    <Box sx={{ px: 2 }}>
                      <ConnectionView Name={ngo?.organizationUserDto?.fullName as string} />
                    </Box>
                  </Stack>

                  {/*================================= post =============================*/}
                  <Stack sx={{ backgroundColor: 'background.paper', pt: 1, pb: 2 }}>
                    <Box sx={{ px: 2 }}>
                      <PostView Name={ngo?.organizationUserDto?.fullName as string} />
                    </Box>
                  </Stack>
                  {/* ------------------------------- ENd sections----------------------------------------- */}
                </>
              ) : (
                <>
                  <Stack sx={{ backgroundColor: 'background.paper', height: '100vh' }} />
                </>
              )}
            </Stack>
          </Grid>
        </Stack>
      </RootStyle>
    </>
  );
}
