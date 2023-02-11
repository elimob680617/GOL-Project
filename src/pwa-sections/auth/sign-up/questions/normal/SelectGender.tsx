import React, { useLayoutEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  styled,
} from '@mui/material';

import { useUpdateProfileFiledMutation } from 'src/_graphql/profile/mainProfile/mutations/updatePersonProfile.generated';
import { Icon } from 'src/components/Icon';
import useAuth from 'src/hooks/useAuth';
import { GenderTsEnum } from 'src/types/afterRegister';
import { ProfileFieldEnum, UserTypeEnum } from 'src/types/serverTypes';

import AfterRegistrationPwaMessages from '../afterRegistrationPwa.messages';
import DialogIconButtons from '../common/DialogIconButtons';
import TitleAndProgress from '../common/TitleAndProgress';

const GenderBoxStyle = styled(ToggleButtonGroup)(({ theme }) => ({
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  alignItems: 'center',
  padding: 0,
  gap: theme.spacing(3),
  border: 'unset !important',
  '& .MuiToggleButtonGroup-grouped': {
    border: '1px solid  !important',
    borderColor: `${theme.palette.grey[100]} !important`,
    borderRadius: `${theme.spacing(2)} !important`,
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
  },
  '& .Mui-selected': {
    borderColor: `${theme.palette.primary.main} !important`,
    color: `${theme.palette.primary.main} !important`,
    backgroundColor: theme.palette.background.paper,
  },
}));
const ToggleButtonStyle = styled(ToggleButton)(({ theme }) => ({
  color: theme.palette.text.primary,
  px: 3,
  cursor: 'pointer',
  border: '1px solid !important',
  borderRadius: theme.spacing(2),
  borderColor: theme.palette.grey[100],
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 0,
  height: 48,
}));

interface SelectGenderProps {
  authType: UserTypeEnum;
  openGenderDialog?: boolean;
  setOpenGenderDialog?: React.Dispatch<
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

export default function SelectGender(props: SelectGenderProps) {
  const { authType, openGenderDialog, setOpenGenderDialog } = props;
  const navigate = useNavigate();
  const { user } = useAuth();
  const [gender, setGender] = React.useState(null);

  const [updateProfileField, { isLoading }] = useUpdateProfileFiledMutation();

  useLayoutEffect(() => {
    if (localStorage.getItem('stepTitle') === 'gender') {
      setOpenGenderDialog!((prev) => ({ ...prev, gender: true }));
    }
  }, [setOpenGenderDialog]);

  const handleChange = (event: React.MouseEvent<HTMLElement>, newGender: any) => {
    setGender(newGender);
  };
  const handleSubmitGender = async () => {
    const res: any = await updateProfileField({
      filter: {
        dto: {
          field: ProfileFieldEnum.Gender,
          gender: gender,
        },
      },
    });
    if (res?.data?.updateProfileFiled?.isSuccess) {
      setOpenGenderDialog!((prev) => ({ ...prev, gender: false, location: true }));
      localStorage.setItem('stepTitle', 'location');
    }
  };

  const handleRouting = () => {
    setOpenGenderDialog!((prev) => ({ ...prev, gender: false, location: true }));
    localStorage.setItem('stepTitle', 'location');
  };

  return (
    <>
      <Dialog fullWidth={true} open={openGenderDialog as boolean} sx={{ minHeight: 592 }}>
        <DialogTitle>
          <DialogIconButtons router={navigate} user={user} setOpenStatusDialog={setOpenGenderDialog} hasBackIcon />
          <Stack alignItems="center" mb={4}>
            <TitleAndProgress step={1} userType={authType} />
          </Stack>
          <Stack alignItems="center" mb={2}>
            <Typography variant="h6" color="text.primary">
              <FormattedMessage {...AfterRegistrationPwaMessages.genderQuestion} />
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack alignItems="center">
            <GenderBoxStyle color="primary" value={gender} exclusive onChange={handleChange}>
              {Object.keys(GenderTsEnum).map((gndr) => (
                <ToggleButtonStyle key={gndr} value={gndr}>
                  <Typography color="text.primary">{gndr}</Typography>
                </ToggleButtonStyle>
              ))}
            </GenderBoxStyle>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Stack direction="row" spacing={2} justifyContent="flex-end" mx={-1}>
            <Button variant="outlined" sx={{ borderColor: 'grey.300' }} onClick={handleRouting}>
              <Typography color="grey.900">
                <FormattedMessage {...AfterRegistrationPwaMessages.skipButton} />
              </Typography>
            </Button>

            <LoadingButton
              loading={isLoading}
              disabled={!gender}
              onClick={handleSubmitGender}
              variant="contained"
              color="primary"
              endIcon={<Icon name="right-arrow-1" color="common.white" />}
            >
              <Typography>
                <FormattedMessage {...AfterRegistrationPwaMessages.nextButton} />
              </Typography>
            </LoadingButton>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
}
