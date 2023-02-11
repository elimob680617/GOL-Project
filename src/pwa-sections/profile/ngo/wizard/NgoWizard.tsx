import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Box, CircularProgress, IconButton, Stack, Typography, useTheme } from '@mui/material';

import { ArrowRight2 } from 'iconsax-react';
import Image from 'src/components/Image';
import useAuth from 'src/hooks/useAuth';
import { PATH_APP } from 'src/routes/paths';

import WizardMessages from '../../WizardPwa';

// ----------------start component------------------
export default function NgoWizard() {
  const { user } = useAuth();
  const [closeWizardNgo, setCloseWizard] = useState(localStorage.getItem('closeWizardNgo') === 'true');
  // tools!
  const theme = useTheme();
  const navigate = useNavigate();

  const percentage = user?.completeProfilePercentage;
  // functions !
  const handleCloseWizard = () => {
    localStorage.setItem('closeWizardNgo', 'true');
    setCloseWizard(true);
  };
  //  ------------------------------------------------------
  if (percentage === 100) {
    return <></>;
  }

  if (closeWizardNgo) {
    return <></>;
  }

  return (
    <>
      <Stack spacing={2} sx={{ backgroundColor: theme.palette.background.paper, p: 2, my: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ gap: 1 }}>
          <Image src="src/assets/images/IconProfileWizard.svg" alt="icon" />
          <Stack direction="row" alignItems="center" onClick={() => navigate(PATH_APP.profile.ngo.wizard.wizardList)}>
            <Typography color="Text.primary" variant="h6">
              <FormattedMessage {...WizardMessages.completeYourProfile} />
            </Typography>
            <IconButton sx={{ p: 0 }}>
              <ArrowRight2 variant="Outline" size="24" color={theme.palette.grey[500]} />
            </IconButton>
          </Stack>
          <IconButton sx={{ color: 'grey.500' }} onClick={handleCloseWizard}>
            &#215;
          </IconButton>
        </Stack>
        <Stack direction="row" alignItems="center" sx={{ backgroundColor: 'grey.100', width: '100%', borderRadius: 1 }}>
          <Box sx={{ position: 'relative', ml: 1 }}>
            <CircularProgress
              variant="determinate"
              sx={{
                my: 1,
                color: 'grey.300',
              }}
              value={100}
            />
            <CircularProgress
              variant="determinate"
              disableShrink
              sx={{
                my: 1,
                position: 'absolute',
                left: 0,
              }}
              value={percentage as number}
            />
          </Box>

          <Stack direction="row" alignItems="center" sx={{ ml: 2, gap: 1 }}>
            <Typography variant="subtitle1" color="primary.main">
              {percentage} %
            </Typography>
            <Typography variant="subtitle1" color="grey.500">
              <FormattedMessage {...WizardMessages.completed} />
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}
