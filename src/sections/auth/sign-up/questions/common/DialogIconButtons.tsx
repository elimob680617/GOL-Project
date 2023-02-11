import { FC } from 'react';
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
}

const DialogIconButtons: FC<IconButtonsOnDialog> = (props) => {
  const { user, router, hasBackIcon } = props;
  const [CompleteQar] = useCompleteQarMutation();

  const handleCloseDialog = async () => {
    const res: any = await CompleteQar({
      filter: { dto: { isNgo: user?.userType === UserTypeEnum.Ngo } },
    });
    if (res?.data?.completeQar?.isSuccess) router(PATH_APP.home.index);
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: hasBackIcon ? 'space-between' : 'flex-end' }}>
        {hasBackIcon && (
          <IconButton onClick={() => router(-1)}>
            <Icon name="left-arrow" color="grey.500" />
          </IconButton>
        )}
        <IconButton onClick={handleCloseDialog}>
          <Icon name="Close-1" color="grey.500" />
        </IconButton>
      </Box>
    </>
  );
};

export default DialogIconButtons;
