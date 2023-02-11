import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { ThemeProvider } from '@mui/material/styles';

import { SnackbarProvider } from 'notistack';
import LanguageProvider from 'src/language/LanguageProvider';
import { store } from 'src/store';

import App from './App';
import theme from './theme/themes';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  // <React.StrictMode>
  <ReduxProvider store={store}>
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <LanguageProvider>
          <SnackbarProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
            <ToastContainer />
          </SnackbarProvider>
        </LanguageProvider>
      </ThemeProvider>
    </HelmetProvider>
  </ReduxProvider>,
  // </React.StrictMode>,
);
