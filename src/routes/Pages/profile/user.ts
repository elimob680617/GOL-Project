import { isMobile } from 'react-device-detect';

import asyncComponentLoader from 'src/utils/loader';

const notFoundPath = 'src/pages/NotFound';

/* #region main profile and view  user*/

const profileUser = [
  {
    path: 'userEdit-birthday',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userMain/mainProfileEdit/MainProfileBirthdayDialog`),
    ),
  },
  {
    path: 'userEdit-gender',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userMain/mainProfileEdit/MainProfileGenderDialog`),
    ),
  },
  {
    path: 'userEdit-cover',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userMain/mainProfileEdit/MainProfileCoverAvatarDialog`),
    ),
  },
  {
    path: 'userEdit-avatar',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userMain/mainProfileEdit/MainProfileCoverAvatarDialog`),
    ),
  },
  {
    path: 'userEdit-change-photo-cover',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userMain/mainProfileEdit/MainProfileChangePhotoDialog`),
    ),
  },
  {
    path: 'userEdit-change-photo-avatar',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userMain/mainProfileEdit/MainProfileChangePhotoDialog`),
    ),
  },
  {
    path: 'userEdit-save-change',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userMain/mainProfileEdit/MainProfileDiscardDialog`),
    ),
  },
  {
    path: 'userEdit-change-avatar',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userMain/addAvatarCoverPhoto/MainProfileChangeCoverUser`),
    ),
  },
  {
    path: 'userEdit-change-cover',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userMain/addAvatarCoverPhoto/MainProfileChangeCoverUser`),
    ),
  },
  {
    path: 'userEdit-add-avatar',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userMain/addAvatarCoverPhoto/MainProfileCoverAvatarUser`),
    ),
  },
  {
    path: 'userEdit-add-cover',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userMain/addAvatarCoverPhoto/MainProfileCoverAvatarUser`),
    ),
  },
  {
    path: 'userEdit-delete-avatar',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userMain/addAvatarCoverPhoto/MainProfileDeleteCoverAvatarDialog`),
    ),
  },
  {
    path: 'userEdit-delete-cover',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userMain/addAvatarCoverPhoto/MainProfileDeleteCoverAvatarDialog`),
    ),
  },
  {
    path: 'userEdit',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/user/owner/userMain/mainProfileEdit/MainProfileEditDialog`)
        : import(`src/sections/profile/user/owner/userMain/mainProfileEdit/MainProfileEditDialog`),
    ),
  },
  // view
  {
    path: 'view/:id',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/user/view/ProfileView`)
        : import(`src/sections/profile/user/view/UserMainView`),
    ),
  },
  {
    path: 'view/certificates/:userId',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/user/view/CertificateListView`)
        : import(`src/sections/profile/components/CertificateListView`),
    ),
  },
  {
    path: 'view/contactInfos/:userId',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/user/view/ContactInfoView`)
        : import(`src/sections/profile/components/ContactInfoView`),
    ),
  },
  {
    path: 'view/experiences/:userId',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/user/view/ExprienceView`)
        : import(`src/sections/profile/user/view/ExperienceListView`),
    ),
  },
  {
    path: 'view/skills/:userId',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/user/view/SkillsView`)
        : import(`src/sections/profile/user/view/SkillListView`),
    ),
  },
  {
    path: 'view/skills/endorsments/:skillId',
    element: asyncComponentLoader(() =>
      isMobile ? import(`${notFoundPath}`) : import(`src/sections/profile/user/view/EndorsmentsView`),
    ),
  },
];

/* #endregion */

/* #region Contact info User */

const contactInfoUser = [
  {
    path: 'contact-info',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/user/owner/userContactInfo/ContactInfoMain`)
        : import(`src/sections/profile/user/owner/userContactInfo/ContactInfoMainDialog`),
    ),
  },
  // email
  {
    path: 'email-form',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/user/owner/userContactInfo/userEmail/UpsertPersonEmailForm`)
        : import(`src/sections/profile/user/owner/userContactInfo/userEmails/UpsertPersonEmailForm`),
    ),
  },
  {
    path: 'verify-email',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/user/owner/userContactInfo/userEmail/VerifyCodeForm`)
        : import(`src/sections/profile/user/owner/userContactInfo/userEmails/VerifyCodeForm`),
    ),
  },
  {
    path: 'confirm-password-form',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/user/owner/userContactInfo/userEmail/ConfirmPasswordForm`)
        : import(`src/sections/profile/user/owner/userContactInfo/userEmails/ConfirmPasswordForm`),
    ),
  },
  {
    path: 'email-delete-confirm',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userContactInfo/userEmails/EmailDeleteDialog`),
    ),
  },
  {
    path: 'email-discard-saveChange',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userContactInfo/userEmails/EmailDiscardDialog`),
    ),
  },
  {
    path: 'select-audience-email',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userContactInfo/userEmails/SelectAudienceDialog`),
    ),
  },
  // social-link
  {
    path: 'social-link-form',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/user/owner/userContactInfo/userSocialLinks/UpsertPersonSocialLink`)
        : import(`src/sections/profile/user/owner/userContactInfo/userSocialLinks/UpsertPersonSocialLinkForm`),
    ),
  },
  {
    path: 'social-link-platform',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userContactInfo/userSocialLinks/SocialLinkPlatformDialoge`),
    ),
  },
  {
    path: 'social-link-delete-confirm',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userContactInfo/userSocialLinks/SocialLinkDeleteDialog`),
    ),
  },
  {
    path: 'socialLink-discard-saveChange',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userContactInfo/userSocialLinks/SocialLinkDiscardDialog`),
    ),
  },
  {
    path: 'select-audience-socialMedia',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userContactInfo/userSocialLinks/SelectAudienceSocialMediaDialog`),
    ),
  },
  // phone number
  {
    path: 'add-phone-number',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/user/owner/userContactInfo/userPhoneNumber/UpsertPhoneNumber`)
        : import(`src/sections/profile/user/owner/userContactInfo/userPhoneNumber/UpsertPhoneNumber`),
    ),
  },
  {
    path: 'edit-phone-number',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/user/owner/userContactInfo/userPhoneNumber/UpsertPhoneNumber`)
        : import(`src/sections/profile/user/owner/userContactInfo/userPhoneNumber/UpsertPhoneNumber`),
    ),
  },
  {
    path: 'confirm-password',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/user/owner/userContactInfo/userPhoneNumber/ConfirmPasswordForm`)
        : import(`src/sections/profile/user/owner/userContactInfo/userPhoneNumber/ConfirmPassword`),
    ),
  },
  {
    path: 'verify-phone-number',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/user/owner/userContactInfo/userPhoneNumber/VerifyCodeFormPhoneNumber`)
        : import(`src/sections/profile/user/owner/userContactInfo/userPhoneNumber/VerifyCodeFormPhoneNumber`),
    ),
  },
  {
    path: 'confirm-delete-number',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userContactInfo/userPhoneNumber/ConfirmDeletePhoneNumber`),
    ),
  },
  {
    path: 'discard-phone-number',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userContactInfo/userPhoneNumber/PhoneNumberDiscardDialog`),
    ),
  },
  {
    path: 'select-audience-phone-number',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userContactInfo/userPhoneNumber/SelectAudiencePhoneNumber`),
    ),
  },
  // website
  {
    path: 'add-website',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/user/owner/userContactInfo/userWebsite/UpsertWebsite`)
        : import(`src/sections/profile/user/owner/userContactInfo/userWebsite/UpsertWebsite`),
    ),
  },
  {
    path: 'edit-website',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/user/owner/userContactInfo/userWebsite/UpsertWebsite`)
        : import(`src/sections/profile/user/owner/userContactInfo/userWebsite/UpsertWebsite`),
    ),
  },
  {
    path: 'confirm-delete-website',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userContactInfo/userWebsite/ConfirmDeleteWebsite`),
    ),
  },
  {
    path: 'discard-website',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userContactInfo/userWebsite/WebsiteDiscardDialog`),
    ),
  },
  {
    path: 'select-audience-website',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userContactInfo/userWebsite/SelectAudienceWebsite`),
    ),
  },
];
/* #endregion */

/* #region public details User */

const publicDetailsUser = [
  {
    path: 'public-details',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/user/owner/userPublicDetails/PublicDetailsMain`)
        : import(`src/sections/profile/user/owner/userPublicDetails/PublicDetailsMainDialog`),
    ),
  },
  {
    path: 'select-audience-main',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/user/owner/userPublicDetails/SelectAudienceMain`)
        : import(`src/sections/profile/user/owner/userPublicDetails/SelectAudienceMainDialog`),
    ),
  },
  /* #region  CurrentCity */
  {
    path: 'add-current-city',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/user/owner/userPublicDetails/currentCity/UpsertCurrentCity`)
        : import(`src/sections/profile/user/owner/userPublicDetails/addCurrentCity/AddCurrentCity`),
    ),
  },
  {
    path: 'edit-current-city',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/user/owner/userPublicDetails/currentCity/UpsertCurrentCity`)
        : import(`src/sections/profile/user/owner/userPublicDetails/addCurrentCity/AddCurrentCity`),
    ),
  },
  {
    path: 'current-city',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userPublicDetails/addCurrentCity/CurrentCity`),
    ),
  },
  {
    path: 'close-dialog-current-city',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userPublicDetails/addCurrentCity/CloseDialogCurrentCity`),
    ),
  },
  {
    path: 'confirm-delete-current-city',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userPublicDetails/addCurrentCity/ConfirmDeleteCurrentCity`),
    ),
  },
  {
    path: 'select-audience-current-city',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userPublicDetails/addCurrentCity/SelectAudienceCurrentCityDialog`),
    ),
  },
  /* #endregion */
  /* #region  HomeTown */
  {
    path: 'add-home-town',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/user/owner/userPublicDetails/homeTown/UpsertHomeTown`)
        : import(`src/sections/profile/user/owner/userPublicDetails/addHomeTown/AddHomeTown`),
    ),
  },
  {
    path: 'edit-home-town',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/user/owner/userPublicDetails/homeTown/UpsertHomeTown`)
        : import(`src/sections/profile/user/owner/userPublicDetails/addHomeTown/AddHomeTown`),
    ),
  },
  {
    path: 'home-town',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userPublicDetails/addHomeTown/HomeTown`),
    ),
  },
  {
    path: 'close-dialog-home-town',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userPublicDetails/addHomeTown/CloseDialogHomeTown`),
    ),
  },
  {
    path: 'confirm-delete-home-town',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userPublicDetails/addHomeTown/ConfirmDeleteHomeTown`),
    ),
  },
  {
    path: 'select-audience-home-town',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userPublicDetails/addHomeTown/SelectAudienceHomeTownDialog`),
    ),
  },
  /* #endregion */
  /* #region  Relation */
  {
    path: 'add-relationship',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/user/owner/userPublicDetails/relationship/UpsertRelationship`)
        : import(`src/sections/profile/user/owner/userPublicDetails/addRelationship/AddRelationship`),
    ),
  },
  {
    path: 'edit-relationship',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/user/owner/userPublicDetails/relationship/UpsertRelationship`)
        : import(`src/sections/profile/user/owner/userPublicDetails/addRelationship/AddRelationship`),
    ),
  },
  {
    path: 'relationship-status',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userPublicDetails/addRelationship/RelationshipStatus`),
    ),
  },
  {
    path: 'close-dialog-relationship',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userPublicDetails/addRelationship/CloseDialogRelationship`),
    ),
  },
  {
    path: 'confirm-delete-relationship',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userPublicDetails/addRelationship/ConfirmDeleteRelationship`),
    ),
  },
  {
    path: 'select-audience-relationship',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userPublicDetails/addRelationship/SelectAudienceRelationshipDialog`),
    ),
  },
  /* #endregion */
  /* #region  School */
  {
    path: 'add-highSchool',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/user/owner/userPublicDetails/education/highSchool/SchoolNewForm`)
        : import(`src/sections/profile/user/owner/userPublicDetails/education/highSchool/SchoolNewFormDialog`),
    ),
  },
  {
    path: 'edit-highSchool',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/user/owner/userPublicDetails/education/highSchool/SchoolNewForm`)
        : import(`src/sections/profile/user/owner/userPublicDetails/education/highSchool/SchoolNewFormDialog`),
    ),
  },
  {
    path: 'add-highSchool-name',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userPublicDetails/education/highSchool/SchoolNameDialog`),
    ),
  },
  {
    path: 'class-year',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userPublicDetails/education/highSchool/SchoolYearDialog`),
    ),
  },
  {
    path: 'delete-highSchool',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userPublicDetails/education/highSchool/SchoolDeleteDialog`),
    ),
  },
  {
    path: 'discard-highSchool',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userPublicDetails/education/highSchool/SchoolDiscardDialog`),
    ),
  },
  {
    path: 'select-audience-highSchool',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userPublicDetails/education/highSchool/SelectAudienceSchoolDialog`),
    ),
  },
  /* #endregion */
  /* #region  College */
  {
    path: 'add-collage',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/user/owner/userPublicDetails/education/college/CollegeNewForm`)
        : import(`src/sections/profile/user/owner/userPublicDetails/education/college/CollegeNewFormDialog`),
    ),
  },
  {
    path: 'edit-college',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/user/owner/userPublicDetails/education/college/CollegeNewForm`)
        : import(`src/sections/profile/user/owner/userPublicDetails/education/college/CollegeNewFormDialog`),
    ),
  },
  {
    path: 'add-college-name',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userPublicDetails/education/college/CollegeNameDialog`),
    ),
  },
  {
    path: 'add-college-concenteration',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userPublicDetails/education/college/CollegeConcenterationDialog`),
    ),
  },
  {
    path: 'college-start-date',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userPublicDetails/education/college/CollegeDateDialog`),
    ),
  },
  {
    path: 'college-end-date',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userPublicDetails/education/college/CollegeDateDialog`),
    ),
  },
  {
    path: 'delete-college',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userPublicDetails/education/college/CollegeDeleteDialog`),
    ),
  },
  {
    path: 'discard-college',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userPublicDetails/education/college/CollegeDiscardDialog`),
    ),
  },
  {
    path: 'select-audience-college',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userPublicDetails/education/college/SelectAudienceCollegeDialog`),
    ),
  },
  /* #endregion */
  /* #region  University */
  {
    path: 'add-university',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/user/owner/userPublicDetails/education/university/UniNewForm`)
        : import(`src/sections/profile/user/owner/userPublicDetails/education/university/UniNewFormDialog`),
    ),
  },
  {
    path: 'edit-university',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/user/owner/userPublicDetails/education/university/UniNewForm`)
        : import(`src/sections/profile/user/owner/userPublicDetails/education/university/UniNewFormDialog`),
    ),
  },
  {
    path: 'add-university-name',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userPublicDetails/education/university/UniversityNameDialog`),
    ),
  },
  {
    path: 'add-university-concenteration',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(
            `src/sections/profile/user/owner/userPublicDetails/education/university/UniversityConcenterationDialog`
          ),
    ),
  },
  {
    path: 'university-start-date',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userPublicDetails/education/university/UniDateDialog`),
    ),
  },
  {
    path: 'university-end-date',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userPublicDetails/education/university/UniDateDialog`),
    ),
  },
  {
    path: 'delete-university',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userPublicDetails/education/university/UniDeleteDialog`),
    ),
  },
  {
    path: 'discard-university',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userPublicDetails/education/university/UniDiscardDialog`),
    ),
  },
  {
    path: 'select-audience-university',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(
            `src/sections/profile/user/owner/userPublicDetails/education/university/SelectAudienceUniversityDialog`
          ),
    ),
  },
  /* #endregion */
];
/* #endregion */

