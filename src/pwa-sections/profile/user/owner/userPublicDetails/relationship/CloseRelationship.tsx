import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Box, Divider, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useUpdateRelationshipMutation } from 'src/_graphql/profile/publicDetails/mutations/updateRelationship.generated';
import { Icon } from 'src/components/Icon';
import GeneralMessagess from 'src/language/general.messages';
import { useSelector } from 'src/store';
import { RelationShipCleared, userRelationShipSelector } from 'src/store/slices/profile/userRelationShip-slice';

import NormalPublicDetailsMessages from '../NormalPublicDetailsPwa.messages';

function CloseRelationship() {
  const navigate = useNavigate();
  const relationShip = useSelector(userRelationShipSelector);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const isEdit = !!relationShip?.personId;
  const { formatMessage } = useIntl();

  const [updateRelationship] = useUpdateRelationshipMutation();

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

      navigate('/profile/public-details');
    }
  };
  const handelDiscard = () => {
    dispatch(RelationShipCleared());
    navigate('/profile/public-details');
  };
  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            <FormattedMessage {...NormalPublicDetailsMessages.saveChangeMessage} />
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 130 }} onClick={handelSaveChange}>
          <Icon name="Save" color="grey.700" />
          <Typography variant="body2" color="text.primary">
            <FormattedMessage {...NormalPublicDetailsMessages.saveChange} />
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }} onClick={handelDiscard}>
          <Icon name="Close-1" color="grey.500" />
          <Typography variant="body2" color="error">
            <FormattedMessage {...GeneralMessagess.discardWord} />
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}

export default CloseRelationship;
