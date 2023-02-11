import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';

import { Icon } from 'src/components/Icon';
import GeneralMessagess from 'src/language/general.messages';
import { useDispatch } from 'src/store';
import { schoolWasEmpty } from 'src/store/slices/profile/userSchool-slice';

import NormalPublicDetailsMessages from '../../NormalPublicDetailsPwa.messages';

interface CollegeDiscardProps {
  isValid: boolean;
  onSubmit: () => void;
  loading: boolean;
}

export default function SchoolDiscard(props: CollegeDiscardProps) {
  const { isValid, loading, onSubmit } = props;

  const navigate = useNavigate();
  const { formatMessage } = useIntl();

  //For Redux Tools
  const dispatch = useDispatch();

  const handleDiscard = () => {
    dispatch(schoolWasEmpty());
    navigate(-1);
  };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            {isValid
              ? formatMessage(NormalPublicDetailsMessages.saveChangeMessage)
              : formatMessage(NormalPublicDetailsMessages.continueMessage)}
            ?
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        <LoadingButton
          loading={loading}
          startIcon={<Icon name="Save" color="grey.700" />}
          variant="text"
          color="inherit"
          onClick={onSubmit}
          sx={{ maxWidth: 130, justifyContent: 'flex-start' }}
        >
          <Typography variant="body2" color="text.primary">
            {isValid
              ? formatMessage(NormalPublicDetailsMessages.saveChange)
              : formatMessage(NormalPublicDetailsMessages.continue)}
          </Typography>
        </LoadingButton>
        <Button
          variant="text"
          color="error"
          startIcon={<Icon name="Close-1" color="grey.500" />}
          onClick={handleDiscard}
          sx={{ maxWidth: 99, justifyContent: 'flex-start' }}
        >
          <Typography variant="body2" color="error">
            <FormattedMessage {...GeneralMessagess.discardWord} />
          </Typography>
        </Button>
      </Stack>
    </Stack>
  );
}
