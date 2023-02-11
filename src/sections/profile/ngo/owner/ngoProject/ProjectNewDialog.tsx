import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, Divider, IconButton, Stack, Typography, styled } from '@mui/material';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { useAddProjectMutation } from 'src/_graphql/profile/mainProfileNOG/mutations/addProject.generated';
import { useUpdateProjectMutation } from 'src/_graphql/profile/mainProfileNOG/mutations/updateProject.generated';
import { useUpdateProjectMediaMutation } from 'src/_graphql/profile/mainProfileNOG/mutations/updateProjectMedia.generated';
import { Icon } from 'src/components/Icon';
import { Audience } from 'src/components/audience';
import { FormProvider, RHFCheckbox, RHFTextField } from 'src/components/hook-form';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { emptyProject, ngoProjectSelector, projectAdded } from 'src/store/slices/profile/ngoProject-slice';
import { AudienceEnum, FeatureAudienceEnum, Project } from 'src/types/serverTypes';
import getMonthName from 'src/utils/getMonthName';

import NgoProjectMessages from './NgoProject.messages';

const IconButtonStyle = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: '21%',
  transform: 'translate(0, -50%)',
  zIndex: 1,
  backgroundColor: theme.palette.grey[100],
  borderRadius: 8,
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
  },
}));

