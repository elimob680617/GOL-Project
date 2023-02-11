import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, Divider, IconButton, Stack, Typography, styled } from '@mui/material';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { useAddExperienceMutation } from 'src/_graphql/profile/experiences/mutations/addExperience.generated';
import { useUpdateExperienceMutation } from 'src/_graphql/profile/experiences/mutations/updateExperience.generated';
import { Icon } from 'src/components/Icon';
import { Audience } from 'src/components/audience';
import { FormProvider, RHFCheckbox, RHFTextField } from 'src/components/hook-form';
import GeneralMessagess from 'src/language/general.messages';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import {
  emptyExperience,
  experienceAdded,
  userExperienceSelector,
} from 'src/store/slices/profile/userExperiences-slice';
import { AudienceEnum, EmploymentTypeEnum, Experience, FeatureAudienceEnum } from 'src/types/serverTypes';
import getMonthName from 'src/utils/getMonthName';

import ExprienceMessages from './Exprience.messages';

const IconButtonStyle = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '46%',
  transform: 'translate(0, -50%)',
  zIndex: 1,
  backgroundColor: theme.palette.grey[100],
  borderRadius: 8,
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
  },
}));

function ExperienceNewDialog() {
  const router = useNavigate();
  const { formatMessage } = useIntl();
  const [openAudience, setOpenAudience] = useState<boolean>(false);
  const experienceData = useSelector(userExperienceSelector);
  const { enqueueSnackbar } = useSnackbar();
  const [addExperienceMutate, { isLoading: addLoading }] = useAddExperienceMutation();
  const [updateExperienceMutate, { isLoading: updateLoading }] = useUpdateExperienceMutation();

  useEffect(() => {
    if (!experienceData) router(PATH_APP.profile.user.experience.root);
  }, [experienceData, router]);

  const ExperienceFormSchema = Yup.object().shape({
    title: Yup.string().required(''),
    companyDto: Yup.object().shape({
      title: Yup.string().required(''),
    }),
    employmentType: Yup.string().required(''),
    startDate: Yup.string().required(''),
    stillWorkingThere: Yup.boolean(),
    endDate: Yup.string()
      .nullable()
      .when('stillWorkingThere', {
        is: false,
        then: Yup.string().required('Required'),
      }),
  });
  const dispatch = useDispatch();

  const methods = useForm<Experience & { titleView?: boolean; descView?: boolean }>({
    resolver: yupResolver(ExperienceFormSchema),
    defaultValues: { ...experienceData, titleView: true, descView: true },
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
    trigger(['companyDto.title', 'title', 'employmentType', 'startDate', 'endDate', 'stillWorkingThere']);
  }, [trigger]);

  const onSubmit = async (data: Experience) => {
    const startDate = new Date(data.startDate);
    let endDate;
    if (data.stillWorkingThere) endDate = undefined;
    else if (data.endDate) {
      const date = new Date(data.endDate);
      endDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-01';
    }

    if (data.id) {
      const res: any = await updateExperienceMutate({
        filter: {
          dto: {
            id: data.id,
            audience: experienceData?.audience || data.audience,
            employmentType: data.employmentType,
            description: data.description,
            mediaUrl: data.mediaUrl,
            stillWorkingThere: data.stillWorkingThere,
            title: data.title,
            cityId: data.cityDto?.id,
            companyId: data.companyDto?.id,
            startDate: startDate.getFullYear() + '-' + ('0' + (startDate.getMonth() + 1)).slice(-2) + '-01',
            endDate: endDate,
          },
        },
      });
      if (res?.data?.updateExperience?.isSuccess) {
        enqueueSnackbar(formatMessage(ExprienceMessages.updateSuccessfull), { variant: 'success' });
        router(PATH_APP.profile.user.experience.root);
        dispatch(emptyExperience());
      }
    } else {
      const res: any = await addExperienceMutate({
        filter: {
          dto: {
            audience: experienceData?.audience || data.audience,
            employmentType: data.employmentType,
            description: data.description,
            mediaUrl: data.mediaUrl,
            stillWorkingThere: data.stillWorkingThere,
            title: data.title,
            cityId: data.cityDto?.id,
            companyId: data.companyDto?.id,
            startDate: startDate.getFullYear() + '-' + ('0' + (startDate.getMonth() + 1)).slice(-2) + '-01',
            endDate: endDate,
          },
        },
      });

      if (res?.data?.addExperience?.isSuccess) {
        enqueueSnackbar(formatMessage(ExprienceMessages.experienceSuccessfull), { variant: 'success' });
        dispatch(emptyExperience());
        router(PATH_APP.profile.user.experience.root);
      }
    }
  };

  const handleNavigation = (url: string) => {
    dispatch(experienceAdded({ ...getValues(), isChange: isDirty || experienceData?.isChange }));
    router(url);
  };

  const handleClose = () => {
    if (isDirty || experienceData?.isChange) {
      dispatch(
        experienceAdded({
          ...getValues(),
          audience: experienceData?.audience,
          isChange: isDirty || experienceData?.isChange,
          isValid: isValid || experienceData?.isValid,
        }),
      );
      router(PATH_APP.profile.user.experience.discard);
    } else {
      router(-1);
      dispatch(emptyExperience());
    }
  };

  // const handleBack = () => {
  //   dispatch(emptyExperience());
  //   router.back();
  // };

  return (
    <>
      <Dialog open={true && !openAudience} fullWidth={true} onClose={handleClose}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} sx={{ py: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2 }}>
              <Stack direction="row" spacing={2}>
                <IconButton sx={{ p: 0 }} onClick={handleClose}>
                  <Icon name="left-arrow-1" />
                </IconButton>
                <Typography variant="subtitle2" color="text.primary">
                  {experienceData?.id
                    ? formatMessage(ExprienceMessages.editExprience)
                    : formatMessage(ExprienceMessages.addExperience)}
                </Typography>
              </Stack>
              <IconButton onClick={handleClose}>
                <Icon name="Close-1" />
              </IconButton>
            </Stack>
            <Divider sx={{ height: 2 }} />

            <Stack spacing={2} sx={{ px: 2 }}>
              <Typography variant="subtitle1" color="text.primary">
                <FormattedMessage {...ExprienceMessages.title} />
              </Typography>
              {watch('titleView') ? (
                <Typography
                  variant="body2"
                  color={watch('title') ? 'text.primary' : 'text.secondary'}
                  onClick={() => setValue('titleView', false)}
                >
                  {watch('title') || 'Ex: Sales Manager'}
                </Typography>
              ) : (
                <Box>
                  <RHFTextField
                    placeholder={formatMessage(ExprienceMessages.exSales)}
                    name="title"
                    size="small"
                    error={false}
                    inputProps={{ maxLength: 60 }}
                    onBlur={() => setValue('titleView', true)}
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
                <FormattedMessage {...ExprienceMessages.employmentTypeReq} />
              </Typography>
              <Box
                sx={{ cursor: 'pointer' }}
                onClick={() => handleNavigation(PATH_APP.profile.user.experience.employmentType)}
              >
                {watch('employmentType') ? (
                  <Typography variant="body2" color="text.primary">
                    {Object.keys(EmploymentTypeEnum)
                      [
                        Object.values(EmploymentTypeEnum).indexOf(watch('employmentType') as EmploymentTypeEnum)
                      ].replace(/([A-Z])/g, ' $1')
                      .trim()}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    <FormattedMessage {...ExprienceMessages.exFull} />
                  </Typography>
                )}
              </Box>
            </Stack>
            <Divider />
            <Stack spacing={2} sx={{ px: 2 }}>
              <Typography variant="subtitle1" color="text.primary">
                <FormattedMessage {...ExprienceMessages.companyNameReq} />
              </Typography>
              <Box
                sx={{ cursor: 'pointer' }}
                onClick={() => handleNavigation(PATH_APP.profile.user.experience.company)}
              >
                {watch('companyDto') ? (
                  <Typography variant="body2" color="text.primary">
                    {watch('companyDto.title')}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    <FormattedMessage {...ExprienceMessages.exSoftware} />
                  </Typography>
                )}
              </Box>
            </Stack>
            <Divider />
            <Stack spacing={2} sx={{ px: 2 }}>
              <Typography variant="subtitle1" color="text.primary">
                <FormattedMessage {...ExprienceMessages.location} />
              </Typography>
              {watch('cityDto') ? (
                <Typography variant="body2" color="text.primary">
                  {watch('cityDto.name')}
                  <IconButton
                    onClick={() => {
                      setValue('cityDto', undefined, { shouldDirty: true });
                      dispatch(experienceAdded({ ...getValues(), cityDto: undefined, isChange: true }));
                    }}
                    sx={{ ml: 1 }}
                  >
                    &#215;
                  </IconButton>
                </Typography>
              ) : (
                <Box
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleNavigation(PATH_APP.profile.user.experience.location)}
                >
                  <Typography variant="body2" color="text.secondary">
                    <FormattedMessage {...ExprienceMessages.exLocation} />
                  </Typography>
                </Box>
              )}
            </Stack>
            <Divider />
            <Stack spacing={2} sx={{ px: 2 }}>
              <Typography variant="body2" color="text.primary">
                <RHFCheckbox
                  name="stillWorkingThere"
                  label={formatMessage(ExprienceMessages.workInThisRole)}
                  sx={{
                    height: 0,
                  }}
                />
              </Typography>
            </Stack>
            <Divider />
            <Stack spacing={2} sx={{ px: 2 }}>
              <Typography variant="subtitle1" color="text.primary">
                <FormattedMessage {...ExprienceMessages.startDateReq} />
              </Typography>
              {watch('startDate') ? (
                <Typography variant="body2" color="text.primary">
                  {getMonthName(new Date(watch('startDate')))}, {new Date(watch('startDate')).getFullYear()}
                  <IconButton
                    onClick={() => {
                      setValue('startDate', undefined, { shouldValidate: true, shouldDirty: true });
                      dispatch(experienceAdded({ ...getValues() }));
                    }}
                    sx={{ ml: 1 }}
                  >
                    &#215;
                  </IconButton>
                </Typography>
              ) : (
                <Box
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleNavigation(PATH_APP.profile.user.experience.startDate)}
                >
                  <Typography variant="body2" color="text.secondary">
                    <FormattedMessage {...ExprienceMessages.startDate} />
                  </Typography>
                </Box>
              )}
            </Stack>
            <Divider />
            <Stack spacing={2} sx={{ px: 2 }}>
              <Typography variant="subtitle1" color="text.primary">
                <FormattedMessage {...ExprienceMessages.endDate} />
                {!watch('stillWorkingThere') && '*'}
              </Typography>
              {watch('endDate') && !watch('stillWorkingThere') ? (
                <Typography variant="body2" color="text.primary">
                  {getMonthName(new Date(watch('endDate')))}, {new Date(watch('endDate')).getFullYear()}
                  <IconButton
                    onClick={() => {
                      setValue('endDate', undefined, { shouldValidate: true, shouldDirty: true });
                      dispatch(experienceAdded({ ...getValues() }));
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
                    watch('stillWorkingThere') ? undefined : handleNavigation(PATH_APP.profile.user.experience.endDate)
                  }
                >
                  <Typography variant="body2" color="text.secondary">
                    {watch('stillWorkingThere')
                      ? formatMessage(ExprienceMessages.present)
                      : formatMessage(ExprienceMessages.endDate)}
                  </Typography>
                </Box>
              )}
            </Stack>
            <Divider />
            <Stack spacing={2} sx={{ px: 2 }}>
              <Typography variant="subtitle1" color="text.primary">
                <FormattedMessage {...ExprienceMessages.description} />
              </Typography>
              {watch('descView') ? (
                <Typography
                  variant="body2"
                  color={watch('description') ? 'text.primary' : 'text.secondary'}
                  onClick={() => setValue('descView', false)}
                >
                  {watch('description') || formatMessage(ExprienceMessages.addDetail)}
                </Typography>
              ) : (
                <Box>
                  <RHFTextField
                    size="small"
                    multiline
                    name="description"
                    placeholder={formatMessage(ExprienceMessages.addDetail)}
                    inputProps={{ maxLength: 500 }}
                    onBlur={() => setValue('descView', true)}
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
              <Typography variant="subtitle1" color="text.primary">
                <FormattedMessage {...ExprienceMessages.photo} />
              </Typography>
              <Stack>
                {!watch('mediaUrl') ? (
                  <Stack direction="row" justifyContent={'space-between'}>
                    <Typography variant="body2" color="text.primary">
                      <FormattedMessage {...ExprienceMessages.addPhotos} />
                    </Typography>
                    <Typography
                      variant="overline"
                      color="primary.main"
                      sx={{ cursor: 'pointer', textTransform: 'none' }}
                      component="div"
                      onClick={() => handleNavigation(PATH_APP.profile.user.experience.photo)}
                    >
                      <FormattedMessage {...ExprienceMessages.addPhotoPlus} />
                    </Typography>
                  </Stack>
                ) : (
                  <Box display="flex" justifyContent="center" position="relative">
                    <IconButtonStyle onClick={() => router(PATH_APP.profile.user.experience.editPhoto)}>
                      <Icon name="camera" size={24} color="text.secondary" />
                    </IconButtonStyle>
                    <Box onClick={() => handleNavigation(PATH_APP.profile.user.experience.photo)}>
                      <img src={watch('mediaUrl') as string} width={328} height={184} alt="experience" />
                    </Box>
                  </Box>
                )}
              </Stack>
            </Stack>

            <Divider />
            <Stack sx={{ px: 2 }} direction="row" justifyContent="space-between">
              <Stack direction="row" spacing={0.5}>
                {experienceData?.id && (
                  <Link to={PATH_APP.profile.user.experience.delete}>
                    <Button color="error" variant="text" sx={{ width: 105 }}>
                      <FormattedMessage {...GeneralMessagess.delete} />
                    </Button>
                  </Link>
                )}
                <Button
                  variant="outlined"
                  startIcon={<Icon name="Earth" color="text.primary" />}
                  onClick={() => {
                    setOpenAudience(true);
                    // dispatch(experienceAdded(getValues()));
                    // router(PATH_APP.profile.user.experience.audience);
                  }}
                  endIcon={<Icon name="down-arrow" color="text.primary" />}
                >
                  <Typography color="text.primary">
                    {
                      Object.keys(AudienceEnum)[
                        Object.values(AudienceEnum).indexOf(experienceData?.audience as AudienceEnum)
                      ]
                    }
                  </Typography>
                </Button>
              </Stack>
              <LoadingButton
                loading={addLoading || updateLoading}
                type="submit"
                variant="contained"
                disabled={!isValid || !(isDirty || experienceData?.isChange)}
                color="primary"
              >
                {experienceData?.id ? formatMessage(GeneralMessagess.save) : formatMessage(GeneralMessagess.add)}
              </LoadingButton>
            </Stack>
          </Stack>
        </FormProvider>
      </Dialog>
      {openAudience && (
        <Audience
          open={openAudience}
          onClose={setOpenAudience}
          feature={FeatureAudienceEnum.Experience}
          value={experienceData?.audience as AudienceEnum}
          onChange={(val: any) => {
            dispatch(experienceAdded({ ...experienceData, audience: val, isChange: true }));
          }}
        />
      )}
    </>
  );
}

export default ExperienceNewDialog;
