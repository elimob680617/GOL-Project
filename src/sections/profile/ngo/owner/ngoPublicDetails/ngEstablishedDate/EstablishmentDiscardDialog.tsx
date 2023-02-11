import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useUpdateOrganizationUserField2Mutation } from 'src/_graphql/profile/ngoPublicDetails/mutations/updateOrgUser.generated';
import { Icon } from 'src/components/Icon';
import GeneralMessagess from 'src/language/general.messages';
import { PATH_APP } from 'src/routes/paths';
import { useSelector } from 'src/store';
import {
  ngoEstablishmentDateSelector,
  ngoEstablishmentDateWasEmpty,
} from 'src/store/slices/profile/ngoPublicDetails-slice';
import { OrgUserFieldEnum } from 'src/types/serverTypes';

import NgoPublicDetailsMessages from '../NgoPublicDetails.messages';

function EstablishmentDiscardDialog() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [upsertCategoryNgoUser] = useUpdateOrganizationUserField2Mutation();
  const { formatMessage } = useIntl();
  const ngoEstablishment = useSelector(ngoEstablishmentDateSelector);
  const dispatch = useDispatch();
  const isEdit = !!ngoEstablishment?.establishmentDate;

  const handelSaveChange = async () => {
    const EstablishedDate = new Date(ngoEstablishment?.establishmentDate as Date);
    const result: any = await upsertCategoryNgoUser({
      filter: {
        dto: {
          field: OrgUserFieldEnum.EstablishmentDate,
          establishmentDate: !!ngoEstablishment?.establishmentDate
            ? EstablishedDate.getFullYear() + '-' + ('0' + (EstablishedDate.getMonth() + 1)).slice(-2) + '-01'
            : null,
          establishmentDateAudience: ngoEstablishment?.establishmentDateAudience,
        },
      },
    });
    if (result?.data?.updateOrganizationUserField?.isSuccess) {
      enqueueSnackbar(
        isEdit
          ? formatMessage(NgoPublicDetailsMessages.ngoDateSuccessEditAlert)
          : formatMessage(NgoPublicDetailsMessages.ngoDateSuccessAddAlert),
        { variant: 'success' },
      );
      navigate(PATH_APP.profile.ngo.publicDetails.main);
      dispatch(ngoEstablishmentDateWasEmpty());
    }
  };
  const handelDiscard = () => {
    navigate(PATH_APP.profile.ngo.publicDetails.main);
    dispatch(ngoEstablishmentDateWasEmpty());
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
              <FormattedMessage {...NgoPublicDetailsMessages.saveChangeMessage} />
            </Typography>
          </Box>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 130 }} onClick={handelSaveChange}>
            <Icon name="Save" />
            <Typography variant="body2" color="text.primary">
              <FormattedMessage {...NgoPublicDetailsMessages.saveChange} />
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }} onClick={handelDiscard}>
            <Icon name="Close-1" color="error.main" />
            <Typography variant="body2" color="error">
              <FormattedMessage {...GeneralMessagess.discardWord} />
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default EstablishmentDiscardDialog;
