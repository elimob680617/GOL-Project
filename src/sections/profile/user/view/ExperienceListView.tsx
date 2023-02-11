import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, Divider, IconButton, Skeleton, Stack, Typography, styled } from '@mui/material';

import { useLazyGetExperiencesQuery } from 'src/_graphql/profile/experiences/queries/getExperiences.generated';
import { Icon } from 'src/components/Icon';
import getMonthName from 'src/utils/getMonthName';

import NormalAndNgoProfileViewMessages from '../../UserProfileView.messages';

const ExperienceWrapperStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
}));
const ExperienceListBoxStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
}));
const ExperienceImage = styled(Stack)(({ theme }) => ({
  width: 48,
  height: 48,
  backgroundColor: theme.palette.grey[100],
}));
const ExperienceBriefDescriptionStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  marginTop: theme.spacing(1),
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 3,
}));
const ExperienceMoreDescriptionStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  marginTop: theme.spacing(1),
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
}));

function ExperienceListView() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { formatMessage } = useIntl();
  const [isSeeMore, setIsLoadMore] = useState<Record<string, boolean>>({});
  const [getExperiences, { data, isFetching }] = useLazyGetExperiencesQuery();

  useEffect(() => {
    getExperiences({
      filter: {
        dto: { userId },
      },
    });
  }, [userId, getExperiences]);

  const experiences = data?.getExpriences?.listDto?.items;

  const handleSeeMoreClick = (key: string) => {
    setIsLoadMore({ ...isSeeMore, [key]: true });
  };

  const showDifferenceExp = (year: number, month: number) => {
    if (year === 0 && month === 0) return null;
    let finalValue = '';

    if (year > 0) finalValue = `${year} Year${year > 1 ? 's' : ''}  `;
    if (finalValue && month) finalValue += 'and ';
    if (month > 0) finalValue += ` ${month} Month${month > 1 ? 's' : ''}`;
    return <span>&#8226; {finalValue}</span>;
  };

  return (
    <ExperienceListBoxStyle>
      <Stack direction="row" justifyContent="flex-start" mb={3} spacing={2}>
        <IconButton sx={{ padding: 0 }} onClick={() => navigate(-1)}>
          <Icon name="left-arrow" color="grey.500" />
        </IconButton>
        <Typography variant="body1">
          <FormattedMessage {...NormalAndNgoProfileViewMessages.experiences} />
        </Typography>
      </Stack>

      {isFetching ? (
        <Stack sx={{ py: 6 }} alignItems="center" justifyContent="flex-start" spacing={2}>
          {[...Array(3)].map((item, i) => (
            <Stack direction="row" spacing={1} key={i + 1}>
              <Skeleton variant="rectangular" width={48} height={48} />
              <Stack spacing={1}>
                <Skeleton variant="text" width={272} />
                <Skeleton variant="text" width={328} />
                <Skeleton variant="text" width={328} />
                <Skeleton variant="rectangular" width={710} height={100} />
              </Stack>
            </Stack>
          ))}
        </Stack>
      ) : (
        experiences?.map((experience, index: number) => (
          <Box key={experience?.id}>
            <ExperienceWrapperStyle spacing={1} direction="row">
              {experience?.companyDto?.logoUrl ? (
                <ExperienceImage alignItems="center" justifyContent="center">
                  <img
                    loading="lazy"
                    src={experience?.companyDto?.logoUrl}
                    style={{ width: 32, height: 32 }}
                    alt={(experience?.title || '') + index}
                  />
                </ExperienceImage>
              ) : (
                <ExperienceImage alignItems="center" justifyContent="center">
                  <img
                    loading="lazy"
                    src="src/assets/companylogo/Vector.png"
                    style={{ width: 32, height: 32 }}
                    alt={'companyLogo' + index}
                  />
                </ExperienceImage>
              )}
              <Stack sx={{ flex: 1 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle2" sx={{ color: 'primary.dark' }}>
                    <FormattedMessage
                      {...NormalAndNgoProfileViewMessages.experienceTitle}
                      values={{ title: experience?.title, name: experience?.companyDto?.title }}
                    />
                  </Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
                  {getMonthName(new Date(experience?.startDate)) +
                    ' ' +
                    new Date(experience?.startDate).getFullYear() +
                    ' - ' +
                    (experience?.endDate
                      ? getMonthName(new Date(experience?.endDate)) + ' ' + new Date(experience?.endDate).getFullYear()
                      : formatMessage(NormalAndNgoProfileViewMessages.presentWord))}{' '}
                  {showDifferenceExp(experience?.dateDiff?.years as number, experience?.dateDiff?.months as number)}
                </Typography>
                {experience?.cityDto && (
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
                    {experience?.cityDto?.name}
                  </Typography>
                )}
                {experience?.description && (
                  <>
                    {!isSeeMore[experience?.id] &&
                    (experience?.description?.length > 210 || experience?.description.split('\n')?.length > 3) ? (
                      <>
                        <ExperienceBriefDescriptionStyle variant="body2">
                          {experience?.description.split('\n').map((str, i: number) => (
                            <p key={i}>{str}</p>
                          ))}
                        </ExperienceBriefDescriptionStyle>
                        <Typography
                          variant="body2"
                          color="info.main"
                          sx={{ cursor: 'pointer' }}
                          onClick={() => handleSeeMoreClick(experience?.id)}
                        >
                          <FormattedMessage {...NormalAndNgoProfileViewMessages.seeMoreButton} />
                        </Typography>
                      </>
                    ) : (
                      <ExperienceMoreDescriptionStyle>
                        {experience?.description.split('\n').map((str, i) => (
                          <p key={i}>{str}</p>
                        ))}
                      </ExperienceMoreDescriptionStyle>
                    )}
                  </>
                )}
                {experience?.mediaUrl && (
                  <Box maxHeight={152} maxWidth={271} mx={'auto'} mb={2} py={1}>
                    <img src={experience?.mediaUrl} width={271} height={152} alt="" />
                  </Box>
                )}
              </Stack>
            </ExperienceWrapperStyle>
            {index < experiences?.length - 1 && <Divider />}
          </Box>
        ))
      )}
    </ExperienceListBoxStyle>
  );
}

export default ExperienceListView;
