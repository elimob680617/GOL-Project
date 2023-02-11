import { isMobile } from 'react-device-detect';

import { Box, Divider, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { Icon } from '../Icon';

interface IBirthdayCard {
  item: any;
}

const IconCircle = styled(Box)(({ theme }) => ({
  minWidth: 48,
  width: 48,
  height: 48,
  backgroundColor: theme.palette.grey[100],
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 8,
}));

function BirthdayCard(props: IBirthdayCard) {
  const { item } = props;
  return (
    <Box>
      <Box
        sx={{
          mt: 1,
          p: 1,
          borderRadius: '8px',
        }}
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
        flexWrap={'wrap'}
      >
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
          sx={{ maxWidth: isMobile ? 320 : 350 }}
        >
          <IconCircle>
            <Icon name={item.Icon} color="primary.main" />
          </IconCircle>
          <Typography variant="caption" sx={{ maxWidth: 350 }}>
            {item.notification}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.disabled">
            {item.time}
          </Typography>
        </Box>
      </Box>
      <Divider />
    </Box>
  );
}

export default BirthdayCard;
