import { defineMessages } from 'react-intl';

const scope = 'profile.certificate';

const UserCertificates = defineMessages({
  successEdited: {
    id: `${scope}.successEdited`,
    defaultMessage: 'The certificate has been successfully edited',
  },
  successAdded: {
    id: `${scope}.successAdded`,
    defaultMessage: 'The certificate has been successfully added ',
  },
  successDeleted: {
    id: `${scope}.successDeleted`,
    defaultMessage: 'The certificate has been successfully deleted',
  },
  notSuccess: {
    id: `${scope}.notSucces`,
    defaultMessage: 'It was not successful',
  },
  certificateName: {
    id: `${scope}.certificateName`,
    defaultMessage: 'Certificate Name*',
  },
  editCertificate: {
    id: `${scope}.edit`,
    defaultMessage: 'Edit Certificate',
  },
  addCertificate: {
    id: `${scope}.add`,
    defaultMessage: 'Add Certificate',
  },
  exampleCertificateName: {
    id: `${scope}.example`,
    defaultMessage: 'Ex: Microsoft certified network security',
  },
  organization: {
    id: `${scope}.org`,
    defaultMessage: 'Issuing Organization*',
  },
  exampleOrg: {
    id: `${scope}.exOrg`,
    defaultMessage: 'Ex: Garden of Love',
  },
  notExpire: {
    id: `${scope}.notExpire`,
    defaultMessage: 'This credential does not expire',
  },
  date: {
    id: `${scope}.date`,
    defaultMessage: 'Issue Date*',
  },
  dateNotRequired: {
    id: `${scope}.dateNotRequired`,
    defaultMessage: 'Issue Date',
  },
  expirationDate: {
    id: `${scope}.expireDate`,
    defaultMessage: 'Expiration Date',
  },
  noExpireDate: {
    id: `${scope}.noExpire`,
    defaultMessage: 'No Expiration',
  },
  noExpireDates: {
    id: `${scope}.noExpires`,
    defaultMessage: 'No Expiration Date',
  },
  credentialId: {
    id: `${scope}.credentialId`,
    defaultMessage: 'Credential ID',
  },
  credentialURL: {
    id: `${scope}.credentialURL`,
    defaultMessage: 'Credential URL',
  },
  // FIXME: Move This Scope To General
  delete: {
    id: `${scope}.delete`,
    defaultMessage: 'Delete',
  },
  // FIXME: Move This Scope To General
  save: {
    id: `${scope}.save`,
    defaultMessage: 'Save',
  },
  // FIXME: Move This Scope To General
  add: {
    id: `${scope}.add`,
    defaultMessage: 'Add',
  },
  // FIXME: Move This Scope To General
  edit: {
    id: `${scope}.edit`,
    defaultMessage: 'Edit',
  },
  // FIXME: Move This Scope To General
  discard: {
    id: `${scope}.discard`,
    defaultMessage: 'Discard',
  },
  certificate: {
    id: `${scope}.certificate`,
    defaultMessage: 'Certificate',
  },
  noResult: {
    id: `${scope}.noResult`,
    defaultMessage: 'No result',
  },
  seeCertificate: {
    id: `${scope}.seeCertificate`,
    defaultMessage: 'see certificate',
  },
  Issueingorganization: {
    id: `${scope}.Issuingorganization`,
    defaultMessage: 'Issuing organization',
  },
  IssuingorganizationTitle: {
    id: `${scope}.Issuingorganization`,
    defaultMessage: 'Issuing organization: {title}',
  },
  areYouSureToDelete: {
    id: `${scope}.areUSureToDelete`,
    defaultMessage: 'Are you sure to delete the current certificate?',
  },
  deleteCurrent: {
    id: `${scope}.deleteCurrent`,
    defaultMessage: 'Delete Current Certificate',
  },
  saveChange: {
    id: `${scope}.saveChange`,
    defaultMessage: 'Do you want to save changes?',
  },
  continue: {
    id: `${scope}.continue`,
    defaultMessage: 'Do you want to continue?',
  },
  saveChangeBtn: {
    id: `${scope}.saveChangeBtn`,
    defaultMessage: 'Save Change',
  },
  continueBtn: {
    id: `${scope}.continueBtn`,
    defaultMessage: 'Continue',
  },
  issueDate: {
    id: `${scope}.isuueDate`,
    defaultMessage: 'Issue Date',
  },
  startType: {
    id: `${scope}.startType`,
    defaultMessage: 'Start typing to find your certificate',
  },
  startTypeOrg: {
    id: `${scope}.startTypeOrg`,
    defaultMessage: 'Start typing to find your Issuing Organization',
  },
  // FIXME: Move This Scope To General
  privacy: {
    id: `${scope}.privacy`,
    defaultMessage: 'Privacy',
  },
  // FIXME: Move This Scope To General
  public: {
    id: `${scope}.public`,
    defaultMessage: 'Public',
  },
  // FIXME: Move This Scope To General
  private: {
    id: `${scope}.private`,
    defaultMessage: 'Private',
  },
  // FIXME: Move This Scope To General
  onlyMe: {
    id: `${scope}.onlyMe`,
    defaultMessage: 'OnlyMe',
  },
  // FIXME: Move This Scope To General
  specificFollowers: {
    id: `${scope}.specificFollowers`,
    defaultMessage: 'Specific followers',
  },
  // FIXME: Move This Scope To General
  selectSpecificFollowers: {
    id: `${scope}.selectSpecificFollowers`,
    defaultMessage: 'Select followers that you dont want as an audience',
  },
  // FIXME: Move This Scope To General
  allFollowersExcept: {
    id: `${scope}.allFollowersExcept`,
    defaultMessage: 'All followers except',
  },
  // FIXME: Move This Scope To General
  selectFollowers: {
    id: `${scope}.selectFollowers`,
    defaultMessage: 'Select followers that you dont want as an audience',
  },
  enterValidUrl: {
    id: `${scope}.enterValidUrl`,
    defaultMessage: 'Enter a valid url',
  },
});

export default UserCertificates;
