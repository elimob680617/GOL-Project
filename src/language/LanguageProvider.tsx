import { IntlProvider } from 'react-intl';

import en from './locale/en.json';

//English and Spanish (add more langs here)
const LanguageProvider = (props: any) => {
  const messages: {
    [key: string]: Record<string, string>;
  } = { en };

  // const [locale, setLocale] = useState('en');
  const locale = 'en';

  return (
    <IntlProvider defaultLocale="en" locale={locale} messages={messages[locale]}>
      {props.children}
    </IntlProvider>
  );
};

export default LanguageProvider;
