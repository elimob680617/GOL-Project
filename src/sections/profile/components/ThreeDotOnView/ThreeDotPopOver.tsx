import React, { FC, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';

import { Button, Popover, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { Icon } from 'src/components/Icon';
import ReportParentDialog, { BlockIcon } from 'src/components/reportPostAndProfile/ReportParentDialog';
import ReportWarningDialog from 'src/components/reportPostAndProfile/ReportWarningDialog';
import { RequestEnum } from 'src/types/serverTypes';

import NormalAndNgoProfileViewMessages from '../../UserProfileView.messages';

interface ProfileThreeDotProp {
  itemId?: string;
  fullName: string;
  fromReport?: boolean;
  anchorEl: HTMLButtonElement | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
  isFollowing: boolean;
  isBlocked?: boolean;
  isReported?: boolean;
}
const ThreeDotPopOver: FC<ProfileThreeDotProp> = (props) => {
  const { anchorEl, setAnchorEl, fullName, isFollowing, isBlocked, isReported } = props;
  const { userId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();
  const [openReportProfile, setOpenReportProfile] = useState(false);
  const [openBlock, setOpenBlock] = useState(false);
  // const ID = router?.query?.id?.[0];
  // const ID = id;

  const handleCopyUrlLink = async () => {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    setAnchorEl(null);
    enqueueSnackbar('Copied! ', { variant: 'success' });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Popover
        id="3dotpopup"
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Stack px={2} py={3}>
          <Button
            variant="text"
            sx={{ display: 'flex', justifyContent: 'flex-start' }}
            onClick={handleCopyUrlLink}
            startIcon={<Icon name="Page-Collection" />}
          >
            <Typography color="text.primary">
              <FormattedMessage {...NormalAndNgoProfileViewMessages.copyLinkMessage} />
            </Typography>
          </Button>
          <Button
            variant="text"
            sx={{ display: 'flex', justifyContent: 'flex-start' }}
            onClick={() => {
              setOpenBlock(true);
              setAnchorEl(null);
            }}
            disabled={isBlocked}
            color="error"
            startIcon={<Icon name="forbidden" color={!isBlocked ? 'error.main' : 'grey.300'} />}
          >
            <Typography>
              <FormattedMessage {...NormalAndNgoProfileViewMessages.blockbutton} />
            </Typography>
          </Button>
          <Button
            variant="text"
            sx={{ display: 'flex', justifyContent: 'flex-start' }}
            disabled={isReported}
            onClick={() => {
              setOpenReportProfile(true);
              setAnchorEl(null);
            }}
            color="error"
            startIcon={<Icon name="Exclamation-Mark" color={!isReported ? 'error.main' : 'grey.300'} />}
          >
            <Typography>
              <FormattedMessage {...NormalAndNgoProfileViewMessages.reportButton} />
            </Typography>
          </Button>
        </Stack>
      </Popover>
      {openBlock && (
        <ReportWarningDialog
          userId={userId}
          showDialog={openBlock}
          onCloseBlock={setOpenBlock}
          buttonText={'Block'}
          warningText={formatMessage(NormalAndNgoProfileViewMessages.blockAlertMessage, {
            username: fullName,
          })}
          icon={BlockIcon}
          actionType={RequestEnum.Block}
        />
      )}
      {openReportProfile && (
        <ReportParentDialog
          reportType="profile"
          userId={userId as string}
          fullName={fullName}
          openDialog={openReportProfile}
          setOpenDialog={setOpenReportProfile}
          isFollowing={isFollowing as boolean}
          isBlocked={isBlocked as boolean}
        />
      )}
    </>
  );
};

export default ThreeDotPopOver;
