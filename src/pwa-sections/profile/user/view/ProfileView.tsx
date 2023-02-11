import { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useParams } from 'react-router-dom';

import {
  Avatar,
  AvatarGroup,
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

import { useLazyGetCertificatesQuery } from 'src/_graphql/profile/certificates/queries/getCertificates.generated';
import { useLazyGetExperiencesQuery } from 'src/_graphql/profile/experiences/queries/getExperiences.generated';
import { useLazyGetUserDetailQuery } from 'src/_graphql/profile/publicDetails/queries/getUser.generated';
import { useEndorsementSkillMutation } from 'src/_graphql/profile/skills/mutations/endorsementSkill.generated';
import { useLazyGetPersonSkillsQuery } from 'src/_graphql/profile/skills/queries/getPersonSkills.generated';
import { Icon } from 'src/components/Icon';
import useAuth from 'src/hooks/useAuth';
import ConnectionView from 'src/pwa-sections/profile/components/ConnectionView';
import PostView from 'src/pwa-sections/profile/components/PostView';
import { AccountPrivacyEnum, ConnectionStatusEnum } from 'src/types/serverTypes';
import getMonthName from 'src/utils/getMonthName';

import ProfileViewPwaMessages from '../../UserProfileViewPwa.messages';
import RequestMessage from '../../components/RequestMessage';
import ButtonStatusView from './ButtonStatusView';

const CardStyle = styled(Card)(({ theme }) => ({
  minHeight: 282,
  borderRadius: 0,
  margin: 'auto',
  boxShadow: 'unset',
  width: '100%',
  position: 'relative',
}));

const CardContentStyle = styled(CardContent)(({ theme }) => ({
  width: '100%',
  position: 'absolute',
  top: '120px',
  padding: theme.spacing(2),
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
  minWidth: '270px',
  backgroundColor: theme.palette.grey[100],
}));
const ExperienceLogoImage = styled(Stack)(({ theme }) => ({
  width: 48,
  height: 48,
  backgroundColor: theme.palette.grey[100],
}));
const bull = (
  <Box component="span" sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}>
    •
  </Box>
);

