import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Box, Button, CircularProgress, Dialog, Divider, IconButton, Stack, Typography, styled } from '@mui/material';

import { useLazyGetExperiencesQuery } from 'src/_graphql/profile/experiences/queries/getExperiences.generated';
import companyLogo from 'src/assets/companylogo/Vector.png';
import { Icon } from 'src/components/Icon';
import useAuth from 'src/hooks/useAuth';
import GeneralMessagess from 'src/language/general.messages';
import { PATH_APP } from 'src/routes/paths';
import { experienceAdded } from 'src/store/slices/profile/userExperiences-slice';
import { AudienceEnum, Experience } from 'src/types/serverTypes';
import getMonthName from 'src/utils/getMonthName';

import ExprienceMessages from './Exprience.messages';

const NoResultStyle = styled(Stack)(({ theme }) => ({
  maxWidth: 164,
  maxHeight: 164,
  width: 164,
  height: 164,
  background: theme.palette.grey[100],
  borderRadius: '100%',
}));

const ExperienceWrapperStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
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

function ExperienceListDialog() {
  const router = useNavigate();
  const { initialize } = useAuth();
  const [isSeeMore, setIsLoadMore] = useState<Record<string, boolean>>({});
  const dispatch = useDispatch();
  const [getExperiences, { data, isFetching }] = useLazyGetExperiencesQuery();

  useEffect(() => {
    getExperiences({
      filter: {
        all: true,
      },
    });
  }, [getExperiences]);

  const experiences = data?.getExpriences?.listDto?.items;
  const handleRouting = (exp: Experience) => {
    dispatch(experienceAdded(exp));
    setTimeout(() => router(PATH_APP.profile.user.experience.add), 1);
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
        router(PATH_APP.profile.user.wizard.wizardList);
      }
    } else {
      router(PATH_APP.profile.user.root);
    }
  }

  return (
    <Dialog fullWidth maxWidth="sm" open onClose={handleClose}>
      <Stack sx={{ mb: 2, px: 2, pt: 3 }} direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle1">
          <FormattedMessage {...ExprienceMessages.experience} />
        </Typography>
        <Stack direction="row" spacing={2}>
          {/* FIXME add primary variant to button variants */}
          {!!experiences?.length && (
            <Button onClick={() => handleRouting({ audience: AudienceEnum.Public })} variant="contained">
              <FormattedMessage {...GeneralMessagess.add} />
            </Button>
          )}
          <IconButton sx={{ padding: 0 }} onClick={handleClose}>
            <Icon name="Close-1" color="text.primary" />
          </IconButton>
        </Stack>
      </Stack>
      <Divider />

      {isFetching ? (
        <Stack sx={{ py: 6 }} alignItems="center" justifyContent="center">
          <CircularProgress />
        </Stack>
      ) : !experiences?.length ? (
        <Stack sx={{ py: 6 }} alignItems="center" justifyContent="center">
          <NoResultStyle alignItems="center" justifyContent="center">
            <Typography variant="subtitle1" sx={{ color: (theme) => 'text.secondary', textAlign: 'center' }}>
              <FormattedMessage {...GeneralMessagess.noResult} />
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
              <FormattedMessage {...ExprienceMessages.addExperience} />
            </Typography>
          </Button>
          {/* </Link> */}
        </Stack>
      ) : (
        experiences?.map((experience, index) => (
          <Box key={experience?.id}>
            <ExperienceWrapperStyle spacing={1} direction="row">
              {experience?.companyDto?.logoUrl ? (
                <ExperienceImage alignItems="center" justifyContent="center">
                  <img
                    src={experience?.companyDto?.logoUrl}
                    width={32}
                    height={32}
                    alt={(experience?.title || '') + index}
                    loading="lazy"
                  />
                </ExperienceImage>
              ) : (
                <ExperienceImage alignItems="center" justifyContent="center">
                  <img
                    src={companyLogo}
                    width={32}
                    height={32}
                    alt={(experience?.title || '') + index}
                    loading="lazy"
                  />
                </ExperienceImage>
              )}
              <Stack sx={{ flex: 1 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle2" sx={{ color: 'primary.dark' }}>
                    {experience?.title} at {experience?.companyDto?.title}
                  </Typography>
                  <Typography
                    sx={{ color: 'text.secondary', cursor: 'pointer' }}
                    variant="subtitle2"
                    onClick={() => handleRouting(experience as Experience)}
                  >
                    <FormattedMessage {...ExprienceMessages.edit} />
                  </Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
                  {getMonthName(new Date(experience?.startDate)) +
                    ' ' +
                    new Date(experience?.startDate).getFullYear() +
                    ' - ' +
                    (experience?.endDate
                      ? getMonthName(new Date(experience?.endDate)) + ' ' + new Date(experience?.endDate).getFullYear()
                      : 'Present')}{' '}
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
                    (experience?.description.length > 210 || experience?.description.split('\n').length > 3) ? (
                      <>
                        <ExperienceBriefDescriptionStyle variant="body2">
                          {experience?.description.split('\n').map((str, i) => (
                            <p key={i}>{str}</p>
                          ))}
                        </ExperienceBriefDescriptionStyle>
                        <Typography
                          variant="body2"
                          color="info.main"
                          sx={{ cursor: 'pointer' }}
                          onClick={() => handleSeeMoreClick(experience?.id)}
                        >
                          <FormattedMessage {...ExprienceMessages.seeMore} />
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
    </Dialog>
  );
}

export default ExperienceListDialog;
