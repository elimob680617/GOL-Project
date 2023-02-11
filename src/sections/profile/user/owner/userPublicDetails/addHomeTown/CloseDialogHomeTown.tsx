import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useUpsertLocationMutation } from 'src/_graphql/profile/publicDetails/mutations/addCurrentCity.generated';
import { Icon } from 'src/components/Icon';
import GeneralMessagess from 'src/language/general.messages';
import { PATH_APP } from 'src/routes/paths';
import { emptyLocation, userLocationSelector } from 'src/store/slices/profile/userLocation-slice';

import NormalPublicDetailsMessages from '../NormalPublicDetails.messages';

function CloseDialogHomeTown() {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const userCity = useSelector(userLocationSelector);
  const isEdit = !!userCity?.id;
  const dispatch = useDispatch();
  const [upsertLocation] = useUpsertLocationMutation();
  const handelSaveChange = async () => {
    const result: any = await upsertLocation({
      filter: {
        dto: {
          audience: userCity?.audience,
          cityId: userCity?.city?.id,
          id: userCity?.id,
          locationType: userCity?.locationType,
        },
      },
    });
    if (result?.data?.upsertLocation?.isSuccess) {
      enqueueSnackbar(
        isEdit
          ? formatMessage(NormalPublicDetailsMessages.homeTownEditedAlertMessage)
          : formatMessage(NormalPublicDetailsMessages.homeTownAddedAlertMessage),
        { variant: 'success' },
      );
      navigate(PATH_APP.profile.user.publicDetails.root);
      dispatch(emptyLocation());
    }
  };
  const handelDiscard = () => {
    dispatch(emptyLocation());
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

export default CloseDialogHomeTown;
