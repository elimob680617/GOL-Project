import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Divider, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useUpdateOrganizationUserField2Mutation } from 'src/_graphql/profile/ngoPublicDetails/mutations/updateOrgUser.generated';
import { Icon } from 'src/components/Icon';
import GeneralMessagess from 'src/language/general.messages';
import { PATH_APP } from 'src/routes/paths';
import { OrgUserFieldEnum } from 'src/types/serverTypes';

import NgoPublicDetailsMessages from '../NgoPublicDetailsPwa.messages';

export default function SizeDelete() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const [updateOrganization, { isLoading }] = useUpdateOrganizationUserField2Mutation();

  const handleClickDeleteButton = async () => {
    const resDataDelete: any = await updateOrganization({
      filter: {
        dto: {
          field: OrgUserFieldEnum.Size,
          numberRangeId: null,
        },
      },
    });
    if (resDataDelete?.data?.updateOrganizationUserField?.isSuccess) {
      enqueueSnackbar(formatMessage(NgoPublicDetailsMessages.ngoSizeDeleteMessage), { variant: 'success' });
    }
    navigate(PATH_APP.profile.ngo.publicDetails.main);
  };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            <FormattedMessage {...NgoPublicDetailsMessages.ngoSizeDeleteAlert} />
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={1} sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
          <Icon name="trash" color="error.main" />
          <LoadingButton variant="text" loading={isLoading} sx={{ p: 0 }}>
            <Typography variant="body2" color="error" onClick={() => handleClickDeleteButton()}>
              <FormattedMessage {...NgoPublicDetailsMessages.ngoSizeDelete} />
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
