import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';

import { LoadingButton } from '@mui/lab';
import { Box, Button, Divider, IconButton, Stack, Typography, styled, useTheme } from '@mui/material';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useUpsertPhoneNumberMutation } from 'src/_graphql/profile/contactInfo/mutations/upsertPhoneNumber.generated';
import { Icon } from 'src/components/Icon';
import PhoneNumber from 'src/components/PhoneNumber';
import { FormProvider } from 'src/components/hook-form';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch } from 'src/store';
import {
  phoneNumberAdded,
  phoneNumberCleared,
  userPhoneNumberSelector,
} from 'src/store/slices/profile/userPhoneNumber-slice';
import { UserPhoneNumberType } from 'src/types/profile/userPhoneNumber';
import { AudienceEnum } from 'src/types/serverTypes';

import ConfirmDeletePhoneNumber from './ConfirmDeletePhoneNumber';
import SelectAudiencePhoneNumber from './SelectAudience';

const ParentPhoneInputStyle = styled(Stack)(({ theme }) => ({
  justifyContent: 'space-between',
  paddingRight: theme.spacing(2),
  paddingLeft: theme.spacing(2),
  paddingBottom: 95,
  display: 'flex',
  //   alignItems: 'center',
  height: 40,
  position: 'relative',
  borderRadius: 8,
  '&:focus-within': {
    // border: ({ isError }) => (isError ? `2px solid ${error.main}` : `2px solid ${primary[900]}`),
  },
}));

function AddPhoneNumber() {
  const navigate = useNavigate();
  const theme = useTheme();
  const userPhoneNumber = useSelector(userPhoneNumberSelector);
  const [addUserPhoneNumber, { isLoading }] = useUpsertPhoneNumberMutation();
  const dispatch = useDispatch();
  const [deletePhoneNumber, setDeletePhoneNumber] = useState(false);
  const [selectAudience, setSelectAudience] = useState(false);

  useEffect(() => {
    if (!userPhoneNumber) navigate(PATH_APP.profile.user.contactInfo.root);
  }, [userPhoneNumber, navigate]);

  const PhoneNumberSchema = Yup.object().shape({
    phoneNumber: Yup.string().test('phoneNumber', 'Invalid Phone Number', function (value: any) {
      const isValidPhone = isValidPhoneNumber(value || '');
      if (!isValidPhone || value?.length < 10) {
        return false;
      }
      return true;
    }),
  });

  const defaultValues = {
    id: userPhoneNumber?.id,
    audience: userPhoneNumber?.audience,
    phoneNumber: userPhoneNumber?.phoneNumber || '',
    status: userPhoneNumber?.status,
    verificationCode: userPhoneNumber?.verificationCode,
  };

  const methods = useForm<UserPhoneNumberType>({
    resolver: yupResolver(PhoneNumberSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: UserPhoneNumberType) => {
    const { id, phoneNumber, audience, status } = data;

    const resData: any = await addUserPhoneNumber({
      filter: {
        dto: {
          id: id,
          phoneNumber: phoneNumber,
          audience: audience,
        },
      },
    });

    if (resData.data?.upsertPhoneNumber?.isSuccess) {
      dispatch(
        phoneNumberAdded({
          status,
          id,
          phoneNumber,
          audience,
        }),
      );
      navigate(PATH_APP.profile.user.contactInfo.phoneNumber.verify);
    }
  };

  const handleBackRoute = () => {
    dispatch(phoneNumberCleared());
    navigate(PATH_APP.profile.user.contactInfo.root);
  };

  const changeAudienceHandler = async (value: AudienceEnum) => {
    setValue('audience', value, { shouldDirty: true });
    setSelectAudience(false);
    if (userPhoneNumber?.id) {
      await addUserPhoneNumber({
        filter: {
          dto: {
            phoneNumber: userPhoneNumber.phoneNumber,
            id: userPhoneNumber.id,
            audience: value as AudienceEnum,
          },
        },
      });
      navigate(-1);
    }
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} sx={{ py: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
            <Stack spacing={2} direction="row" alignItems="center">
              <IconButton sx={{ p: 0 }} onClick={handleBackRoute}>
                <Icon name="left-arrow-1" color="text.primary" />
              </IconButton>
              <Typography variant="subtitle1" color="text.primary">
                {userPhoneNumber?.id ? 'Edit Phone Number' : 'Add Phone Number'}
              </Typography>
            </Stack>
            {!userPhoneNumber?.id ? (
              <LoadingButton type="submit" variant="contained" loading={isLoading}>
                Add
              </LoadingButton>
            ) : (
              <></>
            )}
          </Stack>
          <Divider />
          <ParentPhoneInputStyle>
            <Stack sx={{ mt: 1 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Phone Number
              </Typography>
              {!userPhoneNumber?.id ? (
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <PhoneNumber
                      value={field?.value as string}
                      isError={!!errors?.phoneNumber}
                      placeHolder="Enter phone number"
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  )}
                />
              ) : (
                <Stack direction="row" justifyContent="space-between" sx={{ mt: 1, paddingBottom: 0 }}>
                  <Typography variant="body2">{userPhoneNumber.phoneNumber}</Typography>
                  <Typography variant="body2" color="primary">
                    {userPhoneNumber.status}
                  </Typography>
                </Stack>
              )}
            </Stack>
            {!!errors?.phoneNumber && (
              <Typography component="div" variant="caption" sx={{ color: 'error.main', mt: 0.5 }}>
                {errors?.phoneNumber?.message}
              </Typography>
            )}
          </ParentPhoneInputStyle>
          <Divider sx={{ mt: !!errors?.phoneNumber ? '32px !important' : '16px !important' }} />
          {!userPhoneNumber?.id ? (
            <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
              <Box />
              <Button
                variant="outlined"
                startIcon={<Icon name="Earth" size="18" color="text.primary" />}
                onClick={() => setSelectAudience(true)}
                endIcon={<Icon name="down-arrow" size="16" color="text.primary" />}
              >
                <Typography color={theme.palette.text.primary}>
                  {Object.keys(AudienceEnum)[Object.values(AudienceEnum).indexOf(watch('audience') as AudienceEnum)]}
                </Typography>
              </Button>
            </Stack>
          ) : (
            <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 3 }}>
              <Button variant="text" color="error" onClick={() => setDeletePhoneNumber(true)}>
                Delete
              </Button>
              <LoadingButton
                loading={!!userPhoneNumber?.id && isLoading}
                variant="outlined"
                startIcon={<Icon name="Earth" size="18" color="text.primary" />}
                onClick={() => setSelectAudience(true)}
                endIcon={<Icon name="down-arrow" size="16" color="text.primary" />}
              >
                <Typography color={theme.palette.text.primary}>
                  {Object.keys(AudienceEnum)[Object.values(AudienceEnum).indexOf(watch('audience') as AudienceEnum)]}
                </Typography>
              </LoadingButton>
            </Stack>
          )}
        </Stack>
        <BottomSheet open={deletePhoneNumber} onDismiss={() => setDeletePhoneNumber(false)}>
          <ConfirmDeletePhoneNumber />
        </BottomSheet>
        <BottomSheet open={selectAudience} onDismiss={() => setSelectAudience(false)}>
          <SelectAudiencePhoneNumber
            onChange={(value) => {
              changeAudienceHandler(value);
            }}
            audience={watch('audience') as AudienceEnum}
          />
        </BottomSheet>
      </FormProvider>
    </>
  );
}

export default AddPhoneNumber;
