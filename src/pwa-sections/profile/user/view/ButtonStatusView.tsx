import React from 'react';
import { useParams } from 'react-router-dom';
import { BottomSheet } from 'react-spring-bottom-sheet';

import { Button, Divider, IconButton, Stack, Typography, styled } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useUpdateConnectionMutation } from 'src/_graphql/connection/mutations/updateConnection.generated';
import { Icon } from 'src/components/Icon';
import { AccountPrivacyEnum, ConnectionStatusEnum, FilterByEnum, RequestEnum } from 'src/types/serverTypes';

import ProfileButtonChecker from '../../components/ProfileButtonChecker';

// import ThreeDotBottomSheet from 'src/sections/profile/components/ThreeDotOnView/ThreeDotBottomSheet';
// import BlockProfile from '../../components/ThreeDotOnView/BlockProfile';

const MessageBoxStyle = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(2),
}));

interface UserButtonStatusViewProp {
  user: any;
  itemId?: string;
}
export default function ButtonStatusView(props: UserButtonStatusViewProp) {
  const { user, itemId } = props;
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const ID = id;

  const [openSheet, setOpenSheet] = React.useState<boolean>(false);
  const [openBlock, setOpenBlock] = React.useState(false);
  // const [openReportProfile, setOpenReportProfile] = React.useState(false);

  const userIsVisible =
    user?.accountPrivacy === AccountPrivacyEnum.Public ||
    user?.connectionDto?.meToOtherStatus === ConnectionStatusEnum.Accepted;
  const userBlockStatus = user?.connectionDto?.meBlockedOther || user?.connectionDto?.otherBlockedMe;

  const [changeStatus] = useUpdateConnectionMutation();

  // const handleBlock = async () => {
  //   const res: any = await changeStatus({
  //     filter: {
  //       dto: {
  //         itemId: itemId || ID,
  //         actionType: RequestEnum.Block,
  //       },
  //     },
  //   });
  //   if (res?.data?.updateConnection?.isSuccess) {
  //     setOpenBlock(false);
  //   } else {
  //     setOpenBlock(false);
  //     enqueueSnackbar(`${res?.data?.updateConnection?.messagingKey}`, { variant: 'error' });
  //   }
  // };

  const handleChangeStatus = async (actionType: RequestEnum) => {
    const res: any = await changeStatus({
      filter: {
        dto: {
          itemId: itemId || ID,
          actionType,
        },
      },
    });
    if (res?.data?.updateConnection?.isSuccess) {
      console.log('Unblock');
    } else {
      enqueueSnackbar(`${res?.data?.updateConnection?.messagingKey}`, { variant: 'error' });
    }
  };

  return (
    <>
      {!user?.connectionDto?.otherBlockedMe ? (
        <Stack
          direction="row"
          justifyContent="space-around"
          alignItems="center"
          mt={0.25}
          sx={{ backgroundColor: 'background.paper', borderRadius: 1, px: 2, py: 2 }}
        >
          {!user?.connectionDto?.meBlockedOther ? (
            <>
              <ProfileButtonChecker
                itemId={user?.connectionDto?.itemId}
                itemType={FilterByEnum.Normal}
                meToOther={user?.connectionDto?.meToOtherStatus}
                otherToMe={user?.connectionDto?.otherToMeStatus}
                fullName={`${user?.personDto?.firstName} ${user?.personDto?.lastName}`}
              />
              <Button
                size="small"
                sx={{
                  width: 128,
                  height: 32,
                  px: 4.3,
                  py: 0.8,
                  borderColor: 'grey.300',
                  backgroundColor: 'background.paper',
                  ml: 2,
                }}
                variant="contained"
              >
                <Typography color="grey.900">Message</Typography>
              </Button>
            </>
          ) : (
            <Button
              sx={{ height: 32, width: 280 }}
              variant="contained"
              color="primary"
              onClick={() => handleChangeStatus(RequestEnum.UnBlock)}
            >
              <Icon name="Block" />
              <Typography ml={1}>Unblock</Typography>
            </Button>
          )}
          <IconButton
            onClick={() => {
              setOpenSheet(true);
            }}
          >
            <Icon name="Menu-1" color="text.secondary" />
          </IconButton>
        </Stack>
      ) : (
        !user?.meReportedOther && (
          <>
            <Divider />
            <MessageBoxStyle direction="row" alignItems="center" spacing={1}>
              <Icon name="forbidden" />
              <Typography color="text.primary" variant="subtitle2">
                You have been blocked by this user.
              </Typography>
            </MessageBoxStyle>
            <Divider />
          </>
        )
      )}
      {!userIsVisible && !userBlockStatus && (
        <>
          <Divider />
          <MessageBoxStyle direction="row" alignItems="center" spacing={1}>
            <Icon name="lock" />
            <Typography color="text.primary" variant="subtitle2">
              This Account is Private.
            </Typography>
          </MessageBoxStyle>
          <Divider />
        </>
      )}

      <BottomSheet open={openSheet} onDismiss={() => setOpenSheet(false)}>
        {/* <ThreeDotBottomSheet
          setOpenReportProfile={setOpenReportProfile}
          setOpenBlock={setOpenBlock}
          itemId={itemId}
          openSheet={openSheet}
          setOpenSheet={setOpenSheet}
          fullName={user?.personDto?.fullName}
          isBlocked={user?.connectionDto?.meBlockedOther}
          isReported={user?.meReportedOther}
          isFollowing={user?.connectionDto?.meToOtherStatus === ConnectionStatusEnum.Accepted}
        /> */}
      </BottomSheet>
      <BottomSheet open={openBlock} onDismiss={() => setOpenBlock(!openBlock)}>
        {/* <BlockProfile onClose={setOpenBlock} handleBlock={handleBlock} fullName={user?.personDto?.fullName} /> */}
      </BottomSheet>
    </>
  );
}
