import { defineMessages } from 'react-intl';

const scope = 'pwa-sections.post.sharePost';

const SharePostMessages = defineMessages({
  share: {
    id: `${scope}.share`,
    defaultMessage: 'Share',
  },
  edit: {
    id: `${scope}.edit`,
    defaultMessage: 'edit',
  },
  shareTextLimitation: {
    id: `${scope}.shareTextLimitation`,
    defaultMessage: 'Characters should be less than 3,000.',
  },
  sharePostReport: {
    id: `${scope}.sharePostReport`,
    defaultMessage: 'This post reported by you',
  },
  searchLocation: {
    id: `${scope}.searchLocation`,
    defaultMessage: 'Search your location',
  },
  pleaseWait: {
    id: `${scope}.pleaseWait`,
    defaultMessage: 'Please wait...',
  },
  nearPlaces: {
    id: `${scope}.nearPlaces`,
    defaultMessage: 'Near places',
  },
  otherPlaces: {
    id: `${scope}.otherPlaces`,
    defaultMessage: 'Other places',
  },
  currentlySelected: {
    id: `${scope}.currentlySelected`,
    defaultMessage: 'Currently Selected',
  },
  searchResults: {
    id: `${scope}.searchResults`,
    defaultMessage: 'Search Results',
  },
  noResults: {
    id: `${scope}.otherPlaces`,
    defaultMessage: 'Sorry! No results found',
  },
  findUrLocation: {
    id: `${scope}.otherPlaces`,
    defaultMessage: 'Search here to find your location',
  },
});

export default SharePostMessages;
