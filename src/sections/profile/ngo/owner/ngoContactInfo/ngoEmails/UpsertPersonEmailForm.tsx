import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { useUpsertUserEmailMutation } from 'src/_graphql/profile/contactInfo/mutations/upsertUserEmail.generated';
import { Icon } from 'src/components/Icon';
import { Audience } from 'src/components/audience';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { PATH_APP } from 'src/routes/paths';
import NormalAndNgoProfileContactInfoMessages from 'src/sections/profile/UserProfileContactInfo.messages';
import { useDispatch, useSelector } from 'src/store';
import { addedEmail, emptyEmail, userEmailsSelector } from 'src/store/slices/profile/contactInfo-slice-eli';
import { AudienceEnum, FeatureAudienceEnum, VerificationStatusEnum } from 'src/types/serverTypes';
import sleep from 'src/utils/sleep';

type EmailValueProps = {
  id?: string;
  email: string;
  audience: AudienceEnum;
  status?: VerificationStatusEnum;
};

function UpsertPersonEmailForm() {
  const [openAudience, setOpenAudience] = useState<boolean>(false);

  const router = useNavigate();
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const personEmail = useSelector(userEmailsSelector);
  const [upsertUserEmail, { isLoading }] = useUpsertUserEmailMutation();

  useEffect(() => {
    if (!personEmail) router(PATH_APP.profile.ngo.contactInfo.root);
  }, [personEmail, router]);

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
    // reValidateMode: 'onChange',
    resolver: yupResolver(EmailSchema),
    defaultValues,
  });

  const { handleSubmit } = methods;

  const closeHandler = async () => {
    if (personEmail?.id) {
      router(PATH_APP.profile.ngo.root);
    } else {
      router(PATH_APP.profile.ngo.contactInfo.root);
      await sleep(1500);
      dispatch(emptyEmail({ audience: AudienceEnum.Public }));
    }
  };

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

    if (resData?.data?.upsertUserEmail?.isSuccess) {
      dispatch(
        addedEmail({
          status,
          id,
          email,
          audience,
        }),
      );

      router(PATH_APP.profile.ngo.contactInfo.email.verify);
    }
    if (!resData?.data?.upsertUserEmail?.isSuccess) {
      enqueueSnackbar(resData?.data?.upsertUserEmail?.messagingKey, { variant: 'error' });
    }
  };

  const handleBackRoute = async () => {
    router(PATH_APP.profile.ngo.contactInfo.root);
    await sleep(1500);
    dispatch(emptyEmail({ audience: AudienceEnum.Public }));
  };

  return (
    <>
      <Dialog fullWidth={true} open={true} keepMounted onClose={handleBackRoute}>
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
                <IconButton onClick={handleBackRoute}>
                  <Icon name="Close-1" />
                </IconButton>
              ) : (
                <IconButton onClick={closeHandler}>
                  <Icon name="Close-1" />
                </IconButton>
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
                  placeholder={formatMessage(NormalAndNgoProfileContactInfoMessages.email)}
                  type="text"
                  name="email"
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
                  justifyContent: 'unset',
                  px: 6,
                }),
              }}
            >
              {personEmail?.id && (
                <Link to={PATH_APP.profile.ngo.contactInfo.email.delete}>
                  <Button variant="text" color="error">
                    <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.delete} />
                  </Button>
                </Link>
              )}

              <Button
                variant="outlined"
                startIcon={<Icon name="Earth" />}
                endIcon={<Icon name="down-arrow" />}
                onClick={() => {
                  setOpenAudience(true);
                }}
              >
                <Typography color="text.primary">
                  {Object.keys(AudienceEnum)
                    [Object.values(AudienceEnum).indexOf(personEmail?.audience as AudienceEnum)]?.replace(
                      /([A-Z])/g,
                      ' $1',
                    )
                    .trim()}
                </Typography>
              </Button>

              {!personEmail?.id && (
                <LoadingButton type="submit" variant="contained" loading={isLoading}>
                  <FormattedMessage {...NormalAndNgoProfileContactInfoMessages.add} />
                </LoadingButton>
              )}
            </Stack>
          </Stack>
        </FormProvider>
      </Dialog>
      {openAudience && (
        <Audience
          feature={FeatureAudienceEnum.UserEmail}
          value={personEmail?.audience as AudienceEnum}
          onClose={setOpenAudience}
          open={openAudience}
          onChange={(val: any) => {
            dispatch(
              addedEmail({
                ...personEmail,
                audience: val,
              }),
            );
          }}
        />
      )}
    </>
  );
}

export default UpsertPersonEmailForm;
