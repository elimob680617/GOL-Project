import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';

import { Box, Button, CircularProgress, Divider, IconButton, Stack, Typography, styled, useTheme } from '@mui/material';

import { useLazyGetProjectsQuery } from 'src/_graphql/profile/mainProfileNOG/queries/getProject.generated';
import { Icon } from 'src/components/Icon';
import MediaCarousel from 'src/components/mediaCarousel';
import useAuth from 'src/hooks/useAuth';
import { PATH_APP } from 'src/routes/paths';
import getMonthName from 'src/utils/getMonthName';

import NgoProjectMessages from './NgoProjectPwa.messages';

const NoResultStyle = styled(Stack)(({ theme }) => ({
  maxWidth: 164,
  maxHeight: 164,
  width: 164,
  height: 164,
  background: theme.palette.grey[100],
  borderRadius: '100%',
}));

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
// ---------------------start project !-------------------------------
function ProjectList() {
  // tools !
  const { initialize } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [isLoadMore, setIsLoadMore] = useState(true);
  const { formatMessage } = useIntl();

  // queries
  const [getProjects, { data, isFetching }] = useLazyGetProjectsQuery();

  useEffect(() => {
    getProjects({
      filter: { all: true },
    });
  }, [getProjects]);

  const projects = data?.getProjects?.listDto?.items;

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

  function handleClose() {
    const fromWizard = localStorage.getItem('fromWizardNgo') === 'true';
    initialize();
    if (fromWizard) {
      localStorage.removeItem('fromWizardNgo');
      navigate(PATH_APP.home.wizard.wizardList);
    } else {
      navigate(PATH_APP.profile.ngo.root);
    }
  }

  return (
    <>
      <Stack sx={{ mb: 2, px: 2, pt: 3 }} direction="row" alignItems="center" justifyContent="space-between">
        <Stack spacing={2} direction="row" alignItems="center">
          <IconButton sx={{ p: 0 }} onClick={handleClose}>
            <Icon name="left-arrow-1" color="text.primary" />
          </IconButton>
          <Typography variant="subtitle1">
            <FormattedMessage {...NgoProjectMessages.project} />
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          {!!projects?.length && (
            <Link to={PATH_APP.profile.ngo.project.new}>
              <Button variant="contained">
                <FormattedMessage {...NgoProjectMessages.add} />
              </Button>
            </Link>
          )}
        </Stack>
      </Stack>
      <Divider />

      {isFetching ? (
        <Stack sx={{ py: 6 }} alignItems="center" justifyContent="center">
          <CircularProgress />
        </Stack>
      ) : !projects?.length ? (
        <Stack sx={{ py: 6 }} alignItems="center" justifyContent="center">
          <NoResultStyle alignItems="center" justifyContent="center">
            <Typography variant="subtitle1" sx={{ color: 'text.secondary', textAlign: 'center' }}>
              <FormattedMessage {...NgoProjectMessages.noResult} />
            </Typography>
          </NoResultStyle>
          <Box sx={{ mt: 3 }} />
          <Link to={PATH_APP.profile.ngo.project.new}>
            <Button variant="text" startIcon={<Icon name="Plus" color="info.main" />}>
              <FormattedMessage {...NgoProjectMessages.addProject} />
            </Button>
          </Link>
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
                  <Link to={PATH_APP.profile.ngo.project.new + `/${project?.id}`}>
                    <Typography sx={{ color: 'text.secondary', cursor: 'pointer' }} variant="subtitle2">
                      <FormattedMessage {...NgoProjectMessages.edit} />
                    </Typography>
                  </Link>
                </Stack>
                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
                  {getMonthName(new Date(project?.startDate)) +
                    ' ' +
                    new Date(project?.startDate).getFullYear() +
                    ' - ' +
                    (project?.endDate
                      ? getMonthName(new Date(project?.endDate)) + ' ' + new Date(project?.endDate).getFullYear()
                      : formatMessage(NgoProjectMessages.present))}{' '}
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
                          <FormattedMessage {...NgoProjectMessages.seeMore} />
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
                {!!project?.projectMedias?.length && (
                  <Box maxHeight={152} maxWidth={271} mx={'auto'} mb={2} py={0} my={5}>
                    <MediaCarousel media={project?.projectMedias} dots height={184} width={328} />
                  </Box>
                )}
              </Stack>
            </ProjectWrapperStyle>
            {index < projects?.length - 1 && <Divider />}
          </Box>
        ))
      )}
    </>
  );
}

export default ProjectList;
