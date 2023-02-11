import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { useAddPersonCollegeMutation } from 'src/_graphql/profile/publicDetails/mutations/createPersonCollege.generated';
import { useUpdatePersonCollegeMutation } from 'src/_graphql/profile/publicDetails/mutations/updatePersonCollege.generated';
import { Icon } from 'src/components/Icon';
import { Audience } from 'src/components/audience';
import { FormProvider, RHFCheckbox } from 'src/components/hook-form';
import GeneralMessagess from 'src/language/general.messages';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { emptyCollege, userCollegeUpdated, userCollegesSelector } from 'src/store/slices/profile/userColloges-slice';
import { AudienceEnum, FeatureAudienceEnum, InstituteTypeEnum, PersonCollege } from 'src/types/serverTypes';
import getMonthName from 'src/utils/getMonthName';

import NormalPublicDetailsMessages from '../../NormalPublicDetails.messages';

export default function CollegeNewFormDialog() {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [openAudience, setOpenAudience] = React.useState<boolean>(false);
  const dispatch = useDispatch();
  const userColleges = useSelector(userCollegesSelector);
  const [createPersonCollege, { isLoading: addIsLoading }] = useAddPersonCollegeMutation();
  const [updateCurrentCollege, { isLoading: updateIsLoading }] = useUpdatePersonCollegeMutation();
  const isEdit = !!userColleges?.id;

  const handleNavigation = (url: string) => {
    dispatch(
      userCollegeUpdated({
        ...getValues(),
        audience: userColleges?.audience,
        isChange: isDirty || userColleges?.isChange,
        isValid: isValid || userColleges?.isValid,
      }),
    );
    navigate(url);
  };

  const onSubmit = async (data: PersonCollege) => {
    const startDate = new Date(data.startDate).toISOString();
    let endDate;
    if (data.endDate && data.graduated) {
      endDate = new Date(data.endDate).toISOString();
    }

    if (isEdit) {
      const response: any = await updateCurrentCollege({
        filter: {
          dto: {
            id: data.id,
            collegeId: data.collegeDto?.id,
            concentrationId: data.concentrationDto?.id,
            graduated: data.graduated,
            audience: userColleges?.audience || data.audience,
            startDate: startDate, //(data?.startDate as Date).toISOString(), //startDate.getFullYear() + '-' + ('0' + (startDate.getMonth() + 1)).slice(-2) + '-01',
            endDate: endDate,
            instituteType: InstituteTypeEnum.College,
          },
        },
      });
      if (response?.data?.updatePersonCollege?.isSuccess) {
        enqueueSnackbar(formatMessage(NormalPublicDetailsMessages.collegeEditedAlertMessage), {
          variant: 'success',
        });
        dispatch(emptyCollege());
        navigate(PATH_APP.profile.user.publicDetails.root);
      } else {
        enqueueSnackbar(formatMessage(NormalPublicDetailsMessages.collegeNotEditedAlertMessage), { variant: 'error' });
      }
    } else {
      const response: any = await createPersonCollege({
        filter: {
          dto: {
            audience: userColleges?.audience || data.audience,
            graduated: data.graduated,
            startDate: startDate,
            endDate: endDate,
            collegeId: data.collegeDto?.id,
            concentrationId: data.concentrationDto?.id,
            instituteType: InstituteTypeEnum.College,
          },
        },
      });
      if (response?.data?.addPersonCollege?.isSuccess) {
        enqueueSnackbar(formatMessage(NormalPublicDetailsMessages.collogeAddedAlertMessage), { variant: 'success' });
        dispatch(emptyCollege());
        navigate(PATH_APP.profile.user.publicDetails.root);
      } else if (!response?.createCollegeData?.addPersonCollege?.isSuccess) {
        enqueueSnackbar(formatMessage(NormalPublicDetailsMessages.collegeNotAddedAlertMessage), { variant: 'error' });
      }
    }
  };

  useEffect(() => {
    trigger(['collegeDto', 'startDate']);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!userColleges) navigate(PATH_APP.profile.user.publicDetails.root);
  }, [userColleges, navigate]);

  const handleDiscardDialog = () => {
    if (userColleges?.isChange || isDirty) {
      handleNavigation(PATH_APP.profile.user.publicDetails.college.discard);
    } else {
      navigate(PATH_APP.profile.user.publicDetails.root);
      dispatch(emptyCollege());
    }
  };

  const CollegeValidationSchema = Yup.object().shape({
    collegeDto: Yup.object()
      .shape({
        name: Yup.string().required('Required'),
      })
      .required(),
    startDate: Yup.string().required('Required'),
    graduated: Yup.boolean(),
    endDate: Yup.string()
      .nullable()
      .when('graduated', {
        is: true,
        then: Yup.string().required('Required'),
      }),
  });

  const methods = useForm<PersonCollege>({
    mode: 'onChange',
    defaultValues: {
      ...userColleges,
    },
    resolver: yupResolver(CollegeValidationSchema),
  });

  const {
    getValues,
    watch,
    handleSubmit,
    trigger,
    setValue,
    formState: { isValid, isDirty },
  } = methods;

  return (
    <>
      <Dialog fullWidth={true} open={true && !openAudience} keepMounted onClose={handleDiscardDialog}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} sx={{ py: 3, minHeight: 320 }}>
            <Stack direction="row" spacing={2} sx={{ px: 2 }} justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={2}>
                <IconButton sx={{ p: 0 }} onClick={handleDiscardDialog}>
                  <Icon name="left-arrow-1" />
                </IconButton>
                <Typography variant="subtitle1" color="text.primary">
                  {isEdit
                    ? formatMessage(NormalPublicDetailsMessages.editCollege)
                    : formatMessage(NormalPublicDetailsMessages.addCollege)}
                </Typography>
              </Stack>
              <IconButton sx={{ p: 0 }} onClick={handleDiscardDialog}>
                <Icon name="Close-1" color="text.primary" />
              </IconButton>
            </Stack>
            <Divider />
            <Stack spacing={2} sx={{ px: 2 }}>
              <Typography variant="subtitle1" color="text.primary">
                <FormattedMessage {...NormalPublicDetailsMessages.collegeName} />*
              </Typography>
              <Box onClick={() => handleNavigation(PATH_APP.profile.user.publicDetails.college.collegeName)}>
                {watch('collegeDto') ? (
                  <Typography variant="body2" color="text.primary" sx={{ cursor: 'pointer' }}>
                    {watch('collegeDto')?.name}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>
                    <FormattedMessage {...NormalPublicDetailsMessages.collegeName} />
                  </Typography>
                )}
              </Box>
            </Stack>
            <Divider />
            <Stack spacing={2} sx={{ px: 2 }}>
              <Typography variant="subtitle1" color="text.primary">
                <FormattedMessage {...NormalPublicDetailsMessages.concenteration} />
              </Typography>
              {watch('concentrationDto') ? (
                <Typography variant="body2" color="text.primary" sx={{ cursor: 'pointer' }}>
                  {watch('concentrationDto')?.title}
                  <IconButton
                    onClick={() => {
                      setValue('concentrationDto', undefined, { shouldDirty: true });
                      dispatch(userCollegeUpdated({ ...userColleges, isChange: true, concentrationDto: undefined }));
                    }}
                    sx={{ ml: 1 }}
                  >
                    &#215;
                  </IconButton>
                </Typography>
              ) : (
                <Box onClick={() => handleNavigation(PATH_APP.profile.user.publicDetails.college.concentrationName)}>
                  <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>
                    <FormattedMessage {...NormalPublicDetailsMessages.concenteration} />
                  </Typography>
                </Box>
              )}
            </Stack>
            <Divider />
            <Stack direction="row" sx={{ px: 2 }} justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.primary">
                <FormattedMessage {...NormalPublicDetailsMessages.graduated} />
              </Typography>
              <RHFCheckbox
                label=""
                name="graduated"
                sx={{
                  color: 'primary.main',
                  '&.Mui-checked': {
                    color: 'primary.main',
                  },
                }}
              />
            </Stack>
            <Divider />
            <Stack spacing={2} sx={{ px: 2 }}>
              <Typography variant="subtitle1" color="text.primary">
                <FormattedMessage {...NormalPublicDetailsMessages.startDate} />*
              </Typography>
              {watch('startDate') ? (
                <Typography variant="body2" color="text.primary" sx={{ cursor: 'pointer' }}>
                  {getMonthName(new Date(watch('startDate')))}, {new Date(watch('startDate')).getFullYear()}
                  <IconButton
                    onClick={() => {
                      setValue('startDate', undefined, { shouldValidate: true, shouldDirty: true });
                      // setValue('endDate', undefined,{shouldValidate:true, shouldDirty:true});
                      dispatch(userCollegeUpdated({ ...getValues() }));
                    }}
                    sx={{ ml: 1 }}
                  >
                    &#215;
                  </IconButton>
                </Typography>
              ) : (
                <Box onClick={() => handleNavigation(PATH_APP.profile.user.publicDetails.college.startDate)}>
                  <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>
                    <FormattedMessage {...NormalPublicDetailsMessages.startDate} />
                  </Typography>
                </Box>
              )}
            </Stack>
            <Divider />
            <Stack spacing={2} sx={{ px: 2 }}>
              <Typography variant="subtitle1" color="text.primary">
                <FormattedMessage {...NormalPublicDetailsMessages.endDate} />
                {watch('graduated') && '*'}
              </Typography>
              {watch('endDate') && watch('graduated') ? (
                <Typography
                  variant="body2"
                  color={watch('graduated') ? 'text.primary' : 'text.secondary'}
                  sx={{ cursor: watch('graduated') ? 'pointer' : 'default' }}
                >
                  {watch('graduated')
                    ? `${getMonthName(new Date(watch('endDate')))}, ${new Date(watch('endDate')).getFullYear()}`
                    : formatMessage(NormalPublicDetailsMessages.present)}
                  <IconButton
                    onClick={() => {
                      setValue('endDate', undefined, { shouldValidate: true, shouldDirty: true });
                      dispatch(userCollegeUpdated({ ...getValues() }));
                    }}
                    sx={{ ml: 1 }}
                  >
                    &#215;
                  </IconButton>
                </Typography>
              ) : (
                <Box
                  onClick={() =>
                    watch('graduated') && handleNavigation(PATH_APP.profile.user.publicDetails.college.endDate)
                  }
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ cursor: watch('graduated') ? 'pointer' : 'default' }}
                  >
                    {watch('graduated')
                      ? formatMessage(NormalPublicDetailsMessages.endDate)
                      : formatMessage(NormalPublicDetailsMessages.present)}
                  </Typography>
                </Box>
              )}
            </Stack>
            <Divider />
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2 }}>
              <Stack direction="row" spacing={1}>
                {isEdit && (
                  <Button
                    variant="text"
                    color="error"
                    onClick={() => handleNavigation(PATH_APP.profile.user.publicDetails.college.delete)}
                  >
                    <Typography variant="button">
                      <FormattedMessage {...GeneralMessagess.delete} />
                    </Typography>
                  </Button>
                )}
                <Button
                  variant="outlined"
                  startIcon={<Icon name="Earth" />}
                  onClick={() => {
                    setOpenAudience(true);
                    // dispatch(userCollegeUpdated(getValues()));
                    // navigate(PATH_APP.profile.user.publicDetails.college.audience);
                  }}
                  endIcon={<Icon name="down-arrow" color="grey.500" />}
                >
                  <Typography color="text.primary">
                    {
                      Object.keys(AudienceEnum)[
                        Object.values(AudienceEnum).indexOf(userColleges?.audience as AudienceEnum)
                      ]
                    }
                  </Typography>
                </Button>
              </Stack>
              <LoadingButton
                loading={addIsLoading || updateIsLoading}
                variant="contained"
                color="primary"
                disabled={!isValid || !(isDirty || userColleges?.isChange)}
                type="submit"
              >
                {isEdit ? formatMessage(GeneralMessagess.save) : formatMessage(GeneralMessagess.add)}
              </LoadingButton>
            </Stack>
          </Stack>
        </FormProvider>
      </Dialog>
      {openAudience && (
        <Audience
          open={openAudience}
          onClose={setOpenAudience}
          feature={FeatureAudienceEnum.College}
          value={userColleges?.audience as AudienceEnum}
          onChange={(val: any) => {
            dispatch(userCollegeUpdated({ ...userColleges, audience: val, isChange: true }));
          }}
        />
      )}
    </>
  );
}
