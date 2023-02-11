import { defineMessages } from 'react-intl';

const scope = 'web.NotificationComponents';

const NotificationMessageComponents = defineMessages({
  Accepted: {
    id: `${scope}.Accepted`,
    defaultMessage: 'Accepted',
  },
  Rejected: {
    id: `${scope}.Rejected`,
    defaultMessage: 'Rejected',
  },
  Accept: {
    id: `${scope}.Accept`,
    defaultMessage: 'Accept',
  },
  Reject: {
    id: `${scope}.Reject`,
    defaultMessage: 'Reject',
  },
});

export default NotificationMessageComponents;
