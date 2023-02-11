import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useAddProjectMutation } from 'src/_graphql/profile/mainProfileNOG/mutations/addProject.generated';
import { useUpdateProjectMutation } from 'src/_graphql/profile/mainProfileNOG/mutations/updateProject.generated';
import { useUpdateProjectMediaMutation } from 'src/_graphql/profile/mainProfileNOG/mutations/updateProjectMedia.generated';
import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { emptyProject, ngoProjectSelector } from 'src/store/slices/profile/ngoProject-slice';

import NgoProjectMessages from './NgoProject.messages';

function ProjectDiscardDialog() {
  const { formatMessage } = useIntl();
  const router = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const projectData = useSelector(ngoProjectSelector);
  const [addProjectMutate, { isLoading: addLoading }] = useAddProjectMutation();
  const [updateProjectMutate, { isLoading: updateLoading }] = useUpdateProjectMutation();
  const [updateProjectMedia] = useUpdateProjectMediaMutation();
  function discardHandler() {
    dispatch(emptyProject());
    router(PATH_APP.profile.ngo.project.list);
  }

  const saveHandler = async () => {
    if (!projectData?.isValid) {
      router(-1);
    } else {
      const startDate = new Date(projectData?.startDate);
      let endDate;
      if (projectData?.stillWorkingThere) endDate = undefined;
      else if (projectData?.endDate) {
        const date = new Date(projectData?.endDate);
        endDate = date.getFullYear() + '-' + date.getMonth() + 1 + '-01';
      }

      if (projectData?.id) {
        const res: any = await updateProjectMutate({
          filter: {
            dto: {
              id: projectData?.id,
              audience: projectData?.audience,
              description: projectData?.description,
              stillWorkingThere: projectData?.stillWorkingThere,
              title: projectData?.title,
              cityId: projectData?.cityDto?.id,
              startDate: startDate.getFullYear() + '-' + ('0' + (startDate.getMonth() + 1)).slice(-2) + '-01',
              endDate: endDate,
            },
          },
        });
        if (res?.data?.updateProject?.isSuccess) {
          const newId = res?.data?.addProject?.listDto?.items?.[0];
          if (!!projectData?.projectMedias?.length)
            await updateProjectMedia({
              filter: {
                dto: {
                  projectId: newId?.id,
                  urls: projectData?.projectMedias?.map((item) => item?.url) as string[],
                },
              },
            });
          enqueueSnackbar(formatMessage(NgoProjectMessages.updateSuccessfully), { variant: 'success' });
          dispatch(emptyProject());
          router(PATH_APP.profile.ngo.project.list);
        }
      } else {
        const res: any = await addProjectMutate({
          filter: {
            dto: {
              id: projectData?.id,
              audience: projectData?.audience,
              description: projectData?.description,
              stillWorkingThere: projectData?.stillWorkingThere,
              title: projectData?.title,
              cityId: projectData?.cityDto?.id,
              startDate: startDate.getFullYear() + '-' + ('0' + (startDate.getMonth() + 1)).slice(-2) + '-01',
              endDate: endDate,
            },
          },
        });

        if (res?.data?.addProject?.isSuccess) {
          const newId = res?.data?.addProject?.listDto?.items?.[0];
          if (!!projectData?.projectMedias?.length)
            await updateProjectMedia({
              filter: {
                dto: {
                  projectId: newId?.id,
                  urls: projectData?.projectMedias?.map((item) => item?.url) as string[],
                },
              },
            });
          enqueueSnackbar(formatMessage(NgoProjectMessages.experienceSuccessfully), { variant: 'success' });
          dispatch(emptyProject());
          router(PATH_APP.profile.ngo.project.list);
        }
      }
    }
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => router(-1)}>
      <Stack spacing={2} sx={{ minWidth: 600, minHeight: 194, py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => router(-1)}>
              <Icon name="left-arrow-1" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              {projectData?.isValid
                ? formatMessage(NgoProjectMessages.saveChangeMessage)
                : formatMessage(NgoProjectMessages.continueMessage)}
            </Typography>
          </Box>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <LoadingButton
            loading={addLoading || updateLoading}
            startIcon={<Icon name="Save" />}
            variant="text"
            color="inherit"
            onClick={saveHandler}
            sx={{ justifyContent: 'flex-start' }}
          >
            <Typography variant="body2" color="text.primary">
              {projectData?.isValid
                ? formatMessage(NgoProjectMessages.saveChange)
                : formatMessage(NgoProjectMessages.continue)}
            </Typography>
          </LoadingButton>
          <Button
            variant="text"
            color="error"
            startIcon={<Icon name="Close-1" color="error.main" />}
            onClick={discardHandler}
            sx={{ justifyContent: 'flex-start' }}
          >
            <Typography variant="body2" color="error">
              <FormattedMessage {...NgoProjectMessages.discard} />
            </Typography>
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default ProjectDiscardDialog;
