import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useUpdateOrganizationUserField2Mutation } from 'src/_graphql/profile/ngoPublicDetails/mutations/updateOrgUser.generated';
import { Icon } from 'src/components/Icon';
import GeneralMessagess from 'src/language/general.messages';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { ngoPlaceSelector, ngoPlaceWasEmpty } from 'src/store/slices/profile/ngoPublicDetails-slice';
import { OrgUserFieldEnum } from 'src/types/serverTypes';
import sleep from 'src/utils/sleep';

import NgoPublicDetailsMessages from '../NgoPublicDetails.messages';

export default function LocationDiscardDialog() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const ngoPlace = useSelector(ngoPlaceSelector);
  const [upsertPlaceNgoUser, { isLoading }] = useUpdateOrganizationUserField2Mutation();

  const handleSaveSchoolChangeOrContinue = async () => {
    const response: any = await upsertPlaceNgoUser({
      filter: {
        dto: {
          field: OrgUserFieldEnum.Place,
          placeAudience: ngoPlace?.placeAudience,
          googlePlaceId: ngoPlace?.placeId,
          address: ngoPlace?.address,
          lat: ngoPlace?.lat,
          lng: ngoPlace?.lng,
        },
      },
    });
    if (response?.data?.updateOrganizationUserField?.isSuccess) {
      enqueueSnackbar(formatMessage(NgoPublicDetailsMessages.ngoPlaceUpdateAlertMessage), { variant: 'success' });
      navigate(PATH_APP.profile.ngo.publicDetails.main);
      await sleep(2000);
      dispatch(ngoPlaceWasEmpty());
    }
  };

  const handleDiscard = async () => {
    navigate(PATH_APP.profile.ngo.publicDetails.main);
    await sleep(2000);
    dispatch(ngoPlaceWasEmpty());
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
              {ngoPlace?.description
                ? formatMessage(NgoPublicDetailsMessages.saveChangeMessage)
                : formatMessage(NgoPublicDetailsMessages.continueMessage)}
            </Typography>
          </Box>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <LoadingButton
            loading={isLoading}
            startIcon={<Icon name="Save" />}
            variant="text"
            color="inherit"
            onClick={handleSaveSchoolChangeOrContinue}
            sx={{ justifyContent: 'flex-start' }}
          >
            <Typography variant="body2" color="text.primary">
              {ngoPlace?.description
                ? formatMessage(NgoPublicDetailsMessages.saveChange)
                : formatMessage(NgoPublicDetailsMessages.continue)}
            </Typography>
          </LoadingButton>
          <Button
            variant="text"
            color="error"
            startIcon={<Icon name="Close-1" color="error.main" />}
            onClick={handleDiscard}
            sx={{ maxWidth: 99, justifyContent: 'flex-start' }}
          >
            <Typography variant="body2" color="error">
              <FormattedMessage {...GeneralMessagess.discardWord} />
            </Typography>
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}
