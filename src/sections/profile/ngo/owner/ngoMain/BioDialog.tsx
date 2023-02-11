import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useUpdateOrganizationUserBioMutation } from 'src/_graphql/profile/mainProfileNOG/mutations/updateOrganizationUserBio.generated';
import { Icon } from 'src/components/Icon';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import useAuth from 'src/hooks/useAuth';
import { PATH_APP } from 'src/routes/paths';
import ProfileMainMessage from 'src/sections/profile/components/profileMain.messages';
import { useDispatch } from 'src/store';
import { bioCleared, bioSelector } from 'src/store/slices/profile/ngoProfileBio-slice';
import { OrganizationUserBioInput } from 'src/types/serverTypes';

//.........................................................
const RootStyle = styled(Box)(({ theme }) => ({
  with: 600,
}));
const RHFTextFieldStyle = styled(RHFTextField)(({ theme }) => ({
  width: '100%',
  height: 470,
  border: 'none',
  overflowY: 'auto',
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

function BioDialog() {
  const router = useNavigate();
  const { initialize } = useAuth();
  const ngoBio = useSelector(bioSelector);
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const [userBio, { isLoading }] = useUpdateOrganizationUserBioMutation();
  const onSubmit = async (data: OrganizationUserBioInput) => {
    const result: any = await userBio({
      filter: {
        dto: {
          body: data?.body,
        },
      },
    });
    if (result.data?.updateOrganizationUserBio?.isSuccess) {
      dispatch(bioCleared());
    }
    // router.push(PATH_APP.profile.ngo.root);
    handleClose();
  };

  const defaultValues = {
    body: ngoBio,
  };
  const methods = useForm<OrganizationUserBioInput>({
    defaultValues,
    mode: 'onChange',
  });

  const {
    watch,
    handleSubmit,
    formState: { isDirty },
  } = methods;

  function handleClose() {
    const fromWizard = localStorage.getItem('fromWizard') === 'true';
    const fromHomePage = localStorage.getItem('fromHomePage') === 'true';
    if (fromWizard) {
      initialize();
      localStorage.removeItem('fromWizard');
      if (fromHomePage) {
        router(PATH_APP.home.wizard.wizardList);
      } else {
        router(PATH_APP.profile.ngo.wizard.wizardList);
      }
    } else {
      router(PATH_APP.profile.ngo.root);
    }
  }

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={handleClose}>
      <RootStyle>
        <Stack p={2} direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1">
            <FormattedMessage {...ProfileMainMessage.bio} />
          </Typography>
          <IconButton onClick={handleClose}>
            <Icon name="Close-1" />
          </IconButton>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ p: 2, height: 490 }}>
            <RHFTextFieldStyle
              size="small"
              multiline
              name="body"
              variant="outlined"
              placeholder={formatMessage(ProfileMainMessage.wantToTalkAbout)}
              inputProps={{ maxLength: 1000 }}
              // onBlur={() => setValue('descView', true)}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              sx={{
                '& fieldset': {
                  border: 'unset',
                },
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'end', p: 2 }}>
            <LoadingButton
              size="large"
              variant="contained"
              sx={{ px: 5 }}
              type="submit"
              disabled={!isDirty || !(watch('body') || ngoBio)}
              loading={isLoading}
            >
              <Typography variant="button" sx={{ color: 'common.white' }}>
                <FormattedMessage {...ProfileMainMessage.save} />
              </Typography>
            </LoadingButton>
          </Box>
        </FormProvider>
      </RootStyle>
    </Dialog>
  );
}

export default BioDialog;
