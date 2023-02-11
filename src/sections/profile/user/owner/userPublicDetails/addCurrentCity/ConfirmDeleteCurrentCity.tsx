import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useDeleteLocationMutation } from 'src/_graphql/profile/publicDetails/mutations/deleteLocation.generated';
import { Icon } from 'src/components/Icon';
import GeneralMessagess from 'src/language/general.messages';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { emptyLocation, userLocationSelector } from 'src/store/slices/profile/userLocation-slice';

import NormalPublicDetailsMessages from '../NormalPublicDetails.messages';

function ConfirmDeleteCurrentCity() {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const userCity = useSelector(userLocationSelector);
  const { enqueueSnackbar } = useSnackbar();
  const [deleteUserLocations, { isLoading }] = useDeleteLocationMutation();

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
    //  else {
    //   enqueueSnackbar('current city deleted failed ', { variant: 'error' });
    // }
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
              <FormattedMessage {...NormalPublicDetailsMessages.currentCityDeleteMessage} />
            </Typography>
          </Box>
          <Link to={PATH_APP.profile.user.publicDetails.root}>
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
                <FormattedMessage {...NormalPublicDetailsMessages.currentCityDeleteButton} />
              </Typography>
            </LoadingButton>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }}>
            <Icon name="Close-1" />
            <Link to={PATH_APP.profile.user.publicDetails.root} style={{ textDecoration: 'none' }}>
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

export default ConfirmDeleteCurrentCity;
