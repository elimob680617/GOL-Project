import { defineMessages } from 'react-intl';

const scope = 'post.campaignPost';

const CampaginPostMessages = defineMessages({
  selectDeadLine: {
    id: `${scope}.selectDeadLine`,
    defaultMessage: 'Select Deadline',
  },
  lastModified: {
    id: `${scope}.lastModified`,
    defaultMessage: 'last modified on {date}',
  },
  sureDelete: {
    id: `${scope}.sureDelete`,
    defaultMessage: 'Are you sure you want to delete the {title}?',
  },
  cancel: {
    id: `${scope}.cancel`,
    defaultMessage: 'Cancel',
  },
  delete: {
    id: `${scope}.delete`,
    defaultMessage: 'Delete',
  },
  edit: {
    id: `${scope}.edit`,
    defaultMessage: 'Edit',
  },
  notFound: {
    id: `${scope}.notFound`,
    defaultMessage: 'Sorry! No results found',
  },
  create: {
    id: `${scope}.create`,
    defaultMessage: 'Create Campaign post',
  },
  menu: {
    id: `${scope}.menu`,
    defaultMessage: 'Menu',
  },
  newCampagin: {
    id: `${scope}.newCampagin`,
    defaultMessage: 'New Campaign',
  },
  myDrafts: {
    id: `${scope}.myDrafts`,
    defaultMessage: 'My Drafts',
  },
  myCampagins: {
    id: `${scope}.myCampagins`,
    defaultMessage: 'My Campaigns',
  },
  publish: {
    id: `${scope}.publish`,
    defaultMessage: 'Publish Campaign',
  },
  noCoverImage: {
    id: `${scope}.noCoverImage`,
    defaultMessage: 'No cover image uploaded',
  },
  coverImagePoint: {
    id: `${scope}.coverImagePoint`,
    defaultMessage: 'Consider adding a cover image that complements your article to attract more readers',
  },
  recomendedCoverImage: {
    id: `${scope}.recomendedCoverImage`,
    defaultMessage: 'We recommend uploading an image with a pixel size of 1280 × 720',
  },
  addTitle: {
    id: `${scope}.addTitle`,
    defaultMessage: 'Add Title',
  },
  isRequired: {
    id: `${scope}.isRequired`,
    defaultMessage: '{value} is required',
  },
  charactersMaximum: {
    id: `${scope}.charactersMaximum`,
    defaultMessage: 'Characters should be less than 220.',
  },
  deadLine: {
    id: `${scope}.deadLine`,
    defaultMessage: 'Deadline',
  },
  deadLineHelper: {
    id: `${scope}.deadLineHelper`,
    defaultMessage: 'Example: 40 days',
  },
  target: {
    id: `${scope}.target`,
    defaultMessage: 'Target',
  },
  targetHelper: {
    id: `${scope}.target`,
    defaultMessage: 'Example: $1,500',
  },
  targetMinMax: {
    id: `${scope}.targetMinMax`,
    defaultMessage: 'Target must between 1 and $999,000,000',
  },
  location: {
    id: `${scope}.location`,
    defaultMessage: 'Add location',
  },
  posting: {
    id: `${scope}.posting`,
    defaultMessage: 'Posting...',
  },
  publishQuestion: {
    id: `${scope}.publishQuestion`,
    defaultMessage: 'Do you want to publish the {type}?',
  },
  yourCampaginsSummary: {
    id: `${scope}.yourCampaginsSummary`,
    defaultMessage: 'Your {title}s {length}',
  },
  showAll: {
    id: `${scope}.showAll`,
    defaultMessage: 'showAll',
  },
  ratedWithRate: {
    id: `${scope}.ratedWithValue`,
    defaultMessage: 'Rated: {rate}',
  },
  filteringCampaginPostByCategory: {
    id: `${scope}.filteringCampaginPostByCategory`,
    defaultMessage: 'Filttering Campaign post based on categories',
  },
  categories: {
    id: `${scope}.categories`,
    defaultMessage: 'Categories',
  },
});

export default CampaginPostMessages;