/* #region certificate user */

const certificates = [
  {
    path: 'certificate-list',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/user/owner/userCertificate/CertificateList`)
        : import(`src/sections/profile/user/owner/userCertificates/CertificateListDialog`),
    ),
  },
  {
    path: 'add-certificate',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/user/owner/userCertificate/AddCertificate`)
        : import(`src/sections/profile/user/owner/userCertificates/AddCertificateDialog`),
    ),
  },
  {
    path: 'search-certificate-name',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userCertificates/SearchCertificateNamesDialog`),
    ),
  },
  {
    path: 'search-issuing-organization',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userCertificates/SearchIssingOrganizationDialog`),
    ),
  },
  {
    path: 'certificate-issue-date',
    element: asyncComponentLoader(() =>
      isMobile ? import(`${notFoundPath}`) : import(`src/sections/profile/user/owner/userCertificates/IssueDateDialog`),
    ),
  },
  {
    path: 'certificate-expiration-date',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userCertificates/ExpirationDateDialog`),
    ),
  },
  {
    path: 'certificate-delete-confirm',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userCertificates/DeleteConfirmDialog`),
    ),
  },
  {
    path: 'discard-certificate',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userCertificates/DiscardCertificateDialog`),
    ),
  },
  {
    path: 'select-audience-certificate',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userCertificates/SelectAudienceCertificateDialog`),
    ),
  },
];

