import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useUpdateRelationshipMutation } from 'src/_graphql/profile/publicDetails/mutations/updateRelationship.generated';
import { Icon } from 'src/components/Icon';
import GeneralMessagess from 'src/language/general.messages';
import { PATH_APP } from 'src/routes/paths';
import { useSelector } from 'src/store';
import { RelationShipCleared, userRelationShipSelector } from 'src/store/slices/profile/userRelationShip-slice';

import NormalPublicDetailsMessages from '../NormalPublicDetails.messages';

function CloseDialogRelationship() {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const relationShip = useSelector(userRelationShipSelector);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [updateRelationship] = useUpdateRelationshipMutation();
  const isEdit = !!relationShip?.personId;

  const handelSaveChange = async () => {
    const resData: any = await updateRelationship({
      filter: {
        dto: {
          audience: relationShip?.audience,
          relationshipStatusId: relationShip?.relationshipStatus?.id,
        },
      },
    });
    if (resData?.data?.updateRelationship?.isSuccess) {
      dispatch(RelationShipCleared());
      enqueueSnackbar(
        isEdit
          ? formatMessage(NormalPublicDetailsMessages.relationshipEditedAlertMessage)
          : formatMessage(NormalPublicDetailsMessages.relationshipAddedAlertMessage),
        { variant: 'success' },
      );

      navigate(PATH_APP.profile.user.publicDetails.root);
    }
  };
  const handelDiscard = () => {
    dispatch(RelationShipCleared());
    navigate(PATH_APP.profile.user.publicDetails.root);
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
              <FormattedMessage {...NormalPublicDetailsMessages.saveChangeMessage} />
            </Typography>
          </Box>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 180 }} onClick={handelSaveChange}>
            <Icon name="Save" color="text.primary" />
            <Typography variant="body2" color="text.primary">
              <FormattedMessage {...NormalPublicDetailsMessages.saveChange} />
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

export default CloseDialogRelationship;
