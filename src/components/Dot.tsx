import { FC } from 'react';

import { Box } from '@mui/material';

const Dot: FC = () => {
  return <Box sx={{ width: 5, height: 5, bgcolor: 'grey.300', borderRadius: '100%' }} />;
};

export default Dot;
