import React, { FC } from 'react';
import { NavigateFunction } from 'react-router-dom';

import { Box, IconButton } from '@mui/material';

import { useCompleteQarMutation } from 'src/_graphql/profile/users/mutations/CompleteQAR.generated';
import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import { AuthUser } from 'src/types/auth';
import { UserTypeEnum } from 'src/types/serverTypes';

interface IconButtonsOnDialog {
  user: AuthUser;
  router: NavigateFunction;
  hasBackIcon?: boolean;
  setOpenStatusDialog?: (
    value: React.SetStateAction<{
      welcome: boolean;
      gender: boolean;
      location: boolean;
      categories: boolean;
      workFields: boolean;
      joinReasons: boolean;
      suggestConnection: boolean;
      endQ: boolean;
    }>,
  ) => void;
}

const DialogIconButtons: FC<IconButtonsOnDialog> = (props) => {
  const { user, router, hasBackIcon, setOpenStatusDialog } = props;
  const [CompleteQar] = useCompleteQarMutation();

  const handleRoutBack = () => {
    switch (localStorage.getItem('stepTitle')) {
      case 'gender':
        setOpenStatusDialog!((prev) => ({ ...prev, gender: false, welcome: true }));
        localStorage.setItem('stepTitle', 'welcome');
        break;
      case 'location':
        if (user?.userType === UserTypeEnum.Normal) {
          setOpenStatusDialog!((prev) => ({ ...prev, gender: true, location: false }));
          localStorage.setItem('stepTitle', 'gender');
        } else if (user?.userType === UserTypeEnum.Ngo) {
          setOpenStatusDialog!((prev) => ({ ...prev, welcome: true, location: false }));
          localStorage.setItem('stepTitle', 'welcome');
        }
        break;
      case 'categories':
        setOpenStatusDialog!((prev) => ({ ...prev, location: true, categories: false }));
        localStorage.setItem('stepTitle', 'location');
        break;
      case 'workFields':
        setOpenStatusDialog!((prev) => ({ ...prev, workFields: false, location: true }));
        localStorage.setItem('stepTitle', 'location');
        break;
      case 'joinReasons':
        setOpenStatusDialog!((prev) => ({ ...prev, workFields: true, joinReasons: false }));
        localStorage.setItem('stepTitle', 'workFields');
        break;
      case 'suggestConnection':
        if (user?.userType === UserTypeEnum.Normal) {
          setOpenStatusDialog!((prev) => ({ ...prev, categories: true, suggestConnection: false }));
          localStorage.setItem('stepTitle', 'categories');
        } else if (user?.userType === UserTypeEnum.Ngo) {
          setOpenStatusDialog!((prev) => ({ ...prev, joinReasons: true, suggestConnection: false }));
          localStorage.setItem('stepTitle', 'joinReasons');
        }
        break;

      default:
        break;
    }
  };
  const handleCloseDialog = async () => {
    const res: any = await CompleteQar({
      filter: { dto: { isNgo: user?.userType === UserTypeEnum.Ngo ? true : false } },
    });
    if (res?.data?.completeQar?.isSuccess) router(PATH_APP.home.index);
    localStorage.removeItem('stepTitle');
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: hasBackIcon ? 'space-between' : 'flex-end' }}>
        {hasBackIcon && (
          <IconButton sx={{ p: 0 }} onClick={handleRoutBack}>
            <Icon name="left-arrow" color="grey.500" />
          </IconButton>
        )}
        <IconButton sx={{ p: 0 }} onClick={handleCloseDialog}>
          <Icon name="Close-1" color="grey.500" />
        </IconButton>
      </Box>
    </>
  );
};

export default DialogIconButtons;
