//mui
import { useEffect } from 'react';
//...
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useSnackbar } from 'notistack';
import { useUpdateOrganizationUserBioMutation } from 'src/_graphql/profile/mainProfileNOG/mutations/updateOrganizationUserBio.generated';
//services
import { useLazyGetUserDetailQuery } from 'src/_graphql/profile/publicDetails/queries/getUser.generated';
import { Icon } from 'src/components/Icon';
//component
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import useAuth from 'src/hooks/useAuth';
import ProfileMainMessage from 'src/pwa-sections/profile/components/profileMain.messages';
import { OrganizationUserBioInput } from 'src/types/serverTypes';

//.........................................................

const RHFTextFieldStyle = styled(RHFTextField)(({ theme }) => ({
  width: '100%',
  border: 'none',
  overflowX: 'auto',
  scrollbarColor: `${theme.palette.grey[300]} ${theme.palette.grey[0]}`,
  scrollbarWidth: 'auto',
  '&::-webkit-scrollbar': {
    width: 12,
  },

  '&::-webkit-scrollbar-track': {
    background: theme.palette.grey[0],
    borderRadius: 8,
  },

  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.grey[300],
    borderRadius: 10,
    border: `4px solid ${theme.palette.grey[0]}`,
  },
}));

function BioNgo() {
  const { initialize } = useAuth();
  // mutations
  const [updateOrganizationUserBio, { isLoading }] = useUpdateOrganizationUserBioMutation();
  //  query !!
  const [getUserDetail, { data: userData }] = useLazyGetUserDetailQuery();
  const navigate = useNavigate();
  // tools
  const { formatMessage } = useIntl();
  const { id } = useParams();
  const isEdit = !!id;
  const ngo = userData?.getUser?.listDto?.items?.[0];
  const bioData = ngo?.organizationUserDto?.bio;
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  // query !
  useEffect(() => {
    if (!!id) getUserDetail({ filter: { ids: [id] } });
  }, [getUserDetail, id]);

  const onSubmit = async (data: OrganizationUserBioInput) => {
    const resBio: any = await updateOrganizationUserBio({
      filter: {
        dto: {
          body: data.body,
        },
      },
    });

    if (resBio?.data?.updateOrganizationUserBio?.isSuccess) {
      enqueueSnackbar('Bio successfully Added', { variant: 'success' });
    }
    initialize();
    navigate(-1);
  };

  const methods = useForm<OrganizationUserBioInput>({
    defaultValues: {
      ...BioNgo,
    },
    mode: 'onBlur',
  });

  const {
    watch,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = methods;
  // useEffect
  useEffect(() => {
    if (isEdit)
      reset({
        body: bioData,
      });
  }, [ngo, isEdit, reset, bioData]);

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack p={2} direction="row" alignItems="center" justifyContent="space-between">
          <Stack spacing={2} direction="row" alignItems="center">
            <IconButton sx={{ p: 0 }} onClick={() => navigate(-1)}>
              <Icon name="left-arrow-1" color="text.primary" />
            </IconButton>
            <Typography variant="subtitle1">
              <FormattedMessage {...ProfileMainMessage.bio} />
            </Typography>
          </Stack>

          <LoadingButton
            loading={isLoading}
            type="submit"
            variant="contained"
            disabled={isEdit ? !isDirty : !isDirty || !watch('body')}
            color="primary"
          >
            <Typography variant="button" sx={{ color: theme.palette.common.white }}>
              <FormattedMessage {...ProfileMainMessage.save} />
            </Typography>
          </LoadingButton>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ width: '100%' }}>
          <RHFTextFieldStyle
            sx={{
              '& fieldset': {
                border: 'unset',
              },
            }}
            size="small"
            multiline
            name="body"
            placeholder={formatMessage(ProfileMainMessage.wantToTalkAbout)}
            inputProps={{ maxLength: 1000 }}
            autoFocus
            // maxRows={5}
          />
        </Box>
      </FormProvider>
    </>
  );
}

export default BioNgo;
