import { defineMessages } from 'react-intl';

const scope = 'compontents.audience';

const AudienceProfileMessages = defineMessages({
  audienceWord: {
    id: `${scope}.audienceWord`,
    defaultMessage: 'Audience',
  },
  publicWord: {
    id: `${scope}.publicWord`,
    defaultMessage: 'Public',
  },
  privateWord: {
    id: `${scope}.privateWord`,
    defaultMessage: 'Private',
  },
  onlyMe: {
    id: `${scope}.onlyMe`,
    defaultMessage: 'Only me',
  },
  specificFollowers: {
    id: `${scope}.specificFollowers`,
    defaultMessage: 'Specific followers',
  },
  specificFollowersMessage: {
    id: `${scope}.specificFollowersMessage`,
    defaultMessage: 'Select Specific followers as your audience',
  },
  allFollowersExcept: {
    id: `${scope}.allFollowersExcept`,
    defaultMessage: 'All followers except',
  },
  allFollowersExceptMessage: {
    id: `${scope}.allFollowersExceptMessage`,
    defaultMessage: 'Select followers that you dont want as an audience',
  },
  selectFollowers: {
    id: `${scope}.selectFollowers`,
    defaultMessage: 'Select Followers',
  },
  searchFollowerPlaceholder: {
    id: `${scope}.searchFollowerPlaceholder`,
    defaultMessage: 'Search follower',
  },
  saveChange: {
    id: `${scope}.saveChange`,
    defaultMessage: 'Save Change',
  },
  saveChangeMessage: {
    id: `${scope}.saveChangeMessage`,
    defaultMessage: 'Do you want to save changes?',
  },
  serverErrorMessage: {
    id: `${scope}.serverErrorMessage`,
    defaultMessage: '{messageKey}',
  },
});

export default AudienceProfileMessages;
