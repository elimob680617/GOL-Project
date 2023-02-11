import { defineMessages } from 'react-intl';

const scope = 'auth.afterRegistraton';

const AfterRegistrationPwaMessages = defineMessages({
  welcomeMessage: {
    id: `${scope}.welcomeMessage`,
    defaultMessage: 'Welcome to Garden of love',
  },
  doneMessage: {
    id: `${scope}.doneMessage`,
    defaultMessage: 'Well Done.',
  },
  welcomeDescrptionMessage: {
    id: `${scope}.welcomeDescrptionMessage`,
    defaultMessage: 'Let us ask you a few questions!',
  },
  doneDescrptionMessage: {
    id: `${scope}.doneDescrptionMessage`,
    defaultMessage: 'Let’s surfing GOL',
  },
  nextButton: {
    id: `${scope}.nextButton`,
    defaultMessage: 'Next',
  },
  skipButton: {
    id: `${scope}.skipButton`,
    defaultMessage: 'Skip',
  },
  finishButton: {
    id: `${scope}.finishButton`,
    defaultMessage: 'Finish',
  },
  letsGo: {
    id: `${scope}.letsGo`,
    defaultMessage: 'Let’s go',
  },
  goToGol: {
    id: `${scope}.goToGol`,
    defaultMessage: 'Go to GOL',
  },
  viewMoreButton: {
    id: `${scope}.viewMoreButton`,
    defaultMessage: 'View More',
  },
  searchLocationPlaceholder: {
    id: `${scope}.searchLocationPlaceholder`,
    defaultMessage: 'Search ...',
  },
  locationQuestion: {
    id: `${scope}.locationQuestion`,
    defaultMessage: ' Where are you located?',
  },
  connectionSuggestQuestion: {
    id: `${scope}.connectionSuggestQuestion`,
    defaultMessage: 'Try to add some people or NGO to your connection',
  },
  joinReasonsQuestion: {
    id: `${scope}.joinReasonsQuestion`,
    defaultMessage: 'Why are you joining GOL?',
  },
  workFieldQuestion: {
    id: `${scope}.workFieldQuestion`,
    defaultMessage: 'What is your working field?',
  },
  interestedCategoryQuestion: {
    id: `${scope}.interestedCategoryQuestion`,
    defaultMessage: 'Which categories of good cause you are interested in?',
  },
  genderQuestion: {
    id: `${scope}.genderQuestion`,
    defaultMessage: 'What’s your gender?',
  },
});

export default AfterRegistrationPwaMessages;
