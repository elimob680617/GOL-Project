import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Divider, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useDeletePersonSchoolMutation } from 'src/_graphql/profile/publicDetails/mutations/deletePersonSchool.generated';
import { Icon } from 'src/components/Icon';
import GeneralMessagess from 'src/language/general.messages';
import { useDispatch } from 'src/store';
import { schoolWasEmpty } from 'src/store/slices/profile/userSchool-slice';

import NormalPublicDetailsMessages from '../../NormalPublicDetailsPwa.messages';

interface CollegeDeleteProps {
  id: string;
}

export default function SchoolDelete(props: CollegeDeleteProps) {
  const { id } = props;
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  //Mutation
  const [deleteCurrentSchool, { isLoading }] = useDeletePersonSchoolMutation();
  //For Redux
  const dispatch = useDispatch();

  // Functions
  const handleDeleteButton = async () => {
    const response: any = await deleteCurrentSchool({
      filter: {
        dto: {
          id,
        },
      },
    });
    if (response?.data?.deletePersonSchool?.isSuccess) {
      enqueueSnackbar(formatMessage(NormalPublicDetailsMessages.schoolDeletedAlertMessage), { variant: 'success' });
      dispatch(schoolWasEmpty());
      navigate(-1);
    } else {
      enqueueSnackbar(formatMessage(NormalPublicDetailsMessages.unSuccessfullDelete), { variant: 'error' });
    }
  };
  function handleDiscard() {
    navigate(-1);
  }

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            <FormattedMessage {...NormalPublicDetailsMessages.schoolDeleteMessage} />
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={1} sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
          <Icon name="trash" color="error.main" />
          <LoadingButton variant="text" loading={isLoading} sx={{ p: 0 }} onClick={() => handleDeleteButton()}>
            <Typography variant="body2" color="error">
              <FormattedMessage {...NormalPublicDetailsMessages.schoolDeleteButton} />
            </Typography>
          </LoadingButton>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }}>
          <Icon name="Close-1" color="grey.500" />
          <Typography variant="body2" color="text.primary" onClick={handleDiscard}>
            <FormattedMessage {...GeneralMessagess.discardWord} />
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}
