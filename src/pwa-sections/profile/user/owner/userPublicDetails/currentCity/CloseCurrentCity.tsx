import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Box, Divider, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useUpsertLocationMutation } from 'src/_graphql/profile/publicDetails/mutations/addCurrentCity.generated';
import { Icon } from 'src/components/Icon';
import GeneralMessagess from 'src/language/general.messages';
import { PATH_APP } from 'src/routes/paths';
import { useSelector } from 'src/store';
import { emptyLocation, userLocationSelector } from 'src/store/slices/profile/userLocation-slice';

import NormalPublicDetailsMessages from '../NormalPublicDetailsPwa.messages';

function CloseCurrentCity() {
  const navigate = useNavigate();
  const userCity = useSelector(userLocationSelector);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const isEdit = !!userCity?.id;
  const { formatMessage } = useIntl();

  const [upsertLocation] = useUpsertLocationMutation();
  const handelSaveChange = async () => {
    const result: any = await upsertLocation({
      filter: {
        dto: {
          audience: userCity?.audience,
          cityId: userCity?.cityId,
          id: userCity?.id,
          locationType: userCity?.locationType,
        },
      },
    });

    if (result?.data?.upsertLocation?.isSuccess) {
      enqueueSnackbar(
        isEdit
          ? formatMessage(NormalPublicDetailsMessages.currentCityEditedAlertMessage)
          : formatMessage(NormalPublicDetailsMessages.currentCityAddedAlertMessage),
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
    <Stack spacing={2} sx={{ minWidth: 600, minHeight: 194, py: 3 }}>
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

export default CloseCurrentCity;
