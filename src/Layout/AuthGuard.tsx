import { FC, PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import useAuth from 'src/hooks/useAuth';

const AuthGuard: FC<PropsWithChildren> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated && !location.pathname.includes('/auth/')) {
    localStorage.removeItem('accessToken');
    return <Navigate to="/auth/sign-in" replace state={{ from: location }} />;
  }
  if (isAuthenticated && location.pathname.includes('/auth/'))
    return <Navigate to="/" replace state={{ from: location }} />;

  return <>{children}</>;
};

export default AuthGuard;
