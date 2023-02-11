import { Stack } from '@mui/material';

import NoExperienceadded from 'src/assets/images/ngoNotFound.svg';

function NoDataFound() {
  return (
    <Stack alignItems="center" justifyContent="start" sx={{ my: 6 }}>
      <img src={NoExperienceadded} alt="NoDataFound" width={200} loading="lazy" />
    </Stack>
  );
}

export default NoDataFound;
