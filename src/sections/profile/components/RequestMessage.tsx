import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { Button, Stack, Typography, styled } from '@mui/material';

import { useUpdateConnectionMutation } from 'src/_graphql/connection/mutations/updateConnection.generated';
import { Icon } from 'src/components/Icon';
import { RequestEnum } from 'src/types/serverTypes';

import NormalAndNgoProfileViewMessages from '../UserProfileView.messages';

const MessageBoxStyle = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(2),
}));

interface UserRequestProps {
  fullName: string;
  itemId: string;
}

export default function RequestMessage(props: UserRequestProps) {
  const { fullName, itemId } = props;
  const [showData, setShowData] = useState(true);

  const [changeStatus, { isLoading }] = useUpdateConnectionMutation();
  const handleChangeStatus = async (actionType: RequestEnum) => {
    const res: any = await changeStatus({
      filter: {
        dto: {
          itemId,
          actionType,
        },
      },
    });
    if (res.data.updateConnection.isSuccess) setShowData(false);
  };

  return (
    <>
      {showData && (
        <MessageBoxStyle alignItems="center" spacing={1} mb={3}>
          <Typography color="text.primary" variant="subtitle2">
            <FormattedMessage {...NormalAndNgoProfileViewMessages.followReqMessage} values={{ name: fullName }} />
          </Typography>
          <Stack direction="row" spacing={2}>
            {/* <Icon name="Close" color="grey.900" /> */}
            <Button
              disabled={isLoading}
              variant="contained"
              sx={{ height: 32, width: 128 }}
              color="primary"
              onClick={() => handleChangeStatus(RequestEnum.Accept)}
              startIcon={<Icon name="approve-user" color="background.paper" />}
            >
              <Typography ml={1}>
                <FormattedMessage {...NormalAndNgoProfileViewMessages.acceptButton} />
              </Typography>
            </Button>
            <Button
              disabled={isLoading}
              variant="outlined"
              sx={{ height: 32, width: 128 }}
              onClick={() => handleChangeStatus(RequestEnum.Reject)}
              startIcon={<Icon name="Close" color="grey.900" />}
            >
              <Typography ml={1} color="grey.900">
                <FormattedMessage {...NormalAndNgoProfileViewMessages.declineButton} />
              </Typography>
            </Button>
          </Stack>
        </MessageBoxStyle>
      )}
    </>
  );
}
