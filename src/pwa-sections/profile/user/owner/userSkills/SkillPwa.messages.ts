import { defineMessages } from 'react-intl';

const scope = 'skill';

const SkillMessages = defineMessages({
  deleteSkillSuccessfull: {
    id: `${scope}.deleteSkillSuccessfull`,
    defaultMessage: 'The skill has been successfully deleted',
  },
  notSuccessfull: {
    id: `${scope}.notSuccessfull`,
    defaultMessage: 'It was not successful',
  },
  deleteQuestion: {
    id: `${scope}.deleteQuestion`,
    defaultMessage: 'Are you sure to delete this Skill?',
  },
  deleteSkill: {
    id: `${scope}.deleteSkill`,
    defaultMessage: 'Delete Skill',
  },
  skillWord: {
    id: `${scope}.skillWord`,
    defaultMessage: 'Skill',
  },
  skillName: {
    id: `${scope}.skillName`,
    defaultMessage: 'Skill Name',
  },
  startTypingToFindSkill: {
    id: `${scope}.startTypingToFindSkill`,
    defaultMessage: ' Start typing to find your Skill Name',
  },
  addEndorsmentSuccessfull: {
    id: `${scope}.addEndorsmentSuccessfull`,
    defaultMessage: 'The Endorsement has been endorsement added',
  },
  skillAndEndorsements: {
    id: `${scope}.skillAndEndorsements`,
    defaultMessage: 'Skills and Endorsements',
  },
  noResult: {
    id: `${scope}.noResult`,
    defaultMessage: 'No result',
  },
  addSkillAndEndorsment: {
    id: `${scope}.addSkillAndEndorsment`,
    defaultMessage: 'Add Skills and Endorsements',
  },
});

export default SkillMessages;
