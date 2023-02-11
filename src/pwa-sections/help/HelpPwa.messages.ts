import { defineMessages } from 'react-intl';

const scope = 'help';

const HelpMessages = defineMessages({
  helpCenter: {
    id: `${scope}.helpCenter`,
    defaultMessage: 'Help center',
  },
  pollText: {
    id: `${scope}.poll`,
    defaultMessage: 'Thanks for letting us know',
  },
  pollQuestion: {
    id: `${scope}.pollQuestion`,
    defaultMessage: 'Was this helpful?',
  },
  // FIXME: Move This Scope To General
  yes: {
    id: `${scope}.yes`,
    defaultMessage: 'Yes',
  },
  // FIXME: Move This Scope To General
  no: {
    id: `${scope}.no`,
    defaultMessage: 'No',
  },
  relatedArticles: {
    id: `${scope}.related`,
    defaultMessage: 'Related Articles',
  },
  // FIXME: Move This Scope To General
  gol: {
    id: `${scope}.gol`,
    defaultMessage: 'Garden Of Love',
  },
  language: {
    id: `${scope}.language`,
    defaultMessage: 'Languages',
  },
  about: {
    id: `${scope}.about`,
    defaultMessage: 'About',
  },
  privacyPolicy: {
    id: `${scope}.privacyPolicy`,
    defaultMessage: 'Privacy Policy',
  },
  legal: {
    id: `${scope}.legal`,
    defaultMessage: 'Legal',
  },
  company: {
    id: `${scope}.company`,
    defaultMessage: 'Company',
  },
  termsOfServices: {
    id: `${scope}.terms`,
    defaultMessage: 'Terms Of Services',
  },
  cookies: {
    id: `${scope}.cookies`,
    defaultMessage: 'Cookies',
  },
  whitepaper: {
    id: `${scope}.whitepaper`,
    defaultMessage: 'Whitepaper',
  },
  contact: {
    id: `${scope}.contact`,
    defaultMessage: 'Contact GOL',
  },
  help: {
    id: `${scope}.help`,
    defaultMessage: 'How can we help you?',
  },
  popular: {
    id: `${scope}.popular`,
    defaultMessage: 'Popular articles',
  },
  cancel: {
    id: `${scope}.cancel`,
    defaultMessage: 'Cancel',
  },
});

export default HelpMessages;
