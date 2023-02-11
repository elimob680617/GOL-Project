//mui
import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Dialog, Divider, IconButton, Stack, Typography, styled } from '@mui/material';

import { useLazyGetProjectsQuery } from 'src/_graphql/profile/mainProfileNOG/queries/getProject.generated';
import { Icon } from 'src/components/Icon';
import Loading from 'src/components/Loading';
import MediaCarousel from 'src/components/mediaCarousel';
import useAuth from 'src/hooks/useAuth';
import { PATH_APP } from 'src/routes/paths';
import { projectAdded } from 'src/store/slices/profile/ngoProject-slice';
import { AudienceEnum, Project } from 'src/types/serverTypes';
import getMonthName from 'src/utils/getMonthName';

import NgoProjectMessages from './NgoProject.messages';

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

function ProjectListDialog() {
  const { formatMessage } = useIntl();
  const router = useNavigate();
  const { initialize } = useAuth();
  const dispatch = useDispatch();
  const [isSeeMore, setIsLoadMore] = useState<Record<string, boolean>>({});
  const [getProject, { data, isFetching }] = useLazyGetProjectsQuery();

  useEffect(() => {
    getProject({
      filter: {
        all: true,
      },
    });
  }, [getProject]);

  const projects = data?.getProjects?.listDto?.items;
  const handleRouting = (exp: Project) => {
    dispatch(projectAdded(exp));
    setTimeout(() => router(PATH_APP.profile.ngo.project.new), 1);
  };

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

  function handleClose() {
    const fromWizard = localStorage.getItem('fromWizard') === 'true';
    const fromHomePage = localStorage.getItem('fromHomePage') === 'true';
    if (fromWizard) {
      initialize();
      localStorage.removeItem('fromWizard');
      if (fromHomePage) {
        router(PATH_APP.home.wizard.wizardList);
      } else {
        router(PATH_APP.profile.ngo.wizard.wizardList);
      }
    } else {
      router(PATH_APP.profile.ngo.root);
    }
  }

  return (
    <Dialog fullWidth maxWidth="sm" open onClose={handleClose}>
      <Stack sx={{ mb: 2, px: 2, pt: 3 }} direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle1">
          <FormattedMessage {...NgoProjectMessages.project} />
        </Typography>
        <Stack direction="row" spacing={2}>
          {/* FIXME add primary variant to button variants */}
          {!!projects?.length && (
            <Button onClick={() => handleRouting({ audience: AudienceEnum.Public })} variant="contained">
              <FormattedMessage {...NgoProjectMessages.add} />
            </Button>
          )}
          <IconButton sx={{ padding: 0 }} onClick={handleClose}>
            <Icon name="Close-1" />
          </IconButton>
        </Stack>
      </Stack>
      <Divider />

      {isFetching ? (
        <Stack sx={{ py: 6 }} alignItems="center" justifyContent="center">
          <Loading />
        </Stack>
      ) : !projects?.length ? (
        <Stack sx={{ py: 6 }} alignItems="center" justifyContent="center">
          <NoResultStyle alignItems="center" justifyContent="center">
            <Typography variant="subtitle1" sx={{ color: (theme) => 'text.secondary', textAlign: 'center' }}>
              <FormattedMessage {...NgoProjectMessages.noResult} />
            </Typography>
          </NoResultStyle>
          <Box sx={{ mt: 3 }} />
          {/* <Link href={'/profile/experience-new'} passHref> */}
          <Button
            onClick={() => handleRouting({ audience: AudienceEnum.Public })}
            variant="text"
            startIcon={<Icon name="Plus" color="info.main" />}
          >
            {/* FIXME add varient button sm to typography */}
            <Typography color="info.main">
              <FormattedMessage {...NgoProjectMessages.addProject} />
            </Typography>
          </Button>
          {/* </Link> */}
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
                  <Typography
                    sx={{ color: 'text.secondary', cursor: 'pointer' }}
                    variant="subtitle2"
                    onClick={() => handleRouting(project as Project)}
                  >
                    <FormattedMessage {...NgoProjectMessages.edit} />
                  </Typography>
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
                    {!isSeeMore[project?.id] &&
                    (project?.description.length > 210 || project?.description.split('\n').length > 3) ? (
                      <>
                        <ProjectBriefDescriptionStyle variant="body2">
                          {project?.description.split('\n').map((str, i) => (
                            <p key={i}>{str}</p>
                          ))}
                        </ProjectBriefDescriptionStyle>
                        <Typography
                          variant="body2"
                          color="info.main"
                          sx={{ cursor: 'pointer' }}
                          onClick={() => handleSeeMoreClick(project?.id)}
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
                  <Box maxHeight={184} maxWidth={328} mx={'auto'} mb={2} py={1}>
                    <MediaCarousel media={project?.projectMedias} dots arrows height={184} width={328} />
                  </Box>
                )}
              </Stack>
            </ProjectWrapperStyle>
            {index < projects?.length - 1 && <Divider />}
          </Box>
        ))
      )}
    </Dialog>
  );
}

export default ProjectListDialog;
