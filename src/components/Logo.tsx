import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Box, BoxProps } from '@mui/material';

import logo from 'src/assets/logo/new.svg';

interface LogoProps extends BoxProps {
  disabledLink?: boolean;
}

const Logo: FC<LogoProps> = ({ disabledLink = false, sx }) => {
  const { pathname } = useLocation();

  return (
    <Link to={disabledLink ? pathname : '/'}>
      <Box sx={{ width: 50, height: 44, cursor: 'pointer', ...sx }}>
        <img src={logo} alt="logo" width="100%" height="100%" />
      </Box>
    </Link>
  );
};

export default Logo;
