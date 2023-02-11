import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { experienceAdded, userExperienceSelector } from 'src/store/slices/profile/userExperiences-slice';
import { EmploymentTypeEnum } from 'src/types/serverTypes';

import ExprienceMessages from './Exprience.messages';

function ExperienceEmploymentDialog() {
  const router = useNavigate();
  const dispatch = useDispatch();
  const experienceData = useSelector(userExperienceSelector);

  useEffect(() => {
    if (!experienceData) router(PATH_APP.profile.user.experience.root);
  }, [experienceData, router]);

  const handleSelectEmployment = (emp: keyof typeof EmploymentTypeEnum) => {
    dispatch(
      experienceAdded({
        employmentType: EmploymentTypeEnum[emp],
        isChange: true,
      }),
    );
    router(-1);
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => router(-1)}>
      <Stack spacing={2} sx={{ py: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2 }}>
          <Stack direction="row" spacing={2}>
            <IconButton sx={{ p: 0 }} onClick={() => router(-1)}>
              <Icon name="left-arrow-1" />
            </IconButton>
            <Typography variant="subtitle2" color="text.primary">
              <FormattedMessage {...ExprienceMessages.employmentType} />
            </Typography>
          </Stack>
          <IconButton>
            <Icon name="Close-1" />
          </IconButton>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Stack
            spacing={1.5}
            direction="row"
            sx={{ cursor: 'pointer' }}
            onClick={() => handleSelectEmployment('FullTime' as keyof typeof EmploymentTypeEnum)}
          >
            <Icon name="Save" />
            <Typography variant="body2">
              <FormattedMessage {...ExprienceMessages.fullTime} />
            </Typography>
          </Stack>
          <Stack
            spacing={1.5}
            direction="row"
            sx={{ cursor: 'pointer' }}
            onClick={() => handleSelectEmployment('PartTime' as keyof typeof EmploymentTypeEnum)}
          >
            <Icon name="Save" />
            <Typography variant="body2">
              <FormattedMessage {...ExprienceMessages.partTime} />
            </Typography>
          </Stack>
          <Stack
            spacing={1.5}
            direction="row"
            sx={{ cursor: 'pointer' }}
            onClick={() => handleSelectEmployment('Freelance' as keyof typeof EmploymentTypeEnum)}
          >
            <Icon name="Save" />
            <Typography variant="body2">
              <FormattedMessage {...ExprienceMessages.freelance} />
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default ExperienceEmploymentDialog;
