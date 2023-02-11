import { useLayoutEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';

import AuthGuard from './Layout/AuthGuard';
import { withErrorHandler } from './error-handling';
import AppErrorBoundaryFallback from './error-handling/fallbacks/App';
import useAuth from './hooks/useAuth';
import Pages from './routes/Pages';
import SW from './sections/SW';

function App() {
  const { initialize } = useAuth();

  useLayoutEffect(() => {
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthGuard>
      <SW />
      <Pages />
    </AuthGuard>
  );
}

export default withErrorHandler(App, AppErrorBoundaryFallback);
