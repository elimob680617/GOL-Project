import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { IconButton, Stack, Typography, styled } from '@mui/material';

import { Icon } from 'src/components/Icon';

const HeaderWrapperStyle = styled(Stack)(({ theme }) => ({
  height: 56,
  padding: theme.spacing(2, 1.5, 2, 2),
  boxShadow: '0px 0px 1px rgba(40, 41, 61, 0.04), 0px 2px 4px rgba(96, 97, 112, 0.16)',
}));

const SocialPostAddLocationHeader: FC = () => {
  const navigate = useNavigate();

  return (
    <HeaderWrapperStyle spacing={2} direction="row" alignItems="center">
      <IconButton onClick={() => navigate(-1)} sx={{ padding: 0 }}>
        <Icon size={24} name="left-arrow-1" />
      </IconButton>
      <Typography
        variant="subtitle1"
        sx={{
          color: 'grey.900',
          fontWeight: 500,
        }}
      >
        Search your location
      </Typography>
    </HeaderWrapperStyle>
  );
};

export default SocialPostAddLocationHeader;
