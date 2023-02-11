import { defineMessages } from 'react-intl';

const scope = 'post.socialPost';

const SocialPostMessages = defineMessages({
  characterLimit: {
    id: `${scope}.characterLimit`,
    defaultMessage: 'Characters should be less than 3,000.',
  },
  edit: {
    id: `${scope}.edit`,
    defaultMessage: 'Edit',
  },
  post: {
    id: `${scope}.post`,
    defaultMessage: 'Post',
  },
  videoLimitMaximumError: {
    id: `${scope}.videoLimitMaximumError`,
    defaultMessage: 'The video file that you have selected is larger than 2 GB. Unable to send file.',
  },
  imageLimitMaximumError: {
    id: `${scope}.imageLimitMaximumError`,
    defaultMessage: 'The Image file that you have selected is larger than 30 MB. Unable to send file.',
  },
  mediaCountLimit: {
    id: `${scope}.mediaCountLimit`,
    defaultMessage:
      'Please reduce the number of media files you are attaching. You can add maximum 10 images and 5 videos',
  },
  ok: {
    id: `${scope}.ok`,
    defaultMessage: 'OK',
  },
  socialPost: {
    id: `${scope}.socialPost`,
    defaultMessage: 'Social post',
  },
  exitCreateSocial: {
    id: `${scope}.exitCreateSocial`,
    defaultMessage: 'Exit Social Create Dialog',
  },
  unsavedConfirm: {
    id: `${scope}.unsavedConfirm`,
    defaultMessage: 'Unsaved Data will be lost. Do you want to Continue?',
  },
  pleaseWait: {
    id: `${scope}.pleaseWait`,
    defaultMessage: 'Please wait...',
  },
  currentlySelected: {
    id: `${scope}.currentlySelected`,
    defaultMessage: 'Currently Selected',
  },
});

export default SocialPostMessages;
