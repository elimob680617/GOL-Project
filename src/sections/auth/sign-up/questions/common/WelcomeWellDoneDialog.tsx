import { FC, useLayoutEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';

import { useCompleteQarMutation } from 'src/_graphql/profile/users/mutations/CompleteQAR.generated';
import { Icon } from 'src/components/Icon';
import useAuth from 'src/hooks/useAuth';
import { PATH_APP } from 'src/routes/paths';
import { UserTypeEnum } from 'src/types/serverTypes';

import AfterRegistrationMessages from '../afterRegistration.messages';
import DialogIconButtons from './DialogIconButtons';

interface StartEndProp {
  isDone?: boolean;
}
const WelcomeWellDoneDialog: FC<StartEndProp> = (props) => {
  const { isDone } = props;
  const { user } = useAuth();
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const { pathname } = useLocation();
  const [showDialog, setShowDialog] = useState<boolean>(true);
  const [CompleteQar, { isLoading }] = useCompleteQarMutation();

  useLayoutEffect(() => {
    if ((pathname === 'welcome' || pathname === 'done') && user?.completeQar) {
      setShowDialog(false);
      navigate(PATH_APP.home.index);
    }
  }, [navigate, pathname, user?.completeQar]);

  const handleRouting = async () => {
    if (!isDone) {
      if (user?.userType === UserTypeEnum.Normal) {
        navigate(PATH_APP.home.afterRegister.gender);
      } else {
        navigate(PATH_APP.home.afterRegister.location);
      }
    } else {
      const res: any = await CompleteQar({
        filter: { dto: { isNgo: user?.userType === UserTypeEnum.Ngo ? true : false } },
      });
      if (res?.data?.completeQar?.isSuccess) navigate(PATH_APP.home.index);
    }
  };
  // const handleCloseDialog = async () => {
  //   const res: any = await CompleteQar({
  //     filter: { dto: { isNgo: user?.userType === UserTypeEnum.Ngo ? true : false } },
  //   });
  //   if (res?.data?.completeQar?.isSuccess) navigate(PATH_APP.home.index);
  // };

  return (
    <Dialog fullWidth={true} open={showDialog} sx={{ minHeight: 398 }}>
      <DialogTitle>{!isDone && <DialogIconButtons router={navigate} user={user} />}</DialogTitle>
      <DialogContent>
        <Stack alignItems="center" mt={isDone ? 14 : 6.2}>
          <Box mb={3}>
            <img loading="lazy" src={'src/assets/icons/On-board-Logo.svg'} alt="GOL" />
          </Box>
          <Stack spacing={2} mb={10} alignItems="center">
            <Typography variant="h4" color="text.primary">
              {isDone
                ? formatMessage(AfterRegistrationMessages.doneMessage)
                : formatMessage(AfterRegistrationMessages.welcomeMessage)}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {isDone
                ? formatMessage(AfterRegistrationMessages.doneDescrptionMessage)
                : formatMessage(AfterRegistrationMessages.welcomeDescrptionMessage)}
            </Typography>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1 }}>
        <LoadingButton
          variant="contained"
          color="primary"
          endIcon={<Icon name="right-arrow-1" type="linear" color="common.white" />}
          onClick={handleRouting}
          loading={isDone && isLoading}
        >
          <Typography>
            {isDone
              ? formatMessage(AfterRegistrationMessages.goToGol)
              : formatMessage(AfterRegistrationMessages.letsGo)}
          </Typography>
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default WelcomeWellDoneDialog;
