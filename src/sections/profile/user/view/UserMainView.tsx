import { useEffect, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useParams } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  CircularProgress,
  Container,
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
import ConnectionView from 'src/sections/profile/components/ConnectionView';
import { AccountPrivacyEnum, ConnectionStatusEnum } from 'src/types/serverTypes';
import getMonthName from 'src/utils/getMonthName';

import NormalAndNgoProfileViewMessages from '../../UserProfileView.messages';
import ProfilePostTabs from '../../components/ProfilePostTabs';
import RequestMessage from '../../components/RequestMessage';
import UserInfoCard from './UserInfoCard';

const RootStyle = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.neutral,
  padding: theme.spacing(3, 0),
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
  maxHeight: 152,
  minWidth: 272,
  backgroundColor: theme.palette.grey[100],
}));
const ConnectionsStyle = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(2),
}));
const PostStyle = styled(Stack)(({ theme }) => ({
  borderRadius: theme.spacing(1),
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

export default function UserMainView() {
  const { id } = useParams();
  const auth = useAuth();
  const { formatMessage } = useIntl();

  const [getUserDetail, { data: userData, isFetching: userFetching }] = useLazyGetUserDetailQuery();
  const [getSkills, { data: skillsData }] = useLazyGetPersonSkillsQuery();
  const [getExperiences, { data: experienceData, isFetching: isFetchingExprience }] = useLazyGetExperiencesQuery();
  const [getCertificates, { data: certificateData, isFetching: isFetchingCertificate }] = useLazyGetCertificatesQuery();
  const [updateEmdorsmentSkill, { isLoading }] = useEndorsementSkillMutation();

  const user = userData?.getUser?.listDto?.items?.[0];

  const userBlockStatus = useMemo(
    () => user?.connectionDto?.meBlockedOther || user?.connectionDto?.otherBlockedMe,
    [user?.connectionDto?.meBlockedOther, user?.connectionDto?.otherBlockedMe],
  );
  const userIsVisible =
    user?.accountPrivacy === AccountPrivacyEnum.Public ||
    user?.connectionDto?.meToOtherStatus === ConnectionStatusEnum.Accepted;

  useEffect(() => {
    getUserDetail({ filter: { dto: { id: id } } });
    if (userIsVisible && !userBlockStatus && !user?.meReportedOther) {
      getSkills({ filter: { dto: { id: id } } });
      getExperiences({
        filter: { orderByDescendings: [true], orderByFields: ['CreatedDateTime'], dto: { userId: id } },
      });
      getCertificates({ filter: { dto: { userId: id } } });
    }
  }, [
    id,
    userBlockStatus,
    userIsVisible,
    user?.meReportedOther,
    getUserDetail,
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
  const websites = user?.contactInfoWebSites;
  const socialMedias = user?.contactInfoSocialLinks;

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
      <Container
        maxWidth="lg"
        sx={(theme) => ({
          [theme.breakpoints.up('sm')]: {
            px: 0,
          },
        })}
      >
        <RootStyle>
          <Grid
            container
            spacing={3}
            justifyContent={userIsVisible && !userBlockStatus && !user?.meReportedOther ? 'normal' : 'center'}
          >
            <Grid item lg={8} xs={12}>
              {user?.connectionDto?.otherToMeStatus === ConnectionStatusEnum.Requested && (
                <RequestMessage
                  fullName={(user?.personDto?.firstName || user?.personDto?.fullName) as string}
                  itemId={user?.connectionDto?.itemId}
                />
              )}
              <Stack spacing={3}>
                <UserInfoCard user={user} itemId={user?.connectionDto?.itemId} />
                {userIsVisible && !userBlockStatus && !user?.meReportedOther && (
                  <>
                    {/* SHOW CONNECTION */}
                    <ConnectionsStyle>
                      <ConnectionView Name={(user?.personDto?.firstName || user?.personDto?.fullName) as string} />
                    </ConnectionsStyle>

                    {/* SHOW POST */}
                    <PostStyle spacing={3}>
                      <ProfilePostTabs Name={(user?.personDto?.firstName || user?.personDto?.fullName) as string} />
                    </PostStyle>
                  </>
                )}
              </Stack>
            </Grid>

            {userIsVisible && !userBlockStatus && !user?.meReportedOther && (
              <Grid item lg={4} xs={12}>
                <Stack spacing={3}>
                  {/* PUBLIC DETAILS */}
                  <Stack spacing={1} sx={{ backgroundColor: 'background.paper', borderRadius: 1, p: 2 }}>
                    {hasPublicDetail && (
                      <>
                        {currentExperiences?.map((experience) => (
                          <Box sx={{ display: 'flex', alignItems: 'center' }} key={experience?.id}>
                            <IconButton>
                              <Icon name="Occupation" />
                            </IconButton>
                            <Typography variant="body2" color="text.primary" component="span">
                              <FormattedMessage
                                {...NormalAndNgoProfileViewMessages.experienceInfo}
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
                              <Icon name="mortarboard-Education" />
                            </IconButton>
                            <Typography variant="body2" color="text.primary" component="span">
                              <FormattedMessage
                                {...NormalAndNgoProfileViewMessages.universityInfo}
                                values={{
                                  title: uni?.concentrationDto?.title,
                                  name: uni?.collegeDto?.name,
                                  startDate: `${getMonthName(new Date(uni?.startDate))} ${new Date(
                                    uni?.startDate,
                                  ).getFullYear()}`,
                                  endDate: uni?.endDate
                                    ? getMonthName(new Date(uni?.endDate)) + ' ' + new Date(uni?.endDate).getFullYear()
                                    : formatMessage(NormalAndNgoProfileViewMessages.presentWord),
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
                                {...NormalAndNgoProfileViewMessages.schoolInfo}
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
                                {...NormalAndNgoProfileViewMessages.currentCityInfo}
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
                                {...NormalAndNgoProfileViewMessages.homeTownInfo}
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
                          {...NormalAndNgoProfileViewMessages.joinMessage}
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

                  {/* CONTACT INFO */}
                  {hasContactInfo && (
                    <Stack spacing={2} sx={{ backgroundColor: 'background.paper', borderRadius: 1, p: 2 }}>
                      <>
                        <Typography variant="subtitle1" color="text.primary">
                          <FormattedMessage {...NormalAndNgoProfileViewMessages.contactInfo} />
                        </Typography>

                        {!!emails?.length && (
                          <Box>
                            <Typography variant="subtitle2" sx={{ pl: 1, color: 'primary.main', pb: 1 }}>
                              <FormattedMessage {...NormalAndNgoProfileViewMessages.email} />
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
                        )}

                        {!!phoneNumbers?.length && (
                          <Box>
                            <Typography variant="subtitle2" sx={{ pl: 1, color: 'primary.main', pb: 1 }}>
                              <FormattedMessage {...NormalAndNgoProfileViewMessages.phoneNumber} />
                            </Typography>
                            {userFetching ? (
                              <CircularProgress size={20} />
                            ) : (
                              phoneNumbers?.slice(0, 2)?.map((phone) => (
                                <Typography variant="body2" color="text.primary" sx={{ pl: 1 }} key={phone?.id}>
                                  {phone?.phoneNumber}
                                </Typography>
                              ))
                            )}
                          </Box>
                        )}

                        {!!socialMedias?.length && (
                          <Box>
                            <Typography variant="subtitle2" sx={{ pl: 1, color: 'primary.main', pb: 1 }}>
                              <FormattedMessage {...NormalAndNgoProfileViewMessages.socialLinks} />
                            </Typography>
                            {userFetching ? (
                              <CircularProgress size={20} />
                            ) : (
                              socialMedias?.slice(0, 5)?.map((social) => (
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
                        )}

                        {!!websites?.length && (
                          <Box>
                            <Typography variant="subtitle2" sx={{ pl: 1, color: 'primary.main', pb: 1 }}>
                              <FormattedMessage {...NormalAndNgoProfileViewMessages.website} />
                            </Typography>
                            {userFetching ? (
                              <CircularProgress size={20} />
                            ) : (
                              websites?.slice(0, 2)?.map((webSite) => (
                                <Typography variant="body2" color="text.primary" sx={{ pl: 1 }} key={webSite?.id}>
                                  {webSite?.webSiteUrl}
                                </Typography>
                              ))
                            )}
                          </Box>
                        )}

                        {((emails && emails?.length > 2) ||
                          (phoneNumbers && phoneNumbers?.length > 2) ||
                          (socialMedias && socialMedias?.length > 5) ||
                          (websites && websites?.length > 2)) && (
                          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
                            <Link to={`contactInfos/${id}`}>
                              <Button variant="text" size="small">
                                <FormattedMessage {...NormalAndNgoProfileViewMessages.moreContactInfoMessage} />
                              </Button>
                            </Link>
                          </Box>
                        )}
                      </>
                    </Stack>
                  )}

                  {/* EXPERIENCE */}
                  {!!experiences?.length && (
                    <Stack spacing={1} sx={{ backgroundColor: 'background.paper', borderRadius: 1, p: 2 }}>
                      <>
                        <Typography variant="subtitle1" color="text.primary">
                          <FormattedMessage {...NormalAndNgoProfileViewMessages.experiences} />
                        </Typography>

                        {isFetchingExprience ? (
                          <CircularProgress size={20} />
                        ) : (
                          experiences?.slice(0, 3)?.map((experience, index: number) => (
                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }} key={experience?.id}>
                              <Box>
                                {experience?.companyDto?.logoUrl ? (
                                  <ExperienceLogoImage alignItems="center" justifyContent="center">
                                    <img
                                      loading="lazy"
                                      src={experience?.companyDto?.logoUrl}
                                      style={{ width: 32, height: 32 }}
                                      alt={(experience?.title || '') + index}
                                    />
                                  </ExperienceLogoImage>
                                ) : (
                                  <ExperienceLogoImage alignItems="center" justifyContent="center">
                                    <img
                                      loading="lazy"
                                      src="src/assets/icons/experienceLogo.svg"
                                      style={{ width: 32, height: 32 }}
                                      alt={'companyLogo' + index}
                                    />
                                  </ExperienceLogoImage>
                                )}
                              </Box>
                              <Stack>
                                <Box>
                                  <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
                                    <FormattedMessage
                                      {...NormalAndNgoProfileViewMessages.experienceTitle}
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
                                        : formatMessage(NormalAndNgoProfileViewMessages.presentWord))}
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
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-start',
                                    pt: 1,
                                    alignItems: 'center',
                                  }}
                                >
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
                                    <ExperienceImage sx={{ mt: 2, borderRadius: 1 }}>
                                      <img
                                        loading="lazy"
                                        src={experience?.mediaUrl}
                                        style={{ width: '100%', height: '100%' }}
                                        alt=""
                                      />
                                    </ExperienceImage>
                                  )}
                                </Box>
                              </Stack>
                              {index < experiences?.length - 1 && <Divider sx={{ mt: 2 }} />}
                            </Box>
                          ))
                        )}
                        {experiences?.length - 3 > 0 && (
                          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
                            <Link to={`experiences/${id}`}>
                              <Button variant="text" size="small">
                                {/* See {experiences?.length - 3} More Experiences */}
                                <FormattedMessage
                                  {...NormalAndNgoProfileViewMessages.seeMoreExperienceMessages}
                                  values={{ count: experiences?.length - 3 }}
                                />
                              </Button>
                            </Link>
                          </Box>
                        )}
                      </>
                    </Stack>
                  )}

                  {/* SKILL */}
                  {!!skills?.length && (
                    <Stack spacing={2} sx={{ backgroundColor: 'background.paper', borderRadius: 1, p: 2 }}>
                      <Typography variant="subtitle1" color="text.primary">
                        <FormattedMessage {...NormalAndNgoProfileViewMessages.skills} />
                      </Typography>
                      <>
                        {skills?.slice(0, 5)?.map((skill) => (
                          <Box key={skill?.skill?.id}>
                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                              <Typography variant="body2" mr={1} color="text.primary" sx={{ display: 'flex' }}>
                                {skill?.skill?.title}
                              </Typography>
                              {!!skill?.endorsementsCount && (
                                <Typography sx={{ color: 'primary.main' }}>{skill?.endorsementsCount}</Typography>
                              )}
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                              <LoadingButton
                                variant="outlined"
                                sx={{
                                  color: 'grey.900',
                                  borderColor: 'grey.300',
                                  py: 0.5,
                                  px: 2.8,
                                  mt: 1,
                                }}
                                onClick={() => handleEndorse(skill?.id as any)}
                                disabled={isLoading}
                                loading={isLoading}
                                startIcon={
                                  skill?.people?.find((person) => person?.id === auth?.user?.id) ? (
                                    <Icon name="Approve-Tick-1" />
                                  ) : (
                                    <Icon name="Plus" />
                                  )
                                }
                              >
                                <Typography>
                                  {skill?.people?.find((person) => person?.id === auth?.user?.id)
                                    ? formatMessage(NormalAndNgoProfileViewMessages.endorsed)
                                    : formatMessage(NormalAndNgoProfileViewMessages.endorse)}
                                </Typography>
                              </LoadingButton>
                              <Box mx={1}>
                                {skill?.people && skill?.people?.length > 5 && <Icon name="Plus" color="grey.700" />}
                                <AvatarGroup spacing="small" max={5} sx={{ flexDirection: 'row', pl: 2 }}>
                                  {skill?.people?.map((person) => (
                                    <Avatar
                                      alt="Remy Sharp"
                                      src={person?.avatarUrl || undefined}
                                      key={skill?.personId}
                                      sx={{ width: 24, height: 24 }}
                                    />
                                  ))}
                                </AvatarGroup>
                              </Box>
                            </Box>
                          </Box>
                        ))}
                        {skills?.length - 5 > 0 && (
                          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
                            <Link to={`skills/${id}`}>
                              <Button variant="text" size="small">
                                {/* See {skills?.length - 5} More Skills and Endorsements */}
                                <FormattedMessage
                                  {...NormalAndNgoProfileViewMessages.seeMoreSkillMessages}
                                  values={{ count: skills?.length - 5 }}
                                />
                              </Button>
                            </Link>
                          </Box>
                        )}
                      </>
                    </Stack>
                  )}

                  {/* CERTIFICATE */}
                  {!!certificates?.length && (
                    <Stack spacing={1} sx={{ backgroundColor: 'background.paper', borderRadius: 1, p: 2 }}>
                      <>
                        <Typography variant="subtitle1" color="text.primary">
                          <FormattedMessage {...NormalAndNgoProfileViewMessages.certificate} />
                        </Typography>

                        {isFetchingCertificate ? (
                          <CircularProgress size={20} />
                        ) : (
                          certificates.slice(0, 3).map((certificate) => (
                            <Box key={certificate?.id}>
                              <Box>
                                <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
                                  {certificate?.certificateName?.title}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography variant="caption" color="text.secondary">
                                  {certificate?.issueDate &&
                                    `${formatMessage(NormalAndNgoProfileViewMessages.issued)} ${getMonthName(
                                      new Date(certificate?.issueDate),
                                    )}
                  ${new Date(certificate?.issueDate).getFullYear()}`}
                                  {certificate?.issueDate && bull}
                                  {certificate?.expirationDate
                                    ? ` ${getMonthName(new Date(certificate?.expirationDate))} ${new Date(
                                        certificate?.expirationDate,
                                      ).getFullYear()} `
                                    : !certificate?.credentialDoesExpire &&
                                      formatMessage(NormalAndNgoProfileViewMessages.noExpirationMessage)}
                                </Typography>
                              </Box>
                              <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
                                <FormattedMessage
                                  {...NormalAndNgoProfileViewMessages.issuingOrganizationMessage}
                                  values={{ title: certificate?.issuingOrganization?.title }}
                                />
                              </Typography>
                              {certificate?.credentialID && (
                                <Box>
                                  <Typography variant="caption" color="text.secondary">
                                    <FormattedMessage
                                      {...NormalAndNgoProfileViewMessages.credentialID}
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
                                          <FormattedMessage {...NormalAndNgoProfileViewMessages.seeCertificate} />
                                        </Typography>
                                      </Button>
                                    </MuiLink>
                                  </Link>
                                </Box>
                              )}
                            </Box>
                          ))
                        )}
                        {certificates?.length - 3 > 0 && (
                          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
                            <Link to={`certificates/${id}`}>
                              <Button variant="text" size="small">
                                {/* See {certificates?.length - 3} More Certificate */}
                                <FormattedMessage
                                  {...NormalAndNgoProfileViewMessages.seeMoreCertificateMessages}
                                  values={{ count: certificates?.length - 3 }}
                                />
                              </Button>
                            </Link>
                          </Box>
                        )}
                      </>
                    </Stack>
                  )}
                </Stack>
              </Grid>
            )}
          </Grid>
        </RootStyle>
      </Container>
    </>
  );
}
