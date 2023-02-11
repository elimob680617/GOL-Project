import { FC, ReactNode, useEffect, useLayoutEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { ButtonProps, IconButton } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useFollowMutation } from 'src/_graphql/connection/mutations/follow.generated';
import { useUpdateConnectionMutation } from 'src/_graphql/connection/mutations/updateConnection.generated';
import { Icon } from 'src/components/Icon';
import {
  ConnectionStatusEnum,
  ConnectionStatusType,
  FilterByEnum,
  FollowedItemTypeEnum,
  RequestEnum,
} from 'src/types/serverTypes';

import { StateType } from '../../connections/listContent/PopOverChecker';
import WarningDialog from '../../connections/listContent/WarningDialog';
import NormalAndNgoProfileViewMessages from '../UserProfileView.messages';

interface ProfileButtonCheckerProps {
  meToOther?: ConnectionStatusEnum | ConnectionStatusType;
  otherToMe?: ConnectionStatusEnum | ConnectionStatusType;
  itemType: FollowedItemTypeEnum | FilterByEnum;
  itemId: string;
  fullName: string;
}

// const RemoveIcon = (
//   <Icon>
//     <img alt="" src="/icons/removeUser.svg" />
//   </Icon>
// );

const ProfileButtonChecker: FC<ProfileButtonCheckerProps> = (props) => {
  const { meToOther, otherToMe, fullName, itemId, itemType } = props;
  const { formatMessage } = useIntl();
  const [changeStatus, { isLoading: updateLoading }] = useUpdateConnectionMutation();
  const [followUser, { isLoading: followLoading }] = useFollowMutation();
  const [modal, setModal] = useState<StateType>({
    warningText: '',
    buttonText: '',
    show: false,
  });

  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const _Id = id;
  // const _Id = router?.query?.id?.[0];
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
          actionType: RequestEnum.Unfollow,
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
    setModal({
      warningText: '',
      buttonText: '',
      show: false,
    });
    const { data }: any = await changeStatus({
      filter: {
        dto: {
          itemId: itemId || _Id,
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
          itemId: itemId || _Id,
          itemType: itemType as FilterByEnum,
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
              setModal({
                warningText: formatMessage(NormalAndNgoProfileViewMessages.unfollowAlertMessage, {
                  username: fullName,
                }),
                actionType: RequestEnum.Unfollow,
                buttonText: formatMessage(NormalAndNgoProfileViewMessages.unfollowbutton),
                show: true,
                icon: <Icon name="remove-unfollow" />,
              });
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
      <WarningDialog
        show={modal.show}
        onClose={setModal}
        warningText={modal.warningText}
        actionFn={handleChangeStatus}
        actionType={modal.actionType}
        buttonText={modal.buttonText}
        icon={modal.icon}
      />
    </>
  );
};

export default ProfileButtonChecker;
