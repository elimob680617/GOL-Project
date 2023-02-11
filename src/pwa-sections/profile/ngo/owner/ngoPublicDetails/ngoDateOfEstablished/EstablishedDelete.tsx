import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Divider, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useUpdateOrganizationUserField2Mutation } from 'src/_graphql/profile/ngoPublicDetails/mutations/updateOrgUser.generated';
import { Icon } from 'src/components/Icon';
import GeneralMessagess from 'src/language/general.messages';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch } from 'src/store';
import { emptyLocation } from 'src/store/slices/profile/userLocation-slice';
import { OrgUserFieldEnum } from 'src/types/serverTypes';

import NgoPublicDetailsMessages from '../NgoPublicDetailsPwa.messages';

function EstablishmentDelete() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const [updateOrganization, { isLoading }] = useUpdateOrganizationUserField2Mutation();

  const handleClickDeleteButton = async () => {
    const resDataDelete: any = await updateOrganization({
      filter: {
        dto: {
          field: OrgUserFieldEnum.EstablishmentDate,
          establishmentDate: null,
        },
      },
    });
    if (resDataDelete?.data?.deleteLocation?.isSuccess) {
      enqueueSnackbar(formatMessage(NgoPublicDetailsMessages.ngoDateofEstablishDeleteMessage), { variant: 'success' });
      dispatch(emptyLocation());
    }
    navigate(PATH_APP.profile.ngo.publicDetails.main);
  };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            <FormattedMessage {...NgoPublicDetailsMessages.ngoDateofEstablishDeleteAlert} />
          </Typography>
        </Box>
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
          <Link to="/profile/public-details">
            <Typography variant="body2" color="text.primary">
              <FormattedMessage {...GeneralMessagess.discardWord} />
            </Typography>
          </Link>
        </Box>
      </Stack>
    </Stack>
  );
}

export default EstablishmentDelete;
