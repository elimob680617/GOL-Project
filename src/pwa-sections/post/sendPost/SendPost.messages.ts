import { defineMessages } from 'react-intl';

const scope = 'pwa-sections.post.sharePost.sentPost';

const SendPostMessages = defineMessages({
  writeMessage: {
    id: `${scope}.writeMessage`,
    defaultMessage: 'Write a message ',
  },
  next: {
    id: `${scope}.next`,
    defaultMessage: 'Next',
  },
  send: {
    id: `${scope}.send`,
    defaultMessage: 'Send',
  },
  sent: {
    id: `${scope}.sent`,
    defaultMessage: 'Sent',
  },
  sendTextLimitation: {
    id: `${scope}.sendTextLimitation`,
    defaultMessage: 'Characters should be less than 1,000.',
  },
  sendTo: {
    id: `${scope}.sendTo`,
    defaultMessage: 'Send To',
  },
  connections: {
    id: `${scope}.connections`,
    defaultMessage: 'Connections',
  },
  suggestions: {
    id: `${scope}.suggestions`,
    defaultMessage: 'Suggestions',
  },
});

export default SendPostMessages;
