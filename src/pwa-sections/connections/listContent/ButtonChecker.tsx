import { Dispatch, FC, ReactNode, SetStateAction, useLayoutEffect, useState } from 'react';

import { LoadingButton } from '@mui/lab';
import { ButtonProps, Icon, IconButton, useTheme } from '@mui/material';

import { CloseCircle, TickCircle, UserAdd } from 'iconsax-react';
import { useFollowMutation } from 'src/_graphql/connection/mutations/follow.generated';
import { useDispatch } from 'src/store';
import { onFollow } from 'src/store/slices/connection/connections';
import { FilterByEnum, RequestEnum, StatusEnum } from 'src/types/serverTypes';

import { StateType } from './ConnectionContent';

const RemoveIcon = (
  <Icon>
    <img alt="" src="/icons/removeUser.svg" />
  </Icon>
);

const ButtonChecker: FC<{
  meToOther?: StatusEnum;
  otherToMe?: StatusEnum;
  itemType: FilterByEnum;
  itemId: string;
  url: string | string[];
  index: number;
  fullName: string;
  setModal: Dispatch<SetStateAction<StateType>>;
  handleChangeStatus: (actionType: RequestEnum, id: string) => Promise<void>;
  updateLoading: boolean;
}> = ({
  meToOther,
  otherToMe,
  itemId,
  itemType,
  url,
  index,
  fullName,
  setModal,
  handleChangeStatus,
  updateLoading,
}) => {
  const [followUser, { isLoading: followLoading }] = useFollowMutation();
  const dispatch = useDispatch();

  const theme = useTheme();
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
    startIcon: <UserAdd />,
  });

  useLayoutEffect(() => {
    switch (meToOther) {
      case StatusEnum.Accepted:
        setButtonAtt({
          variant: 'text',
          text: 'Unfollow',
          px: 4.1,
          py: 0.9,
          backgroundColor: theme.palette.grey[100],
          borderColor: '',
          actionType: RequestEnum.Unfollow,
        });
        break;
      case StatusEnum.Muted:
        setButtonAtt({
          variant: 'text',
          text: 'Unfollow',
          px: 4.1,
          py: 0.9,
          backgroundColor: theme.palette.grey[100],
          borderColor: '',
          actionType: RequestEnum.Unfollow,
        });
        break;
      case StatusEnum.Requested:
        setButtonAtt({
          variant: 'outlined',
          text: 'Requested',
          px: 3.1,
          py: 0.9,
          backgroundColor: '',
          borderColor: theme.palette.grey[300],
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
          startIcon: <UserAdd />,
        });
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meToOther]);

  const handleFollow = async () => {
    try {
      const { data }: any = await followUser({
        filter: {
          dto: {
            itemId,
            itemType,
          },
        },
      });
      dispatch(
        onFollow({
          index: index,
          meToOther: data?.follow.listDto.items[0]?.meToOtherStatus,
          otherToMe: data?.follow.listDto.items[0]?.otherToMeStatus,
        }),
      );
    } catch (error) {}
  };

  return (
    <>
      {url === 'requests' && otherToMe === StatusEnum.Requested ? (
        <>
          {updateLoading ? (
            <LoadingButton
              loading
              variant="outlined"
              size="small"
              sx={{
                width: 120,
                height: 32,
              }}
            >
              loading...
            </LoadingButton>
          ) : (
            <>
              <IconButton onClick={() => handleChangeStatus(RequestEnum.Reject, itemId)}>
                <CloseCircle color={theme.palette.error.main} />
              </IconButton>
              <IconButton onClick={() => handleChangeStatus(RequestEnum.Accept, itemId)}>
                <TickCircle color={theme.palette.primary.main} variant="Bold" />
              </IconButton>
            </>
          )}
        </>
      ) : (
        <LoadingButton
          loading={updateLoading || followLoading}
          onClick={() => {
            if (!buttonAtt.actionType) {
              handleFollow();
            } else if (buttonAtt.actionType === RequestEnum.Unfollow) {
              setModal({
                warningText: `Are you sure you want to Unfollow ${fullName}?`,
                actionType: RequestEnum.Unfollow,
                buttonText: 'Unfollow',
                show: true,
                icon: RemoveIcon,
                itemId,
              });
            } else {
              handleChangeStatus(buttonAtt.actionType, itemId);
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
    </>
  );
};

export default ButtonChecker;