export default function ProfileViewNormalUser() {
  const auth = useAuth();
  const { id } = useParams();
  const { formatMessage } = useIntl();

  const [getUserDetail, { data: userData, isFetching: userFetching }] = useLazyGetUserDetailQuery();
  const [getExperiences, { data: experienceData, isFetching: isFetchingExprience }] = useLazyGetExperiencesQuery();
  const [getCertificates, { data: certificateData, isFetching: isFetchingCertificate }] = useLazyGetCertificatesQuery();
  const [getSkills, { data: skillsData, isFetching: isFetchingSkill }] = useLazyGetPersonSkillsQuery();
  const [updateEmdorsmentSkill] = useEndorsementSkillMutation();

  const user = userData?.getUser?.listDto?.items?.[0];

  const userBlockStatus = user?.connectionDto?.meBlockedOther || user?.connectionDto?.otherBlockedMe;
  const userIsVisible =
    user?.accountPrivacy === AccountPrivacyEnum.Public ||
    user?.connectionDto?.meToOtherStatus === ConnectionStatusEnum.Accepted;

  useEffect(() => {
    if (id) {
      getUserDetail({ filter: { dto: { id: id } } });
      if (userIsVisible && !userBlockStatus && !user?.meReportedOther) {
        getSkills({ filter: { dto: { id: id } } });
        getExperiences({
          filter: { dto: { userId: id }, orderByDescendings: [true], orderByFields: ['CreatedDateTime'] },
        });
        getCertificates({ filter: { dto: { userId: id } } });
      }
    }
  }, [
    id,
    userIsVisible,
    userBlockStatus,
    getUserDetail,
    user?.meReportedOther,
    getSkills,
    getExperiences,
    getCertificates,
  ]);

  const handleEndorse = async (data: any) => {
    const endorseRes: any = await updateEmdorsmentSkill({
      filter: {
        dto: {
          id: data,
        },
      },
    });
    if (endorseRes?.data?.endorsementSkill?.isSuccess) {
      getSkills({ filter: { dto: { id: id } } });
    }
  };

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
  const hometown = user?.personDto?.hometown;
  const currentCity = user?.personDto?.currnetCity;
  const relationship = user?.personDto?.relationship;
  const userExperience = user?.personDto?.experience;
  const currentExperiences = user?.personDto?.personCurrentExperiences;
  const university = user?.personDto?.personUniversities;
  const schools = user?.personDto?.personSchools;
  const emails = user?.contactInfoEmails;
  const phoneNumbers = user?.contactInfoPhoneNumbers;
  const socialMedias = user?.contactInfoSocialLinks;
  const websites = user?.contactInfoWebSites;
  const hasPublicDetail =
    !!userExperience ||
    !!currentExperiences?.length ||
    !!university?.length ||
    !!schools?.length ||
    !!currentCity ||
    !!hometown ||
    !!relationship;
  const hasContactInfo = !!emails?.length || !!phoneNumbers?.length || !!socialMedias?.length || !!websites?.length;

  return (
    <>
      <RootStyle>
        <Stack sx={{ width: '100%' }}>
          <Grid item lg={12}>
            {/* HAS REQUEST MODE CONDITION */}
            {user?.connectionDto?.otherToMeStatus === ConnectionStatusEnum.Requested && (
              <RequestMessage
                fullName={user?.personDto?.firstName || (user?.personDto?.fullName as string)}
                itemId={user?.connectionDto?.itemId}
              />
            )}
            {user?.meReportedOther && (
              <Stack
                sx={{
                  backgroundColor: 'background.paper',
                  borderRadius: 1,
                  padding: 2,
                }}
                direction="row"
                alignItems="center"
                spacing={1}
              >
                <Icon name="Info" />
                <Typography color="text.secondary" variant="subtitle2">
                  {user?.personDto?.firstName} is reported by you.
                </Typography>
              </Stack>
            )}
            <CardStyle>
              <CardMedia
                component="img"
                alt="Cover Image"
                height={'176px'}
                image={user?.personDto?.coverUrl || '/icons/empty_cover.svg'}
              />
              <CardContentStyle>
                <StackContentStyle>
                  <Avatar
                    alt={user?.personDto?.fullName || undefined}
                    src={user?.personDto?.avatarUrl || undefined}
                    sx={{ width: 80, height: 80, backgroundColor: 'background.neutral' }}
                  >
                    <img src="/icons/camera.svg" width={28} height={22} alt="avatar" loading="lazy" />
                  </Avatar>

                  <Stack direction={'row'} spacing={0.5} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack>
                      <Typography gutterBottom variant="subtitle1" sx={{ mt: 1 }} color="text.primary">
                        {user?.personDto?.firstName} {user?.personDto?.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {!!user?.userType && 'Normal User'}
                      </Typography>
                    </Stack>

                    {userIsVisible && !userBlockStatus && !user?.meReportedOther && (
                      <Box>
                        <Box sx={{ backgroundColor: 'secondary.main', padding: '16px 8px', borderRadius: 1 }}>
                          <Typography color="background.paper">BGD</Typography>
                        </Box>
                      </Box>
                    )}
                  </Stack>
                  {/* LOCATON AND HEADLINE */}
                  {userIsVisible && !userBlockStatus && !user?.meReportedOther && (
                    <Stack alignItems="flex-start">
                      <Button size="small" variant="text" sx={{ minWidth: 'unset !important' }}>
                        {/* handle when current City Exists */}
                        <Typography color="text.primary">{user?.personDto?.currnetCity?.city?.name}</Typography>
                      </Button>
                      {/* handle when headline Exists */}
                      <Button size="small" variant="text" sx={{ minWidth: 'unset !important' }}>
                        <Typography color="text.primary">{user?.personDto?.headline}</Typography>
                      </Button>
                    </Stack>
                  )}
                </StackContentStyle>
              </CardContentStyle>
            </CardStyle>
          </Grid>
          <Grid item lg={12}>
            <Stack spacing={0.25}>
              {/* PRIVACY AND BLOCK MODE CONDITION */}
              {/* =================================={BUTTONS}============================= */}
              <ButtonStatusView user={user} itemId={user?.connectionDto?.itemId} />
              {/* PRIVACY AND BLOCK MODE CONDITION */}
              {userIsVisible && !userBlockStatus && !user?.meReportedOther ? (
                <>
                  {/*-------------------------------------------- {PUBLIC DETAILS}--------------------------------------- */}
                  <Stack spacing={1} sx={{ backgroundColor: 'background.paper', borderRadius: 1, p: 2 }}>
                    {hasPublicDetail && (
                      <>
                        {currentExperiences?.map((experience) => (
                          <Box sx={{ display: 'flex', alignItems: 'center' }} key={experience?.id}>
                            <IconButton>
                              <Icon name="Occupation" />
                            </IconButton>
                            <Typography variant="body2" color="text.primary" component="span">
                              {experience?.title}
                              <Typography component="span" variant="subtitle2" sx={{ ml: 0.5 }}>
                                <FormattedMessage
                                  {...ProfileViewPwaMessages.experienceInfo}
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
                            </Typography>
                          </Box>
                        ))}

                        {university?.map((uni) => (
                          <Box sx={{ display: 'flex', alignItems: 'center' }} key={uni?.id}>
                            <IconButton>
                              <Icon name="mortarboard-Education" />
                            </IconButton>
                            <Typography variant="body2" color="text.primary" component="span">
                              <FormattedMessage
                                {...ProfileViewPwaMessages.universityInfo}
                                values={{
                                  title: uni?.concentrationDto?.title,
                                  name: uni?.collegeDto?.name,
                                  startDate: `${getMonthName(new Date(uni?.startDate))} ${new Date(
                                    uni?.startDate,
                                  ).getFullYear()}`,
                                  endDate: uni?.endDate
                                    ? getMonthName(new Date(uni?.endDate)) + ' ' + new Date(uni?.endDate).getFullYear()
                                    : formatMessage(ProfileViewPwaMessages.presentWord),
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
                              <Icon name="mortarboard-Education" />
                            </IconButton>
                            <Typography variant="body2" color="text.primary" component="span">
                              <FormattedMessage
                                {...ProfileViewPwaMessages.schoolInfo}
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
                              <Icon name="City" />
                            </IconButton>

                            <Typography variant="body2" color="text.primary" component="span">
                              <FormattedMessage
                                {...ProfileViewPwaMessages.currentCityInfo}
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
                              <Icon name="Hometown" />
                            </IconButton>

                            <Typography variant="body2" color="text.primary" component="span">
                              <FormattedMessage
                                {...ProfileViewPwaMessages.homeTownInfo}
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
                              <Icon name="Relationship" />
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
                        <Icon name="Join-Calendar" />
                      </IconButton>

                      <Typography variant="body2" color="text.primary" component="span">
                        <FormattedMessage
                          {...ProfileViewPwaMessages.joinMessage}
                          values={{
                            brand: 'Garden of love',
                            Date:
                              getMonthName(new Date(user?.personDto?.joinDateTime)) +
                              ' ' +
                              new Date(user?.personDto?.joinDateTime).getFullYear(),
                            Typography: (str) =>
                              user?.personDto?.joinDateTime && (
                                <Typography component="span" variant="subtitle2" sx={{ ml: 0.5 }}>
                                  {str}
                                </Typography>
                              ),
                          }}
                        />
                      </Typography>
                    </Box>
                  </Stack>

                  {/* -----------------------------------{EXPERIENCE} -------------------*/}
                  <Stack spacing={1} sx={{ backgroundColor: 'background.paper', borderRadius: 1, p: 2 }}>
                    {experiences?.length ? (
                      <>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1" color="text.primary">
                            <FormattedMessage {...ProfileViewPwaMessages.experiences} />
                          </Typography>
                        </Box>

                        {isFetchingExprience ? (
                          <CircularProgress size={20} />
                        ) : (
                          experiences?.slice(0, 1)?.map((experience, index) => (
                            <Box key={experience?.id} sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                              <Box>
                                {experience?.companyDto?.logoUrl ? (
                                  <ExperienceLogoImage alignItems="center" justifyContent="center">
                                    <img
                                      src={experience?.companyDto?.logoUrl}
                                      width={32}
                                      height={32}
                                      alt={experience?.title || '' + index}
                                      loading="lazy"
                                    />
                                  </ExperienceLogoImage>
                                ) : (
                                  <ExperienceLogoImage alignItems="center" justifyContent="center">
                                    <img
                                      src="src/assets/icons/experienceLogo.svg"
                                      width={32}
                                      height={32}
                                      alt={experience?.title || '' + index}
                                      loading="lazy"
                                    />
                                  </ExperienceLogoImage>
                                )}
                              </Box>
                              <Stack>
                                <Box>
                                  <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
                                    <FormattedMessage
                                      {...ProfileViewPwaMessages.experienceTitle}
                                      values={{ title: experience?.title, name: experience?.companyDto?.title }}
                                    />
                                  </Typography>
                                </Box>

                                <Box>
                                  <Typography variant="caption" color="text.secondary">
                                    {getMonthName(new Date(experience?.startDate)) +
                                      ' ' +
                                      new Date(experience?.startDate).getFullYear() +
                                      ' - ' +
                                      (experience?.endDate
                                        ? getMonthName(new Date(experience?.startDate)) +
                                          ' ' +
                                          new Date(experience?.startDate).getFullYear()
                                        : formatMessage(ProfileViewPwaMessages.presentWord))}
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
                                    <ExperienceImage sx={{ mr: 1, borderRadius: 1, mt: 2 }}>
                                      <img
                                        src={experience?.mediaUrl}
                                        width={'100%'}
                                        height={'100%'}
                                        alt="experience"
                                        loading="lazy"
                                      />
                                    </ExperienceImage>
                                  )}
                                </Stack>
                              </Stack>
                            </Box>
                          ))
                        )}

                        {experiences.length - 3 > 0 && (
                          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
                            <Link to={`exprience/${id}`}>
                              <Button variant="text" size="small">
                                <FormattedMessage
                                  {...ProfileViewPwaMessages.seeMoreExperienceMessages}
                                  values={{ count: experiences?.length - 3 }}
                                />
                              </Button>
                            </Link>
                          </Box>
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                    <Divider />
                  </Stack>

                  {/* ---------------------------------{CERTIFICATE}--------------------------------------- */}
                  {!!certificates?.length && (
                    <Stack
                      spacing={1}
                      sx={{
                        backgroundColor: 'background.paper',
                        borderRadius: 1,
                        p: 2,
                      }}
                    >
                      <>
                        <Typography variant="subtitle1" color="text.primary">
                          <FormattedMessage {...ProfileViewPwaMessages.certificate} />
                        </Typography>

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
                                <FormattedMessage
                                  {...ProfileViewPwaMessages.issuingOrganizationMessage}
                                  values={{ title: certificate?.issuingOrganization?.title }}
                                />
                              </Typography>
                              {certificate?.credentialID && (
                                <Box>
                                  <Typography variant="caption" color="text.secondary">
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
                                        sx={{
                                          borderColor: 'text.primary',
                                          color: 'text.primary',
                                          mt: 1,
                                          mb: 1,
                                        }}
                                      >
                                        <Typography variant="body2">
                                          <FormattedMessage {...ProfileViewPwaMessages.seeCertificate} />
                                        </Typography>
                                      </Button>
                                    </MuiLink>
                                  </Link>
                                </Box>
                              )}
                            </Box>
                          ))
                        )}
                        {certificates.length - 3 > 0 && (
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              pt: 1,
                            }}
                          >
                            <Link to={`certificate/${id}`}>
                              <Button variant="text" size="small">
                                <FormattedMessage
                                  {...ProfileViewPwaMessages.seeMoreCertificateMessages}
                                  values={{ count: certificates?.length - 3 }}
                                />
                              </Button>
                            </Link>
                          </Box>
                        )}
                      </>
                      <Divider />
                    </Stack>
                  )}

                  {/*---------------------------- {SKILL} ---------------------------------*/}
                  {!!skills?.length && (
                    <Stack
                      spacing={2}
                      sx={{
                        backgroundColor: 'background.paper',
                        borderRadius: 1,
                        p: 2,
                      }}
                    >
                      <Typography variant="subtitle1" color="text.primary">
                        <FormattedMessage {...ProfileViewPwaMessages.skills} />
                      </Typography>
                      {isFetchingSkill ? (
                        <CircularProgress size={20} />
                      ) : (
                        <>
                          {skills?.slice(0, 3)?.map((skill) => (
                            <Box key={skill?.skill?.id}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  gap: 1,
                                }}
                              >
                                <Typography variant="body2" mr={1} color="text.primary" sx={{ display: 'flex' }}>
                                  {skill?.skill?.title}
                                  {/* SHOW NUMBER OF ENDORSMENT PEAPLE */}
                                </Typography>
                                {!!skill?.endorsementsCount && (
                                  <Typography sx={{ color: 'primary.main' }}>{skill?.endorsementsCount}</Typography>
                                )}
                              </Box>
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}
                              >
                                <Button
                                  variant="outlined"
                                  sx={{
                                    color: 'grey.900',
                                    borderColor: 'grey.500',
                                    py: 0.5,
                                    px: 2.8,
                                    mt: 1,
                                  }}
                                  onClick={() => handleEndorse(skill?.id as any)}
                                >
                                  {skill?.people?.find((person) => person?.id === auth?.user?.id) ? (
                                    <Icon name="Approve-Tick-1" />
                                  ) : (
                                    <Icon name="Plus" />
                                  )}
                                  <Typography ml={1}>
                                    {skill?.people?.find((person) => person?.id === auth?.user?.id)
                                      ? formatMessage(ProfileViewPwaMessages.endorsed)
                                      : formatMessage(ProfileViewPwaMessages.endorse)}
                                  </Typography>
                                </Button>
                                {/* SHOW ENDORSMENT PEAPLE HERE */}
                                <AvatarGroup spacing="small" max={5} sx={{ flexDirection: 'row', pl: 2, ml: 1 }}>
                                  {skill?.people?.map((person, index) => (
                                    <Avatar
                                      alt="Remy Sharp"
                                      src={person?.avatarUrl || undefined}
                                      key={skill.id + index}
                                      sx={{ width: 24, height: 24 }}
                                    />
                                  ))}
                                </AvatarGroup>
                                <></>
                              </Box>
                            </Box>
                          ))}
                          {skills?.length - 5 > 0 && (
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                pt: 1,
                              }}
                            >
                              <Link to={`skill/${id}`}>
                                <Button variant="text" size="small">
                                  <FormattedMessage
                                    {...ProfileViewPwaMessages.seeMoreSkillMessages}
                                    values={{ count: skills?.length - 5 }}
                                  />
                                </Button>
                              </Link>
                            </Box>
                          )}
                        </>
                      )}
                    </Stack>
                  )}

                  {/*----------------------------------- {CONTACT INFO} ------------------------------------*/}
                  {hasContactInfo && (
                    <Stack
                      spacing={2}
                      sx={{
                        backgroundColor: 'background.paper',
                        borderRadius: 1,
                        p: 2,
                      }}
                    >
                      <>
                        <Typography variant="subtitle1" color="text.primary">
                          <FormattedMessage {...ProfileViewPwaMessages.contactInfo} />
                        </Typography>
                        <Box>
                          <Typography variant="subtitle2" sx={{ pl: 1, color: 'primary.main', pb: 1 }}>
                            <FormattedMessage {...ProfileViewPwaMessages.email} />
                          </Typography>
                          {userFetching ? (
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
                            <FormattedMessage {...ProfileViewPwaMessages.phoneNumber} />
                          </Typography>
                          {userFetching ? (
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
                            <FormattedMessage {...ProfileViewPwaMessages.socialLinks} />
                          </Typography>
                          {userFetching ? (
                            <CircularProgress size={20} />
                          ) : (
                            socialMedias?.map((social) => (
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
                            <FormattedMessage {...ProfileViewPwaMessages.website} />
                          </Typography>
                          {userFetching ? (
                            <CircularProgress size={20} />
                          ) : (
                            websites?.map((webSite) => (
                              <Typography variant="body2" color="text.primary" sx={{ pl: 1 }} key={webSite?.id}>
                                {webSite?.webSiteUrl}
                              </Typography>
                            ))
                          )}
                        </Box>
                        {((emails && emails?.length > 2) ||
                          (phoneNumbers && phoneNumbers?.length > 2) ||
                          (socialMedias && socialMedias?.length > 5) ||
                          (websites && websites?.length > 2)) && (
                          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
                            <Link to={`contact-info/${id}`}>
                              <Button variant="text" size="small">
                                <FormattedMessage {...ProfileViewPwaMessages.moreContactInfoMessage} />
                              </Button>
                            </Link>
                          </Box>
                        )}
                      </>
                    </Stack>
                  )}

                  {/* -----------------------------------followers ----------------------------------- */}
                  <Stack sx={{ backgroundColor: 'background.paper', pt: 3, pb: 1 }}>
                    <Box sx={{ px: 2 }}>
                      <ConnectionView Name={(user?.personDto?.firstName || user?.personDto?.fullName) as string} />
                    </Box>
                  </Stack>
                  {/*---------------------------------- posts----------------------------------------------- */}
                  <Stack sx={{ backgroundColor: 'background.paper', pt: 2, pb: 2 }}>
                    <Box sx={{ px: 2 }}>
                      <PostView Name={(user?.personDto?.firstName || user?.personDto?.fullName) as string} />
                    </Box>
                  </Stack>
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
