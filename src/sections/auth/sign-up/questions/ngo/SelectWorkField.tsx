import React, { useLayoutEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import {
  Box,
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

import { useUpdateOrganizationUserField2Mutation } from 'src/_graphql/profile/ngoPublicDetails/mutations/updateOrgUser.generated';
import { useLazySearchGroupCategoriesQuery } from 'src/_graphql/profile/ngoPublicDetails/queries/searchGroupCategories.generated';
import { Icon } from 'src/components/Icon';
import Loading from 'src/components/Loading';
import useAuth from 'src/hooks/useAuth';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { registerWorkFieldSelector, registerWorkFieldUpdated } from 'src/store/slices/afterRegistration';
import { GroupCategoryTypeEnum, OrgUserFieldEnum, UserTypeEnum } from 'src/types/serverTypes';

import AfterRegistrationMessages from '../afterRegistration.messages';
import DialogIconButtons from '../common/DialogIconButtons';
import TitleAndProgress from '../common/TitleAndProgress';

const GenderBoxStyle = styled(ToggleButtonGroup)(({ theme }) => ({
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  alignItems: 'center',
  padding: 0,
  gap: theme.spacing(2),
  paddingLeft: theme.spacing(3),
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
  },
  '&::-webkit-scrollbar': {
    width: 12,
  },
  '&::-webkit-scrollbar-track': {
    background: theme.palette.grey[0],
    borderRadius: 8,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.grey[300],
    borderRadius: 10,
    border: `4px solid ${theme.palette.grey[0]}`,
  },
}));
const ToggleButtonStyle = styled(ToggleButton)(({ theme }) => ({
  color: theme.palette.text.primary,
  paddingInline: theme.spacing(2.9),
  paddingTop: theme.spacing(1.9),
  paddingBottom: theme.spacing(1.9),
  cursor: 'pointer',
  height: 48,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 0,
  borderRadius: theme.spacing(2),
}));

export default function SelectWorkField() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [showDialog, setShowDialog] = React.useState<boolean>(true);
  const dispatch = useDispatch();
  const workingFieldSelector = useSelector(registerWorkFieldSelector);

  const [searchCategories, { data, isFetching }] = useLazySearchGroupCategoriesQuery();
  const [updateProfileField, { isLoading }] = useUpdateOrganizationUserField2Mutation();

  useLayoutEffect(() => {
    if (pathname === 'fields' && user?.completeQar) {
      // if (navigate.query.index?.[0] === 'fields' && user?.completeQar) {
      setShowDialog(false);
      navigate(PATH_APP.home.index);
    }
    if (user?.userType !== UserTypeEnum.Ngo) {
      navigate(PATH_APP.home.afterRegister.welcome);
    } else {
      searchCategories({
        filter: {
          dto: {
            groupCategoryType: GroupCategoryTypeEnum.Category,
            title: '',
          },
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate, searchCategories]);

  const handleChange = (event: React.MouseEvent<HTMLElement>, newField: string) => {
    dispatch(registerWorkFieldUpdated(newField));
  };

  const handleSubmitGender = async () => {
    const res: any = await updateProfileField({
      filter: {
        dto: {
          field: OrgUserFieldEnum.GroupCategory,
          groupCategoryId: workingFieldSelector,
        },
      },
    });
    if (res?.data?.updateOrganizationUserField?.isSuccess) {
      handleRouting();
      // dispatch(registerWorkFieldUpdated(undefined));
    }
  };

  const handleRouting = () => {
    navigate(PATH_APP.home.afterRegister.reason);
  };

  return (
    <Dialog fullWidth={true} open={showDialog}>
      <DialogTitle>
        <DialogIconButtons router={navigate} user={user} hasBackIcon />
        <Stack alignItems="center" mb={3} mt={-5}>
          <TitleAndProgress step={2} userType={user?.userType as UserTypeEnum} />
        </Stack>
        <Stack alignItems="center" mb={3}>
          <Typography variant="h6" color="text.primary">
            <FormattedMessage {...AfterRegistrationMessages.workFieldQuestion} />
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack alignItems={'center'}>
          {isFetching ? (
            <Box m={1}>
              <Loading />
            </Box>
          ) : (
            <Box>
              <GenderBoxStyle color="primary" value={workingFieldSelector} exclusive onChange={handleChange}>
                {data?.searchGroupCategories?.listDto?.items?.map((_field) => (
                  <ToggleButtonStyle key={_field?.id} value={_field?.id}>
                    {_field?.title}
                  </ToggleButtonStyle>
                ))}
              </GenderBoxStyle>
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={2} justifyContent="flex-end" mx={3}>
          <Button variant="outlined" sx={{ borderColor: 'grey.300' }} onClick={handleRouting}>
            <Typography color="grey.900">
              <FormattedMessage {...AfterRegistrationMessages.skipButton} />
            </Typography>
          </Button>

          <LoadingButton
            loading={isLoading}
            disabled={!workingFieldSelector}
            onClick={handleSubmitGender}
            variant="contained"
            color="primary"
            endIcon={<Icon name="right-arrow-1" color="common.white" />}
          >
            <Typography>
              <FormattedMessage {...AfterRegistrationMessages.nextButton} />
            </Typography>
          </LoadingButton>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