/* #endregion */

/* #region experience user */

const experiences = [
  {
    path: 'experience-list',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/user/owner/userExperiences/ExperienceList`)
        : import(`src/sections/profile/user/owner/userExperiences/ExperienceListDialog`),
    ),
  },
  {
    path: 'experience-new',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/user/owner/userExperiences/ExperienceNew`)
        : import(`src/sections/profile/user/owner/userExperiences/ExperienceNewDialog`),
    ),
  },
  {
    path: 'experience-company',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userExperiences/ExperienceCompanyDialog`),
    ),
  },
  {
    path: 'experience-employment-type',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userExperiences/ExperienceEmploymentDialog`),
    ),
  },
  {
    path: 'experience-start-date',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userExperiences/ExperienceDateDialog`),
    ),
  },
  {
    path: 'experience-end-date',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userExperiences/ExperienceDateDialog`),
    ),
  },
  {
    path: 'experience-location',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userExperiences/ExperienceLocationDialog`),
    ),
  },
  {
    path: 'experience-photo',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userExperiences/ExperiencePhotoDialog`),
    ),
  },
  {
    path: 'experience-edit-photo',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userExperiences/ExperienceEditPhotoDialog`),
    ),
  },
  {
    path: 'experience-delete',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userExperiences/ExperienceDeleteConfirmDialog`),
    ),
  },
  {
    path: 'experience-discard',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userExperiences/ExperienceDiscardDialog`),
    ),
  },
  {
    path: 'experience-audience',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/user/owner/userExperiences/SelectExperienceAudienceDialog`),
    ),
  },
];

/* #endregion */

/* #region skill user */

const skills = [
  {
    path: 'skill-list',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/user/owner/userSkills/SkillList`)
        : import(`src/sections/profile/user/owner/userSkills/SkillListDialog`),
    ),
  },
  {
    path: 'search-skill',
    element: asyncComponentLoader(() =>
      isMobile ? import(`${notFoundPath}`) : import(`src/sections/profile/user/owner/userSkills/SearchSkillDialog`),
    ),
  },
  {
    path: 'show-Endorsements',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/user/owner/userSkills/ShowEndorsements`)
        : import(`src/sections/profile/user/owner/userSkills/ShowEndorsementsDialog`),
    ),
  },
  {
    path: 'delete-skill',
    element: asyncComponentLoader(() =>
      isMobile ? import(`${notFoundPath}`) : import(`src/sections/profile/user/owner/userSkills/DeleteSkillDialog`),
    ),
  },
];
/* #endregion */

const exportFiles = [
  ...profileUser,
  ...contactInfoUser,
  ...publicDetailsUser,
  ...experiences,
  ...certificates,
  ...skills,
];
export default exportFiles;
