import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Box, CircularProgress, Divider, IconButton, Stack, Typography, styled, useTheme } from '@mui/material';

// import { useGetMediasQuery } from 'src/_graphql/profile/mainProfileNOG/queries/getMedias.generated';
import { useLazyGetProjectsQuery } from 'src/_graphql/profile/mainProfileNOG/queries/getProject.generated';
import { Icon } from 'src/components/Icon';
import MediaCarousel from 'src/components/mediaCarousel';
import getMonthName from 'src/utils/getMonthName';

import ProfileViewPwaMessages from '../../UserProfileViewPwa.messages';

// const bull = (
//   <Box component="span" sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}>
//     •
//   </Box>
// );

// const NoResultStyle = styled(Stack)(({ theme }) => ({
//   maxWidth: 164,
//   maxHeight: 164,
//   width: 164,
//   height: 164,
//   background: theme.palette.grey[100],
//   borderRadius: '100%',
// }));

// const ProjectImage = styled(Stack)(({ theme }) => ({
//   width: 48,
//   height: 48,
//   backgroundColor: theme.palette.grey[100],
// }));

const ProjectWrapperStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
}));
const ProjectBriefDescriptionStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  marginTop: theme.spacing(1),
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 3,
}));
const ProjectMoreDescriptionStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  marginTop: theme.spacing(1),
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
}));

function MoreProjects() {
  const router = useNavigate();
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const [isLoadMore, setIsLoadMore] = useState(true);

  const [getProjects, { data, isFetching }] = useLazyGetProjectsQuery();
  // const { data: mediaData } = useGetMediasQuery({
  //   filter: {
  //     all: true,
  //   },
  // });

  useEffect(() => {
    getProjects({
      filter: { all: true },
    });
  }, [getProjects]);

  const projects = data?.getProjects?.listDto?.items;
  // const medias = mediaData?.getMedias?.listDto?.items;

  const showDifferenceExp = (year: number, month: number) => {
    if (year === 0 && month === 0) return null;
    let finalValue = '';

    if (year > 0) finalValue = `${year} Year${year > 1 ? 's' : ''}  `;
    if (month > 0) finalValue += `${month} Month${month > 1 ? 's' : ''}`;
    return <span>&#8226; {finalValue}</span>;
  };

  const handleSeeMoreClick = () => {
    setIsLoadMore(!isLoadMore);
  };

  return (
    <>
      <Stack sx={{ mb: 2, px: 2, pt: 3 }} direction="row" alignItems="center" justifyContent="space-between">
        <Stack spacing={2} direction="row" alignItems="center">
          <IconButton sx={{ p: 0 }} onClick={() => router(-1)}>
            <Icon name="left-arrow" color="text.primary" />
          </IconButton>
          <Typography variant="subtitle1">
            <FormattedMessage {...ProfileViewPwaMessages.ngoprojectTitle} />
          </Typography>
        </Stack>
      </Stack>
      <Divider />

      {isFetching ? (
        <Stack sx={{ py: 6 }} alignItems="center" justifyContent="center">
          <CircularProgress />
        </Stack>
      ) : (
        projects?.map((project, index) => (
          <Box key={project?.id}>
            <ProjectWrapperStyle spacing={1} direction="row">
              <Stack sx={{ flex: 1 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle2" sx={{ color: 'primary.dark' }}>
                    {project?.title}
                  </Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
                  {getMonthName(new Date(project?.startDate)) +
                    ' ' +
                    new Date(project?.startDate).getFullYear() +
                    ' - ' +
                    (project?.endDate
                      ? getMonthName(new Date(project?.endDate)) + ' ' + new Date(project?.endDate).getFullYear()
                      : formatMessage(ProfileViewPwaMessages.presentWord))}{' '}
                  {showDifferenceExp(project?.dateDiff?.years as number, project?.dateDiff?.months as number)}
                </Typography>
                {project?.cityDto && (
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
                    {project?.cityDto?.name}
                  </Typography>
                )}
                {project?.description && (
                  <>
                    {isLoadMore &&
                    (project?.description.length > 210 || project?.description.split('\n').length > 3) ? (
                      <>
                        <ProjectBriefDescriptionStyle variant="body2">
                          {project?.description.split('\n').map((str, i) => (
                            <p key={i}>{str}</p>
                          ))}
                        </ProjectBriefDescriptionStyle>
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
                      <ProjectMoreDescriptionStyle>
                        {project?.description.split('\n').map((str, i) => (
                          <p key={i}>{str}</p>
                        ))}
                      </ProjectMoreDescriptionStyle>
                    )}
                  </>
                )}
                {
                  (project?.projectMedias?.length as number) > 0 && (
                    // project.projectMedias.map((item) => (
                    <Box maxHeight={152} maxWidth={271} mx={'auto'} mb={2} py={0} my={5}>
                      <MediaCarousel media={project?.projectMedias} dots height={184} width={328} />
                    </Box>
                  )
                  // ))
                }
              </Stack>
            </ProjectWrapperStyle>
            {index < projects?.length - 1 && <Divider />}
          </Box>
        ))
      )}
    </>
  );
}

export default MoreProjects;
