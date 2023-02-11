import { defineMessages } from 'react-intl';

const scope = 'reports.ngo.total';

const TotalMessages = defineMessages({
  total: {
    id: `${scope}.total`,
    defaultMessage: 'Total',
  },
  donors: {
    id: `${scope}.donors`,
    defaultMessage: 'Donors',
  },
  raisedFund: {
    id: `${scope}.raisedFund`,
    defaultMessage: 'Raised Fund',
  },
  impression: {
    id: `${scope}.impression`,
    defaultMessage: 'Impression',
  },
  engagementPercentage: {
    id: `${scope}.engagementPercentage`,
    defaultMessage: 'Engagement Percentage',
  },
  likes: {
    id: `${scope}.likes`,
    defaultMessage: 'Likes',
  },
  comments: {
    id: `${scope}.comments`,
    defaultMessage: 'Comments',
  },
  saved: {
    id: `${scope}.saved`,
    defaultMessage: 'Saved',
  },
  reshared: {
    id: `${scope}.reshared`,
    defaultMessage: 'Reshared',
  },
  shared: {
    id: `${scope}.shared`,
    defaultMessage: 'Shared',
  },
  status: {
    id: `${scope}.status`,
    defaultMessage: 'status',
  },
  receivedMoney: {
    id: `${scope}.receivedMoney`,
    defaultMessage: 'Received Money',
  },
});

export default TotalMessages;
