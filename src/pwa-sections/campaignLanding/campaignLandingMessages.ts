import { defineMessages } from 'react-intl';

const scope = 'pwa.campaignLanding';

const campaignLandingMessages = defineMessages({
  errorCreateCampaign: {
    id: `${scope}.errorCreateCampaign`,
    defaultMessage: 'Sorry! Creating campaign not available in Application, please use Website.',
  },
  categories: {
    id: `${scope}.categories`,
    defaultMessage: 'Categories',
  },
  campaignLanding: {
    id: `${scope}.campaignLanding`,
    defaultMessage: 'Campaign Landing',
  },
  NoTitle: {
    id: `${scope}.NoTitle`,
    defaultMessage: 'No Title',
  },
  Saved: {
    id: `${scope}.Saved`,
    defaultMessage: 'Saved',
  },
  ago: {
    id: `${scope}.ago`,
    defaultMessage: 'ago',
  },
  NoMoneyAdded: {
    id: `${scope}.NoMoneyAdded`,
    defaultMessage: 'No Money added',
  },
  raisedOf: {
    id: `${scope}.raisedOf`,
    defaultMessage: 'raised of',
  },
  daysLeft: {
    id: `${scope}.daysLeft`,
    defaultMessage: 'days left',
  },
  Expired: {
    id: `${scope}.Expired`,
    defaultMessage: 'Expired',
  },
  NoDeadlineAdded: {
    id: `${scope}.NoDeadlineAdded`,
    defaultMessage: 'No deadline added',
  },
  SortBy: {
    id: `${scope}.SortBy`,
    defaultMessage: 'Sort By',
  },
  YouNotDonated: {
    id: `${scope}.YouNotDonated`,
    defaultMessage: 'You have not donated yet',
  },
  sortHighPaid: {
    id: `${scope}.sortHighPaid`,
    defaultMessage: 'High Paid',
  },
  sortRecent: {
    id: `${scope}.sortRecent`,
    defaultMessage: 'Recent',
  },
  sortHighRated: {
    id: `${scope}.sortHighRated`,
    defaultMessage: 'High Rated',
  },
});
export default campaignLandingMessages;
