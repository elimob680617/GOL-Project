import { defineMessages } from 'react-intl';

const scope = 'pwa.NotificationSection';

const NotificationMessagesPwa = defineMessages({
  Notifications: {
    id: `${scope}.Notifications`,
    defaultMessage: 'Notifications',
  },
  sortShowAll: {
    id: `${scope}.sortShowAll`,
    defaultMessage: 'Show All',
  },
  sortReads: {
    id: `${scope}.sortReads`,
    defaultMessage: 'Reads',
  },
  sortUnreads: {
    id: `${scope}.sortUnreads`,
    defaultMessage: 'Unreads',
  },
  MarkAllAsRead: {
    id: `${scope}.MarkAllAsRead`,
    defaultMessage: 'Mark all as read',
  },
  NotificationSetting: {
    id: `${scope}.NotificationSetting`,
    defaultMessage: 'Notification Setting',
  },
  NotificationCategory: {
    id: `${scope}.NotificationCategory`,
    defaultMessage: 'Notification Category',
  },
  ThereIsNoNotification: {
    id: `${scope}.ThereIsNoNotification`,
    defaultMessage: 'There is no notification',
  },
  Done: {
    id: `${scope}.Done`,
    defaultMessage: 'Done',
  },
  NotificationMenu: {
    id: `${scope}.NotificationMenu`,
    defaultMessage: 'Notification Menu',
  },
});

export default NotificationMessagesPwa;
