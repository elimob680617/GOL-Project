import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Divider, Stack, Typography } from '@mui/material';

import { Icon } from 'src/components/Icon';
import { useSelector } from 'src/store';
import { userExperienceSelector } from 'src/store/slices/profile/userExperiences-slice';
import { EmploymentTypeEnum } from 'src/types/serverTypes';

import ExprienceMessages from './ExpriencePwa.messages';

interface EmploymentProps {
  onChange: (value: EmploymentTypeEnum) => void;
}

function ExperienceEmployment(props: EmploymentProps) {
  const { onChange } = props;
  const navigate = useNavigate();
  const experienceData = useSelector(userExperienceSelector);

  useEffect(() => {
    if (!experienceData) navigate('/profile/user/experience/list');
  }, [experienceData, navigate]);

  const handleSelectEmployment = (emp: keyof typeof EmploymentTypeEnum) => {
    onChange(EmploymentTypeEnum[emp]);
  };

  return (
    <>
      <Stack spacing={2} sx={{ py: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2 }}>
          <Stack direction="row" spacing={2}>
            <Typography variant="subtitle2" color="text.primary">
              <FormattedMessage {...ExprienceMessages.employmentType} />
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Stack
            spacing={1.5}
            direction="row"
            sx={{ cursor: 'pointer' }}
            onClick={() => handleSelectEmployment('FullTime' as keyof typeof EmploymentTypeEnum)}
          >
            <Icon name="Full-Time" color="grey.700" />
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
            <Icon name="Part-time" color="grey.700" />
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
            <Icon name="Freelancer" color="grey.700" />
            <Typography variant="body2">
              <FormattedMessage {...ExprienceMessages.freelance} />
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}

export default ExperienceEmployment;
