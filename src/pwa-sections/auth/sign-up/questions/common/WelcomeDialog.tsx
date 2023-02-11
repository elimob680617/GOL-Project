import React, { FC, useLayoutEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Dialog, Stack, Typography } from '@mui/material';

import { Icon } from 'src/components/Icon';
import Logo from 'src/components/Logo';
import useAuth from 'src/hooks/useAuth';
import { PATH_APP } from 'src/routes/paths';
import { UserTypeEnum } from 'src/types/serverTypes';

import AfterRegistrationPwaMessages from '../afterRegistrationPwa.messages';
import SelectJoinReason from '../ngo/SelectJoinReason';
import SelectWorkField from '../ngo/SelectWorkField';
import SelectCategory from '../normal/SelectCategory';
import SelectGender from '../normal/SelectGender';
import DialogIconButtons from './DialogIconButtons';
import SelectConnection from './SelectConnection';
import SelectLocation from './SelectLocation';
import WellDoneDialog from './WellDoneDialog';

interface StartEndProp {
  isDone?: boolean;
  openWelcome: boolean;
}
const WelcomeDialog: FC<StartEndProp> = (props) => {
  const { isDone, openWelcome } = props;
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stepTitleDialog, setStepTitleDialog] = React.useState<{
    welcome: boolean;
    gender: boolean;
    location: boolean;
    categories: boolean;
    workFields: boolean;
    joinReasons: boolean;
    suggestConnection: boolean;
    endQ: boolean;
  }>({
    welcome: true,
    gender: false,
    location: false,
    categories: false,
    workFields: false,
    joinReasons: false,
    suggestConnection: false,
    endQ: false,
  });

  useLayoutEffect(() => {
    if (localStorage.getItem('stepTitle') === 'welcome') {
      setStepTitleDialog((prev) => ({ ...prev, welcome: true }));
    }
  }, [setStepTitleDialog]);

  const handleRouting = () => {
    if (!isDone) {
      if (user?.userType === UserTypeEnum.Normal) {
        setStepTitleDialog((prev) => ({ ...prev, gender: true, welcome: false }));
        localStorage.setItem('stepTitle', 'gender');
      } else if (user?.userType === UserTypeEnum.Ngo) {
        setStepTitleDialog((prev) => ({ ...prev, location: true, welcome: false }));
        localStorage.setItem('stepTitle', 'location');
      }
    } else {
      navigate(PATH_APP.home.index);
    }
  };

  return (
    <>
      <Dialog fullWidth={true} open={openWelcome} sx={{ minHeight: 398 }}>
        <Box p={3}>
          <DialogIconButtons router={navigate} user={user} />
          <Stack alignItems="center" mt={6.7}>
            <Box mb={3.8}>
              {/* <img src={Logo} alt="GOL" /> */}
              <Logo sx={{ width: 67, height: 67 }} />
            </Box>
            <Stack spacing={2} mb={9.8} alignItems="center">
              <Typography variant="h5" color="text.primary">
                <FormattedMessage {...AfterRegistrationPwaMessages.welcomeMessage} />
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                <FormattedMessage {...AfterRegistrationPwaMessages.welcomeDescrptionMessage} />
              </Typography>
            </Stack>

            <Button
              variant="contained"
              color="primary"
              endIcon={<Icon name="right-arrow-1" type="linear" color="common.white" />}
              onClick={handleRouting}
            >
              <Typography>
                <FormattedMessage {...AfterRegistrationPwaMessages.letsGo} />
              </Typography>
            </Button>
          </Stack>
        </Box>
      </Dialog>

      <SelectGender
        authType={user?.userType as UserTypeEnum}
        openGenderDialog={stepTitleDialog.gender}
        setOpenGenderDialog={setStepTitleDialog}
      />
      <SelectLocation
        authType={user?.userType as UserTypeEnum}
        openLocationDialog={stepTitleDialog.location}
        setOpenLocationDialog={setStepTitleDialog}
      />
      <SelectCategory
        authType={user?.userType as UserTypeEnum}
        openCategoryDialog={stepTitleDialog.categories}
        setOpenCategoryDialog={setStepTitleDialog}
      />
      <SelectWorkField
        authType={user?.userType as UserTypeEnum}
        openFieldDialog={stepTitleDialog.workFields}
        setOpenFieldDialog={setStepTitleDialog}
      />
      <SelectJoinReason
        authType={user?.userType as UserTypeEnum}
        openReasonsDialog={stepTitleDialog.joinReasons}
        setOpenReasonsDialog={setStepTitleDialog}
      />
      <SelectConnection
        authType={user?.userType as UserTypeEnum}
        openConnectionDialog={stepTitleDialog.suggestConnection}
        setOpenConnectionDialog={setStepTitleDialog}
      />
      <WellDoneDialog openWellDone={stepTitleDialog.endQ} setOpenWellDoneDialog={setStepTitleDialog} />
    </>
  );
};

export default WelcomeDialog;
