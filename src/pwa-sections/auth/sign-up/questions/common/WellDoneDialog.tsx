import { useLayoutEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Dialog, Stack, Typography } from '@mui/material';

import { useCompleteQarMutation } from 'src/_graphql/profile/users/mutations/CompleteQAR.generated';
import { Icon } from 'src/components/Icon';
import Logo from 'src/components/Logo';
import useAuth from 'src/hooks/useAuth';
import { PATH_APP } from 'src/routes/paths';
import { UserTypeEnum } from 'src/types/serverTypes';

import AfterRegistrationPwaMessages from '../afterRegistrationPwa.messages';

interface StartEndProp {
  openWellDone?: boolean;
  setOpenWellDoneDialog?: React.Dispatch<
    React.SetStateAction<{
      welcome: boolean;
      gender: boolean;
      location: boolean;
      categories: boolean;
      workFields: boolean;
      joinReasons: boolean;
      suggestConnection: boolean;
      endQ: boolean;
    }>
  >;
}
const WellDoneDialog = (props: StartEndProp) => {
  const { openWellDone, setOpenWellDoneDialog } = props;
  const navigate = useNavigate();
  const { user } = useAuth();
  const [CompleteQar] = useCompleteQarMutation();
  useLayoutEffect(() => {
    if (localStorage.getItem('stepTitle') === 'endQ') {
      setOpenWellDoneDialog!((prev) => ({ ...prev, endQ: true }));
    }
  }, [setOpenWellDoneDialog]);

  const handleRouting = async () => {
    const res: any = await CompleteQar({
      filter: { dto: { isNgo: user?.userType === UserTypeEnum.Ngo ? true : false } },
    });
    if (res?.data?.completeQar?.isSuccess) navigate(PATH_APP.home.index);
    localStorage.removeItem('stepTitle');
  };

  return (
    <>
      <Dialog fullWidth={true} open={openWellDone as boolean} sx={{ minHeight: 400 }}>
        <Box p={3}>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }} />

          <Stack alignItems="center" mt={6.7}>
            <Box mb={3.8}>
              {/* <img src={Logo} alt="GOL" /> */}
              <Logo sx={{ width: 67, height: 67 }} />
            </Box>
            <Stack spacing={2} mb={11.5} alignItems="center">
              <Typography variant="h4" color="text.primary">
                <FormattedMessage {...AfterRegistrationPwaMessages.doneMessage} />
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                <FormattedMessage {...AfterRegistrationPwaMessages.doneDescrptionMessage} />
              </Typography>
            </Stack>

            <Button
              variant="contained"
              color="primary"
              endIcon={<Icon name="right-arrow-1" color="common.white" />}
              onClick={handleRouting}
            >
              <Typography>
                <FormattedMessage {...AfterRegistrationPwaMessages.goToGol} />
              </Typography>
            </Button>
          </Stack>
        </Box>
      </Dialog>
    </>
  );
};

export default WellDoneDialog;
