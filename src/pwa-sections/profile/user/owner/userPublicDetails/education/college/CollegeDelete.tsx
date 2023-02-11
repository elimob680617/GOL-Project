import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Divider, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useDeletePersonCollegeMutation } from 'src/_graphql/profile/publicDetails/mutations/deletePersonCollege.generated';
import { Icon } from 'src/components/Icon';
import GeneralMessagess from 'src/language/general.messages';
import { useDispatch } from 'src/store';
import { emptyCollege } from 'src/store/slices/profile/userColloges-slice';
import { InstituteTypeEnum } from 'src/types/serverTypes';

import NormalPublicDetailsMessages from '../../NormalPublicDetailsPwa.messages';

interface CollegeDeleteProps {
  id: string;
}

export default function CollegeDelete(props: CollegeDeleteProps) {
  const { id } = props;
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  //Mutation
  const [deleteCurrentCollege, { isLoading }] = useDeletePersonCollegeMutation();
  //For Redux
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();

  const handleDeleteButton = async () => {
    const resp: any = await deleteCurrentCollege({
      filter: {
        dto: {
          id,
          instituteType: InstituteTypeEnum.College,
        },
      },
    });
    if (resp?.data?.deletePersonCollege?.isSuccess) {
      enqueueSnackbar(formatMessage(NormalPublicDetailsMessages.collegeDeletedAlertMessage), { variant: 'success' });
      dispatch(emptyCollege());
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
            <FormattedMessage {...NormalPublicDetailsMessages.collegeDeleteMessage} />
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={1} sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
          <Icon name="trash" color="error.main" />
          <LoadingButton variant="text" loading={isLoading} sx={{ p: 0 }} onClick={() => handleDeleteButton()}>
            <Typography variant="body2" color="error">
              <FormattedMessage {...NormalPublicDetailsMessages.collegeDeleteButton} />
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
