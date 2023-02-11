import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { useAddPersonSchoolMutation } from 'src/_graphql/profile/publicDetails/mutations/createPersonSchool.generated';
import { useUpdatePersonSchoolMutation } from 'src/_graphql/profile/publicDetails/mutations/updatePersonSchool.generated';
import { Icon } from 'src/components/Icon';
import { Audience } from 'src/components/audience';
import { FormProvider } from 'src/components/hook-form';
import GeneralMessagess from 'src/language/general.messages';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { schoolWasEmpty, userSchoolUpdated, userSchoolsSelector } from 'src/store/slices/profile/userSchool-slice';
import { AudienceEnum, FeatureAudienceEnum, PersonSchool } from 'src/types/serverTypes';
import sleep from 'src/utils/sleep';

import NormalPublicDetailsMessages from '../../NormalPublicDetails.messages';

export default function SchoolNewFormDialog() {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [openAudience, setOpenAudience] = useState<boolean>(false);
  const [createPersonSchool, { isLoading: createIsLoading }] = useAddPersonSchoolMutation();
  const [updateCurrentSchool, { isLoading: updateIsLoading }] = useUpdatePersonSchoolMutation();
  const dispatch = useDispatch();
  const userHighSchool = useSelector(userSchoolsSelector);
  const isEdit = !!userHighSchool?.id;

  const handleNavigation = (url: string) => {
    dispatch(
      userSchoolUpdated({
        ...getValues(),
        audience: userHighSchool?.audience,
        isValid: isValid || userHighSchool?.isValid,
      }),
    );
    navigate(url);
  };

  const onSubmit = async (data: PersonSchool) => {
    if (isEdit) {
      const response: any = await updateCurrentSchool({
        filter: {
          dto: {
            id: data.id,
            year: data?.year ? +data?.year : undefined,
            schoolId: data.school?.id,
            audience: userHighSchool?.audience || data.audience,
          },
        },
      });
      if (response?.data?.updatePersonSchool?.isSuccess) {
        enqueueSnackbar(formatMessage(NormalPublicDetailsMessages.schoolEditedAlertMessage), { variant: 'success' });
        navigate(PATH_APP.profile.user.publicDetails.root);
        await sleep(1500);
        dispatch(schoolWasEmpty());
      } else {
        enqueueSnackbar(formatMessage(NormalPublicDetailsMessages.schoolNotEditedAlertMessage), { variant: 'error' });
      }
    } else {
      const response: any = await createPersonSchool({
        filter: {
          dto: {
            // id: null,
            year: data?.year ? +data?.year : undefined,
            schoolId: data.school?.id,
            audience: userHighSchool?.audience || data.audience,
          },
        },
      });
      if (response?.data?.addPersonSchool?.isSuccess) {
        enqueueSnackbar(formatMessage(NormalPublicDetailsMessages.schoolAddedAlertMessage), { variant: 'success' });
        navigate(PATH_APP.profile.user.publicDetails.root);
        await sleep(1500);
        dispatch(schoolWasEmpty());
      } else {
        enqueueSnackbar(formatMessage(NormalPublicDetailsMessages.schoolNotAddedAlertMessage), { variant: 'error' });
      }
    }
  };
  useEffect(() => {
    trigger(['school.title']);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!userHighSchool) navigate(PATH_APP.profile.user.publicDetails.root);
  }, [userHighSchool, navigate]);

  const handleDiscardDialog = () => {
    if (userHighSchool?.isChange || isDirty) {
      handleNavigation(PATH_APP.profile.user.publicDetails.school.discard);
    } else {
      dispatch(schoolWasEmpty());
      navigate(PATH_APP.profile.user.publicDetails.root);
    }
  };

  const SchoolValidationSchema = Yup.object().shape({
    school: Yup.object().shape({
      title: Yup.string().required('Required'),
    }),
  });

  const methods = useForm<PersonSchool>({
    mode: 'onChange',
    defaultValues: {
      ...userHighSchool,
    },
    resolver: yupResolver(SchoolValidationSchema),
  });

  const {
    trigger,
    getValues,
    watch,
    handleSubmit,
    setValue,
    formState: { isValid, isDirty },
  } = methods;

  return (
    <>
      <Dialog fullWidth={true} open={true && !openAudience} keepMounted onClose={handleDiscardDialog}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} sx={{ py: 3, minHeight: 320, minWidth: 600 }}>
            <Stack direction="row" spacing={2} sx={{ px: 2 }} justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={2}>
                <IconButton sx={{ p: 0 }} onClick={handleDiscardDialog}>
                  <Icon name="left-arrow-1" />
                </IconButton>
                <Typography variant="subtitle1" color="text.primary">
                  {isEdit
                    ? formatMessage(NormalPublicDetailsMessages.editSchool)
                    : formatMessage(NormalPublicDetailsMessages.addSchool)}
                </Typography>
              </Stack>
              <IconButton sx={{ p: 0 }} onClick={handleDiscardDialog}>
                <Icon name="Close-1" color="text.primary" />
              </IconButton>
            </Stack>
            <Divider />
            <Stack spacing={2} sx={{ px: 2 }}>
              <Typography variant="subtitle1" color="text.primary">
                <FormattedMessage {...NormalPublicDetailsMessages.schoolName} />*
              </Typography>
              <Box onClick={() => handleNavigation(PATH_APP.profile.user.publicDetails.school.schoolName)}>
                <Typography variant="subtitle1" color="text.secondary" sx={{ cursor: 'pointer' }}>
                  {watch('school') ? (
                    <Typography variant="body2" color="text.primary">
                      {watch('school.title')}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      <FormattedMessage {...NormalPublicDetailsMessages.schoolName} />
                    </Typography>
                  )}
                </Typography>
              </Box>
            </Stack>
            <Divider />
            <Stack spacing={2} sx={{ px: 2 }}>
              <Typography variant="subtitle1" color="text.primary">
                <FormattedMessage {...NormalPublicDetailsMessages.classYear} />
              </Typography>

              {watch('year') ? (
                <Typography color="text.primary" variant="body2" sx={{ cursor: 'pointer' }}>
                  {watch('year')}
                  <IconButton
                    onClick={() => {
                      setValue('year', undefined, { shouldDirty: true });
                      dispatch(userSchoolUpdated({ ...getValues() }));
                    }}
                    sx={{ ml: 1 }}
                  >
                    &#215;
                  </IconButton>
                </Typography>
              ) : (
                <Box onClick={() => handleNavigation(PATH_APP.profile.user.publicDetails.school.year)}>
                  <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>
                    <FormattedMessage {...NormalPublicDetailsMessages.classYear} />
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
                    onClick={() => navigate(PATH_APP.profile.user.publicDetails.school.delete)}
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
                    // dispatch(userSchoolUpdated(getValues()));
                    // navigate(PATH_APP.profile.user.publicDetails.school.audience);
                  }}
                  endIcon={<Icon name="down-arrow" color="grey.500" />}
                >
                  <Typography color="text.primary">
                    {
                      Object.keys(AudienceEnum)[
                        Object.values(AudienceEnum).indexOf(userHighSchool?.audience as AudienceEnum)
                      ]
                    }
                  </Typography>
                </Button>
              </Stack>
              <LoadingButton
                loading={createIsLoading || updateIsLoading}
                variant="contained"
                color="primary"
                disabled={!isValid || !(isDirty || userHighSchool?.isChange)}
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
          feature={FeatureAudienceEnum.School}
          value={userHighSchool?.audience as AudienceEnum}
          onChange={(val: any) => {
            dispatch(userSchoolUpdated({ ...userHighSchool, audience: val, isChange: true }));
          }}
        />
      )}
    </>
  );
}
