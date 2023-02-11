import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { BottomSheet } from 'react-spring-bottom-sheet';

import { Button, IconButton, Stack, Typography, styled } from '@mui/material';

import { useUpdateConnectionMutation } from 'src/_graphql/connection/mutations/updateConnection.generated';
import { Icon } from 'src/components/Icon';
import { FilterByEnum, RequestEnum } from 'src/types/serverTypes';

import ProfileViewPwaMessages from '../../UserProfileViewPwa.messages';
import ProfileButtonChecker from '../../components/ProfileButtonChecker';

// import ThreeDotBottomSheet from 'src/sections/profile/components/ThreeDotOnView/ThreeDotBottomSheet';
// import BlockProfile from '../../components/ThreeDotOnView/BlockProfile';

const MessageBoxStyle = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(2),
}));

interface NgoButtonStatusViewProp {
  ngo: any;
  itemId?: string;
}

export default function ButtonStatusView(props: NgoButtonStatusViewProp) {
  const { ngo, itemId } = props;
  const [openSheet, setOpenSheet] = React.useState<boolean>(false);
  const [openBlock, setOpenBlock] = React.useState(false);
  // const [openReportProfile, setOpenReportProfile] = React.useState(false);
  const [changeStatus] = useUpdateConnectionMutation();
  // const handleBlock = async () => {
  //   const res: any = await changeStatus({
  //     filter: {
  //       dto: {
  //         itemId,
  //         actionType: RequestEnum.Block,
  //       },
  //     },
  //   });
  //   if (res?.data?.updateConnection?.isSuccess) {
  //     setOpenBlock(false);
  //   }
  // };
  const handleChangeStatus = async (actionType: RequestEnum) => {
    const res: any = await changeStatus({
      filter: {
        dto: {
          itemId,
          actionType,
        },
      },
    });
    if (res.data.updateConnection.isSuccess) {
      console.log('Unblock');
    }
  };

  return (
    <>
      {!ngo?.connectionDto?.otherBlockedMe ? (
        <Stack
          direction="row"
          justifyContent="space-around"
          alignItems="center"
          mt={0.25}
          sx={{ backgroundColor: 'background.paper', borderRadius: 1, px: 2, py: 2 }}
        >
          {!ngo?.connectionDto?.meBlockedOther ? (
            <>
              <ProfileButtonChecker
                fullName={ngo?.organizationUserDto?.fullName}
                itemId={ngo?.connectionDto?.itemId}
                itemType={FilterByEnum.Ngo}
                meToOther={ngo?.connectionDto?.meToOtherStatus}
                otherToMe={ngo?.connectionDto?.otherToMeStatus}
              />
              <Link to="#">
                <Button
                  size="large"
                  variant="outlined"
                  sx={{
                    width: 128,
                    height: 32,
                    px: 4.3,
                    py: 0.8,
                    borderColor: 'grey.300',
                    backgroundColor: 'background.paper',
                    ml: 2,
                    // '@media (max-width:425px)': {
                    //   mt: 2,
                    //   ml: 0,
                    // },
                  }}
                >
                  <Typography sx={{ ml: 1.5 }} color="grey.900">
                    <FormattedMessage {...ProfileViewPwaMessages.messagebutton} />
                  </Typography>
                </Button>
              </Link>
            </>
          ) : (
            <Button
              sx={{ height: 32, width: 280 }}
              variant="contained"
              color="primary"
              onClick={() => handleChangeStatus(RequestEnum.UnBlock)}
            >
              <Icon name="Block" size={24} />
              <Typography ml={1}>
                <FormattedMessage {...ProfileViewPwaMessages.unblockbutton} />
              </Typography>
            </Button>
          )}
          <IconButton
            sx={{ ml: 3 }}
            onClick={() => {
              setOpenSheet(true);
            }}
          >
            <Icon name="Menu" color="text.primary" />
          </IconButton>
        </Stack>
      ) : (
        <>
          {ngo?.connectionDto?.otherBlockedMe && (
            <>
              <MessageBoxStyle direction="row" alignItems="center" spacing={1}>
                <Icon name="forbidden" color="grey.700" />
                <Typography color="text.primary" variant="subtitle2">
                  <FormattedMessage {...ProfileViewPwaMessages.blockedMessage} />
                </Typography>
              </MessageBoxStyle>
            </>
          )}
        </>
      )}
      <BottomSheet open={openSheet} onDismiss={() => setOpenSheet(!openSheet)}>
        {/* <ThreeDotBottomSheet
          itemId={itemId}
          openSheet={openSheet}
          setOpenSheet={setOpenSheet}
          fullName={ngo?.organizationUserDto?.fullName}
          isBlocked={ngo?.connectionDto?.meBlockedOther}
          setOpenBlock={setOpenBlock}
          setOpenReportProfile={setOpenReportProfile}
          isReported={ngo?.meReportedOther}
          isFollowing={ngo?.connectionDto?.meToOtherStatus === ConnectionStatusEnum.Accepted}
        /> */}
      </BottomSheet>
      <BottomSheet open={openBlock} onDismiss={() => setOpenBlock(!openBlock)}>
        {/* <BlockProfile onClose={setOpenBlock} handleBlock={handleBlock} fullName={ngo?.organizationUserDto?.fullName} /> */}
      </BottomSheet>
    </>
  );
}
