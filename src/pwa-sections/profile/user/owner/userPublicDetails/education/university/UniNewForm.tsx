import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';

import { LoadingButton } from '@mui/lab';
import { Box, Button, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { useAddPersonCollegeMutation } from 'src/_graphql/profile/publicDetails/mutations/createPersonCollege.generated';
import { useUpdatePersonCollegeMutation } from 'src/_graphql/profile/publicDetails/mutations/updatePersonCollege.generated';
import { Icon } from 'src/components/Icon';
import { FormProvider, RHFCheckbox } from 'src/components/hook-form';
import GeneralMessagess from 'src/language/general.messages';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { emptyUniversity, userUniversitySelector } from 'src/store/slices/profile/userUniversity-slice';
import { AudienceEnum, InstituteTypeEnum, PersonCollege } from 'src/types/serverTypes';
import getMonthName from 'src/utils/getMonthName';

import NormalPublicDetailsMessages from '../../NormalPublicDetailsPwa.messages';
import SelectAudienceUniversity from './SelectAudienceUniversity';
import UniDate from './UniDate';
import UniDelete from './UniDelete';
import UniDiscard from './UniDiscard';
import UniversityConcentration from './UniversityConcenteration';
import UniversityName from './UniversityName';

export default function UniNewForm() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const [concentrationBottomSheet, setConcentrationBottomSheet] = useState(false);
  const [dateBottomSheet, setDateBottomSheet] = useState(false);
  const [deleteBottomSheet, setDeleteBottomSheet] = useState(false);
  const [discardBottomSheet, setDiscardBottomSheet] = useState(false);
  const [audienceBottomSheet, setAudienceBottomSheet] = useState(false);
  const [nameBottomSheet, setNameBottomSheet] = useState(false);
  const [isEndDate, setIsEndDate] = useState(false);

  //Mutations
  const [createPersonUniversity, { isLoading: createIsLoading }] = useAddPersonCollegeMutation();
  const [updateCurrentUniversity, { isLoading: updateIsLoading }] = useUpdatePersonCollegeMutation();

  //For Redux Tools
  const dispatch = useDispatch();
  const userUniversity = useSelector(userUniversitySelector);
  const isEdit = userUniversity?.id;

  //Functions for Mutation and Redux
  useEffect(() => {
    trigger(['collegeDto', 'startDate']);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!userUniversity) navigate(PATH_APP.profile.user.publicDetails.root);
  }, [userUniversity, navigate]);

  const onSubmit = async (data: PersonCollege) => {
    const startDate = new Date(data.startDate).toISOString();
    let endDate;
    if (data.endDate && data.graduated) {
      endDate = new Date(data.endDate).toISOString();
    }

    if (isEdit) {
      const response: any = await updateCurrentUniversity({
        filter: {
          dto: {
            id: data.id,
            audience: userUniversity?.audience || data.audience,
            collegeId: data.collegeDto?.id,
            concentrationId: data.concentrationDto?.id,
            graduated: data.graduated,
            startDate: startDate,
            endDate: endDate,
            instituteType: InstituteTypeEnum.University,
          },
        },
      });
      if (response?.data?.updatePersonCollege?.isSuccess) {
        enqueueSnackbar(formatMessage(NormalPublicDetailsMessages.universityEditedAlertMessage), {
          variant: 'success',
        });
        dispatch(emptyUniversity());
        navigate(PATH_APP.profile.user.publicDetails.root);
      } else {
        enqueueSnackbar(formatMessage(NormalPublicDetailsMessages.universityNotEditedAlertMessage), {
          variant: 'error',
        });
      }
    } else {
      const response: any = await createPersonUniversity({
        filter: {
          dto: {
            audience: userUniversity?.audience || data.audience,
            graduated: data.graduated,
            startDate: startDate,
            endDate: endDate,
            collegeId: data.collegeDto?.id,
            concentrationId: data.concentrationDto?.id,
            instituteType: InstituteTypeEnum.University,
          },
        },
      });
      if (response?.data?.addPersonCollege?.isSuccess) {
        enqueueSnackbar(formatMessage(NormalPublicDetailsMessages.universityAddedAlertMessage), { variant: 'success' });
        dispatch(emptyUniversity());
        navigate(PATH_APP.profile.user.publicDetails.root);
      } else if (!response?.createCollegeData?.addPersonCollege?.isSuccess) {
        enqueueSnackbar(formatMessage(NormalPublicDetailsMessages.universityNotAddedAlertMessage), {
          variant: 'error',
        });
      }
    }
  };

  //Yup Validation schema & RHF
  const universityValidationSchema = Yup.object().shape({
    collegeDto: Yup.object()
      .shape({
        name: Yup.string().required('Required'),
      })
      .required(),
    startDate: Yup.string().required('Required'),
    graduated: Yup.boolean(),
    endDate: Yup.string().when('graduated', {
      is: true,
      then: Yup.string().required('Required'),
    }),
  });

  const methods = useForm<PersonCollege>({
    defaultValues: {
      ...userUniversity,
    },
    resolver: yupResolver(universityValidationSchema),
    mode: 'onChange',
  });
  const {
    getValues,
    watch,
    setValue,
    trigger,
    handleSubmit,
    formState: { isValid, isDirty },
  } = methods;

  const handleClose = () => {
    if (isDirty) {
      setDiscardBottomSheet(true);
    } else {
      navigate(-1);
    }
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} sx={{ py: 3, minHeight: 320 }}>
          <Stack direction="row" spacing={2} sx={{ px: 2 }} justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton sx={{ p: 0 }} onClick={handleClose}>
                <Icon name="left-arrow-1" color="text.primary" />
              </IconButton>
              <Typography variant="subtitle1" color="text.primary">
                {isEdit
                  ? formatMessage(NormalPublicDetailsMessages.editUniversity)
                  : formatMessage(NormalPublicDetailsMessages.addUniversity)}
              </Typography>
            </Stack>
            <LoadingButton
              variant="contained"
              disabled={!isDirty || !isValid}
              color="primary"
              type="submit"
              loading={createIsLoading || updateIsLoading}
            >
              {isEdit ? formatMessage(GeneralMessagess.save) : formatMessage(GeneralMessagess.add)}
            </LoadingButton>
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              <FormattedMessage {...NormalPublicDetailsMessages.universityName} />*
            </Typography>
            {watch('collegeDto') ? (
              <Typography
                variant="body2"
                color="text.primary"
                sx={{ cursor: 'pointer' }}
                onClick={() => setNameBottomSheet(true)}
              >
                {watch('collegeDto')?.name}
              </Typography>
            ) : (
              <Box onClick={() => setNameBottomSheet(true)}>
                <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>
                  <FormattedMessage {...NormalPublicDetailsMessages.universityName} />
                </Typography>
              </Box>
            )}
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
                  }}
                  sx={{ ml: 1 }}
                >
                  &#215;
                </IconButton>
              </Typography>
            ) : (
              <Box onClick={() => setConcentrationBottomSheet(true)}>
                <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>
                  <FormattedMessage {...NormalPublicDetailsMessages.concenteration} />
                </Typography>
              </Box>
            )}
          </Stack>
          <Divider />
          <Stack direction="row" sx={{ px: 2 }} justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color={theme.palette.text.primary}>
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
                  }}
                  sx={{ ml: 1 }}
                >
                  &#215;
                </IconButton>
              </Typography>
            ) : (
              <Box
                onClick={() => {
                  setDateBottomSheet(true);
                  setIsEndDate(false);
                }}
              >
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
                color={watch('graduated') ? theme.palette.text.primary : theme.palette.text.secondary}
                sx={{ cursor: watch('graduated') ? 'pointer' : 'default' }}
              >
                {watch('graduated')
                  ? `${getMonthName(new Date(watch('endDate')))}, ${new Date(watch('endDate')).getFullYear()}`
                  : formatMessage(NormalPublicDetailsMessages.present)}
                <IconButton
                  onClick={() => {
                    setValue('endDate', undefined, { shouldValidate: true, shouldDirty: true });
                  }}
                  sx={{ ml: 1 }}
                >
                  &#215;
                </IconButton>
              </Typography>
            ) : (
              <Box
                onClick={() => {
                  watch('graduated') && setDateBottomSheet(true);
                  setIsEndDate(true);
                }}
              >
                <Typography
                  variant="body2"
                  color={theme.palette.text.secondary}
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
          {!isEdit ? (
            <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
              <Box />
              <Button
                variant="outlined"
                startIcon={<Icon name="Earth" size="18" color="text.primary" />}
                endIcon={<Icon name="down-arrow" size="16" color="text.primary" />}
                onClick={() => setAudienceBottomSheet(true)}
              >
                <Typography color={theme.palette.text.primary}>
                  {Object.keys(AudienceEnum)[Object.values(AudienceEnum).indexOf(watch('audience') as AudienceEnum)]}
                </Typography>
              </Button>
            </Stack>
          ) : (
            <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 3 }}>
              <Button color="error" onClick={() => setDeleteBottomSheet(true)}>
                <Typography variant="button">
                  <FormattedMessage {...GeneralMessagess.delete} />
                </Typography>
              </Button>

              <Button
                variant="outlined"
                startIcon={<Icon name="Earth" size="18" color="text.primary" />}
                endIcon={<Icon name="down-arrow" size="16" color="text.primary" />}
                onClick={() => setAudienceBottomSheet(true)}
              >
                <Typography color={theme.palette.text.primary}>
                  {Object.keys(AudienceEnum)[Object.values(AudienceEnum).indexOf(watch('audience') as AudienceEnum)]}
                </Typography>
              </Button>
            </Stack>
          )}
        </Stack>
      </FormProvider>

      <BottomSheet
        open={concentrationBottomSheet}
        onDismiss={() => setConcentrationBottomSheet(false)}
        snapPoints={({ maxHeight }) => maxHeight / 2}
      >
        <UniversityConcentration
          onChange={(value) => {
            setValue('concentrationDto', value, { shouldDirty: true, shouldValidate: true });
            setConcentrationBottomSheet(false);
          }}
        />
      </BottomSheet>
      <BottomSheet open={deleteBottomSheet} onDismiss={() => setDeleteBottomSheet(false)}>
        <UniDelete id={watch('id')} />
      </BottomSheet>
      <BottomSheet open={dateBottomSheet} onDismiss={() => setDateBottomSheet(false)}>
        <UniDate
          endDate={watch('endDate')}
          startDate={watch('startDate')}
          isEndDate={isEndDate}
          onChange={(value) => {
            setValue(`${isEndDate ? 'endDate' : 'startDate'}`, value, { shouldDirty: true, shouldValidate: true });
            setDateBottomSheet(false);
          }}
        />
      </BottomSheet>
      <BottomSheet open={discardBottomSheet} onDismiss={() => setDiscardBottomSheet(false)}>
        <UniDiscard
          isValid={isValid}
          loading={createIsLoading || updateIsLoading}
          onSubmit={() => onSubmit(getValues())}
        />
      </BottomSheet>
      <BottomSheet
        open={nameBottomSheet}
        onDismiss={() => setNameBottomSheet(false)}
        snapPoints={({ maxHeight }) => maxHeight / 2}
      >
        <UniversityName
          onChange={(val) => {
            setValue('collegeDto', val, { shouldDirty: true, shouldValidate: true });
            setNameBottomSheet(false);
          }}
        />
      </BottomSheet>
      <BottomSheet open={audienceBottomSheet} onDismiss={() => setAudienceBottomSheet(false)}>
        <SelectAudienceUniversity
          value={watch('audience') as AudienceEnum}
          onChange={(val) => {
            setValue('audience', val, { shouldDirty: true, shouldValidate: true });
            setAudienceBottomSheet(false);
          }}
        />
      </BottomSheet>
    </>
  );
}
