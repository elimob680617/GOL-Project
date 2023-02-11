import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
// bottom sheet
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';

import { LoadingButton } from '@mui/lab';
import { Box, Button, Divider, IconButton, Stack, Typography, styled, useTheme } from '@mui/material';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { useAddExperienceMutation } from 'src/_graphql/profile/experiences/mutations/addExperience.generated';
import { useUpdateExperienceMutation } from 'src/_graphql/profile/experiences/mutations/updateExperience.generated';
import { Icon } from 'src/components/Icon';
import { FormProvider, RHFCheckbox, RHFTextField } from 'src/components/hook-form';
import GeneralMessagess from 'src/language/general.messages';
// import components
import ExperienceEmployment from 'src/pwa-sections/profile/user/owner/userExperiences/ExperienceEmployment';
import { useDispatch, useSelector } from 'src/store';
import {
  emptyExperience,
  experienceAdded,
  userExperienceSelector,
} from 'src/store/slices/profile/userExperiences-slice';
import { AudienceEnum, EmploymentTypeEnum, Experience } from 'src/types/serverTypes';
import getMonthName from 'src/utils/getMonthName';

import ExperienceCompany from './ExperienceCompany';
import ExperienceDate from './ExperienceDate';
import ExperienceDeleteConfirm from './ExperienceDeleteConfirm';
import ExperienceDiscard from './ExperienceDiscard';
import ExperienceEditPhoto from './ExperienceEditPhoto';
import ExperienceLocation from './ExperienceLocation';
import ExperiencePhoto from './ExperiencePhoto';
import ExprienceMessages from './ExpriencePwa.messages';
import SelectExperienceAudience from './SelectExperienceAudience';

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

