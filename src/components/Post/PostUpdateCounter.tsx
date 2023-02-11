import { FormattedMessage } from 'react-intl';

import { Box, CircularProgress, Typography } from '@mui/material';

import PostComponentsMessage from './PostComponentsMessage';

function PostUpdateCounter({ updatePercent }: any) {
  return (
    <Box
      sx={{
        m: 2,
        bgcolor: 'grey.100',
        height: '3.5rem',
        borderRadius: '15px',
        color: 'primary.main',
        p: 1,
      }}
      display="flex"
      justifyContent={'flex-start'}
      alignItems={'center'}
    >
      <CircularProgress variant="determinate" value={updatePercent} />
      <Typography sx={{ pl: 1 }} variant="subtitle1">
        {updatePercent}% <FormattedMessage {...PostComponentsMessage.Update} />
      </Typography>
    </Box>
  );
}

export default PostUpdateCounter;