function ProjectNewDialog() {
  const [openAudience, setOpenAudience] = useState<boolean>(false);
  const { formatMessage } = useIntl();
  const router = useNavigate();
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();
  const projectData = useSelector(ngoProjectSelector);
  const [addProjectMutate, { isLoading: addLoading }] = useAddProjectMutation();
  const [updateProjectMutate, { isLoading: updateLoading }] = useUpdateProjectMutation();
  const [updateProjectMedia] = useUpdateProjectMediaMutation();

  useEffect(() => {
    if (!projectData) router(PATH_APP.profile.ngo.project.list);
  }, [projectData, router]);

  const ProjectFormSchema = Yup.object().shape({
    title: Yup.string().required(''),
    startDate: Yup.string().required(''),
    stillWorkingThere: Yup.boolean(),
    endDate: Yup.string()
      .nullable()
      .when('stillWorkingThere', {
        is: false,
        then: Yup.string().required('Required'),
      })
      .required(),
  });

  const methods = useForm<Project & { titleView?: boolean; descView?: boolean }>({
    resolver: yupResolver(ProjectFormSchema),
    defaultValues: { ...projectData, titleView: true, descView: true },
    mode: 'onChange',
  });
  const {
    handleSubmit,
    watch,
    trigger,
    getValues,
    setValue,
    formState: { isValid, isDirty },
  } = methods;

  useEffect(() => {
    trigger(['title', 'startDate', 'endDate', 'stillWorkingThere']);
  }, [trigger]);

  const onSubmit = async (data: Project) => {
    const startDate = new Date(data.startDate);
    let endDate;
    if (data.stillWorkingThere) endDate = undefined;
    else if (data.endDate) {
      const date = new Date(data.endDate);
      endDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-01';
    }

    if (data.id) {
      const res: any = await updateProjectMutate({
        filter: {
          dto: {
            id: data?.id,
            audience: data?.audience,
            cityId: data?.cityDto?.id,
            description: data?.description,
            endDate: data?.endDate,
            startDate: startDate.getFullYear() + '-' + ('0' + (startDate.getMonth() + 1)).slice(-2) + '-01',
            stillWorkingThere: data?.stillWorkingThere,
            title: data?.title,
          },
        },
      });
      if (res?.data?.updateProject?.isSuccess) {
        if (!!data?.projectMedias?.length)
          await updateProjectMedia({
            filter: {
              dto: {
                projectId: data.id,
                urls: data?.projectMedias?.map((item) => item?.url) as string[],
              },
            },
          });
        enqueueSnackbar(formatMessage(NgoProjectMessages.updateSuccessfully), { variant: 'success' });
        dispatch(emptyProject());
        router(PATH_APP.profile.ngo.project.list);
      }
    } else {
      const res: any = await addProjectMutate({
        filter: {
          dto: {
            audience: data.audience,
            description: data.description,
            stillWorkingThere: data.stillWorkingThere,
            title: data.title,
            cityId: data.cityDto?.id,
            startDate: startDate.getFullYear() + '-' + ('0' + (startDate.getMonth() + 1)).slice(-2) + '-01',
            endDate: endDate,
            id: data.id,
          },
        },
      });

      if (res?.data?.addProject?.isSuccess) {
        const newId = res?.data?.addProject?.listDto?.items?.[0];
        if (!!data?.projectMedias?.length)
          await updateProjectMedia({
            filter: {
              dto: {
                projectId: newId?.id,
                urls: data?.projectMedias?.map((item) => item?.url) as string[],
              },
            },
          });
        enqueueSnackbar(formatMessage(NgoProjectMessages.projectSuccessfully), { variant: 'success' });
        dispatch(emptyProject());
        router(PATH_APP.profile.ngo.project.list);
      }
    }
  };

  const handleNavigation = (url: string) => {
    dispatch(projectAdded({ ...getValues(), isChange: isDirty || projectData?.isChange }));
    router(url);
  };

  const handleClose = () => {
    if (isDirty || projectData?.isChange) {
      dispatch(
        projectAdded({
          ...getValues(),
          isChange: isDirty || projectData?.isChange,
          isValid: isValid || projectData?.isValid,
        }),
      );
      router(PATH_APP.profile.ngo.project.discard);
    } else {
      dispatch(emptyProject());
      router(-1);
    }
  };

  const handleRemovePhoto = (url: string) => {
    setValue(
      'projectMedias',
      watch('projectMedias')?.filter((item) => item?.url !== url),
      { shouldDirty: true },
    );

    // const handleBack = () => {
    //   dispatch(emptyExperience());
    //   router.back();
    // };
  };
  return (
    <>
      <Dialog open={true && !openAudience} fullWidth={true} onClose={handleClose}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} sx={{ py: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <IconButton sx={{ p: 0 }} onClick={handleClose}>
                  <Icon name="left-arrow-1" />
                </IconButton>
                <Typography variant="subtitle2" color="text.primary">
                  {projectData?.id
                    ? formatMessage(NgoProjectMessages.editProject)
                    : formatMessage(NgoProjectMessages.addProject)}
                </Typography>
              </Stack>
              <IconButton onClick={handleClose}>
                <Icon name="Close-1" />
              </IconButton>
            </Stack>
            <Divider sx={{ height: 2 }} />

            <Stack spacing={2} sx={{ px: 2 }}>
              <Typography variant="subtitle1" color="text.primary">
                <FormattedMessage {...NgoProjectMessages.titleStar} />
              </Typography>
              {watch('titleView') ? (
                <Typography
                  variant="body2"
                  color={watch('title') ? 'text.primary' : 'text.secondary'}
                  onClick={() => setValue('titleView', false)}
                >
                  {watch('title') || formatMessage(NgoProjectMessages.exSchool)}
                </Typography>
              ) : (
                <Box>
                  <RHFTextField
                    placeholder={formatMessage(NgoProjectMessages.exSchool)}
                    name="title"
                    size="small"
                    error={false}
                    inputProps={{ maxLength: 60 }}
                    onBlur={() => setValue('titleView', true)}
                    // eslint-disable-next-line jsx-a11y/no-autofocus
                    autoFocus
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    component="div"
                    sx={{ width: '100%', textAlign: 'right' }}
                  >
                    {watch('title')?.length || 0}/60
                  </Typography>
                </Box>
              )}
            </Stack>
            <Divider />
            <Stack spacing={2} sx={{ px: 2 }}>
              <Typography variant="subtitle1" color="text.primary">
                <FormattedMessage {...NgoProjectMessages.location} />
              </Typography>
              {watch('cityDto') ? (
                <Typography variant="body2" color="text.primary">
                  {watch('cityDto.name')}
                  <IconButton
                    onClick={() => {
                      setValue('cityDto', undefined, { shouldDirty: true });
                      dispatch(projectAdded({ ...getValues(), cityDto: undefined }));
                    }}
                    sx={{ ml: 1 }}
                  >
                    &#215;
                  </IconButton>
                </Typography>
              ) : (
                <Box sx={{ cursor: 'pointer' }} onClick={() => handleNavigation(PATH_APP.profile.ngo.project.location)}>
                  <Typography variant="body2" color="text.secondary">
                    <FormattedMessage {...NgoProjectMessages.exLocation} />
                  </Typography>
                </Box>
              )}
            </Stack>
            <Divider />
            <Stack spacing={2} sx={{ px: 2 }}>
              <Typography variant="body2" color="text.primary">
                <RHFCheckbox
                  name="stillWorkingThere"
                  label={formatMessage(NgoProjectMessages.IAmCurrentlyWorkOnThisProject)}
                  sx={{
                    height: 0,
                  }}
                />
              </Typography>
            </Stack>
            <Divider />
            <Stack spacing={2} sx={{ px: 2 }}>
              <Typography variant="subtitle1" color="text.primary">
                <FormattedMessage {...NgoProjectMessages.startDateStar} />
              </Typography>
              {watch('startDate') ? (
                <Typography variant="body2" color="text.primary">
                  {getMonthName(new Date(watch('startDate')))}, {new Date(watch('startDate')).getFullYear()}
                  <IconButton
                    onClick={() => {
                      setValue('startDate', undefined, { shouldValidate: true, shouldDirty: true });
                      dispatch(projectAdded({ ...getValues() }));
                    }}
                    sx={{ ml: 1 }}
                  >
                    &#215;
                  </IconButton>
                </Typography>
              ) : (
                <Box
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleNavigation(PATH_APP.profile.ngo.project.startDate)}
                >
                  <Typography variant="body2" color="text.secondary">
                    <FormattedMessage {...NgoProjectMessages.startDate} />
                  </Typography>
                </Box>
              )}
            </Stack>
            <Divider />
            <Stack spacing={2} sx={{ px: 2 }}>
              <Typography variant="subtitle1" color="text.primary">
                <FormattedMessage {...NgoProjectMessages.endDate} />
                {!watch('stillWorkingThere') && '*'}
              </Typography>
              {watch('endDate') && !watch('stillWorkingThere') ? (
                <Typography variant="body2" color="text.primary">
                  {getMonthName(new Date(watch('endDate')))}, {new Date(watch('endDate')).getFullYear()}
                  <IconButton
                    onClick={() => {
                      setValue('endDate', undefined, { shouldValidate: true, shouldDirty: true });
                      dispatch(projectAdded({ ...getValues() }));
                    }}
                    sx={{ ml: 1 }}
                  >
                    &#215;
                  </IconButton>
                </Typography>
              ) : (
                <Box
                  sx={{ cursor: !watch('stillWorkingThere') ? 'pointer' : 'default' }}
                  onClick={() =>
                    watch('stillWorkingThere') ? undefined : handleNavigation(PATH_APP.profile.ngo.project.endDate)
                  }
                >
                  <Typography variant="body2" color="text.secondary">
                    {watch('stillWorkingThere') ? 'Present' : 'End Date'}
                  </Typography>
                </Box>
              )}
            </Stack>
            <Divider />
            <Stack spacing={2} sx={{ px: 2 }}>
              <Typography variant="subtitle1" color="text.primary">
                <FormattedMessage {...NgoProjectMessages.description} />
              </Typography>
              {watch('descView') ? (
                <Typography
                  variant="body2"
                  color={watch('description') ? 'text.primary' : 'text.secondary'}
                  onClick={() => setValue('descView', false)}
                >
                  {watch('description') || formatMessage(NgoProjectMessages.AddDetailAndDescriptionAboutYourProject)}
                </Typography>
              ) : (
                <Box>
                  <RHFTextField
                    size="small"
                    multiline
                    name="description"
                    placeholder={formatMessage(NgoProjectMessages.AddDetailAndDescriptionAboutYourProject)}
                    inputProps={{ maxLength: 500 }}
                    onBlur={() => setValue('descView', true)}
                    // eslint-disable-next-line jsx-a11y/no-autofocus
                    autoFocus
                    maxRows={4}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    component="div"
                    sx={{ width: '100%', textAlign: 'right' }}
                  >
                    {watch('description')?.length || 0}/500
                  </Typography>
                </Box>
              )}
            </Stack>
            <Divider />
            <Stack spacing={2} sx={{ px: 2 }}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1" color="text.primary">
                  <FormattedMessage {...NgoProjectMessages.media} />
                </Typography>
                {!!watch('projectMedias')?.length && watch('projectMedias')!.length < 5 && (
                  <Typography
                    variant="overline"
                    color="primary.main"
                    sx={{ cursor: 'pointer', textTransform: 'none' }}
                    component="div"
                    onClick={() => handleNavigation(PATH_APP.profile.ngo.project.photo)}
                  >
                    + Add New Media
                  </Typography>
                )}
              </Box>

              <Stack>
                {!watch('projectMedias')?.length ? (
                  <Stack direction="row" justifyContent={'space-between'}>
                    <Typography variant="body2" color="text.primary">
                      <FormattedMessage {...NgoProjectMessages.newMedia} />
                    </Typography>

                    <Typography
                      variant="overline"
                      color="primary.main"
                      sx={{ cursor: 'pointer', textTransform: 'none' }}
                      component="div"
                      onClick={() => handleNavigation(PATH_APP.profile.ngo.project.photo)}
                    >
                      <FormattedMessage {...NgoProjectMessages.addMedia} />
                    </Typography>
                  </Stack>
                ) : (
                  watch('projectMedias')?.map((item) => (
                    <Box display="flex" justifyContent="center" position="relative" key={item?.url}>
                      <IconButtonStyle
                        onClick={() => handleRemovePhoto(item?.url as string)}
                        sx={{ opacity: '64%', p: 0.5 }}
                      >
                        <Icon name="Close" size={28} color="surface.onSurface" />
                      </IconButtonStyle>
                      <Box mb={3}>
                        <img
                          // onClick={() => handleNavigation(PATH_APP.profile.ngo.projectPhoto)}
                          src={item?.url as string}
                          width={328}
                          height={184}
                          alt="projectPhoto"
                        />
                      </Box>
                    </Box>
                  ))
                )}
              </Stack>
            </Stack>

            <Divider />
            <Stack sx={{ px: 2 }} direction="row" justifyContent="space-between">
              <Stack direction="row" spacing={0.5}>
                {projectData?.id && (
                  <Link to={PATH_APP.profile.ngo.project.delete}>
                    <Button color="error" variant="text" sx={{ width: 105 }}>
                      <FormattedMessage {...NgoProjectMessages.delete} />
                    </Button>
                  </Link>
                )}
                <Button
                  variant="outlined"
                  onClick={() => {
                    // dispatch(projectAdded(getValues()));
                    setOpenAudience(true);
                  }}
                  startIcon={<Icon name="Earth" />}
                  endIcon={<Icon name="down-arrow" />}
                >
                  <Typography color="text.primary">
                    {
                      Object.keys(AudienceEnum)[
                        Object.values(AudienceEnum).indexOf(projectData?.audience as AudienceEnum)
                      ]
                    }
                  </Typography>
                </Button>
              </Stack>
              <LoadingButton
                loading={addLoading || updateLoading}
                type="submit"
                variant="contained"
                disabled={!isValid || !(isDirty || projectData?.isChange)}
                color="primary"
              >
                {projectData?.id ? formatMessage(NgoProjectMessages.save) : formatMessage(NgoProjectMessages.add)}
              </LoadingButton>
            </Stack>
          </Stack>
        </FormProvider>
      </Dialog>
      {openAudience && (
        <Audience
          feature={FeatureAudienceEnum.Project}
          value={projectData?.audience as AudienceEnum}
          onClose={setOpenAudience}
          open={openAudience}
          onChange={(val: any) => {
            dispatch(
              projectAdded({
                ...projectData,
                audience: val,
                isChange: true,
              }),
            );
          }}
        />
      )}
    </>
  );
}

export default ProjectNewDialog;
