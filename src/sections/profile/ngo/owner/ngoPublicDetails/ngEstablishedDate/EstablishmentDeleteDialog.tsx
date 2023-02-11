import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useUpdateOrganizationUserField2Mutation } from 'src/_graphql/profile/ngoPublicDetails/mutations/updateOrgUser.generated';
import { Icon } from 'src/components/Icon';
import GeneralMessagess from 'src/language/general.messages';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch } from 'src/store';
import { ngoEstablishmentDateWasEmpty } from 'src/store/slices/profile/ngoPublicDetails-slice';
import { OrgUserFieldEnum } from 'src/types/serverTypes';
import sleep from 'src/utils/sleep';

import NgoPublicDetailsMessages from '../NgoPublicDetails.messages';

function EstablishmentDeleteDialog() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const [upsertEstablishmentDateNgoUser, { isLoading }] = useUpdateOrganizationUserField2Mutation();

  const handleClickDeleteButton = async () => {
    const resDataDelete: any = await upsertEstablishmentDateNgoUser({
      filter: {
        dto: {
          field: OrgUserFieldEnum.EstablishmentDate,
          establishmentDate: null,
        },
      },
    });
    if (resDataDelete?.data?.updateOrganizationUserField?.isSuccess) {
      enqueueSnackbar(formatMessage(NgoPublicDetailsMessages.ngoDateofEstablishDeleteMessage), { variant: 'success' });
      navigate(PATH_APP.profile.ngo.publicDetails.main);
      await sleep(1500);
      dispatch(ngoEstablishmentDateWasEmpty());
    }
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => navigate(-1)}>
      <Stack spacing={2} sx={{ minWidth: 600, minHeight: 194, py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => navigate(-1)}>
              <Icon name="left-arrow-1" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              <FormattedMessage {...NgoPublicDetailsMessages.ngoDateofEstablishDeleteAlert} />
            </Typography>
          </Box>
          <Link to={PATH_APP.profile.ngo.publicDetails.main}>
            <IconButton>
              <Icon name="Close-1" />
            </IconButton>
          </Link>
        </Stack>
        <Divider />
        <Stack spacing={1} sx={{ px: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
            <Icon name="trash" color="error.main" />
            <LoadingButton variant="text" loading={isLoading} sx={{ p: 0 }}>
              <Typography variant="body2" color="error" onClick={() => handleClickDeleteButton()}>
                <FormattedMessage {...NgoPublicDetailsMessages.ngoDateofEstablishDelete} />
              </Typography>
            </LoadingButton>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }}>
            <Icon name="Close-1" />
            <Link to={PATH_APP.profile.ngo.publicDetails.main}>
              <Typography variant="body2" color="text.primary">
                <FormattedMessage {...GeneralMessagess.discardWord} />
              </Typography>
            </Link>
          </Box>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default EstablishmentDeleteDialog;
