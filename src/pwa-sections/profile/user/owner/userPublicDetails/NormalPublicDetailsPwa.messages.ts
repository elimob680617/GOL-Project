import { defineMessages } from 'react-intl';

const scope = 'profile.normal.publicDetails';

const NormalPublicDetailsMessages = defineMessages({
  publicDetailsTitle: {
    id: `${scope}.publicDetailsTitle`,
    defaultMessage: 'Public Details',
  },
  joinGarden: {
    id: `${scope}.joinGarden`,
    defaultMessage: 'Joined {brand}',
  },
  education: {
    id: `${scope}.education`,
    defaultMessage: 'Education',
  },

  highSchool: {
    id: `${scope}.highSchool`,
    defaultMessage: 'High School',
  },
  highSchoolName: {
    id: `${scope}.highSchoolName`,
    defaultMessage: 'High School Name',
  },
  schoolName: {
    id: `${scope}.schoolName`,
    defaultMessage: 'School Name',
  },
  classYear: {
    id: `${scope}.classYear`,
    defaultMessage: 'Class Year',
  },
  schoolInfo: {
    id: `${scope}.schoolInfo`,
    defaultMessage: 'Went <Typography>to {school}</Typography>',
  },
  addSchool: {
    id: `${scope}.addSchool`,
    defaultMessage: 'Add High School',
  },
  editSchool: {
    id: `${scope}.editSchool`,
    defaultMessage: 'Edit High School',
  },
  schoolEditedAlertMessage: {
    id: `${scope}.schoolEditedAlertMessage`,
    defaultMessage: 'The High school has been successfully edited ',
  },
  schoolNotEditedAlertMessage: {
    id: `${scope}.schoolNotEditedAlertMessage`,
    defaultMessage: 'The High school unfortunately not edited',
  },
  schoolAddedAlertMessage: {
    id: `${scope}.schoolAddedAlertMessage`,
    defaultMessage: 'The High school has been successfully added ',
  },
  schoolNotAddedAlertMessage: {
    id: `${scope}.schoolNotAddedAlertMessage`,
    defaultMessage: 'The High school unfortunately not added',
  },
  schoolDeletedAlertMessage: {
    id: `${scope}.schoolDeletedAlertMessage`,
    defaultMessage: 'The school has been successfully deleted',
  },
  schoolDeleteMessage: {
    id: `${scope}.schoolDeleteMessage`,
    defaultMessage: 'Are you sure to delete this High School?',
  },
  schoolDeleteButton: {
    id: `${scope}.schoolDeleteButton`,
    defaultMessage: 'Delete High School',
  },
  schoolSearchMessage: {
    id: `${scope}.schoolSearchMessage`,
    defaultMessage: 'Start typing to find your School',
  },

  graduated: {
    id: `${scope}.graduated`,
    defaultMessage: 'Graduated',
  },
  concenteration: {
    id: `${scope}.concenteration`,
    defaultMessage: 'Concenteration',
  },

  college: {
    id: `${scope}.college`,
    defaultMessage: 'College',
  },
  collegeName: {
    id: `${scope}.collegeName`,
    defaultMessage: 'College Name',
  },
  collegeInfo: {
    id: `${scope}.collegeInfo`,
    defaultMessage: 'Studied {concentration} <Typography>at {college}</Typography>',
  },
  addCollege: {
    id: `${scope}.addCollege`,
    defaultMessage: 'Add College',
  },
  editCollege: {
    id: `${scope}.editCollege`,
    defaultMessage: 'Edit College',
  },
  collegeEditedAlertMessage: {
    id: `${scope}.collegeEditedAlertMessage`,
    defaultMessage: 'The College has been successfully edited ',
  },
  collegeNotEditedAlertMessage: {
    id: `${scope}.collegeNotEditedAlertMessage`,
    defaultMessage: 'The College unfortunately not edited',
  },
  collogeAddedAlertMessage: {
    id: `${scope}.collogeAddedAlertMessage`,
    defaultMessage: 'The College has been successfully added ',
  },
  collegeNotAddedAlertMessage: {
    id: `${scope}.collegeNotAddedAlertMessage`,
    defaultMessage: 'The College unfortunately not added',
  },
  collegeDeletedAlertMessage: {
    id: `${scope}.collegeDeletedAlertMessage`,
    defaultMessage: 'The college has been successfully deleted',
  },
  collegeDeleteMessage: {
    id: `${scope}.collegeDeleteMessage`,
    defaultMessage: 'Are you sure to delete this College?',
  },
  collegeDeleteButton: {
    id: `${scope}.collegeDeleteButton`,
    defaultMessage: 'Delete College',
  },
  collegeSearchMessage: {
    id: `${scope}.collegeSearchMessage`,
    defaultMessage: 'Start typing to find your School',
  },

  university: {
    id: `${scope}.university`,
    defaultMessage: 'University',
  },
  universityInfo: {
    id: `${scope}.universityInfo`,
    defaultMessage: 'Studied {concentration} <Typography>at {university}</Typography>',
  },
  addUniversity: {
    id: `${scope}.addUniversity`,
    defaultMessage: 'Add University',
  },
  universityName: {
    id: `${scope}.universityName`,
    defaultMessage: 'University Name',
  },
  editUniversity: {
    id: `${scope}.editUniversity`,
    defaultMessage: 'Edit University',
  },
  universityEditedAlertMessage: {
    id: `${scope}.universityEditedAlertMessage`,
    defaultMessage: 'The University has been successfully edited ',
  },
  universityNotEditedAlertMessage: {
    id: `${scope}.universityNotEditedAlertMessage`,
    defaultMessage: 'The University unfortunately not edited',
  },
  universityAddedAlertMessage: {
    id: `${scope}.universityAddedAlertMessage`,
    defaultMessage: 'The University has been successfully added ',
  },
  universityNotAddedAlertMessage: {
    id: `${scope}.universityNotAddedAlertMessage`,
    defaultMessage: 'The University unfortunately not added',
  },
  universityDeletedAlertMessage: {
    id: `${scope}.universityDeletedAlertMessage`,
    defaultMessage: 'The university has been successfully deleted',
  },
  universityDeleteMessage: {
    id: `${scope}.universityDeleteMessage`,
    defaultMessage: 'Are you sure to delete this University?',
  },
  universityDeleteButton: {
    id: `${scope}.universityDeleteButton`,
    defaultMessage: 'Delete University',
  },
  universitySearchMessage: {
    id: `${scope}.universitySearchMessage`,
    defaultMessage: 'Start typing to find your University',
  },

  currentCity: {
    id: `${scope}.currentCity`,
    defaultMessage: 'Current City',
  },
  currentCityInfo: {
    id: `${scope}.currentCityInfo`,
    defaultMessage: 'Lives in <Typography>{currentCity}</Typography> ',
  },
  addCurrentCity: {
    id: `${scope}.addCurrentCity`,
    defaultMessage: 'Add Current City',
  },
  editCurrentCity: {
    id: `${scope}.editCurrentCity`,
    defaultMessage: 'Edit Current City',
  },
  currentCityEditedAlertMessage: {
    id: `${scope}.currentCityEditedAlertMessage`,
    defaultMessage: 'The current city has been successfully edited',
  },
  currentCityAddedAlertMessage: {
    id: `${scope}.currentCityAddedAlertMessage`,
    defaultMessage: 'The current city has been successfully added',
  },
  currentCityDeletedAlertMessage: {
    id: `${scope}.currentCityDeletedAlertMessage`,
    defaultMessage: 'The current city has been successfully deleted',
  },
  currentCityDeleteMessage: {
    id: `${scope}.currentCityDeleteMessage`,
    defaultMessage: 'Are you sure to delete the current city?',
  },
  currentCityDeleteButton: {
    id: `${scope}.currentCityDeleteButton`,
    defaultMessage: 'Delete Current City',
  },
  currentCitySearchMessage: {
    id: `${scope}.currentCitySearchMessage`,
    defaultMessage: 'Start typing to find your Current City',
  },

  homeTown: {
    id: `${scope}.homeTown`,
    defaultMessage: 'Home Town',
  },
  homeTownInfo: {
    id: `${scope}.homeTownInfo`,
    defaultMessage: 'From <Typography>{homeTown}</Typography> ',
  },
  addHomeTown: {
    id: `${scope}.addHomeTown`,
    defaultMessage: 'Add Home Town',
  },
  editHomeTown: {
    id: `${scope}.editHomeTown`,
    defaultMessage: 'Edit Home Town',
  },
  homeTownEditedAlertMessage: {
    id: `${scope}.homeTownEditedAlertMessage`,
    defaultMessage: 'The current city has been successfully  edited',
  },
  homeTownAddedAlertMessage: {
    id: `${scope}.homeTownAddedAlertMessage`,
    defaultMessage: 'The current city has been successfully added',
  },
  homeTownDeletedAlertMessage: {
    id: `${scope}.homeTownDeletedAlertMessage`,
    defaultMessage: 'The home town has been successfully deleted',
  },
  homeTownDeleteMessage: {
    id: `${scope}.homeTownDeleteMessage`,
    defaultMessage: 'Are you sure to delete the Home town?',
  },
  homeTownDeleteButton: {
    id: `${scope}.homeTownDeleteButton`,
    defaultMessage: 'Delete Home Town',
  },
  homeTownSearchMessage: {
    id: `${scope}.homeTownSearchMessage`,
    defaultMessage: 'Start typing to find your Home Town',
  },

  relationship: {
    id: `${scope}.relationship`,
    defaultMessage: 'Relationship',
  },
  relationshipStatus: {
    id: `${scope}.relationshipStatus`,
    defaultMessage: 'Relationship Status',
  },
  addRelationship: {
    id: `${scope}.addRelationship`,
    defaultMessage: 'Add Relationship',
  },
  editRelationshipStatus: {
    id: `${scope}.editRelationshipStatus`,
    defaultMessage: 'Edit Relationship Status',
  },
  addRelationshipStatus: {
    id: `${scope}.addRelationshipStatus`,
    defaultMessage: 'Set Relationship Status',
  },
  relationshipEditedAlertMessage: {
    id: `${scope}.relationshipEditedAlertMessage`,
    defaultMessage: 'The relationship has been successfully edited',
  },
  relationshipAddedAlertMessage: {
    id: `${scope}.relationshipAddedAlertMessage`,
    defaultMessage: 'The relationship has been successfully added',
  },
  relationshipDeletedAlertMessage: {
    id: `${scope}.relationshipDeletedAlertMessage`,
    defaultMessage: 'The relationship has been successfully deleted',
  },
  relationshipDeleteMessage: {
    id: `${scope}.relationshipDeleteMessage`,
    defaultMessage: 'Are you sure to delete this Relationship Status?',
  },
  relationshipDeleteButton: {
    id: `${scope}.relationshipDeleteButton`,
    defaultMessage: 'Delete Relationship Status',
  },

  continue: {
    id: `${scope}.continue`,
    defaultMessage: 'Continue',
  },
  continueMessage: {
    id: `${scope}.continueMessage`,
    defaultMessage: 'Do you want to continue?',
  },
  saveChange: {
    id: `${scope}.saveChange`,
    defaultMessage: 'Save Change',
  },
  saveChangeMessage: {
    id: `${scope}.saveChangeMessage`,
    defaultMessage: 'Do you want to save changes?',
  },
  startDate: {
    id: `${scope}.startDate`,
    defaultMessage: 'Start Date',
  },
  endDate: {
    id: `${scope}.endDate`,
    defaultMessage: 'End Date',
  },
  present: {
    id: `${scope}.present`,
    defaultMessage: 'Present',
  },
  unSuccessfullDelete: {
    id: `${scope}.unSuccessfullDelete`,
    defaultMessage: 'It was not successful',
  },
  concentrationSearchMessage: {
    id: `${scope}.concentrationSearchMessage`,
    defaultMessage: 'Start typing to find your Concentrarion',
  },
});

export default NormalPublicDetailsMessages;
