import { defineMessages } from 'react-intl';

const scope = 'compontents.reportPostAndProfile';

const ProfileftPostReportMessages = defineMessages({
  reportTitleWord: {
    id: `${scope}.reportTitleWord`,
    defaultMessage: 'Report',
  },
  doneWord: {
    id: `${scope}.doneWord`,
    defaultMessage: 'Done',
  },
  reportAlertMessage: {
    id: `${scope}.reportAlertMessage`,
    defaultMessage:
      'Your report is anonymous, except if you’re reporting an intellectual property infringement. If someone is in immediate danger, call the local emergency services - don’t wait.',
  },
  submitReportAlert: {
    id: `${scope}.submitReportAlert`,
    defaultMessage: 'Your report has been submitted',
  },
  submitReportMessage: {
    id: `${scope}.submitReportMessage`,
    defaultMessage: 'Your feedback is important in helping us keep the Garden of love community safe.',
  },
  actionTypeAlert: {
    id: `${scope}.actionTypeAlert`,
    defaultMessage: 'Other actions you can take:',
  },
  blockActionAlert: {
    id: `${scope}.blockActionAlert`,
    defaultMessage: 'Block {username}',
  },
  unfollowActionAlert: {
    id: `${scope}.unfollowActionAlert`,
    defaultMessage: 'Unfollow {username}',
  },
});

export default ProfileftPostReportMessages;
