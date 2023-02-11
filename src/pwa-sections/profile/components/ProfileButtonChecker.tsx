import { FC, ReactNode, useEffect, useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';

import { LoadingButton } from '@mui/lab';
import { Box, Button, ButtonProps, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useFollowMutation } from 'src/_graphql/connection/mutations/follow.generated';
import { useUpdateConnectionMutation } from 'src/_graphql/connection/mutations/updateConnection.generated';
import { Icon } from 'src/components/Icon';
import { ConnectionStatusEnum, ConnectionStatusType, FilterByEnum, RequestEnum } from 'src/types/serverTypes';

interface ProfileButtonCheckerProps {
  meToOther?: ConnectionStatusEnum | ConnectionStatusType;
  otherToMe?: ConnectionStatusEnum | ConnectionStatusType;
  itemType: FilterByEnum;
  itemId: string;
  fullName: string;
}

const ProfileButtonChecker: FC<ProfileButtonCheckerProps> = (props) => {
  const { meToOther, otherToMe, itemId, itemType } = props;
  const [changeStatus, { isLoading: updateLoading }] = useUpdateConnectionMutation();
  const [followUser, { isLoading: followLoading }] = useFollowMutation();

  const { enqueueSnackbar } = useSnackbar();
  const { userId } = useParams();
  const [buttonStatus, setButtonStatus] = useState(false);
  const [buttonAtt, setButtonAtt] = useState<{
    variant: ButtonProps['variant'];
    text: string;
    px: number;
    py: number;
    backgroundColor: string;
    borderColor: string;
    startIcon?: ReactNode;
    actionType?: RequestEnum;
  }>({
    variant: 'contained',
    text: 'Follow',
    px: 2.9,
    py: 0.5,
    backgroundColor: '',
    borderColor: '',
    startIcon: <Icon name="add-account" color="background.paper" />,
  });
  const [connectionState, setConnectionState] = useState<{
    otherToMe: ConnectionStatusEnum | ConnectionStatusType | undefined;
    meToOther: ConnectionStatusEnum | ConnectionStatusType | undefined;
  }>({
    otherToMe: undefined,
    meToOther: undefined,
  });

  useEffect(() => {
    setConnectionState({
      otherToMe,
      meToOther,
    });
  }, [meToOther, otherToMe]);

  useLayoutEffect(() => {
    switch (connectionState.meToOther) {
      case ConnectionStatusEnum.Accepted:
        setButtonAtt({
          variant: 'text',
          text: 'Unfollow',
          px: 4.1,
          py: 0.9,
          backgroundColor: 'gray.100',
          borderColor: '',
          actionType: RequestEnum.Unfollow,
        });
        break;
      case ConnectionStatusEnum.Muted:
        setButtonAtt({
          variant: 'text',
          text: 'Unfollow',
          px: 4.1,
          py: 0.9,
          backgroundColor: 'gray.100',
          borderColor: '',
          actionType: RequestEnum.Unfollow,
        });
        break;
      case ConnectionStatusEnum.Requested:
        setButtonAtt({
          variant: 'outlined',
          text: 'Requested',
          px: 3.1,
          py: 0.9,
          backgroundColor: '',
          borderColor: 'gray.300',
          actionType: RequestEnum.Remove,
        });
        break;

      default:
        setButtonAtt({
          variant: 'contained',
          text: 'Follow',
          px: 2.9,
          py: 0.5,
          backgroundColor: '',
          borderColor: '',
          startIcon: <Icon name="add-account" color="background.paper" />,
        });
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionState.meToOther]);

  const handleChangeStatus = async (actionType: RequestEnum) => {
    const { data }: any = await changeStatus({
      filter: {
        dto: {
          itemId: itemId || userId,
          actionType,
        },
      },
    });
    const res = data?.updateConnection?.listDto?.items?.[0];
    if (data?.updateConnection?.isSuccess) {
      setConnectionState({
        meToOther: res?.meToOtherStatus,
        otherToMe: res?.otherToMeStatus,
      });
    } else {
      enqueueSnackbar(`${data?.updateConnection?.messagingKey}`, { variant: 'error' });
    }
  };
  const handleFollow = async () => {
    const { data }: any = await followUser({
      filter: {
        dto: {
          itemId: itemId || userId,
          itemType,
        },
      },
    });
    const res = data?.follow?.listDto?.items?.[0];
    if (data?.follow?.isSuccess) {
      setConnectionState({
        meToOther: res?.meToOtherStatus,
        otherToMe: res?.otherToMeStatus,
      });
    } else {
      enqueueSnackbar(`${data?.follow?.messagingKey}`, { variant: 'error' });
    }
  };

  return (
    <>
      {connectionState.otherToMe === ConnectionStatusEnum.Requested ? (
        <>
          <IconButton onClick={() => handleChangeStatus(RequestEnum.Reject)}>
            <Icon name="Close-1" color="error.main" />
          </IconButton>
          <IconButton onClick={() => handleChangeStatus(RequestEnum.Accept)}>
            <Icon name="Approve-Tick" type="solid" color="primary.main" />
          </IconButton>
        </>
      ) : (
        <LoadingButton
          loading={updateLoading || followLoading}
          onClick={() => {
            if (!buttonAtt.actionType) {
              handleFollow();
            } else if (buttonAtt.actionType === RequestEnum.Unfollow) {
              setButtonStatus(true);
            } else {
              handleChangeStatus(buttonAtt.actionType);
            }
          }}
          variant={buttonAtt.variant}
          size="small"
          startIcon={buttonAtt.startIcon}
          sx={{
            px: buttonAtt.px,
            py: buttonAtt.py,
            backgroundColor: buttonAtt.backgroundColor,
            borderColor: buttonAtt.borderColor,
            width: 120,
            height: 32,
          }}
        >
          {buttonAtt.text}
        </LoadingButton>
      )}

      <BottomSheet open={buttonStatus} onDismiss={() => setButtonStatus(false)}>
        <Stack spacing={2} sx={{ py: 3 }}>
          <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="subtitle1" color="text.primary">
                Are you sure to unfollow this user?
              </Typography>
            </Box>
          </Stack>
          <Divider />
          <Stack spacing={1} px={2} sx={{ alignItems: 'flex-start' }}>
            <Button
              onClick={() => handleChangeStatus(RequestEnum?.Unfollow)}
              variant="text"
              size="large"
              startIcon={<Icon name="remove-unfollow" />}
              sx={{
                height: 32,
                justifyContent: 'stretch',
                color: 'error.main',
              }}
            >
              Unfollow
            </Button>
            <Button
              onClick={() => setButtonStatus(false)}
              variant="text"
              size="large"
              startIcon={<Icon name="Close-1" color="grey.500" />}
              sx={{
                justifyContent: 'stretch',
                height: 32,
                color: 'text.primary',
              }}
            >
              Discard
            </Button>
          </Stack>
        </Stack>
      </BottomSheet>
    </>
  );
};

export default ProfileButtonChecker;
