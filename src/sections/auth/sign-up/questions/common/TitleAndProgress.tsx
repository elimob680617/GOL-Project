import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { Box, LinearProgress, Stack, Typography } from '@mui/material';

import Logo from 'src/components/Logo';
// import Logo from 'src/assets/icons/On-board-Logo.svg';
import { UserTypeEnum } from 'src/types/serverTypes';

import AfterRegistrationMessages from '../afterRegistration.messages';

interface TitleAndProgressProps {
  step: number;
  userType: UserTypeEnum;
}

const TitleAndProgress: FC<TitleAndProgressProps> = (props) => {
  const { step, userType } = props;

  return (
    <>
      <Box mb={3}>
        {/* <img loading="lazy" src={Logo} alt="GOL" /> */}
        <Logo sx={{ width: 67, height: 67 }} />
      </Box>
      <Stack spacing={2} mb={10} alignItems="center">
        <Typography variant="h4" color="text.primary">
          <FormattedMessage {...AfterRegistrationMessages.welcomeMessage} />
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          <FormattedMessage {...AfterRegistrationMessages.welcomeDescrptionMessage} />
        </Typography>
        <Box sx={{ width: 144 }}>
          <LinearProgress
            variant="determinate"
            value={userType === UserTypeEnum.Normal ? (step as number) * (100 / 5) : (step as number) * (100 / 4)}
          />
        </Box>
      </Stack>
    </>
  );
};
export default TitleAndProgress;
