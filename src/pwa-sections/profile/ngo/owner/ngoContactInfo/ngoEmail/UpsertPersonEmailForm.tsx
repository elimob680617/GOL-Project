import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';

import { LoadingButton } from '@mui/lab';
import { Box, Button, Divider, IconButton, Stack, Typography } from '@mui/material';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { useUpsertUserEmailMutation } from 'src/_graphql/profile/contactInfo/mutations/upsertUserEmail.generated';
import { Icon } from 'src/components/Icon';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import NormalAndNgoProfileContactInfoMessages from 'src/pwa-sections/profile/UserProfileContactInfoPwa.messages';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { addedEmail, emptyEmail, userEmailsSelector } from 'src/store/slices/profile/contactInfo-slice-eli';
import { AudienceEnum, VerificationStatusEnum } from 'src/types/serverTypes';

import EmailDelete from './EmailDelete';
import SelectAudience from './SelectAudience';

type EmailValueProps = {
  id?: string;
  email: string;
  audience: AudienceEnum;
  status?: VerificationStatusEnum;
};

function UpsertPersonEmailForm() {
  const { enqueueSnackbar } = useSnackbar();
  const [upsertUserEmail, { isLoading }] = useUpsertUserEmailMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const personEmail = useSelector(userEmailsSelector);
  const [deleteEmail, setDeleteEmail] = useState(false);
  const [selectAudience, setSelectAudience] = useState(false);
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (!personEmail) navigate(PATH_APP.profile.ngo.contactInfo.root);
  }, [personEmail, navigate]);

  const EmailSchema = Yup.object().shape({
    email: Yup.string().email().required(formatMessage(NormalAndNgoProfileContactInfoMessages.fillThisField)),
  });

  const defaultValues = {
    id: personEmail?.id,
    email: personEmail?.email || '',
    audience: personEmail?.audience || AudienceEnum.Public,
    status: personEmail?.status || VerificationStatusEnum.Pending,
  };

  const methods = useForm<EmailValueProps>({
    mode: 'onSubmit',
    resolver: yupResolver(EmailSchema),
    defaultValues,
  });

  const { getValues, handleSubmit, setValue, watch } = methods;

  // const handleNavigation = (url: string) => {
  //   dispatch(addedEmail(getValues()));
  //   navigate(url);
  // };

  // function closeHandler() {
  //   if (personEmail?.id) {
  //     navigate('/profile/ngo');
  //   } else {
  //     dispatch(emptyEmail({ audience: AudienceEnum.Public }));
  //     navigate(PATH_APP.profile.ngo.contactInfo.list);
  //   }
  // }

  const onSubmit = async (data: EmailValueProps) => {
    const { id, email, audience, status } = data;
    const resData: any = await upsertUserEmail({
      filter: {
        dto: {
          id: id,
          email: email,
          audience: audience,
        },
      },
    });

    if (resData.data?.upsertUserEmail?.isSuccess) {
      dispatch(
        addedEmail({
          status,
          id,
          email,
          audience,
        }),
      );
      navigate(PATH_APP.profile.ngo.contactInfo.email.verify);
      // dispatch(addedEmail({ audience: AudienceEnum.Public }));
    }
    if (!resData.data?.upsertUserEmail?.isSuccess) {
      enqueueSnackbar(resData.data?.upsertUserEmail?.messagingKey, { variant: 'error' });
    }
  };

  const changeAudienceHandler = async (value: AudienceEnum) => {
    setValue('audience', value, { shouldDirty: true });
    setSelectAudience(false);
    if (personEmail?.id) {
      await upsertUserEmail({
        filter: {
          dto: {
            email: personEmail.email,
            id: personEmail.id,
            audience: value as AudienceEnum,
          },
        },
      });
      navigate(-1);
    }
  };

  const handleBackRoute = () => {
    dispatch(emptyEmail({ audience: AudienceEnum.Public }));
    navigate(PATH_APP.profile.ngo.contactInfo.root);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} sx={{ py: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            <IconButton sx={{ p: 0, mr: 2 }} onClick={handleBackRoute}>
              <Icon name="left-arrow-1" />
            </IconButton>
            {!personEmail?.id
              ? formatMessage(NormalAndNgoProfileContactInfoMessages.addEmail)
              : formatMessage(NormalAndNgoProfileContactInfoMessages.editEmail)}
          </Typography>
          {!personEmail?.id ? (
            <LoadingButton type="submit" variant="contained" loading={isLoading}>
              <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.add} />
            </LoadingButton>
          ) : (
            <></>
          )}
        </Stack>
        <Divider />

        <Stack spacing={2} sx={{ px: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.email} />
          </Typography>
          {!personEmail?.id ? (
            <RHFTextField
              autoComplete="Email"
              placeholder="Email"
              type="text"
              name={formatMessage(NormalAndNgoProfileContactInfoMessages.email)}
              size="small"
            />
          ) : (
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.primary">
                  {personEmail?.email}
                </Typography>
                <Typography variant="caption" color="primary">
                  {personEmail?.status}
                </Typography>
              </Box>
            </Stack>
          )}
        </Stack>
        <Divider />

        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{
            justifyContent: 'space-between',
            px: 2,
            ...(personEmail?.id && {
              justifyContent: 'space-between',
            }),
          }}
        >
          {personEmail?.id && (
            <Button variant="text" color="error" onClick={() => setDeleteEmail(true)}>
              <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.delete} />
            </Button>
          )}
          <Box />
          <LoadingButton
            loading={!!personEmail?.id && (isLoading as boolean)}
            variant="outlined"
            startIcon={<Icon name="Earth" />}
            onClick={() => {
              dispatch(addedEmail(getValues()));
              setSelectAudience(true);
            }}
            endIcon={<Icon name="down-arrow" color="grey.500" />}
          >
            <Typography color="text.primary">
              {Object.keys(AudienceEnum)
                [Object.values(AudienceEnum).indexOf(watch('audience'))]?.replace(/([A-Z])/g, ' $1')
                .trim()}
            </Typography>
          </LoadingButton>
        </Stack>
      </Stack>
      <BottomSheet open={deleteEmail} onDismiss={() => setDeleteEmail(false)}>
        <EmailDelete />
      </BottomSheet>
      <BottomSheet open={selectAudience} onDismiss={() => setSelectAudience(false)}>
        <SelectAudience
          onChange={(value) => {
            changeAudienceHandler(value);
          }}
          audience={watch('audience')}
        />
      </BottomSheet>
    </FormProvider>
  );
}

export default UpsertPersonEmailForm;