function ExperienceNew() {
  const experienceData = useSelector(userExperienceSelector);
  const theme = useTheme();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [addExperienceMutate, { isLoading: addLoading }] = useAddExperienceMutation();
  const [updateExperienceMutate, { isLoading: updateLoading }] = useUpdateExperienceMutation();
  const { formatMessage } = useIntl();

  // useState for bottomSheet;
  const [employmentBottomSheet, setEmploymentBottomSheet] = useState(false);
  const [companyNameBottomSheet, setCompanyNameBottomSheet] = useState(false);
  const [locationBottomSheet, setLocationBottomSheet] = useState(false);
  const [dateBottomSheet, setDateBottomSheet] = useState(false);
  const [audienceBottomSheet, setAudienceBottomSheet] = useState(false);
  const [discardExperienceBottomSheet, setDiscardExperienceBottomSheet] = useState(false);
  const [deleteExperienceBottomSheet, setDeleteExperienceBottomSheet] = useState(false);
  const [editExperiencePhoto, setEditExperiencePhoto] = useState(false);
  const [newPhotoExperienceBottomSheet, setNewPhotoExperienceBottomSheet] = useState(false);
  //
  const [statusDate, setStatusDate] = useState<'startDate' | 'endDate' | undefined>();

  useEffect(() => {
    if (!experienceData) navigate('/profile/user/experience/list');
  }, [experienceData, navigate]);

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
    defaultValues: {
      ...experienceData,
      titleView: true,
      descView: true,
    },
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
            audience: data.audience,
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
        dispatch(emptyExperience());
        navigate('/profile/user/experience/list');
      }
    } else {
      const res: any = await addExperienceMutate({
        filter: {
          dto: {
            audience: data.audience,
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
        navigate('/profile/user/experience/list');
      }
    }
  };

  const handleClose = () => {
    if (isDirty || experienceData?.isChange) {
      setDiscardExperienceBottomSheet(true);
    } else {
      dispatch(emptyExperience());
      navigate(-1);
    }
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} sx={{ py: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2 }}>
            <Stack direction="row" spacing={2}>
              <IconButton sx={{ p: 0 }} onClick={handleClose}>
                <Icon name="left-arrow-1" color="text.primary" />
              </IconButton>
              <Typography variant="subtitle1" color="text.primary">
                {experienceData?.id
                  ? formatMessage(ExprienceMessages.editExprience)
                  : formatMessage(ExprienceMessages.addExperience)}
              </Typography>
            </Stack>
            <LoadingButton
              loading={addLoading || updateLoading}
              type="submit"
              variant="contained"
              disabled={!isValid || !isDirty}
              color="primary"
            >
              {experienceData?.id ? formatMessage(GeneralMessagess.save) : formatMessage(GeneralMessagess.add)}
            </LoadingButton>
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
                  onBlur={() => setValue('titleView', true, { shouldDirty: true })}
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
            <Box sx={{ cursor: 'pointer' }} onClick={() => setEmploymentBottomSheet(true)}>
              {watch('employmentType') ? (
                <Typography variant="body2" color="text.primary">
                  {Object.keys(EmploymentTypeEnum)
                    [Object.values(EmploymentTypeEnum).indexOf(watch('employmentType') as EmploymentTypeEnum)].replace(
                      /([A-Z])/g,
                      ' $1',
                    )
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
            <Box sx={{ cursor: 'pointer' }} onClick={() => setCompanyNameBottomSheet(true)}>
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
                  }}
                  sx={{ ml: 1 }}
                >
                  &#215;
                </IconButton>
              </Typography>
            ) : (
              <Box sx={{ cursor: 'pointer' }} onClick={() => setLocationBottomSheet(true)}>
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
                  color: ' primary.main',
                  height: 0,
                  '&.Mui-checked': {
                    color: 'primary.main',
                  },
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
                    // dispatch(experienceAdded({ ...getValues() }));
                  }}
                  sx={{ ml: 1 }}
                >
                  &#215;
                </IconButton>
              </Typography>
            ) : (
              <Box
                sx={{ cursor: 'pointer' }}
                onClick={() => {
                  setDateBottomSheet(true);
                  setStatusDate('startDate');
                }}
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
              <FormattedMessage {...ExprienceMessages.endDate} /> {!watch('stillWorkingThere') && '*'}
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
                onClick={() => {
                  if (!watch('stillWorkingThere')) {
                    setDateBottomSheet(true);
                    setStatusDate('endDate');
                  }
                }}
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
                  maxRows={4}
                  autoFocus
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
                    onClick={() => setNewPhotoExperienceBottomSheet(true)}
                  >
                    <FormattedMessage {...ExprienceMessages.addPhotoPlus} />
                  </Typography>
                </Stack>
              ) : (
                <Box display="flex" justifyContent="center" position="relative">
                  <IconButtonStyle onClick={() => setEditExperiencePhoto(true)}>
                    <Icon name="camera" size={24} color="text.secondary" />
                  </IconButtonStyle>
                  <Box onClick={() => setEditExperiencePhoto(true)}>
                    <img src={watch('mediaUrl') as string} width={328} height={184} alt="experience" loading="lazy" />
                  </Box>
                </Box>
              )}
            </Stack>
          </Stack>

          <Divider />
          <Stack sx={{ px: 2 }} direction="row" justifyContent="space-between">
            <Stack direction="row" spacing={0.5}>
              {experienceData?.id && (
                <Button
                  color="error"
                  variant="text"
                  sx={{ width: 105 }}
                  onClick={() => setDeleteExperienceBottomSheet(true)}
                >
                  <FormattedMessage {...GeneralMessagess.delete} />
                </Button>
              )}
            </Stack>

            <Button
              variant="outlined"
              startIcon={<Icon name="Earth" size="18" color="text.primary" />}
              onClick={() => {
                dispatch(experienceAdded(getValues()));
                setAudienceBottomSheet(true);
              }}
              endIcon={<Icon name="down-arrow" size="16" color="text.primary" />}
            >
              <Typography color={theme.palette.text.primary}>
                {Object.keys(AudienceEnum)[Object.values(AudienceEnum).indexOf(watch('audience') as AudienceEnum)]}
              </Typography>
            </Button>
          </Stack>
        </Stack>
      </FormProvider>
      <BottomSheet open={employmentBottomSheet} onDismiss={() => setEmploymentBottomSheet(false)}>
        <ExperienceEmployment
          onChange={(value) => {
            setValue('employmentType', value, { shouldDirty: true, shouldValidate: true });
            setEmploymentBottomSheet(false);
          }}
        />
      </BottomSheet>
      <BottomSheet
        open={companyNameBottomSheet}
        onDismiss={() => setCompanyNameBottomSheet(false)}
        snapPoints={({ maxHeight }) => maxHeight / 2}
      >
        <ExperienceCompany
          onChange={(value) => {
            setValue('companyDto', value, { shouldDirty: true, shouldValidate: true });
            setCompanyNameBottomSheet(false);
          }}
        />
      </BottomSheet>
      <BottomSheet
        open={locationBottomSheet}
        onDismiss={() => setLocationBottomSheet(false)}
        snapPoints={({ maxHeight }) => maxHeight / 2}
      >
        <ExperienceLocation
          onChange={(value) => {
            setValue('cityDto', value, { shouldDirty: true });
            setLocationBottomSheet(false);
          }}
        />
      </BottomSheet>

      <BottomSheet open={dateBottomSheet} onDismiss={() => setDateBottomSheet(false)}>
        <ExperienceDate
          startDate={watch('startDate')}
          endDate={watch('endDate')}
          isEndDate={statusDate === 'endDate'}
          onChange={(value) => {
            setValue(statusDate === 'startDate' ? 'startDate' : 'endDate', value, {
              shouldDirty: true,
              shouldValidate: true,
            });
            setDateBottomSheet(false);
          }}
        />
      </BottomSheet>
      <BottomSheet open={audienceBottomSheet} onDismiss={() => setAudienceBottomSheet(false)}>
        <SelectExperienceAudience
          onChange={(value) => {
            setValue('audience', value, { shouldDirty: true });
            setAudienceBottomSheet(false);
          }}
          audience={watch('audience') as AudienceEnum}
        />
      </BottomSheet>

      <BottomSheet open={discardExperienceBottomSheet} onDismiss={() => setDiscardExperienceBottomSheet(false)}>
        <ExperienceDiscard
          loading={addLoading || updateLoading}
          onSubmit={() => {
            if (isValid) {
              onSubmit(getValues());
            }
            setDiscardExperienceBottomSheet(false);
          }}
          isValid={isValid}
        />
      </BottomSheet>

      <BottomSheet open={deleteExperienceBottomSheet} onDismiss={() => setDeleteExperienceBottomSheet(false)}>
        <ExperienceDeleteConfirm />
      </BottomSheet>

      <BottomSheet open={newPhotoExperienceBottomSheet} onDismiss={() => setNewPhotoExperienceBottomSheet(false)}>
        <ExperiencePhoto
          onChange={(value) => {
            setValue('mediaUrl', value, { shouldDirty: true, shouldValidate: true });
            setNewPhotoExperienceBottomSheet(false);
          }}
          onClose={() => {
            setNewPhotoExperienceBottomSheet(false);
          }}
        />
      </BottomSheet>
      <BottomSheet open={editExperiencePhoto} onDismiss={() => setEditExperiencePhoto(false)}>
        <ExperienceEditPhoto
          onUpload={() => {
            setEditExperiencePhoto(false);
            setNewPhotoExperienceBottomSheet(true);
          }}
          onRemove={(value) => {
            setValue('mediaUrl', value, { shouldDirty: true, shouldValidate: true });
            setEditExperiencePhoto(false);
          }}
        />
      </BottomSheet>
    </>
  );
}

export default ExperienceNew;
