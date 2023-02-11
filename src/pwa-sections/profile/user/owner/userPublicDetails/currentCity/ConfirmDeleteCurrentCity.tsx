import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Box, Divider, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useDeleteLocationMutation } from 'src/_graphql/profile/publicDetails/mutations/deleteLocation.generated';
import { Icon } from 'src/components/Icon';
import GeneralMessagess from 'src/language/general.messages';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { emptyLocation, userLocationSelector } from 'src/store/slices/profile/userLocation-slice';

import NormalPublicDetailsMessages from '../NormalPublicDetailsPwa.messages';

function ConfirmDeleteCurrentCity() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userCity = useSelector(userLocationSelector);
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const [deleteUserLocations] = useDeleteLocationMutation();

  const handleClickDeleteButton = async () => {
    const resDataDelete: any = await deleteUserLocations({
      filter: {
        dto: {
          id: userCity?.id,
        },
      },
    });
    if (resDataDelete?.data?.deleteLocation?.isSuccess) {
      enqueueSnackbar(formatMessage(NormalPublicDetailsMessages.currentCityDeletedAlertMessage), {
        variant: 'success',
      });
      dispatch(emptyLocation());
    }

    navigate(PATH_APP.profile.user.publicDetails.root);
  };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            <FormattedMessage {...NormalPublicDetailsMessages.currentCityDeleteMessage} />
          </Typography>
        </Box>
      </Stack>
      <Divider />

      <Stack spacing={2} sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
          <Icon name="trash" color="error.main" />
          <Typography variant="body2" color="error" onClick={() => handleClickDeleteButton()}>
            <FormattedMessage {...NormalPublicDetailsMessages.currentCityDeleteButton} />
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
          <Icon name="Close-1" color="grey.500" />
          <Typography variant="body2" color="text.primary">
            <FormattedMessage {...GeneralMessagess.discardWord} />
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}

export default ConfirmDeleteCurrentCity;
