import { Dispatch, FC, SetStateAction } from 'react';

import { Button, Icon, Stack, useTheme } from '@mui/material';

import { Slash } from 'iconsax-react';
import { FilterByEnum, RequestEnum, StatusEnum } from 'src/types/serverTypes';

import { StateType } from './ConnectionContent';

const MessagesIcon = (
  <Icon>
    <img alt="" src="/icons/Outline.svg" />
  </Icon>
);
const RemoveIcon = (
  <Icon>
    <img alt="" src="/icons/removeUser.svg" />
  </Icon>
);
const MuteIcon = (
  <Icon>
    <img alt="" src="/icons/MuteIcon.svg" />
  </Icon>
);

const PopOverChecker: FC<{
  index: number;
  meToOther?: StatusEnum;
  itemType: FilterByEnum;
  itemId: string;
  url: string | string[];
  fullName: string;
  setModal: Dispatch<SetStateAction<StateType>>;
  dismissModal: Dispatch<SetStateAction<boolean>>;
}> = ({ itemType, itemId, meToOther, url, index, fullName, setModal, dismissModal }) => {
  const theme = useTheme();

  return (
    <Stack px={1} py={1}>
      {itemType !== FilterByEnum.Hashtag && (
        <Button
          onClick={() => {
            dismissModal(false);
          }}
          variant="text"
          size="large"
          startIcon={MessagesIcon}
          sx={{
            width: '100%',
            color: theme.palette.surface.onSurface,
            justifyContent: 'stretch',
          }}
        >
          Send Message
        </Button>
      )}
      {itemType !== FilterByEnum.Hashtag && url === 'followers' && (
        <Button
          onClick={() => {
            dismissModal(false);
            setModal({
              warningText: `Are you sure you want to Remove ${fullName}?`,
              actionType: RequestEnum.Remove,
              buttonText: 'Remove',
              show: true,
              icon: RemoveIcon,
            });
          }}
          variant="text"
          size="large"
          startIcon={RemoveIcon}
          sx={{
            width: '100%',
            color: theme.palette.error.dark,
            justifyContent: 'stretch',
          }}
        >
          Remove
        </Button>
      )}
      {url === 'following' && (
        <Button
          onClick={() => {
            dismissModal(false);
            if (meToOther === StatusEnum.Muted) {
              setModal({
                warningText: `Are you sure you want to Unmute ${fullName}?`,
                actionType: RequestEnum.UnMute,
                buttonText: 'Unmute',
                show: true,
                icon: MuteIcon,
              });
            } else {
              setModal({
                warningText: `Are you sure you want to Mute ${fullName}?`,
                actionType: RequestEnum.Mute,
                buttonText: 'Mute',
                show: true,
                icon: MuteIcon,
              });
            }
          }}
          variant="text"
          size="large"
          startIcon={MuteIcon}
          sx={{
            width: '100%',
            color: theme.palette.error.dark,
            justifyContent: 'stretch',
          }}
        >
          {meToOther === StatusEnum.Muted ? 'Unmute' : 'Mute'}
        </Button>
      )}
      {itemType !== FilterByEnum.Hashtag && url !== 'requested' && (
        <Button
          onClick={() => {
            dismissModal(false);
            setModal({
              warningText: `Are you sure you want to Block ${fullName}?`,
              actionType: RequestEnum.Block,
              buttonText: 'Block',
              show: true,
              icon: <Slash />,
            });
          }}
          variant="text"
          size="large"
          startIcon={<Slash color={theme.palette.error.dark} />}
          sx={{
            width: '100%',
            color: theme.palette.error.dark,
            justifyContent: 'stretch',
          }}
        >
          Block
        </Button>
      )}
    </Stack>
  );
};

export default PopOverChecker;
